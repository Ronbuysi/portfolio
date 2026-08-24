import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { expect, test } from 'vitest'

const css = readFileSync('src/styles.css', 'utf8')

function cssBlock(source, marker) {
  const markerIndex = source.indexOf(marker)
  if (markerIndex === -1) return ''
  const openingBrace = source.indexOf('{', markerIndex)
  let depth = 0
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') depth -= 1
    if (depth === 0) return source.slice(openingBrace + 1, index)
  }
  return ''
}

function relativeLuminance(hex) {
  const [red, green, blue] = hex.slice(1).match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4)
  return .2126 * red + .7152 * green + .0722 * blue
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + .05) / (darker + .05)
}

function compositeHex(overlay, alpha, backdrop) {
  const overlayChannels = overlay.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16))
  const backdropChannels = backdrop.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16))
  const channels = overlayChannels.map((channel, index) => Math.round(channel * alpha + backdropChannels[index] * (1 - alpha)))
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function computedProperty(markup, selector, property, source = css) {
  const dom = new JSDOM(`<style>${source}</style>${markup}`)
  const element = dom.window.document.querySelector(selector)
  return dom.window.getComputedStyle(element).getPropertyValue(property)
}

test('keeps keyboard focus visible on the acid contact background', () => {
  expect(css).toMatch(/\.contact a:focus-visible\s*{[^}]*outline-color:\s*var\(--ink\)/s)
})

test('uses an accessible shared color for tiny muted labels', () => {
  expect(css).toContain('--label-muted: #85857f')
  expect(css).toMatch(/\.stats span,[^{]+{[^}]*color:\s*var\(--label-muted\)/s)
})

test('adds restrained Hero entrance motion', () => {
  expect(css).toContain('@keyframes hero-enter')
  expect(css).toMatch(/\.header\s*{[^}]*animation:\s*hero-enter/s)
})

test('keeps the About lead paired through desktop and tablet widths', () => {
  expect(css).toMatch(/\.about__lead\s*{[^}]*grid-template-columns:\s*320px minmax\(0,\s*1fr\)/s)
  expect(css).toMatch(/@media \(max-width:\s*960px\)\s*{[\s\S]*?\.about__lead\s*{[^}]*grid-template-columns:\s*240px minmax\(0,\s*1fr\)/s)
})

test('keeps the approved portrait crop and deep-navy duotone deterministic', () => {
  expect(css).toMatch(/\.about__portrait-frame\s*{[^}]*aspect-ratio:\s*3\s*\/\s*4/s)
  expect(css).toMatch(/\.about__portrait-frame img\s*{[^}]*object-fit:\s*cover[^}]*object-position:\s*center 30%[^}]*filter:\s*grayscale\(1\) contrast\(1\.12\) brightness\(\.8\)/s)
  expect(css).toMatch(/\.about__portrait-frame::after\s*{[^}]*background:\s*#0b1d3c[^}]*mix-blend-mode:\s*color/s)
  expect(css).toMatch(/\.about__portrait-grid\s*{[^}]*background-image:/s)
})

test('keeps the mobile portrait beside its lead copy with a face focal point', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)\s*{[\s\S]*?\.about__lead\s*{[^}]*grid-template-columns:\s*112px minmax\(0,\s*1fr\)/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)\s*{[\s\S]*?\.about__portrait-frame img\s*{[^}]*object-position:\s*center 27%/s)
})

test('keeps the About portrait small and details full-width', () => {
  expect(css).toMatch(/\.about__portrait\s*{[^}]*width:\s*320px[^}]*max-width:\s*100%/s)
  expect(css).toMatch(/\.about__details\s*{[^}]*width:\s*100%/s)
  expect(css).toMatch(/@media \(max-width:\s*960px\)\s*{[\s\S]*?\.about__portrait\s*{[^}]*width:\s*240px/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)\s*{[\s\S]*?\.about__portrait\s*{[^}]*width:\s*112px/s)
})

