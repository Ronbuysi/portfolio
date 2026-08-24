import { gsap, ScrollTrigger, useGSAP } from './gsapSetup'

export const aboutMode = ({ reduced }) => reduced ? 'static' : 'flow'
export const aboutNodeProgress = gsap.utils.clamp(0, 1)

export default function useAboutStory(rootRef) {
  useGSAP(() => {
    const root = rootRef.current
    if (!root) return undefined
    const q = gsap.utils.selector(root)
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width:1025px)', reduced: '(prefers-reduced-motion:reduce)' }, ({ conditions }) => {
      const forced = document.documentElement.classList.contains('motion-forced')
      const mode = aboutMode({ ...conditions, reduced: conditions.reduced && !forced })
      if (mode === 'static') return undefined
      if (mode === 'flow') {
        gsap.timeline({ scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: .7 } })
          .fromTo(q('.about__portrait-frame img'), { yPercent: -4, scale: 1.08, filter: 'grayscale(1) contrast(1.12) brightness(.8)' }, { yPercent: 4, scale: 1.03, filter: 'grayscale(.28) contrast(1.05) brightness(.94)', ease: 'none' }, 0)
          .fromTo(q('.about__portrait-grid'), { yPercent: 5 }, { yPercent: -5, ease: 'none' }, 0)
          .fromTo(q('.about__ghost'), { xPercent: 14 }, { xPercent: -8, ease: 'none' }, 0)
      }
      ScrollTrigger.batch(q('.about__stat, [data-about-node], .honors__card'), {
        start: 'top 88%', once: true, interval: .08, batchMax: 3,
        onEnter: (batch) => gsap.fromTo(batch, { y: 24 }, { y: 0, stagger: .08, duration: .65, overwrite: true }),
      })
      const path = q('.about__path path')[0]
      if (path) gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path, start: 'top 86%', end: 'bottom 30%', scrub: .8 } })
      return undefined
    })
    return () => media.revert()
  }, { scope: rootRef })
}
