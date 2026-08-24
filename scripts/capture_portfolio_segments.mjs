import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { groupBoxesByRow, normalizeCaptureBounds, tileCaptureBounds } from './portfolio_pdf_layout.mjs'
import { SEGMENTS } from './portfolio_pdf_segments.mjs'

const runtimeModules = process.env.CODEX_NODE_MODULES
  || '/Users/luoen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
const runtimeRequire = createRequire(path.join(runtimeModules, 'package.json'))
const { chromium } = runtimeRequire('playwright')
const sharp = runtimeRequire('sharp')

const ROOT = path.resolve(import.meta.dirname, '..')
const outputDir = path.resolve(ROOT, process.argv[2] || 'tmp/pdfs/website-segments')
const targetUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5173/?pdf=desktop'
const chromeExecutable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const slug = (value) => value.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

await rm(outputDir, { recursive: true, force: true })
await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromeExecutable,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
})

const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
})
const cdp = await page.context().newCDPSession(page)

await page.goto(targetUrl, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
    image.loading = 'eager'
  })
})
await page.evaluate(async () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const step = Math.max(window.innerHeight * 0.8, 720)
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await delay(55)
  }
  window.scrollTo(0, 0)
  await delay(500)
})

await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 30000 })
await page.evaluate(async () => {
  await Promise.all([...document.images].map(async (image) => {
    try {
      await image.decode()
    } catch {
      // The audit below remains the source of truth for failed image loads.
    }
  }))
})
await page.waitForTimeout(900)

const audit = await page.evaluate(() => ({
  title: document.title,
  pageHeight: document.documentElement.scrollHeight,
  imageCount: document.images.length,
  failedImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
  privatePhoneFound: /(?<!\d)1[3-9]\d{9}(?!\d)/.test(document.body.innerText),
  emailFound: document.body.innerText.includes('241022998@qq.com'),
}))

const captures = []
const failures = []
const duplicateCapturesSkipped = []
const captureHashes = new Map()
const captureRanges = new Map()
let pageIndex = 1

const absoluteBox = async (locator) => locator.evaluate((element) => {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  }
})

const captureBounds = async (label, bounds, matte = 24) => {
  const pageHeight = audit.pageHeight
  const { top, bottom, height } = normalizeCaptureBounds(bounds, pageHeight)
  const rangeKey = `${top}:${bottom}`
  if (captureRanges.has(rangeKey)) {
    duplicateCapturesSkipped.push({
      label,
      duplicateOf: captureRanges.get(rangeKey),
      reason: 'identical source range',
    })
    return
  }
  const filename = `${String(pageIndex).padStart(3, '0')}-${slug(label)}.jpg`
  if (process.env.DEBUG_CAPTURE) console.log({ pageIndex, label, top, bottom, height, pageHeight })
  const tileBuffers = []
  for (const tile of tileCaptureBounds({ top, height })) {
    await page.evaluate(async ({ tileTop }) => {
      window.scrollTo(0, tileTop)
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      await new Promise((resolve) => setTimeout(resolve, 90))
    }, { tileTop: tile.top })
    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: 0, y: tile.top, width: 1920, height: tile.height, scale: 1 },
    })
    tileBuffers.push({
      input: Buffer.from(screenshot.data, 'base64'),
      top: tile.offset,
      left: 0,
    })
  }
  const bytes = await sharp({
    create: {
      width: 1920,
      height,
      channels: 3,
      background: '#000000',
    },
  })
    .composite(tileBuffers)
    .jpeg({ quality: 93, chromaSubsampling: '4:4:4' })
    .toBuffer()
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  if (captureHashes.has(sha256)) {
    duplicateCapturesSkipped.push({
      label,
      duplicateOf: captureHashes.get(sha256),
      reason: 'identical rendered pixels',
    })
    return
  }
  await writeFile(path.join(outputDir, filename), bytes)
  captureRanges.set(rangeKey, label)
  captureHashes.set(sha256, label)
  captures.push({
    index: pageIndex,
    label,
    filename,
    matte,
    sha256,
    source: { x: 0, y: top, width: 1920, height },
  })
  pageIndex += 1
}

for (const segment of SEGMENTS) {
  if (segment.from && segment.to) {
    const from = page.locator(segment.from)
    const to = page.locator(segment.to)
    if (await from.count() !== 1 || await to.count() !== 1) {
      failures.push({ label: segment.label, from: segment.from, to: segment.to })
      continue
    }
    const fromBox = await absoluteBox(from)
    const toBox = await absoluteBox(to)
    if (!fromBox || !toBox || toBox.y <= fromBox.y) {
      failures.push({ label: segment.label, reason: 'invalid range' })
      continue
    }
    await captureBounds(segment.label, {
      y: fromBox.y,
      height: toBox.y - fromBox.y,
    }, segment.matte)
    continue
  }

  const locator = page.locator(segment.selector)
  const count = await locator.count()
  if (count === 0 || (!segment.all && count !== 1)) {
    failures.push({ label: segment.label, selector: segment.selector, count })
    continue
  }
  if (segment.all && segment.rowGroup) {
    const boxes = []
    for (let index = 0; index < count; index += 1) {
      const box = await absoluteBox(locator.nth(index))
      if (!box) {
        failures.push({ label: segment.label, selector: segment.selector, index, reason: 'no bounding box' })
        continue
      }
      boxes.push({ ...box, index })
    }
    const rows = groupBoxesByRow(boxes)
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      const label = rows.length > 1 ? `${segment.label} row ${index + 1}` : segment.label
      await captureBounds(label, row, segment.matte)
    }
    continue
  }

  const captureCount = segment.all ? count : 1
  for (let index = 0; index < captureCount; index += 1) {
    const item = locator.nth(index)
    const box = await absoluteBox(item)
    if (!box) {
      failures.push({ label: segment.label, selector: segment.selector, index, reason: 'no bounding box' })
      continue
    }
    const label = captureCount > 1 ? `${segment.label} ${index + 1}` : segment.label
    await captureBounds(label, box, segment.matte)
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  url: targetUrl,
  viewport: { width: 1920, height: 1080 },
  audit,
  pageCount: captures.length,
  failedCount: failures.length,
  failures,
  duplicateCapturesSkipped,
  captures,
}

await writeFile(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
await browser.close()

if (failures.length) {
  console.error(JSON.stringify(manifest, null, 2))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({ pageCount: captures.length, audit, outputDir }, null, 2))
}
