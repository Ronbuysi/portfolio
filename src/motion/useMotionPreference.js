import { useEffect, useState } from 'react'

const STORAGE_KEY = 'motion-preference'

function readForced() {
  if (typeof window === 'undefined') return false
  let forced = null
  try {
    const param = new URLSearchParams(window.location.search).get('motion')
    if (param === 'force' || param === 'auto') {
      forced = param === 'force'
      window.localStorage.setItem(STORAGE_KEY, forced ? 'force' : 'auto')
    }
  } catch {
    forced = null
  }
  if (forced === null) {
    try {
      forced = window.localStorage.getItem(STORAGE_KEY) === 'force'
    } catch {
      forced = false
    }
  }
  return forced
}

export default function useMotionPreference() {
  const [forced, setForced] = useState(readForced)
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false,
  )

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return undefined
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return { forced, reduced, motionAllowed: forced || !reduced }
}