test('limits interactive border glow to the portrait, capability cards, and visual grammar cards', () => {
  expect(css).toMatch(/\.about__portrait-glow\s*{[^}]*width:\s*100%/s)
  expect(css).toMatch(/\.strengths__grid > \.border-glow-card\s*{[^}]*min-height:\s*320px/s)
  expect(css).toMatch(/\.operation-story__grammar-grid > \.border-glow-card\s*{[^}]*min-height:\s*14rem/s)
  expect(css).toMatch(/\.sanfu-campaign__strategy > \.border-glow-card\s*{[^}]*min-height:\s*28rem/s)
  expect(css).toMatch(/\.daodao-story__concept-grid > \.border-glow-card\s*{[^}]*min-height:\s*22rem/s)
  expect(css).toMatch(/\.brand-story__rules > \.border-glow-card\s*{[^}]*min-height:\s*11rem/s)
  expect(css).toMatch(/\.ip-story__summer-track > \.border-glow-card\s*{[^}]*min-height:\s*10rem/s)
  expect(css).not.toMatch(/\.project (figure|img)[^{]*\.border-glow-card/s)
})

test('keeps the mobile About headline compact beside the identity card', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)\s*{[\s\S]*?\.about h2\s*{[^}]*font-size:\s*clamp\(1\.25rem,\s*6vw,\s*1\.45rem\)/s)
})

test('keeps original poster artwork uncropped and top-aligned', () => {
  expect(css).toMatch(/\.poster-story__originals\s*{[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.poster-story__originals img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
})

test('uses three and two aligned poster columns on desktop', () => {
  expect(css).toMatch(/\.poster-story__originals--3[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.poster-story__originals--2[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
})

test('keeps poster sections on the shared project baseline without sizing borders', () => {
  expect(css).toMatch(/\.poster-story\s*>\s*section\s*{[^}]*width:\s*100%[^}]*margin-inline:\s*0/s)
  expect(css).toMatch(/\.poster-story__language\s*{[^}]*outline:\s*1px solid var\(--line\)/s)
  expect(css).not.toMatch(/\.poster-story__language\s*{[^}]*border:\s*[^;}]+/s)
})

test('keeps AI stage overlays front-facing and aligned to the original artwork', () => {
  expect(css).toMatch(/\.poster-story__stage-frames\s*{[^}]*display:\s*grid[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.poster-story__stage-frame img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).not.toMatch(/\.poster-story__stage-frame\s*{[^}]*(?:rotate|transform|perspective)\s*:/s)
})

test('stacks poster projects on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.poster-story__originals\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.poster-story__stage-frames\s*{[^}]*display:\s*none/s)
})

test('preserves the complete 16:9 AI stage on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(css).toMatch(/\.poster-story__stage\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(mobileCss).not.toMatch(/\.poster-story__stage\s*{[^}]*min-height\s*:/s)
  expect(mobileCss).not.toMatch(/\.poster-story__stage\s*{[^}]*aspect-ratio\s*:/s)
})

test('lays out the Sanfu visual campaign as a strategy archive', () => {
  expect(css).toMatch(/\.sanfu-campaign\s*{[^}]*--sanfu-inset:\s*var\(--case-inset\)/s)
  expect(css).toMatch(/\.sanfu-campaign__strategy\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.sanfu-campaign__evidence\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.sanfu-campaign__original img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.sanfu-campaign__extensions\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.sanfu-campaign__extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(css).toMatch(/\.sanfu-campaign__extension figure img\s*{[^}]*object-fit:\s*contain/s)
})

test('stacks every Sanfu campaign system on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.sanfu-campaign__strategy,[^}]*\.sanfu-campaign__evidence,[^}]*\.sanfu-campaign__extensions\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.sanfu-campaign__extensions > \.sanfu-campaign__extension:first-child\s*{[^}]*grid-column:\s*auto/s)
})

test('gives Sanfu process scenes a full-width hierarchy below original posters', () => {
  expect(css).toMatch(/\.sanfu-campaign__process-presentations\s*{[^}]*display:\s*grid[^}]*grid-template-columns:\s*1fr/s)
  expect(css).toMatch(/\.sanfu-campaign__process-presentation figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
})

test('builds the Daodao Bar archive from four identity rules, nine originals and six extensions', () => {
  expect(css).toMatch(/\.project--daodao \.project__heading h2\s*{[^}]*font-size:\s*clamp\(3\.1rem,\s*5\.4vw,\s*6\.5rem\)/s)
  expect(css).toMatch(/\.daodao-story\s*{[^}]*--bar-inset:\s*var\(--case-inset\)/s)
  expect(css).toMatch(/\.daodao-story__concept-grid\s*{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/s)
  expect(css).toMatch(/\.daodao-story__identity-rules\s*{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/s)
  expect(css).toMatch(/\.daodao-story__originals\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.daodao-story__original img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.daodao-story__extensions\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.daodao-story__extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(css).toMatch(/\.daodao-story__extension figure img\s*{[^}]*object-fit:\s*contain/s)
})

test('stacks the Daodao Bar systems on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.project--daodao \.project__heading h2\s*{[^}]*font-size:\s*2\.5rem/s)
  expect(mobileCss).toMatch(/\.daodao-story__concept-grid,[^}]*\.daodao-story__identity-rules,[^}]*\.daodao-story__originals,[^}]*\.daodao-story__extensions\s*{[^}]*grid-template-columns:\s*1fr/s)
})

test('animates the Sanfu rule without triggering layout', () => {
  const lineRule = cssBlock(css, '.poster-story__language::after')
  const lineKeyframes = cssBlock(css, '@keyframes poster-line')
  expect(lineRule).toMatch(/width:\s*100%/s)
  expect(lineRule).toMatch(/transform-origin:\s*left/s)
  expect(lineRule).toMatch(/transform:\s*scaleX\(\.34\)/s)
  expect(lineKeyframes).toMatch(/transform:\s*scaleX\(1\)/s)
  expect(lineKeyframes).not.toMatch(/width\s*:/s)
})

test('stops poster story motion for reduced-motion users', () => {
  const reducedMotionCss = cssBlock(css, '@media (prefers-reduced-motion: reduce)')
  expect(reducedMotionCss).toMatch(/\.poster-story__timeline i,[^}]*\.poster-story__language::after\s*{[^}]*animation:\s*none/s)
})

test('shares the case-study inset with the MY MAY brand chapter', () => {
  expect(css).toMatch(/\.brand-story\s*{[^}]*--brand-inset:\s*var\(--case-inset\)/s)
  expect(css).toMatch(/\.brand-story\s*>\s*section\s*{[^}]*width:\s*100%[^}]*margin-inline:\s*0/s)
})

