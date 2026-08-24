import { useEffect, useRef, useState } from 'react'
import { gsap, motionAllowed, useGSAP } from '../motion/gsapSetup'
import { heroPreloadSources, heroProps } from '../data/heroScene'
import { preloadImages } from '../utils/preloadImages'

const spring = heroProps.find(({ id }) => id === 'spring-table')

export default function Preloader({
  assets = heroPreloadSources,
  onReady = () => {},
  loadAssets = preloadImages,
  minDuration = 1200,
  maxDuration = 3500,
}) {
  const [complete, setComplete] = useState(false)
  const rootRef = useRef(null)
  const topRef = useRef(null)
  const bottomRef = useRef(null)
  const numRef = useRef(null)
  const barRef = useRef(null)
  const springRef = useRef(null)
  const progressRef = useRef({ n: 0, tween: null })
  const readyCalledRef = useRef(false)

  const renderProgress = (value) => {
    const rounded = Math.max(0, Math.min(100, Math.round(value)))
    if (numRef.current) numRef.current.textContent = String(rounded).padStart(3, '0')
    if (barRef.current) barRef.current.style.transform = `scaleX(${rounded / 100})`
  }

  useEffect(() => {
    let active = true
    let loaded = false
    let minimumMet = false
    const state = progressRef.current
    const updateProgress = (target) => {
      state.tween?.kill()
      if (!motionAllowed()) {
        state.n = target
        renderProgress(target)
        return
      }
      state.tween = gsap.to(state, {
        n: target,
        duration: .34,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => renderProgress(state.n),
      })
    }
    const finishIfReady = () => {
      if (active && loaded && minimumMet) {
        updateProgress(100)
        setComplete(true)
      }
    }
    const startTimer = setTimeout(() => {
      loadAssets(assets, { onProgress: updateProgress })
        .catch(() => ({ total: assets.length, failed: assets.length }))
        .then(() => { loaded = true; finishIfReady() })
    }, 0)
    const minimumTimer = setTimeout(() => { minimumMet = true; finishIfReady() }, minDuration)
    const failsafeTimer = setTimeout(() => {
      if (!active) return
      loaded = true
      minimumMet = true
      updateProgress(100)
      setComplete(true)
    }, maxDuration)

    return () => {
      active = false
      clearTimeout(startTimer)
      clearTimeout(minimumTimer)
      clearTimeout(failsafeTimer)
      state.tween?.kill()
    }
  }, [assets, loadAssets, minDuration, maxDuration])

  useGSAP(() => {
    if (!complete) return undefined
    const callReady = () => {
      if (readyCalledRef.current) return
      readyCalledRef.current = true
      onReady()
    }
    renderProgress(100)
    if (!motionAllowed()) {
      const timer = setTimeout(callReady, 160)
      return () => clearTimeout(timer)
    }
    const timeline = gsap.timeline({ onComplete: callReady })
      .to(springRef.current, { scaleY: .84, duration: .14, ease: 'power2.in' })
      .to(springRef.current, { scaleY: 1, duration: .5, ease: 'back.out(2.6)' })
      .to(topRef.current, { yPercent: -101, duration: .72, ease: 'expo.inOut' }, '+=.02')
      .to(bottomRef.current, { yPercent: 101, duration: .72, ease: 'expo.inOut' }, '<')
      .to(rootRef.current, { autoAlpha: 0, duration: .18 }, '-=.08')
    return () => timeline.kill()
  }, { scope: rootRef, dependencies: [complete, onReady], revertOnUpdate: true })

  return <div className="preloader" ref={rootRef} aria-hidden="true">
    <span className="preloader__split preloader__split--top" ref={topRef} />
    <span className="preloader__split preloader__split--bottom" ref={bottomRef} />
    <div className="preloader__content">
      <div className="preloader__meta"><strong>WANG CHENGCHENG</strong><span>PORTFOLIO / 2026</span></div>
      <picture className="preloader__spring" ref={springRef}>
        <source srcSet={spring.mobile} type="image/webp" />
        <img src={spring.desktop} alt="" />
      </picture>
      <span className="preloader__word">LOADING THE SCENE</span>
      <span className="preloader__num" ref={numRef}>000</span>
      <span className="preloader__bar"><i ref={barRef} /></span>
    </div>
  </div>
}
