import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'

export default function FloatingNav() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      const goingUp = y < lastY - 4
      el.classList.toggle('is-shown', goingUp && y > window.innerHeight * 0.85)
      lastY = y
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <nav ref={ref} className="floating-nav" aria-label="Floating navigation">
    <a className="floating-nav__mark" href="#home">WANG CC™</a>
    <div className="floating-nav__links">
      <a href="#work">WORK</a>
      <a href="#about">ABOUT</a>
      <a href="#contact">CONTACT</a>
    </div>
    <a className="floating-nav__cta" href={`mailto:${profile.email}`}>LET&apos;S TALK ↗</a>
  </nav>
}
