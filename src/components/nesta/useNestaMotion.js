import {
  gsap,
  ScrollTrigger,
  motionAllowed,
  scrollerFor,
  useGSAP,
} from '../../motion/gsapSetup'

export function nestaMotionMode({ desktop, reduceMotion }) {
  if (reduceMotion) return 'static'
  return desktop ? 'editorial' : 'flow'
}

export default function useNestaMotion(rootRef) {
  useGSAP((context, contextSafe) => {
    const root = rootRef.current
    if (!root || !motionAllowed()) return undefined

    const q = gsap.utils.selector(root)
    const scroller = scrollerFor(root)
    const withScroller = scroller ? { scroller } : {}
    const media = gsap.matchMedia()

    media.add({
      desktop: '(min-width: 721px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, ({ conditions }) => {
      const mode = nestaMotionMode(conditions)
      if (mode === 'static') return undefined

      const cleanups = []

      gsap.timeline({ defaults: { duration: .72, ease: 'power3.out' } })
        .addLabel('intro')
        .from(q('[data-nesta-intro] > *'), { autoAlpha: 0, y: 28, stagger: .08 }, 'intro')

      ScrollTrigger.batch(q('.nesta-research__insights article, .nesta-identity__grid > article'), {
        start: 'top 86%',
        once: true,
        interval: .08,
        batchMax: mode === 'editorial' ? 3 : 1,
        ...withScroller,
        onEnter: (batch) => gsap.fromTo(
          batch,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: .7, stagger: .08, overwrite: true },
        ),
      })

      const strategy = q('.nesta-strategy')[0]
      if (strategy) {
        gsap.timeline({
          defaults: { duration: .8, ease: 'power3.out' },
          scrollTrigger: {
            trigger: strategy,
            start: 'top 78%',
            end: 'top 34%',
            scrub: mode === 'editorial' ? .8 : false,
            ...withScroller,
          },
        })
          .addLabel('positioning')
          .from(q('.nesta-strategy .nesta-section-head h3'), {
            clipPath: 'inset(0 100% 0 0)',
          }, 'positioning')
          .from(q('.nesta-strategy__decisions article'), {
            autoAlpha: 0,
            y: 24,
            stagger: .1,
          }, 'positioning+=.15')
      }

      if (mode === 'editorial') {
        // media entrances are handled by the global asset-motion system
        // (useAssetMotion: clip-wipe + staggered am-in), same as every other
        // case study — no bespoke batch here, and no pointer tilt, so hover
        // interaction matches the shared .am grammar.
      }

      return () => cleanups.forEach((cleanup) => cleanup())
    })

    let cancelled = false
    Promise.all(
      Array.from(root.querySelectorAll('img')).map((image) => image.decode?.().catch(() => undefined)),
    ).then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      media.revert()
    }
  }, { scope: rootRef })
}
