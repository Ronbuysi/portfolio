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

    // 兜底：加载时已处于视口内的元素，batch 的 onEnter 不会回溯触发
    // （布局偏早计算时会漏标），直接显示，避免停留在 scale(1.08) 裁切态
    const markVisibleNow = () => nodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) node.classList.add('is-visible')
    })
    requestAnimationFrame(markVisibleNow)
    const onLoad = () => markVisibleNow()
    if (document.readyState !== 'complete') window.addEventListener('load', onLoad, { once: true })

    return () => {
      window.removeEventListener('load', onLoad)
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [motionAllowed, requeryKey])
}
