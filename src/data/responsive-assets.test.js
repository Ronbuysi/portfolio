import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const target = path.join(directory, entry)
    return statSync(target).isDirectory() ? walk(target) : [target]
  })
}

test('every portfolio source image has valid mobile and desktop WebP assets', () => {
  const imageRoot = path.join(process.cwd(), 'public', 'images')
  const originals = walk(imageRoot).filter((file) => /\.(?:png|jpe?g)$/i.test(file))
  const sourceRoot = path.join(process.cwd(), 'src')
  const referencedAssets = new Set(
    walk(sourceRoot)
      .filter((file) => /\.[jt]sx?$/i.test(file))
      .flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/["'`](\/images\/[^"'`]+\.(?:png|jpe?g))["'`]/gi)])
      .filter((match) => !match[1].includes('${'))
      .map((match) => path.join(process.cwd(), 'public', match[1])),
  )

  expect(originals.length).toBeGreaterThan(100)
  expect(referencedAssets.size).toBeGreaterThan(80)

  for (const referencedAsset of referencedAssets) {
    expect(existsSync(referencedAsset), `Missing referenced source asset: ${referencedAsset}`).toBe(true)
  }

  for (const original of originals) {
    const base = original.replace(/\.(?:png|jpe?g)$/i, '')

    for (const suffix of ['-w960.webp', '-w1800.webp']) {
      const variant = `${base}${suffix}`
      expect(existsSync(variant), `Missing responsive asset: ${variant}`).toBe(true)
      expect(statSync(variant).size, `Truncated responsive asset: ${variant}`).toBeGreaterThan(1024)

      const header = readFileSync(variant).subarray(0, 12)
      expect(header.subarray(0, 4).toString(), `Invalid RIFF header: ${variant}`).toBe('RIFF')
      expect(header.subarray(8, 12).toString(), `Invalid WebP header: ${variant}`).toBe('WEBP')
    }
  }
})
