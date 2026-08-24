import { gsap, useGSAP, motionAllowed, scrollerFor } from '../motion/gsapSetup'

const POP_TARGETS = [
  '.ip-story__palette i',
  '.ip-story__summer-track i',
  '.brand-story__colors i',
  '.sanfu-campaign__swatches i',
  '.operation-story__grammar-grid i',
  '.poster-story__swatches i',
].join(', ')

// these marks carry base CSS rotations; gsap reads them and settles back
const MARK_TARGETS = '.daodao-story__concept-card i, .daodao-story__identity-mark'

export default function useStoryAccents(rootRef) {
  useGSAP(() => {
    const root = rootRef.current
    if (!root || !motionAllowed()) return undefined

    const q = gsap.utils.selector(root)

    const popIn = (targets, vars = {}) => targets.forEach((el) => {
      const scroller = scrollerFor(el)
      gsap.from(el, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'back.out(2.2)',
        ...vars,
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top 88%',
          once: true,
          ...(scroller ? { scroller } : {}),
        },
      })
    })

    popIn(q(POP_TARGETS))
    popIn(q(MARK_TARGETS), { rotation: '-=28', duration: 0.7, ease: 'back.out(1.8)' })
  }, { scope: rootRef })
}