test('keeps original brand boards complete in two aligned columns', () => {
  expect(css).toMatch(/\.brand-story__originals\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.brand-story__originals img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
})

test('builds three brand DNA columns and complete 16:9 extension scenes', () => {
  expect(css).toMatch(/\.brand-story__keywords\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.brand-story__extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(css).toMatch(/\.brand-story__extension figure img\s*{[^}]*object-fit:\s*contain/s)
})

test('builds aligned logo rules and two-column VI extensions', () => {
  expect(css).toMatch(/\.brand-story__standards\s*{[^}]*grid-template-columns:\s*\.8fr 1\.2fr/s)
  expect(css).toMatch(/\.brand-story__rules\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.brand-story__vi-applications\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.brand-story__vi-extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
})

test('aligns the operation originals, grammar and extension scenes', () => {
  expect(css).toMatch(/\.operation-story\s*{[^}]*--operation-inset:\s*var\(--case-inset\)/s)
  expect(css).toMatch(/\.operation-story__originals\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.operation-story__originals img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.operation-story__grammar-grid\s*{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/s)
  expect(css).toMatch(/\.operation-story__system-head\s*{[^}]*background:\s*radial-gradient[^}]*#0d0d0d/s)
  expect(css).toMatch(/\.operation-story__system-evidence\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.operation-story__system-card img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.operation-story__extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
})

test('stacks the MY MAY chapter without changing extension aspect ratio', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.brand-story__originals,[^}]*\.brand-story__keywords\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.brand-story__standards,[^}]*\.brand-story__vi-applications\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).not.toMatch(/\.brand-story__extension figure\s*{[^}]*(?:aspect-ratio|min-height)\s*:/s)
})

test('stacks operation systems on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.operation-story__originals,[^}]*\.operation-story__grammar-grid,[^}]*\.operation-story__system-evidence\s*{[^}]*grid-template-columns:\s*1fr/s)
})

