import { useRef } from 'react'
import { projects } from '../data/projects'
import { gsap, useGSAP } from '../motion/gsapSetup'

function srcFor(project) {
  const raw = project.cover
    || project.aiPresentation?.hero
    || project.posters?.[0]?.src
    || project.extensions?.[0]?.src
    || project.gallery?.[0]?.src
    || ''
  return raw.replace(/\.(png|jpe?g)$/, '-w960.webp')
}

const TEXTS = ['WANG CHENGCHENG', 'VISUAL × AI × BRAND', 'PORTFOLIO 2026']

function Half({ projects }) {
  const tokens = []
  for (let i = 0; i < 6; i++) {
    tokens.push(<span key={`t${i}`} className="ticker__text">{TEXTS[i % TEXTS.length]}</span>)
    tokens.push(
      <img
        key={`i${i}`}
        className="ticker__pic"
        src={srcFor(projects[i % projects.length])}
        alt=""
        loading="lazy"
        decoding="async"
      />,
    )
  }
  return <>{tokens}</>
}

export default function TickerTape() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return undefined
    const forced = document.documentElement.classList.contains('motion-forced')
    if (!forced && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return undefined

    const state = { x: 0, velocity: 0, lastY: window.scrollY, dir: -1, hover: false, half: 0 }
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.45, ease: 'power2.out' })

    // measure the wrap period up front and refresh it only on resize / image load;
    // reading scrollWidth inside the frame loop forces layout every tick
    const measure = () => { state.half = track.scrollWidth / 2 }
    let measureQueued = false
    const queueMeasure = () => {
      if (measureQueued) return
      measureQueued = true
      requestAnimationFrame(() => { measureQueued = false; measure() })
    }

    const tick = (time, deltaTime) => {
      const delta = Math.min(deltaTime / 16.7, 4)
      const y = window.scrollY
      const scrolled = y - state.lastY
      state.lastY = y
      state.velocity += (scrolled * 0.05 - state.velocity) * 0.08
      if (state.velocity > 0.12) state.dir = -1
      else if (state.velocity < -0.12) state.dir = 1
      skewTo(gsap.utils.clamp(-7, 7, state.velocity * 2.4))
      state.x -= (0.55 + Math.abs(state.velocity)) * delta * state.dir * (state.hover ? 0 : 1)
      if (state.half > 0) {
        if (state.x <= -state.half) state.x += state.half
        if (state.x > 0) state.x -= state.half
      }
      track.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`
    }

    // only run the ticker callback while the strip is actually on screen
    let running = false
    const setRunning = (next) => {
      if (next === running) return
      running = next
      if (running) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    }
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), { threshold: 0 })
      : null

    const enter = () => { state.hover = true }
    const leave = () => { state.hover = false }
    track.parentElement.addEventListener('pointerenter', enter)
    track.parentElement.addEventListener('pointerleave', leave)
    window.addEventListener('resize', queueMeasure)
    track.addEventListener('load', queueMeasure, true)
    gsap.fromTo(root, { scaleY: .08 }, { scaleY: 1, transformOrigin: 'center', ease: 'none', scrollTrigger: { trigger: root, start: 'top 96%', end: 'top 72%', scrub: .7 } })

    measure()
    if (observer) observer.observe(root)
    else setRunning(true)

    return () => {
      setRunning(false)
      observer?.disconnect()
      window.removeEventListener('resize', queueMeasure)
      track.removeEventListener('load', queueMeasure, true)
      track.parentElement.removeEventListener('pointerenter', enter)
      track.parentElement.removeEventListener('pointerleave', leave)
      gsap.set(track, { clearProps: 'all' })
    }
  }, { scope: rootRef, dependencies: [] })

  return <div className="ticker" ref={rootRef} data-chapter-threshold="work" aria-hidden="true">
    <div className="ticker__track" ref={trackRef}>
      <span className="ticker__half"><Half projects={projects} /></span>
      <span className="ticker__half"><Half projects={projects} /></span>
    </div>
  </div>
}
