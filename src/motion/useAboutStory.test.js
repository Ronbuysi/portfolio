import { expect, test } from 'vitest'
import { aboutMode, aboutNodeProgress } from './useAboutStory'

test('uses normal flow on every motion-enabled viewport', () => {
  expect(aboutMode({ desktop: true, reduced: false })).toBe('flow')
  expect(aboutMode({ desktop: false, reduced: false })).toBe('flow')
  expect(aboutMode({ desktop: true, reduced: true })).toBe('static')
})

test('clamps timeline progress', () => {
  expect(aboutNodeProgress(-1)).toBe(0)
  expect(aboutNodeProgress(.6)).toBe(.6)
  expect(aboutNodeProgress(2)).toBe(1)
})