test('shares the case-study inset with the TOSS DIARY IP chapter', () => {
  expect(css).toMatch(/\.ip-story\s*{[^}]*--ip-inset:\s*var\(--case-inset\)/s)
  expect(css).toMatch(/\.ip-story\s*>\s*section\s*{[^}]*width:\s*100%[^}]*margin-inline:\s*0/s)
})

test('keeps original IP boards complete in two aligned columns', () => {
  expect(css).toMatch(/\.ip-story__source-grid\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.ip-story__original img\s*{[^}]*width:\s*100%[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
})

test('builds the TOSS DIARY service archive around one featured scene', () => {
  const serviceCaptionCss = cssBlock(css, '.project .ip-story__service-item figcaption')

  expect(css).toMatch(/\.ip-story__service\s*{[^}]*margin-top:\s*clamp\(6rem,\s*10vw,\s*11rem\)/s)
  expect(css).toMatch(/\.ip-story__service-head\s*{[^}]*background:\s*radial-gradient[^;}]*rgba\(159,46,36,[^)]+\)[^;}]*radial-gradient[^;}]*rgba\(85,45,42,[^)]+\)[^;}]*#0d0d0d/s)
  expect(css).toMatch(/\.ip-story__service-grid\s*{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)[^}]*gap:\s*\.8rem[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.ip-story__service-item\s*{[^}]*min-width:\s*0[^}]*display:\s*grid[^}]*grid-template-rows:\s*auto 1fr[^}]*height:\s*100%/s)
  expect(css).toMatch(/\.ip-story__service-item--featured\s*{[^}]*grid-column:\s*1\s*\/\s*-1/s)
  expect(css).toMatch(/\.ip-story__service-item figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*overflow:\s*hidden[^}]*background:\s*#0d0d0d[^}]*outline:\s*1px solid var\(--line\)/s)
  expect(css).toMatch(/\.ip-story__service-item figure img\s*{[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*contain/s)
  expect(serviceCaptionCss).toMatch(/outline:\s*1px solid var\(--glass-edge\)[^}]*background:\s*var\(--glass-bg\)[^}]*box-shadow:[^}]*var\(--glass-highlight\)/s)
  expect(serviceCaptionCss).toMatch(/-webkit-backdrop-filter:\s*blur\(var\(--glass-blur\)\)/s)
  expect(serviceCaptionCss).toMatch(/(?:^|;)\s*backdrop-filter:\s*blur\(var\(--glass-blur\)\)/s)
  expect(serviceCaptionCss).not.toMatch(/backdrop-filter:[^;}]*14px/s)
  expect(css).toMatch(/\.ip-story__service-copy\s*{[^}]*min-height:\s*15rem[^}]*height:\s*100%[^}]*padding:\s*var\(--ip-inset\)[^}]*outline:\s*1px solid var\(--line\)/s)
  expect(css).toMatch(/\.ip-story__service-copy h4\s*{[^}]*margin:\s*0/s)
  expect(css).toMatch(/\.ip-story__service-copy h4\s*{[^}]*font-size:\s*clamp\(1\.9rem,\s*3\.2vw,\s*3\.8rem\)/s)
  expect(css).toMatch(/\.ip-story__service-copy p\s*{[^}]*color:\s*var\(--muted\)/s)
  expect(css).toMatch(/\.ip-story figure:hover img\s*{[^}]*transform:\s*none/s)
})

test('keeps the service head gradient above the generic system background', () => {
  const backgroundImage = computedProperty(
    '<section class="ip-story"><header class="ip-story__system-head ip-story__service-head"></header></section>',
    '.ip-story__service-head',
    'background-image',
  )

  expect(backgroundImage).toContain('radial-gradient')
  expect(backgroundImage).toContain('rgba(159, 46, 36, 0.12)')
  expect(backgroundImage).toContain('rgba(85, 45, 42, 0.2)')
})

