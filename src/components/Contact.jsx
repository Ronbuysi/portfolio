import { useRef } from 'react'
import { profile } from '../data/profile'
import { gsap, SplitText, useGSAP, motionAllowed } from '../motion/gsapSetup'
import useMagneticLinks from '../hooks/useMagneticLinks'

const CONTACT_LINES = ["LET'S MAKE", 'SOMETHING', 'MEMORABLE.']

export default function Contact() {
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  useMagneticLinks(rootRef, '.contact footer a')

  useGSAP((context, contextSafe) => {
    const root = rootRef.current
    const title = titleRef.current
    if (!root || !title || !motionAllowed()) return undefined

    const orbs = Array.from(root.querySelectorAll('.contact__orb')).map((orb, index) => ({
      xTo: gsap.quickTo(orb, 'x', { duration: .8 + index * .2, ease: 'power3.out' }),
      yTo: gsap.quickTo(orb, 'y', { duration: .8 + index * .2, ease: 'power3.out' }),
    }))
    const move = contextSafe((event) => {
      const x = event.clientX / window.innerWidth - .5
      const y = event.clientY / window.innerHeight - .5
      orbs.forEach((orb, index) => { orb.xTo(x * (55 + index * 35)); orb.yTo(y * (40 + index * 28)) })
    })
    const reset = contextSafe(() => orbs.forEach((orb) => { orb.xTo(0); orb.yTo(0) }))
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerleave', reset)

    gsap.fromTo(root.querySelector('.contact__wipe'), { scale: .08 }, { scale: 1.5, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 15%', scrub: .8 } })

    const split = SplitText.create(title, { type: 'chars', mask: 'chars' })
    gsap.from(split.chars, {
      yPercent: 120,
      duration: 0.85,
      stagger: 0.028,
      ease: 'power4.out',
      scrollTrigger: { trigger: title, start: 'top 82%', once: true },
    })
    const back = root.querySelector('[data-scroll-home]')
    const scrollHome = contextSafe((event) => {
      event.preventDefault()
      gsap.to(window, { duration: .9, scrollTo: { y: '#home', offsetY: 0 }, ease: 'power3.inOut' })
    })
    back?.addEventListener('click', scrollHome)
    return () => {
      split.revert()
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', reset)
      back?.removeEventListener('click', scrollHome)
    }
  }, { scope: rootRef })

  return <section id="contact" className="contact" ref={rootRef}>
    <span className="contact__wipe" aria-hidden="true" />
    <span className="contact__orb contact__orb--a" aria-hidden="true" />
    <span className="contact__orb contact__orb--b" aria-hidden="true" />
    <div className="contact__inner shell">
      <p className="eyebrow" data-reveal>AVAILABLE FOR CREATIVE COLLABORATION</p>
      <h2 className="contact__title" ref={titleRef} aria-label="LET'S MAKE SOMETHING MEMORABLE.">
        {CONTACT_LINES.map((line) => <span className="contact__line" key={line} aria-hidden="true">{line}</span>)}
      </h2>
      <footer data-reveal data-reveal-delay={220}>
        <a className="contact__email" href={`mailto:${profile.email}`}>{profile.email} ↗<i className="contact__email-scan" /></a>
        <a href="#home" data-scroll-home>BACK TO TOP ↑</a>
        <span>© 2026 WCC</span>
      </footer>
    </div>
  </section>
}
