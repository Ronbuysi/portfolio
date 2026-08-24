import { gsap, useGSAP, motionAllowed } from '../motion/gsapSetup'

export default function useMagneticLinks(rootRef, selector = 'a[href], button') {
  useGSAP((context, contextSafe) => {
    const root = rootRef.current
    if (!root || !motionAllowed()) return undefined
    if (!window.matchMedia?.('(pointer: fine)')?.matches) return undefined

    const cleanups = Array.from(root.querySelectorAll(selector)).map((link) => {
      const qx = gsap.quickTo(link, 'x', { duration: 0.4, ease: 'power3.out' })
      const qy = gsap.quickTo(link, 'y', { duration: 0.4, ease: 'power3.out' })
      const onMove = contextSafe((event) => {
        const rect = link.getBoundingClientRect()
        qx(gsap.utils.clamp(-10, 10, (event.clientX - rect.left - rect.width / 2) * 0.25))
        qy(gsap.utils.clamp(-8, 8, (event.clientY - rect.top - rect.height / 2) * 0.35))
      })
      const onLeave = contextSafe(() => { qx(0); qy(0) })
      link.addEventListener('pointermove', onMove)
      link.addEventListener('pointerleave', onLeave)
      return () => {
        link.removeEventListener('pointermove', onMove)
        link.removeEventListener('pointerleave', onLeave)
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, { scope: rootRef })
}