test('keeps the tiny service source label readable over default glass and dark fallbacks', () => {
  const sourceLabelCss = cssBlock(css, '.ip-story__service-item figcaption span:last-child')
  const foreground = sourceLabelCss.match(/color:\s*(#[\da-f]{6})/i)?.[1]
  const lightArtworkComposite = compositeHex('#0c0c0c', .58, '#ffffff')

  expect(lightArtworkComposite).toBe('#727272')
  expect(contrastRatio(foreground, lightArtworkComposite)).toBeGreaterThanOrEqual(4.5)
  expect(foreground).toBe('#fffef8')
  expect(contrastRatio(foreground, '#070707')).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio(foreground, '#0d0d0d')).toBeGreaterThanOrEqual(4.5)
})

test('keeps a solid service-caption fallback without backdrop-filter support', () => {
  const fallbackCss = cssBlock(css, '@supports not (backdrop-filter: blur(1px))')
  const serviceCaptionFallback = cssBlock(fallbackCss, '.project .ip-story__service-item figcaption')

  expect(serviceCaptionFallback).toMatch(/background:\s*rgba\(7,7,7,\.94\)/s)
})

test('removes service-caption blur when reduced transparency is requested', () => {
  const reducedCss = cssBlock(css, '@media (prefers-reduced-transparency: reduce)')
  const serviceCaptionOverride = cssBlock(reducedCss, '.project .ip-story__service-item figcaption')
  const backdropFilter = computedProperty(
    '<div class="project"><article class="ip-story__service-item"><figure><figcaption></figcaption></figure></article></div>',
    'figcaption',
    'backdrop-filter',
    `${css}\n${reducedCss}`,
  )

  expect(serviceCaptionOverride).toMatch(/-webkit-backdrop-filter:\s*none/s)
  expect(serviceCaptionOverride).toMatch(/(?:^|;)\s*backdrop-filter:\s*none/s)
  expect(backdropFilter).toBe('none')
})

test('stacks the TOSS DIARY service archive at the 720px breakpoint', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.ip-story__service-grid\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.ip-story__service-item--featured\s*{[^}]*grid-column:\s*auto/s)
  expect(mobileCss).not.toMatch(/\.ip-story__service-item figure\s*{[^}]*(?:aspect-ratio|min-height|height)\s*:/s)
})

test('keeps service provenance visible at the 720px breakpoint', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  const sourceDisplay = computedProperty(
    '<div class="project"><article class="ip-story__service-item"><figure><figcaption><span>FIRST BATCH / 01</span><span data-service-source>AI-ASSISTED SERVICE EXTENSION</span></figcaption></figure></article></div>',
    '[data-service-source]',
    'display',
    `${css}\n${mobileCss}`,
  )

  expect(mobileCss).toMatch(/\.project \.ip-story__service-item figcaption span:last-child\s*{[^}]*display:\s*inline/s)
  expect(sourceDisplay).not.toBe('none')
})

