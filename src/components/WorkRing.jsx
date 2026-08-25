import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import { gsap } from '../motion/gsapSetup'
import { createRingController, ringMode } from '../motion/ringController'

const AUTO_SPEED = 14 // deg per second
const COUNT = projects.length
const STEP_DEG = 360 / COUNT
const projectCount = String(projects.length).padStart(3, '0')

function srcFor(project) {
  const raw = project.cover
    || project.aiPresentation?.hero
    || project.posters?.[0]?.src
    || project.extensions?.[0]?.src
    || project.gallery?.[0]?.src
    || ''
  // ring cards render ≤ ~450 CSS px wide; the 960px variant covers them at DPR2
  return raw.replace(/\.(png|jpe?g)$/, '-w960.webp')
}

export default function WorkRing({ onOpen }) {
  const stageRef = useRef(null)
  const sceneRef = useRef(null)
  const spinRef = useRef(null)
  const hubNumRef = useRef(null)
  const capNumRef = useRef(null)
  const capTitleRef = useRef(null)
  const capCatRef = useRef(null)
  const cardRefs = useRef([])

  const A = useRef({ angle: 0 }) // single source of truth for ring rotation
  const controllerRef = useRef(createRingController(0))
  const S = useRef({
    hover: -1,
    front: -1,
    dragging: false,
    movedPx: 0,
    lastX: 0,
    lastMoveTime: 0,
    fling: 0,
    suppressClick: false,
  })
  const R = useRef({ auto: null, settle: null, idleTimer: 0, observer: null, sceneRotY: null, unbind: [] })

  function updateHub() {
    const st = S.current
    const raw = Math.round(-A.current.angle / STEP_DEG) % COUNT
    const idx = (raw + COUNT) % COUNT
    if (idx === st.front) return
    st.front = idx
    const p = projects[idx]
    if (hubNumRef.current) hubNumRef.current.textContent = p.index
    if (capNumRef.current) capNumRef.current.textContent = p.index
    if (capTitleRef.current) capTitleRef.current.textContent = p.title
    if (capCatRef.current) capCatRef.current.textContent = p.category
    cardRefs.current.forEach((card, i) => {
      card.setAttribute('aria-current', i === idx ? 'true' : 'false')
    })
  }

  function applyAngle() {
    if (!spinRef.current) return
    spinRef.current.style.transform = `rotateY(${A.current.angle.toFixed(3)}deg)`
    cardRefs.current.forEach((card, index) => {
      let eff = (index * STEP_DEG + A.current.angle) % 360
      if (eff < 0) eff += 360
      const facing = Math.cos((eff * Math.PI) / 180)
      const alpha = 0.22 + 0.78 * ((facing + 1) / 2)
      card.style.opacity = (S.current.hover === index ? 1 : alpha).toFixed(3)
    })
    updateHub()
  }

  const stopSettle = () => {
    if (R.current.settle) { R.current.settle.kill(); R.current.settle = null }
  }

  const pauseAuto = () => { R.current.auto?.pause() }

  const scheduleAuto = (delay = 1100) => {
    clearTimeout(R.current.idleTimer)
    R.current.idleTimer = setTimeout(() => {
      // never fight an in-flight settle tween for the angle property
      if (!R.current.settle) R.current.auto?.resume()
    }, delay)
  }

  // glide to a card-aligned angle; keeps momentum from the last drag
  const settleTo = (target, { maxDuration = 1.5 } = {}) => {
    stopSettle()
    controllerRef.current.acquire('settle')
    const distance = Math.abs(target - A.current.angle)
    const duration = gsap.utils.clamp(0.45, maxDuration, 0.35 + distance / 140)
    R.current.settle = gsap.to(A.current, {
      angle: target,
      duration,
      ease: 'power3.out',
      onUpdate: applyAngle,
      onComplete: () => {
        R.current.settle = null
        controllerRef.current.release('settle')
        scheduleAuto()
      },
    })
    return R.current.settle
  }

  const snapped = (value) => Math.round(value / STEP_DEG) * STEP_DEG

  useEffect(() => {
    const stage = stageRef.current
    const spin = spinRef.current
    if (!stage || !spin) return undefined

    const forced = document.documentElement.classList.contains('motion-forced')
    const reduced = !forced && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const mode = ringMode({ desktop: window.innerWidth >= 1025, tablet: window.innerWidth >= 721 })
    stage.dataset.ringMode = mode
    const flat = mode !== '3d' // 手机/平板胶片模式：原生横滑，角度系统不参与

    // continuous auto rotation as one pausable tween
    if (!reduced && !flat) {
      R.current.auto = gsap.to(A.current, {
        angle: '+=360',
        duration: 360 / AUTO_SPEED,
        ease: 'none',
        repeat: -1,
        onUpdate: applyAngle,
      })
      R.current.sceneRotY = gsap.quickTo(sceneRef.current, 'rotationY', { duration: 0.55, ease: 'power3.out' })
    }

    const layout = () => {
      const width = stage.offsetWidth || window.innerWidth
      const height = stage.offsetHeight || 520
      // scale up with the viewport so the ring fills large/fullscreen displays
      const cardWidth = Math.max(170, Math.min(width * 0.17, height * 0.48, 380))
      const radius = Math.max(240, Math.min(width * 0.38, 700))
      stage.style.setProperty('--wr-card-w', `${cardWidth.toFixed(0)}px`)
      stage.style.setProperty('--wr-radius', `${radius.toFixed(0)}px`)
      cardRefs.current.forEach((card, index) => {
        card.style.transform = `translate(-50%, -50%) rotateY(${index * STEP_DEG}deg) translateZ(${radius.toFixed(0)}px)`
      })
    }

    const onMouseMove = (event) => {
      R.current.sceneRotY?.((event.clientX / window.innerWidth - 0.5) * 4)
    }
    const resizeTimer = { current: 0 }
    const onResize = () => {
      clearTimeout(resizeTimer.current)
      resizeTimer.current = setTimeout(layout, 120)
    }

    const onPointerDown = (event) => {
      controllerRef.current.acquire('drag')
      S.current.dragging = true
      S.current.movedPx = 0
      S.current.lastX = event.clientX
      S.current.fling = 0
      stopSettle()
      pauseAuto()
      stage.classList.add('is-dragging')
    }
    const onPointerMove = (event) => {
      R.current.sceneRotY?.((event.clientX / window.innerWidth - 0.5) * 4)
      if (!S.current.dragging) return
      const now = performance.now()
      const dt = Math.max(now - (S.current.lastMoveTime || now - 16), 1) / 1000
      const dx = event.clientX - S.current.lastX
      const step = dx * 0.24
      A.current.angle += step
      S.current.movedPx += Math.abs(dx)
      S.current.fling = S.current.fling * 0.75 + (step / dt) * 0.25
      S.current.lastX = event.clientX
      S.current.lastMoveTime = now
      applyAngle()
    }
    const endDrag = () => {
      if (!S.current.dragging) return
      S.current.dragging = false
      controllerRef.current.release('drag')
      stage.classList.remove('is-dragging')
      if (S.current.movedPx > 8) {
        S.current.suppressClick = true
        setTimeout(() => { S.current.suppressClick = false }, 0)
      }
      // inertia: project momentum forward, then land on the nearest card
      const projected = A.current.angle + S.current.fling * 0.16
      settleTo(snapped(projected))
    }
    const onClickCapture = (event) => {
      if (S.current.suppressClick) {
        event.preventDefault()
        event.stopPropagation()
        S.current.suppressClick = false
      }
    }

    const cardUnbind = cardRefs.current.map((card, index) => {
      if (!card) return () => {}
      const enter = () => { S.current.hover = index; applyAngle() }
      const leave = () => { if (S.current.hover === index) { S.current.hover = -1; applyAngle() } }
      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)
      return () => {
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
      }
    })

    const stepButtons = []
    stage.parentElement?.querySelectorAll('[data-ring-step]').forEach((btn) => {
      const dir = Number(btn.dataset.ringStep)
      // 胶片模式：箭头按卡宽滚动；3D 模式：箭头走角度
      const handler = flat
        ? () => {
            const cardW = cardRefs.current[0]?.getBoundingClientRect().width || stage.clientWidth * 0.8
            stage.scrollBy({ left: dir * (cardW + 16), behavior: 'smooth' })
          }
        : () => {
            stopSettle()
            pauseAuto()
            settleTo(snapped(A.current.angle) + dir * STEP_DEG, { maxDuration: 0.9 })
          }
      btn.addEventListener('click', handler)
      stepButtons.push({ btn, handler })
    })

    // 胶片模式：角标与标题跟随横向滚动位置
    let syncFlat = null
    if (flat) {
      syncFlat = () => {
        const cardW = cardRefs.current[0]?.getBoundingClientRect().width || 1
        const idx = ((Math.round(stage.scrollLeft / (cardW + 16)) % COUNT) + COUNT) % COUNT
        const p = projects[idx]
        if (!p) return
        if (capNumRef.current) capNumRef.current.textContent = p.index
        if (capTitleRef.current) capTitleRef.current.textContent = p.title
        if (capCatRef.current) capCatRef.current.textContent = p.category
        cardRefs.current.forEach((card, k) => card.setAttribute('aria-current', k === idx ? 'true' : 'false'))
      }
      stage.addEventListener('scroll', syncFlat, { passive: true })
    }
    const scrub = { last: 0 }
    const slider = stage.parentElement?.querySelector('#work-ring-scrub')
    const onSliderDown = () => { stopSettle(); pauseAuto() }
    const onSliderInput = (event) => {
      const v = Number(event.target.value)
      A.current.angle += (v - scrub.last) * 1.5
      scrub.last = v
      applyAngle()
    }
    const onSliderRelease = (event) => {
      settleTo(snapped(A.current.angle), { maxDuration: 0.9 })
      event.target.value = '0'
      scrub.last = 0
    }
    const onSliderBlur = () => {
      settleTo(snapped(A.current.angle), { maxDuration: 0.9 })
    }
    if (slider && !flat) {
      slider.addEventListener('pointerdown', onSliderDown)
      slider.addEventListener('input', onSliderInput)
      slider.addEventListener('change', onSliderRelease)
      slider.addEventListener('blur', onSliderBlur)
    }

    layout()
    applyAngle()
    syncFlat?.()

    const cleanup = () => {
      stopSettle()
      R.current.auto?.kill()
      R.current.auto = null
      clearTimeout(R.current.idleTimer)
      clearTimeout(resizeTimer.current)
      R.current.observer?.disconnect()
      cardUnbind.forEach((fn) => fn())
      stepButtons.forEach(({ btn, handler }) => btn.removeEventListener('click', handler))
      if (slider) {
        slider.removeEventListener('pointerdown', onSliderDown)
        slider.removeEventListener('input', onSliderInput)
        slider.removeEventListener('change', onSliderRelease)
        slider.removeEventListener('blur', onSliderBlur)
      }
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      stage.removeEventListener('click', onClickCapture, true)
      stage.removeEventListener('scroll', syncFlat)
    }

    if (!flat) {
      stage.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', endDrag)
      stage.addEventListener('click', onClickCapture, true)
    }
    document.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize)

    if (typeof IntersectionObserver !== 'undefined' && R.current.auto) {
      R.current.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(R.current.idleTimer)
          // an in-flight settle re-schedules the auto spin on completion
          if (!S.current.dragging && !R.current.settle) R.current.auto?.resume()
        } else {
          R.current.auto?.pause()
        }
      }, { threshold: 0 })
      R.current.observer.observe(stage)
    }

    return cleanup
  }, [])

  return <div className="work-ring">
    <div className="work-cards__head">
      <span className="mini-label">INDEX / {projectCount}</span>
      <div className="work-cards__nav">
        <button type="button" aria-label="逆时针旋转" data-ring-step="-1">←</button>
        <button type="button" aria-label="顺时针旋转" data-ring-step="1">→</button>
      </div>
    </div>
    <div className="work-ring__stage" ref={stageRef}>
      <div className="work-ring__floor" aria-hidden="true" />
      <div className="work-ring__hub" aria-hidden="true">
        <span className="work-ring__hub-num" ref={hubNumRef}>001</span>
      </div>
      <svg className="work-ring__path" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="17" rx="48.5" ry="15.5" />
      </svg>
      <div className="work-ring__scene" ref={sceneRef}>
        <div className="work-ring__spin" ref={spinRef}>
          {projects.map((project, index) => (
            <a
              key={project.id}
              ref={(el) => { cardRefs.current[index] = el }}
              className="work-ring__card"
              href={`#work/${project.id}`}
              tabIndex={index < 3 ? 0 : -1}
              aria-label={`${project.index} ${project.title}`}
              onClick={(event) => {
                event.preventDefault()
                if (!S.current.suppressClick) onOpen?.(project.id, event.currentTarget)
              }}
            >
              <span className="work-ring__card-in">
                <img src={srcFor(project)} alt={`${project.title}项目预览`} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
                <span className="work-ring__num" aria-hidden="true">{project.index}</span>
                <span className="work-ring__label">
                  <b>{project.index} · {project.title}</b>
                  <i>{project.category}</i>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
    <p className="work-ring__caption" aria-live="polite">
      <b className="work-ring__cap-num" ref={capNumRef}>001</b>
      <span className="work-ring__cap-title" ref={capTitleRef}>{projects[0]?.title}</span>
      <span className="work-ring__cap-cat" ref={capCatRef}>{projects[0]?.category}</span>
    </p>
    <div className="work-ring__controls">
      <label htmlFor="work-ring-scrub">◄ DRAG ►</label>
      <input
        id="work-ring-scrub"
        type="range"
        min="-100"
        max="100"
        step="1"
        defaultValue="0"
        aria-label="左右拖动旋转作品环"
      />
    </div>
  </div>
}
