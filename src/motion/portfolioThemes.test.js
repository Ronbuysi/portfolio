import { expect, test } from 'vitest'
import { CHAPTER_ORDER, portfolioThemes, themeProgress } from './portfolioThemes'

test('defines approved themes in page order', () => {
  expect(CHAPTER_ORDER).toEqual(['about', 'work', 'strengths', 'contact'])
  expect(Object.keys(portfolioThemes)).toEqual(CHAPTER_ORDER)
  expect(CHAPTER_ORDER.map((key) => portfolioThemes[key].background)).toEqual(['#071426', '#061A35', '#4B101C', '#D8FF36'])
})

test('clamps theme progress', () => {
  expect(themeProgress(-1)).toBe(0)
  expect(themeProgress(.4)).toBe(.4)
  expect(themeProgress(2)).toBe(1)
})
