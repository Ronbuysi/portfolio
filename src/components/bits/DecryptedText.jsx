import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#@$%&'

export default function DecryptedText({ text = '', className = '', delay = 0, step = 26 }) {
  const ref = useRef(null)
  const [output, setOutput] = useState(() => text.replace(/\S/g, ' '))

  useEffect(() => {
    const forced = document.documentElement.classList.contains('motion-forced')
    if (!forced && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setOutput(text)
      return undefined
    }

    let frame = 0
    let elapsed = 0
    let startAt = 0

    const tick = (now) => {
      if (!startAt) startAt = now + delay
      if (now < startAt) {
        frame = requestAnimationFrame(tick)
        return
      }
      elapsed += step
      const revealed = Math.min(text.length, Math.floor(elapsed / step))
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ') { out += ' '; continue }
        out += i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setOutput(out)
      if (revealed < text.length) frame = requestAnimationFrame(tick)
      else setOutput(text)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, delay, step])

  return <span ref={ref} className={className}>{output}</span>
}
