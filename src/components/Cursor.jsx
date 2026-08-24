import { useRef } from 'react'
import { gsap, useGSAP, motionAllowed } from '../motion/gsapSetup'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useGSAP(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined
    if (!window.matchMedia?.('(pointer: fine)')?.matches) return undefined
    if (!motionAllowed()) return undefined

    document.documentElement.classList.add('has-cursor')

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' })

    let hover = false
    const scaleTween = gsap.to(ring, { scale: 1.9, duration: 0.35, ease: 'back.out(2.2)', paused: true })

    const onMove = (event) => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
      const interactive = event.target.closest?.('a, button, .work-ring__stage, input, textarea')
      if (!!interactive !== hover) {
        hover = !!interactive
        ring.classList.toggle('is-active', hover)
        if (hover) scaleTween.timeScale(1).play()
        else scaleTween.timeScale(1.6).reverse()
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      scaleTween.kill()
      document.documentElement.classList.remove('has-cursor')
    }
  })

  return <>
    <span className="cursor-dot" ref={dotRef} aria-hidden="true" />
    <span className="cursor-ring" ref={ringRef} aria-hidden="true" />
  </>
}
