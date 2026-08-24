const RULES = [
  [/cover|hero|exterior-hero|hero-dark|dusk-first-batch/i, 'cover'],
  [/poster-\d|poster\.|posters\/|original-|originals\//i, 'original'],
  [/blueprint|diagram|visual-language|structure|route|wayfinding|city-/i, 'diagram'],
  [/\.(png)$/i, 'extension'],
]

export function profileFor(src = '') {
  const path = src.split('/').pop() || ''
  for (const [pattern, kind] of RULES) {
    if (pattern.test(path)) return kind
  }
  return 'board'
}
