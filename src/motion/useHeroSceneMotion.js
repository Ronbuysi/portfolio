import { gsap, SplitText, useGSAP } from './gsapSetup'

const DEPTH = { far: 8, mid: 14, front: 22 }

export function heroMotionMode({ reduced, finePointer }) {
  if (reduced) return 'static'
  return finePointer ? 'desktop' : 'touch'
}

export function normalizedPointer(value, size) {
  if (!size) return 0
  return Math.max(-1, Math.min(1, value / size * 2 - 1))
}

export function depthOffset(depth, value) {
  return (DEPTH[depth] ?? DEPTH.mid) * Math.max(-1, Math.min(1, value))
}

function feedbackFor(element) {
  const id = element.dataset.heroProp
  if (id === 'spring-table') {
    return gsap.timeline().to(element, { scaleY: .88, duration: .12, ease: 'power2.in' }).to(element, { scaleY: 1, duration: .55, ease: 'back.out(2.4)' })
  }
  if (id === 'rocking-chair') {
    return gsap.to(element, { rotation: -2.2, duration: .48, yoyo: true, repeat: 1, transformOrigin: '50% 92%', ease: 'sine.inOut' })
  }
  if (id === 'table-lamp') {
    return gsap.to(element, { rotation: 2, filter: 'brightness(1.12)', duration: .36, yoyo: true, repeat: 1, ease: 'sine.inOut' })
  }
  if (id === 'blue-cabinet') {
    return gsap.to(element, { rotation: 1.4, filter: 'drop-shadow(0 0 1.2rem rgba(40,123,234,.55))', duration: .38, yoyo: true, repeat: 1, ease: 'sine.inOut' })
  }
  return gsap.to(element, { rotation: 1.8, scale: 1.025, duration: .4, yoyo: true, repeat: 1, ease: 'sine.inOut' })
}

export default function useHeroSceneMotion(rootRef, ready) {
  useGSAP((context, contextSafe) => {
    const root = rootRef.current
    if (!root) return undefined
    const q = gsap.utils.selector(root)
    const media = gsap.matchMedia()

    media.add({
      finePointer: '(pointer: fine)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, ({ conditions }) => {
      const forced = document.documentElement.classList.contains('motion-forced')
      const mode = heroMotionMode({ ...conditions, reduced: conditions.reduced && !forced })
      if (mode === 'static') return undefined

      const splits = q('.hero__line-inner').map((element) => SplitText.create(element, { type: 'chars', mask: 'chars' }))
      const titleChars = splits.flatMap((split) => split.chars)
      const props = q('[data-hero-prop]')
      const cleanups = []

      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
        .addLabel('background')
        .from(q('.hero__scene-bg-img'), { scale: 1.06, filter: 'blur(8px)', duration: 1.1, clearProps: 'filter' }, 'background')
        .addLabel('title', .12)
        .from(titleChars, { yPercent: 118, duration: .9, stagger: .045 }, 'title')
        .fromTo(q('[data-depth="far"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .62, immediateRender: false }, .38)
        .fromTo(q('[data-depth="mid"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .68, stagger: .08, immediateRender: false }, .48)
        .fromTo(q('[data-depth="front"]'), { autoAlpha: 0, y: 32, scale: .94 }, { autoAlpha: 1, y: 0, scale: 1, duration: .72, stagger: .1, immediateRender: false }, .6)
        .from(q('.hero__meta-row, .hero__baseline, .hero__edge-label'), { autoAlpha: 0, y: 16, duration: .55, stagger: .08 }, .78)

      if (ready) entrance.play()

      gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: .8 },
        defaults: { ease: 'none' },
      })
        .to(q('.hero__scene-bg'), { scale: 1.04 }, 0)
        .to(q('[data-depth="far"]'), { yPercent: -3 }, 0)
        .to(q('[data-depth="mid"]'), { yPercent: -7 }, 0)
        .to(q('[data-depth="front"]'), { xPercent: (index) => index % 2 ? 8 : -8, yPercent: -10 }, 0)
        .to(q('.hero__content'), { yPercent: -10, autoAlpha: .35 }, 0)
        .to(q('.hero__scroll-cue'), { autoAlpha: 0, duration: .2 }, 0)

      if (mode === 'desktop') {
        const layers = [q('.hero__scene-bg')[0], ...props].filter(Boolean).map((element) => ({
          element,
          depth: element.dataset.depth || 'far',
          xTo: gsap.quickTo(element, 'x', { duration: .55, ease: 'power3.out' }),
          yTo: gsap.quickTo(element, 'y', { duration: .55, ease: 'power3.out' }),
        }))
        const move = contextSafe((event) => {
          const x = normalizedPointer(event.clientX, root.clientWidth)
          const y = normalizedPointer(event.clientY, root.clientHeight)
          layers.forEach((layer) => {
            layer.xTo(depthOffset(layer.depth, x))
            layer.yTo(depthOffset(layer.depth, y) * .7)
          })
        })
        const reset = contextSafe(() => layers.forEach((layer) => { layer.xTo(0); layer.yTo(0) }))
        root.addEventListener('pointermove', move)
        root.addEventListener('pointerleave', reset)
        cleanups.push(() => { root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', reset) })
      } else {
        gsap.to(q('[data-depth="mid"]'), { y: -4, duration: 1.6, stagger: .12, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      }

      props.forEach((element) => {
        const react = contextSafe(() => feedbackFor(element))
        element.addEventListener('pointerenter', react)
        element.addEventListener('click', react)
        cleanups.push(() => { element.removeEventListener('pointerenter', react); element.removeEventListener('click', react) })
      })

      return () => {
        entrance.kill()
        splits.forEach((split) => split.revert())
        cleanups.forEach((cleanup) => cleanup())
      }
    }, root)

    return () => media.revert()
  }, { scope: rootRef, dependencies: [ready], revertOnUpdate: true })
}
