import { useEffect } from 'react'
import { gsap, scrollerFor } from '../motion/gsapSetup'
import { isGlobalProjectMotionTarget } from '../motion/globalProjectMotion'

export default function useParallax(motionAllowed = true, requeryKey = null) {
  useEffect(() => {
    if (!motionAllowed || typeof window === 'undefined') return undefined

    const figures = Array.from(document.querySelectorAll('[data-parallax], .project figure'))
      .filter(isGlobalProjectMotionTarget)
      // 舞台海报必须与背景框像素级对齐，任何缩放/漂移都会让它溢出框外
      .filter((figure) => !figure.closest('.poster-story__stage'))
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
          // 仅保留 figure 级缩放（不裁图）；img 级 scale 1.12 + yPercent 视差
          // 会永久裁掉图片左右边缘（overflow:hidden），已按需求移除
          gsap.timeline({ scrollTrigger: st() })
            .fromTo(figure, { scale: 0.955 }, { scale: 1, duration: 0.5, ease: 'none' })
            .to(figure, { scale: 0.955, duration: 0.5, ease: 'none' })
        }
        // 非 hero 图片不再做 scale 视差，保证作品图完整显示不被裁边
      })
    })

    return () => { mm.revert() }
  }, [motionAllowed, requeryKey])
}