test('turns the TOSS summer reference into aligned posters and application scenes', () => {
  expect(css).toMatch(/\.ip-story__summer-posters\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.ip-story__summer-poster img\s*{[^}]*width:\s*100%[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.ip-story__summer-applications\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.ip-story__summer-application:first-child\s*{[^}]*grid-column:\s*1\s*\/\s*-1/s)
  expect(css).toMatch(/\.ip-story__summer-application figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(css).toMatch(/\.ip-story__summer-application figure img\s*{[^}]*object-fit:\s*contain/s)
})

test('uses structured IP traits and complete 16:9 extension scenes', () => {
  expect(css).toMatch(/\.ip-story__traits,[^}]*\.ip-story__palette\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.ip-story__extensions\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.ip-story__extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(css).toMatch(/\.ip-story__extension figure img\s*{[^}]*object-fit:\s*contain/s)
})

test('stacks TOSS DIARY evidence and extensions on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.ip-story__source-grid,[^}]*\.ip-story__extensions\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.ip-story__summer-posters,[^}]*\.ip-story__summer-applications\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.ip-story__traits,[^}]*\.ip-story__palette\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.ip-story__summer-application:first-child\s*{[^}]*grid-column:\s*auto/s)
  expect(mobileCss).toMatch(/\.ip-story__extensions > \.ip-story__extension:first-child\s*{[^}]*grid-column:\s*auto/s)
})

test('adds aligned expression and long-term campaign systems', () => {
  expect(css).toMatch(/\.ip-story__expression-grid,[^}]*\.ip-story__campaign-grid\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
  expect(css).toMatch(/\.ip-story__expression-extension figure,[^}]*\.ip-story__campaign-extension figure\s*{[^}]*aspect-ratio:\s*16\s*\/\s*9/s)
  expect(css).toMatch(/\.ip-story__expression-extension img,[^}]*\.ip-story__campaign-extension img\s*{[^}]*object-fit:\s*contain/s)
})

test('stacks expression and campaign grids on narrow screens', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.ip-story__expression-grid,[^}]*\.ip-story__campaign-grid\s*{[^}]*grid-template-columns:\s*1fr/s)
})

test('stops MY MAY decorative motion for reduced-motion users', () => {
  const reducedMotionCss = cssBlock(css, '@media (prefers-reduced-motion: reduce)')
  expect(reducedMotionCss).toMatch(/\.brand-story__concept::after\s*{[^}]*animation:\s*none/s)
})

test('defines one restrained glass token system', () => {
  expect(css).toContain('--glass-bg: rgba(12, 12, 12, .58)')
  expect(css).toContain('--glass-edge: rgba(255, 255, 255, .14)')
  expect(css).toContain('--glass-blur: 18px')
})

test('uses light glass on navigation and primary controls', () => {
  expect(css).toMatch(/\.header\s*{[^}]*backdrop-filter:\s*blur\(12px\)/s)
  expect(css).toMatch(/\.header__contact,\s*\.round-link\s*{[^}]*backdrop-filter:\s*blur\(12px\)/s)
})

test('keeps navigation inside the hero without a floating header state', () => {
  expect(css).not.toContain('.header--floating')
})

test('uses acid color replacement on navigation links and primary buttons', () => {
  expect(css).toMatch(/\.header nav a:hover,\s*\.wordmark:hover\s*{[^}]*color:\s*var\(--acid\)/s)
  expect(css).toMatch(/\.header__contact:hover,\s*\.round-link:hover\s*{[^}]*color:\s*var\(--ink\)[^}]*background:\s*var\(--acid\)[^}]*border-color:\s*var\(--acid\)/s)
})

test('uses glass only on metadata and scene labels, not artwork', () => {
  expect(css).toMatch(/\.project dl\s*{[^}]*background:\s*var\(--glass-bg\)[^}]*backdrop-filter:/s)
  expect(css).toMatch(/\.poster-story__stage-source,[^{]+\.brand-story__extension figure figcaption\s*{[^}]*background:\s*var\(--glass-bg\)/s)
  expect(css).not.toMatch(/\.project img\s*{[^}]*backdrop-filter:/s)
})

test('keeps the contact ending solid and provides a glass fallback', () => {
  expect(css).toMatch(/\.contact\s*{[^}]*background:\s*var\(--acid\)/s)
  expect(css).not.toMatch(/\.contact\s*{[^}]*backdrop-filter:/s)
  expect(css).toMatch(/@supports not \(backdrop-filter:\s*blur\(1px\)\)\s*{[^}]*\.header,[^}]*\.project dl[^}]*{[^}]*background:\s*rgba\(7,7,7,\.94\)/s)
})

test('reduces glass cost and transparency when requested', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/:root\s*{[^}]*--glass-blur:\s*10px/s)
  expect(css).toMatch(/@media \(prefers-reduced-transparency:\s*reduce\)\s*{[^}]*:root\s*{[^}]*--glass-bg:\s*rgba\(7,7,7,\.94\)/s)
})

