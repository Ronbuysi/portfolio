import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { nestaMotionMode } from './useNestaMotion'

const source = readFileSync('src/components/nesta/useNestaMotion.js', 'utf8')

describe('nestaMotionMode', () => {
  test('uses static mode for reduced motion', () => {
    expect(nestaMotionMode({ desktop: true, reduceMotion: true })).toBe('static')
  })

  test('uses flow mode below the desktop breakpoint', () => {
    expect(nestaMotionMode({ desktop: false, reduceMotion: false })).toBe('flow')
  })

  test('uses editorial motion on desktop', () => {
    expect(nestaMotionMode({ desktop: true, reduceMotion: false })).toBe('editorial')
  })

  test('delegates media entrances to the global asset-motion grammar', () => {
    // case 007 must use the same figure reveal (am clip-wipe) and hover
    // treatment as every other case study — no bespoke batch, no pointer tilt
    expect(source).not.toContain("ScrollTrigger.batch(q('.nesta-applications .nesta-media')")
    expect(source).not.toContain('quickTo')
    expect(source).not.toMatch(/gsap\.from\(section\.querySelectorAll\('\.nesta-media'\)/)
  })

  test('never scales or clips the NESTA cover artwork', () => {
    expect(source).not.toContain("clipPath: 'inset(0 14%)'")
    expect(source).not.toContain('scale: 1.04')
  })
})
