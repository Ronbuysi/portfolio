import { useEffect } from 'react'
import { ScrollTrigger } from '../motion/gsapSetup'

export default function useRevealOnScroll(motionAllowed = true, requeryKey = null) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!nodes.length) return undefined

    const showAll = () => nodes.forEach((node) => node.classList.add('is-visible'))

    if (!motionAllowed || typeof ScrollTrigger === 'undefined') {
      showAll()
      return undefined
    }

    // elements inside the project overlay scroll within .pdetail, not the window
    const groups = new Map()
    nodes.forEach((node) => {
      const scroller = node.closest?.('.pdetail')
      const key = scroller ?? 'viewport'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(node)
    })

    const triggers = []
    groups.forEach((list, key) => {
      const batched = ScrollTrigger.batch(list, {
        start: 'top 91%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((node, index) => {
            const delay = Number(node.dataset.revealDelay || 0) + index * 30
            if (delay) {
              node.style.transitionDelay = `${delay}ms`
              node.addEventListener('transitionend', () => { node.style.transitionDelay = '' }, { once: true })
            }
            node.classList.add('is-visible')
          })
        },
        ...(key === 'viewport' ? {} : { scroller: key }),
      })
      triggers.push(...batched)
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [motionAllowed, requeryKey])
}