test('keeps the contact headline inside the narrow shell', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.contact h2\s*{[^}]*font-size:\s*clamp\(3\.2rem,\s*13vw,\s*7rem\)/s)
})

test('removes decorative WebGL pillars and glow layers from the layout', () => {
  expect(css).not.toContain('.hero__pillar')
  expect(css).not.toContain('.about__ambient-pillar')
  expect(css).not.toContain('.strengths__ambient-pillar')
  expect(css).toMatch(/\.hero__scrim\s*{[^}]*z-index:\s*3/s)
  expect(css).not.toMatch(/\.border-glow-card[^{]*::before/s)
})

test('builds the NESTA editorial runway and four vertical application groups', () => {
  expect(css).toMatch(/\.nesta-cold-open\s*{[^}]*min-height:\s*0/s)
  expect(css).toMatch(/\.nesta-brief\s+dl\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.nesta-research__insights\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.nesta-identity__grid\s*{[^}]*display:\s*grid/s)
  expect(css).toMatch(/\.nesta-strategy \.nesta-section-head\s*{[^}]*background:\s*var\(--nesta-blue\)/s)
  expect(css).toMatch(/\.nesta-story \[data-application\] \.nesta-media-grid\s*{[^}]*grid-auto-flow:\s*row/s)
  expect(css).toMatch(/\.nesta-takeaway\s*{[^}]*background:\s*var\(--acid\)/s)
})

test('stacks every irregular NESTA asset vertically without paired-size gaps', () => {
  expect(css).toMatch(/\.nesta-story \.nesta-media-grid\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(css).toMatch(/\.nesta-story \[data-application\] \.nesta-media-grid\s*{[^}]*display:\s*grid[^}]*grid-auto-flow:\s*row/s)
  expect(css).toMatch(/\.nesta-identity__grid > article,[^{]*{[^}]*grid-template-columns:\s*1fr/s)
  expect(css).toMatch(/\.nesta-identity__grid\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(css).toMatch(/\.nesta-identity__grid > article,[^{]*{[^}]*grid-column:\s*1\s*\/\s*-1/s)
  expect(css).toMatch(/\.nesta-media\s*{[^}]*width:\s*100%/s)
  expect(css).toMatch(/\.nesta-story \.nesta-evidence__base\s*{[^}]*columns:\s*1/s)
  expect(css).toMatch(/\.nesta-story \.nesta-evidence__base \.nesta-media:last-child\s*{[^}]*width:\s*100%/s)
})

test('presents the complete NESTA evidence archive as a premium disclosure entrance', () => {
  expect(css).toMatch(/\.nesta-evidence__trigger\s*{[^}]*display:\s*grid[^}]*padding:\s*clamp\(1\.4rem,\s*3vw,\s*2\.4rem\)/s)
  expect(css).toMatch(/\.nesta-evidence__title\s*{[^}]*font-size:\s*clamp\(1\.7rem,\s*3vw,\s*3\.2rem\)/s)
  expect(css).toMatch(/\.nesta-evidence__trigger:hover\s*{[^}]*border-color:\s*var\(--nesta-blue\)/s)
  expect(css).toMatch(/\.nesta-evidence\[open\] \.nesta-evidence__icon\s*{[^}]*transform:\s*rotate\(45deg\)/s)
  expect(css).toMatch(/\.nesta-evidence\[open\] \.nesta-evidence__closed,[^{]*{[^}]*display:\s*none/s)
  expect(css).toMatch(/\.nesta-competitors h4\s*{[^}]*font-size:\s*clamp\(2rem,\s*3\.6vw,\s*3\.6rem\)/s)
})

test('keeps NESTA typography restrained and aligned with the dark portfolio shell', () => {
  expect(css).toMatch(/\.project--nesta \.nesta-story\s*{[^}]*color:\s*var\(--paper\)[^}]*background:\s*#070707/s)
  expect(css).toMatch(/\.nesta-section-head h3\s*{[^}]*font-size:\s*clamp\(2\.2rem,\s*4\.2vw,\s*5rem\)[^}]*line-height:\s*\.98/s)
  expect(css).toMatch(/\.nesta-identity,[^}]*\.nesta-applications\s*{[^}]*background:\s*#070707/s)
})

test('stacks NESTA sections and removes horizontal motion hooks on mobile', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*?\.nesta-brief\s+dl,[^}]*\.nesta-research__insights[^}]*{[^}]*grid-template-columns:\s*1fr/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*?\.nesta-identity__grid\s*{[^}]*display:\s*block/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*?\[data-nesta-horizontal\]\s*{[^}]*display:\s*grid/s)
})

