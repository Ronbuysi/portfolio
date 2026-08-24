import { useRef } from 'react'
import { Flip, gsap, motionAllowed, useGSAP } from '../motion/gsapSetup'

export default function ProjectTransitionLayer({ origin, active }) {
  const rootRef = useRef(null)
  useGSAP(() => {
    const root = rootRef.current
    const target = document.querySelector('.pdetail__transition-target')
    if (!root || !origin || !active || !target || !motionAllowed()) return undefined
    const clone = origin.cloneNode(true)
    const rect = origin.getBoundingClientRect()
    clone.className = 'project-transition__clone'
    Object.assign(clone.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: '0' })
    root.appendChild(clone)
    const tween = Flip.fit(clone, target, { duration: .68, ease: 'power3.inOut', absolute: true, scale: true, onComplete: () => gsap.to(clone, { autoAlpha: 0, duration: .15 }) })
    return () => { tween?.kill(); clone.remove() }
  }, { scope: rootRef, dependencies: [origin, active], revertOnUpdate: true })
  return <div className="project-transition" ref={rootRef} aria-hidden="true" />
}
