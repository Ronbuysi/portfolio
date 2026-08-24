import { gsap, ScrollTrigger, useGSAP } from './gsapSetup'

export const strengthsMode = ({ reduced }) => reduced ? 'static' : 'flow'
export const strengthIndex = (progress) => Math.min(3, Math.floor(gsap.utils.clamp(0, .9999, progress) * 4))

export default function useStrengthsStory(rootRef) {
  useGSAP(() => {
    const root = rootRef.current
    if (!root) return undefined
    const q = gsap.utils.selector(root)
    const cards = q('[data-strength-card]')
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width:1025px)', reduced: '(prefers-reduced-motion:reduce)' }, ({ conditions }) => {
      const forced = document.documentElement.classList.contains('motion-forced')
      const mode = strengthsMode({ ...conditions, reduced: conditions.reduced && !forced })
      const activate = (index) => cards.forEach((card, i) => card.setAttribute('aria-current', i === index ? 'true' : 'false'))
      activate(0)
      if (mode === 'static') return undefined
      ScrollTrigger.batch(cards, { start: 'top 88%', once: true, onEnter: (batch) => {
        const index = cards.indexOf(batch[0])
        if (index >= 0) activate(index)
        gsap.fromTo(batch, { y: 28 }, { y: 0, stagger: .1 })
      } })
      const path = q('.strengths__path path')[0]
      if (path) gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top 86%', end: 'bottom 30%', scrub: .7 } })
      return undefined
    })
    return () => media.revert()
  }, { scope: rootRef })
}
