import { gsap, useGSAP } from './gsapSetup'
import { CHAPTER_ORDER, interpolateColor, portfolioThemes, themeProgress } from './portfolioThemes'

// The atmosphere is a fixed full-viewport layer with heavy blurs; writing layout
// properties (left/top/width/height) on every scrub frame repaints the whole
// screen. Geometry and fades are therefore driven exclusively through
// compositor-only properties (transform/opacity), so the browser keeps the
// blurred textures cached and merely moves/fades them. Only colors still go
// through custom properties.
const GLOW_BASE_REM = 46 // must match --glow base size in styles.css
const THEME_STEPS = 50 // 2% progress granularity — imperceptible for ambient glows

const lastWrite = new WeakMap()
const glowState = new WeakMap()

function stateFor(root) {
  let cache = glowState.get(root)
  if (!cache) {
    cache = {
      a: root.querySelector('.portfolio-atmosphere__glow--a'),
      b: root.querySelector('.portfolio-atmosphere__glow--b'),
      grid: root.querySelector('.portfolio-atmosphere__grid'),
      curve: root.querySelector('.portfolio-atmosphere__curve'),
      vw: 0,
      vh: 0,
      rem: 0,
    }
    glowState.set(root, cache)
  }
  return cache
}

function metricsFor(root, cache) {
  if (!cache.vw) {
    cache.vw = root.clientWidth || window.innerWidth || 1
    cache.vh = root.clientHeight || window.innerHeight || 1
    cache.rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  }
  return cache
}

export function applyAtmosphereTheme(root, from, to = from, value = 1, force = false) {
  if (!root) return
  const step = Math.round(gsap.utils.clamp(0, 1, value) * THEME_STEPS)
  const last = lastWrite.get(root)
  if (!force && last && last.from === from && last.to === to && last.step === step) return
  lastWrite.set(root, { from, to, step })
  const p = themeProgress(step / THEME_STEPS)

  root.style.setProperty('--atmo-bg', interpolateColor(from.background, to.background, p))
  root.style.setProperty('--atmo-fg', interpolateColor(from.foreground, to.foreground, p))
  root.style.setProperty('--atmo-accent', interpolateColor(from.accent, to.accent, p))

  const cache = stateFor(root)
  const m = metricsFor(root, cache)
  const lerpNum = (a, b) => gsap.utils.interpolate(parseFloat(a), parseFloat(b), p)
  const halfPx = (GLOW_BASE_REM * m.rem) / 2

  ;[['a', 'glowA'], ['b', 'glowB']].forEach(([slot, key]) => {
    const el = cache[slot]
    const specFrom = from[key]
    const specTo = to[key]
    if (!el || !specFrom || !specTo) return
    const cx = (lerpNum(specFrom[0], specTo[0]) / 100) * m.vw
    const cy = (lerpNum(specFrom[1], specTo[1]) / 100) * m.vh
    const scale = lerpNum(specFrom[2], specTo[2]) / GLOW_BASE_REM
    el.style.transform = `translate3d(${(cx - halfPx).toFixed(1)}px, ${(cy - halfPx).toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
    el.style.opacity = lerpNum(specFrom[3], specTo[3]).toFixed(3)
  })

  // opacity writes bypass the CSS vars: composited, no repaint of grid texture
  if (cache.grid) cache.grid.style.opacity = lerpNum(from.gridAlpha, to.gridAlpha).toFixed(3)
  if (cache.curve) cache.curve.style.opacity = lerpNum(from.curveAlpha, to.curveAlpha).toFixed(3)
}

export default function usePortfolioAtmosphere(rootRef) {
  useGSAP(() => {
    const root = rootRef.current
    if (!root) return undefined
    const lastArgs = { from: portfolioThemes.about, to: portfolioThemes.about, value: 1 }
    const apply = (from, to, value, force = false) => {
      lastArgs.from = from
      lastArgs.to = to
      lastArgs.value = value
      applyAtmosphereTheme(root, from, to, value, force)
    }

    apply(portfolioThemes.about, portfolioThemes.about, 1, true)

    // viewport metrics feed px transforms; re-measure and re-apply on resize
    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const cache = glowState.get(root)
        if (cache) { cache.vw = 0; cache.vh = 0; cache.rem = 0 }
        apply(lastArgs.from, lastArgs.to, lastArgs.value, true)
      }, 150)
    }
    window.addEventListener('resize', onResize)

    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 721px)', reduced: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
      const forced = document.documentElement.classList.contains('motion-forced')
      const scrub = conditions.desktop && !(conditions.reduced && !forced)
      const cleanups = []
      CHAPTER_ORDER.forEach((key, index) => {
        const selector = key === 'strengths' ? '.strengths' : `#${key}`
        const element = document.querySelector(selector)
        if (!element) return
        const from = portfolioThemes[CHAPTER_ORDER[Math.max(0, index - 1)]]
        const to = portfolioThemes[key]
        const range = key === 'about'
          ? { start: 'top bottom', end: 'top 42%' }
          : { start: 'top 48%', end: 'top 12%' }
        const trigger = scrub
          ? gsap.to({}, { scrollTrigger: { trigger: element, ...range, scrub: 1, onUpdate: (self) => apply(from, to, self.progress) } })
          : gsap.to({}, { scrollTrigger: { trigger: element, start: 'top 60%', onEnter: () => apply(to, to, 1, true), onEnterBack: () => apply(to, to, 1, true) } })
        cleanups.push(() => trigger.kill())
      })
      return () => cleanups.forEach((cleanup) => cleanup())
    })
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      media.revert()
    }
  }, { scope: rootRef })
}
