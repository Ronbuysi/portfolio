import { useEffect, useRef } from 'react'
import { gsap, Flip, motionAllowed } from '../motion/gsapSetup'

export default function Lightbox() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const imgEl = root.querySelector('.lb-img')
    const capEl = root.querySelector('.lb-cap')
    const figureEl = root.querySelector('.lb-figure')
    const backdropEl = root.querySelector('.lb-backdrop')
    const countEl = root.querySelector('.lb-count')
    const titleEl = root.querySelector('.lb-title')
    const labelEl = root.querySelector('.lb-label')
    const closeBtn = root.querySelector('.lb-close')
    const prevBtn = root.querySelector('.lb-prev')
    const nextBtn = root.querySelector('.lb-next')

    let group = []
    let index = 0
    let isOpen = false
    let lastFocus = null
    let wheelLock = 0
    let flipState = null

    const pad = (n) => String(n).padStart(2, '0')

    const revealImg = () => {
      imgEl.classList.add('is-ready')
      if (!flipState) return
      const state = flipState
      flipState = null
      // Flip writes transforms every frame; the CSS entrance transition would smear it
      gsap.set(imgEl, { transition: 'none' })
      Flip.from(state, {
        target: imgEl,
        duration: 0.55,
        ease: 'power3.inOut',
        scale: true,
        onComplete: () => gsap.set(imgEl, { clearProps: 'transition' }),
      })
    }

    const show = (next) => {
      if (!group.length) return
      index = (next + group.length) % group.length
      const item = group[index]
      imgEl.classList.remove('is-ready')
      const onLoad = () => {
        revealImg()
        imgEl.removeEventListener('load', onLoad)
      }
      imgEl.addEventListener('load', onLoad)
      imgEl.src = item.src
      imgEl.alt = item.alt || ''
      if (imgEl.complete && imgEl.naturalWidth > 0) {
        revealImg()
        imgEl.removeEventListener('load', onLoad)
      }
      if (countEl) countEl.textContent = `${pad(index + 1)} / ${pad(group.length)}`
      if (titleEl) titleEl.textContent = item.project
      if (labelEl) labelEl.textContent = item.label
    }

    const finishClose = () => {
      root.classList.remove('is-open')
      gsap.set([figureEl, backdropEl, capEl], { clearProps: 'all' })
      document.documentElement.style.overflow = ''
      if (lastFocus instanceof HTMLElement) lastFocus.focus()
    }

    const close = () => {
      if (!isOpen) return
      isOpen = false
      flipState = null
      if (!motionAllowed()) {
        finishClose()
        return
      }
      gsap.timeline({ onComplete: finishClose })
        .to(figureEl, { autoAlpha: 0, y: 16, scale: 0.975, duration: 0.22, ease: 'power2.in' }, 0)
        .to(backdropEl, { autoAlpha: 0, duration: 0.26, ease: 'power1.in' }, 0)
    }

    const open = () => {
      if (isOpen) return
      isOpen = true
      root.classList.add('is-open')
      document.documentElement.style.overflow = 'hidden'
      lastFocus = document.activeElement
      closeBtn?.focus()
      if (motionAllowed()) {
        gsap.from(capEl, { y: 14, autoAlpha: 0, duration: 0.45, ease: 'power3.out', delay: 0.18 })
      }
    }

    const onClick = (event) => {
      const img = event.target.closest?.('.project img')
      if (!img) return
      const article = img.closest('.project')
      if (!article) return
      const title = article.querySelector('.project__heading h2')?.textContent || ''
      group = Array.from(article.querySelectorAll('img')).map((im) => {
        const figure = im.closest('figure')
        return {
          src: im.currentSrc || im.getAttribute('src') || '',
          alt: im.getAttribute('alt') || '',
          project: title,
          label: figure?.querySelector('figcaption span')?.textContent || '',
        }
      })
      const startIndex = Math.max(0, group.findIndex((item) => item.src === (img.currentSrc || img.getAttribute('src'))))
      if (motionAllowed()) flipState = Flip.getState(img)
      open()
      show(startIndex)
    }

    const onKey = (event) => {
      if (!isOpen) return
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowRight') show(index + 1)
      else if (event.key === 'ArrowLeft') show(index - 1)
    }
    const onWheel = (event) => {
      if (!isOpen) return
      event.preventDefault()
      const now = performance.now()
      if (now - wheelLock < 320) return
      wheelLock = now
      show(index + (event.deltaY > 0 ? 1 : -1))
    }
    const onBackdrop = (event) => {
      if (event.target === root || event.target.classList?.contains('lb-backdrop')) close()
    }
    const onPrev = () => show(index - 1)
    const onNext = () => show(index + 1)
    const onCloseClick = () => close()

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('click', onBackdrop)
    prevBtn?.addEventListener('click', onPrev)
    nextBtn?.addEventListener('click', onNext)
    closeBtn?.addEventListener('click', onCloseClick)

    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      root.removeEventListener('click', onBackdrop)
      prevBtn?.removeEventListener('click', onPrev)
      nextBtn?.removeEventListener('click', onNext)
      closeBtn?.removeEventListener('click', onCloseClick)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return <div className="lightbox" ref={rootRef} role="dialog" aria-modal="true" aria-label="作品查看器">
    <div className="lb-backdrop" />
    <figure className="lb-figure">
      <img className="lb-img" alt="" />
      <figcaption className="lb-cap">
        <span className="lb-count">01 / 01</span>
        <span className="lb-title" />
        <span className="lb-label" />
      </figcaption>
    </figure>
    <button type="button" className="lb-close" aria-label="关闭查看器">×</button>
    <button type="button" className="lb-nav lb-prev" aria-label="上一张">←</button>
    <button type="button" className="lb-nav lb-next" aria-label="下一张">→</button>
  </div>
}
