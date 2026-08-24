import { useEffect, useRef } from 'react'
import { scrollTargets } from '../motion/scrollTargets'

const clamp01 = (v) => Math.max(0, Math.min(1, v))

export default function ScrollFillText({
  text = '',
  as = 'p',
  className = '',
  accent = '',
}) {
  const ref = useRef(null)
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const chars = Array.from(el.querySelectorAll('.sft-ch'))
    if (!chars.length) return undefined

    const applyAll = () => chars.forEach((ch) => ch.classList.add('is-lit'))

    const forced = document.documentElement.classList.contains('motion-forced')
    const reduced = !forced && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      applyAll()
      return undefined
    }

    let frame = 0
    let lastLit = -1

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const startLine = vh * 0.9
      const travel = Math.max(vh * 0.52, rect.height)
      const progress = clamp01((startLine - rect.top) / travel)
      const litCount = Math.round(progress * chars.length)
      if (litCount === lastLit) return
      lastLit = litCount
      chars.forEach((ch, i) => ch.classList.toggle('is-lit', i < litCount))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onVisible = ([entry]) => {
      if (entry.isIntersecting) {
        update()
        scrollTargets(el).forEach((t) => t.addEventListener('scroll', schedule, { passive: true }))
        window.addEventListener('resize', schedule)
      } else {
        scrollTargets(el).forEach((t) => t.removeEventListener('scroll', schedule))
        window.removeEventListener('resize', schedule)
      }
    }

    const observer = new IntersectionObserver(onVisible, { threshold: 0 })
    observer.observe(el)

    return () => {
      observer.disconnect()
      scrollTargets(el).forEach((t) => t.removeEventListener('scroll', schedule))
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [text])

  const label = text.replace(/\n+/g, ' ')
  const lines = text.split('\n')

  return <Tag ref={ref} className={`sft ${className}`} aria-label={label}>
    {lines.map((line, lineIndex) => (
      <span key={lineIndex} className="sft-line">
        {line.split('').map((char, charIndex) => (
          <span
            key={charIndex}
            className={`sft-ch${accent.includes(char) && char.trim() ? ' sft-ch--accent' : ''}`}
            aria-hidden="true"
          >{char}</span>
        ))}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    ))}
  </Tag>
}
