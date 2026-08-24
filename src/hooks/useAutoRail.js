import { useEffect } from 'react'

const RAIL_SELECTORS = [
  '.operation-story__system-evidence',
  '.daodao-story__originals',
  '.brand-story__originals',
  '.ip-story__source-grid',
]

const CLONE_STRIP_ATTRIBUTES = ['data-reveal', 'data-reveal-delay', 'data-reveal-clip', 'data-parallax', 'data-bleed', 'data-offset-x']
const MAX_COPY_SETS = 8

export default function useAutoRail(motionAllowed = true, requeryKey = null) {
  useEffect(() => {
    if (!motionAllowed || typeof IntersectionObserver === 'undefined') return undefined

    const forced = document.documentElement.classList.contains('motion-forced')
    const reduced = !forced && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    const rails = []

    RAIL_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((container) => {
        if (container.dataset.railReady) return
        container.dataset.railReady = '1'
        container.classList.add('auto-rail')

        const state = {
          container,
          track: null,
          x: 0,
          period: 0,
          needMeasure: true,
          paused: false,
          visible: true,
          speedEase: 1,
          originals: [],
          clones: [],
          io: null,
          unbind: [],
        }

        if (reduced) {
          container.classList.add('is-static')
          rails.push(state)
          return
        }

        const makeClone = (child) => {
          const clone = child.cloneNode(true)
          clone.setAttribute('aria-hidden', 'true')
          CLONE_STRIP_ATTRIBUTES.forEach((attr) => clone.removeAttribute(attr))
          clone.classList.add('am', 'am-in', 'is-visible')
          clone.querySelectorAll('[data-reveal], [data-parallax]').forEach((node) => {
            CLONE_STRIP_ATTRIBUTES.forEach((attr) => node.removeAttribute(attr))
            node.classList.add('is-visible')
          })
          clone.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; img.removeAttribute('loading') })
          return clone
        }

        const appendCloneSet = () => {
          state.originals.forEach((child) => {
            const clone = makeClone(child)
            state.clones.push(clone)
            state.track.appendChild(clone)
          })
        }

        const track = document.createElement('div')
        track.className = 'auto-rail__track'
        state.track = track
        state.originals = Array.from(container.children)
        state.originals.forEach((child) => track.appendChild(child))
        appendCloneSet()
        container.appendChild(track)

        const measure = () => {
          if (!state.track || !state.originals.length) return
          const firstOriginal = state.track.children[0]
          const firstClone = state.track.children[state.originals.length]
          if (!firstOriginal || !firstClone) return
          const period = Math.max(firstClone.offsetLeft - firstOriginal.offsetLeft, 1)
          let guard = 0
          while (state.track.scrollWidth < state.container.clientWidth + period && guard < MAX_COPY_SETS) {
            appendCloneSet()
            guard += 1
          }
          state.period = period
          state.needMeasure = false
        }
        state.measure = measure

        const onImageLoad = () => { state.needMeasure = true }
        const onResize = () => { state.needMeasure = true }
        container.addEventListener('load', onImageLoad, true)
        container.addEventListener('error', onImageLoad, true)
        window.addEventListener('resize', onResize)
        state.unbind.push(() => {
          container.removeEventListener('load', onImageLoad, true)
          container.removeEventListener('error', onImageLoad, true)
          window.removeEventListener('resize', onResize)
        })

        const enter = () => { state.paused = true }
        const leave = () => { state.paused = false }
        container.addEventListener('pointerenter', enter)
        container.addEventListener('pointerleave', leave)
        container.addEventListener('focusin', enter)
        container.addEventListener('focusout', leave)
        state.unbind.push(() => {
          container.removeEventListener('pointerenter', enter)
          container.removeEventListener('pointerleave', leave)
          container.removeEventListener('focusin', enter)
          container.removeEventListener('focusout', leave)
        })

        rails.push(state)
      })
    })

    if (!rails.length) return undefined

    let frame = 0
    let last = 0

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      let anyVisible = false
      rails.forEach((state) => {
        if (!state.track) return
        if (!state.visible) return
        anyVisible = true
        if (state.needMeasure) state.measure()
        if (!state.period) return
        state.speedEase += ((state.paused ? 0 : 1) - state.speedEase) * 0.06
        state.x -= 88 * state.speedEase * dt
        if (state.x <= -state.period) state.x += state.period
        if (state.x > 0) state.x -= state.period
        state.track.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`
      })
      if (anyVisible) frame = requestAnimationFrame(tick)
      else { frame = 0; runningRef.running = false }
    }
    const runningRef = { running: false }

    const start = () => {
      if (runningRef.running) return
      runningRef.running = true
      last = 0
      frame = requestAnimationFrame(tick)
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const state = rails.find((r) => r.container === entry.target)
        if (!state) return
        state.visible = entry.isIntersecting
      })
      if (rails.some((r) => r.visible)) start()
    }, { threshold: 0 })

    rails.forEach((state) => visibilityObserver.observe(state.container))
    if (rails.some((r) => r.track)) start()

    return () => {
      runningRef.running = false
      if (frame) cancelAnimationFrame(frame)
      visibilityObserver.disconnect()
      rails.forEach((state) => {
        state.unbind.forEach((fn) => fn())
        if (state.clones.length) {
          state.clones.forEach((clone) => clone.remove())
          state.clones = []
        }
        if (state.originals.length && state.track) {
          state.originals.forEach((child) => state.container.appendChild(child))
        }
        delete state.container.dataset.railReady
        state.container.classList.remove('auto-rail', 'is-static')
        if (state.track) { state.track.remove(); state.track = null }
      })
    }
  }, [motionAllowed, requeryKey])
}
