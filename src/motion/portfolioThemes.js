import { gsap } from './gsapSetup'

export const CHAPTER_ORDER = ['about', 'work', 'strengths', 'contact']
export const portfolioThemes = {
  about: { background: '#071426', foreground: '#FFF3EA', accent: '#61BDD9', gridAlpha: .13, curveAlpha: .45, glowA: ['24%', '32%', '42rem', .34], glowB: ['78%', '68%', '34rem', .2] },
  work: { background: '#061A35', foreground: '#FFF3EA', accent: '#61BDD9', gridAlpha: .12, curveAlpha: .38, glowA: ['72%', '28%', '42rem', .3], glowB: ['16%', '78%', '34rem', .2] },
  strengths: { background: '#4B101C', foreground: '#FFF3EA', accent: '#287BEA', gridAlpha: .08, curveAlpha: .28, glowA: ['18%', '24%', '34rem', .26], glowB: ['78%', '72%', '40rem', .2] },
  contact: { background: '#D8FF36', foreground: '#0E0E0E', accent: '#287BEA', gridAlpha: 0, curveAlpha: 0, glowA: ['16%', '18%', '46rem', .3], glowB: ['82%', '76%', '38rem', .2] },
}
export const themeProgress = gsap.utils.clamp(0, 1)
export const interpolateColor = (from, to, progress) => gsap.utils.interpolate(from, to, themeProgress(progress))
