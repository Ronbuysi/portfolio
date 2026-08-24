import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../motion/gsapSetup'

export default function CountUp({ value = '', duration = 900 }) {
  const ref = useRef(null)
  const [placeholder] = useState(() => value.replace(/\d/g, '0'))

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const match = value.match(/^(\D*?)(\d+)(\D*)$/)
    if (!match) { el.textContent = value; return undefined }
    const [, prefix, digits, suffix] = match
    const end = parseInt(digits, 10)
    const forced = document.documentElement.classList.contains('motion-forced')
    if (!forced && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) { el.textContent = value; return undefined }
    if (typeof IntersectionObserver === 'undefined') { el.textContent = value; return undefined }

    const state = { n: 0 }
    const render = () => {
      el.textContent = `${prefix}${String(Math.round(state.n)).padStart(digits.length, '0')}${suffix}`
    }
    const tween = gsap.to(state, {
      n: end,
      duration: duration / 1000,
      ease: 'back.out(1.25)',
      paused: true,
      onUpdate: render,
      onComplete: () => { el.textContent = value },
    })
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      tween.play()
      observer.disconnect()
    }, { threshold: 0.4 })
    observer.observe(el)

    return () => { tween.kill(); observer.disconnect() }
  }, [value, duration])

  return <span ref={ref}>{placeholder}</span>
}