test('keeps NESTA artwork uncropped and disables transform motion when reduced', () => {
  expect(css).toMatch(/\.nesta-media img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.nesta-cold-open__media img\s*{[^}]*min-height:\s*0[^}]*object-fit:\s*contain/s)
  expect(css).toMatch(/\.project--nesta \.nesta-story\s*{[^}]*margin:\s*clamp\([^;}]+\)\s*0\s*0/s)
  expect(css).toMatch(/\.project--nesta > \.project__ghost\s*{[^}]*display:\s*none/s)
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.nesta-story \*\s*{[^}]*animation-duration:\s*\.01ms/s)
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.nesta-story \[data-nesta-horizontal\]\s*{[^}]*transform:\s*none/s)
})

test('builds the illustration Hero depth layers without video selectors', () => {
  expect(css).not.toContain('.hero__video')
  expect(css).not.toContain('.hero__fallback')
  expect(css).toMatch(/\.hero__scene-bg\s*{[^}]*position:\s*absolute[^}]*inset:\s*0/s)
  expect(css).toMatch(/\.hero__scene-bg img\s*{[^}]*object-fit:\s*cover/s)
  expect(css).toMatch(/\.hero__props\s*{[^}]*position:\s*absolute[^}]*pointer-events:\s*none/s)
  expect(css).toMatch(/\.hero-prop--spring\s*{[^}]*left:\s*clamp\(/s)
  expect(css).toMatch(/\.hero-prop--chair\s*{[^}]*right:\s*clamp\(/s)
  expect(css).toMatch(/\.hero__title\s*{[^}]*z-index:\s*2[^}]*opacity:/s)
})

test('keeps all five Hero props on mobile and removes motion when reduced', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*?\.hero-prop--cabinet\s*{[^}]*width:/s)
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.hero-prop\s*{[^}]*transform:\s*none/s)
})

test('keeps Hero chips compact and bounds furniture at tablet widths', () => {
  expect(css).not.toMatch(/\.hero__meta-row,\s*\.hero__baseline,\s*\.hero__chip\s*{[^}]*position:\s*relative/s)
  expect(css).toMatch(/@media \(max-width:\s*1024px\)[\s\S]*?\.hero-prop--cabinet\s*{[^}]*width:\s*clamp\(10rem,\s*18vw,\s*14rem\)/s)
  expect(css).toMatch(/@media \(max-width:\s*1024px\)[\s\S]*?\.hero-prop--chair\s*{[^}]*width:\s*clamp\(13rem,\s*22vw,\s*18rem\)/s)
})

test('builds the NESTA scene preloader with split panels and three-digit progress', () => {
  expect(css).toMatch(/\.preloader__split\s*{[^}]*position:\s*absolute[^}]*background:\s*#287bea/s)
  expect(css).toMatch(/\.preloader__split--top\s*{[^}]*inset:\s*0\s*0\s*50%/s)
  expect(css).toMatch(/\.preloader__split--bottom\s*{[^}]*inset:\s*50%\s*0\s*0/s)
  expect(css).toMatch(/\.preloader__num\s*{[^}]*font-size:\s*clamp\(7rem,\s*24vw,\s*24rem\)/s)
  expect(css).toMatch(/\.preloader__spring\s*{[^}]*position:\s*absolute[^}]*width:\s*clamp\(/s)
  expect(css).toMatch(/\.preloader__bar i\s*{[^}]*transform:\s*scaleX\(0\)/s)
  expect(css).not.toContain('.preloader__veil')
})
