import { gsap, motionAllowed } from './gsapSetup'

export const DEFAULT_ACCENT = '#d8ff36'

export function setThemeAccent(hex) {
  gsap.to(document.documentElement, {
    '--acid': hex || DEFAULT_ACCENT,
    duration: motionAllowed() ? 0.45 : 0,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}
