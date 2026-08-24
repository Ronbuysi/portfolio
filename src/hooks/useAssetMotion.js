import { useEffect } from 'react'
import { profileFor } from '../motion/assetProfiles'
import { ScrollTrigger, scrollerFor } from '../motion/gsapSetup'
import { isGlobalProjectMotionTarget } from '../motion/globalProjectMotion'

export default function useAssetMotion(motionAllowed = true, requeryKey = null) {
  useEffect(() => {
    if (!motionAllowed || typeof ScrollTrigger === 'undefined') return undefined

    const figures = Array.from(document.querySelectorAll('.project figure'))
      .filter(isGlobalProjectMotionTarget)
    if (!figures.length) return undefined

    const reduced = !document.documentElement.classList.contains('motion-forced')
      && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    const groupCounter = new Map()

    figures.forEach((figure) => {
      const img = figure.querySelector('img')
      const src = img?.getAttribute('src') || ''
      const kind = profileFor(src)
      figure.classList.add('am', `am--${kind}`)
      if (/stamp|passport/i.test(src)) figure.classList.add('am--stamp')
      if (/route|wayfinding|blueprint|city-|touchpoint/i.test(src)) figure.classList.add('am--draw')

      const parentKey = figure.parentElement
      const nextIndex = (groupCounter.get(parentKey) || 0) + 1
      groupCounter.set(parentKey, nextIndex)
      figure.style.setProperty('--am-d', `${(nextIndex - 1) % 4 * 80}ms`)
    })

    const revealAll = () => figures.forEach((figure) => figure.classList.add('am-in'))

    if (reduced) {
      revealAll()
      return undefined
    }

    // elements inside the project overlay scroll within .pdetail, not the window
    const groups = new Map()
    figures.forEach((figure) => {
      const key = scrollerFor(figure) ?? 'viewport'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(figure)
    })

    const triggers = []
    groups.forEach((list, key) => {
      const batched = ScrollTrigger.batch(list, {
        start: 'top 94%',
        once: true,
        onEnter: (batch) => batch.forEach((figure) => figure.classList.add('am-in')),
        ...(key === 'viewport' ? {} : { scroller: key }),
      })
      triggers.push(...batched)
    })

    const failsafe = setTimeout(revealAll, 1600)

    return () => {
      clearTimeout(failsafe)
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [motionAllowed, requeryKey])
}
