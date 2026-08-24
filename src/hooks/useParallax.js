import { useEffect } from 'react'
import { gsap, scrollerFor } from '../motion/gsapSetup'
import { isGlobalProjectMotionTarget } from '../motion/globalProjectMotion'

export default function useParallax(motionAllowed = true, requeryKey = null) {
  useEffect(() => {
    if (!motionAllowed || typeof window === 'undefined') return undefined

    const figures = Array.from(document.querySelectorAll('[data-parallax], .project figure'))
      .filter(isGlobalProjectMotionTarget)
    const seen = new Set()
    const items = []
    figures.forEach((figure) => {
      if (seen.has(figure)) return
      seen.add(figure)
      const isHero = figure.dataset.parallax !== undefined
      const isClip = figure.getAttribute('data-reveal') === 'clip'
      // clip figures keep their CSS entrance transition on img transforms,
      // except parallax heroes whose imgs opt out via [data-parallax] img
      if (isClip && !isHero) return
      const img = figure.querySelector('img')
      if (!img) return
      items.push({
        figure,
        img,
        strength: isHero ? (Number(figure.dataset.parallax) || 5) : 2.6,
        offsetX: Number(figure.dataset.offsetX || 0),
        isHero,
        scroller: scrollerFor(figure),
      })
    })
    if (!items.length) return undefined

    // desktop + fine pointer only; gsap.matchMedia auto-reverts on breakpoint change
    const mm = gsap.matchMedia()
    mm.add('(min-width: 721px) and (pointer: fine)', () => {
      items.forEach(({ figure, img, strength, offsetX, isHero, scroller }) => {
        const st = () => ({
          trigger: figure,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          ...(scroller ? { scroller } : {}),
        })
        if (isHero) {
          gsap.timeline({ scrollTrigger: st() })
            .fromTo(figure, { xPercent: offsetX, scale: 0.955 }, { xPercent: offsetX, scale: 1, duration: 0.5, ease: 'none' })
            .to(figure, { scale: 0.955, duration: 0.5, ease: 'none' })
          gsap.fromTo(img, { yPercent: -strength * 0.9, scale: 1.12 }, { yPercent: strength * 0.9, scale: 1.12, ease: 'none', scrollTrigger: st() })
        } else {
          gsap.fromTo(img, { yPercent: -strength * 0.9, scale: 1.08 }, { yPercent: strength * 0.9, scale: 1.08, ease: 'none', scrollTrigger: st() })
        }
      })
    })

    return () => { mm.revert() }
  }, [motionAllowed, requeryKey])
}
