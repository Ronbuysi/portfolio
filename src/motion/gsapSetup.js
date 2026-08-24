import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrollToPlugin, useGSAP)

gsap.defaults({ ease: 'power2.out', duration: 0.7 })

export { gsap, ScrollTrigger, SplitText, Flip, ScrollToPlugin, useGSAP }

export function motionAllowed() {
  if (typeof window === 'undefined') return false
  if (document.documentElement.classList.contains('motion-forced')) return true
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
}

export function scrollerFor(el) {
  return el?.closest?.('.pdetail') ?? undefined
}
