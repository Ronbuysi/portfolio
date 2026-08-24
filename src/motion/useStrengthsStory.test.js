import { expect, test } from 'vitest'
import { strengthIndex, strengthsMode } from './useStrengthsStory'

test('keeps Strengths in normal flow and maps active indices', () => {
  expect(strengthsMode({ desktop: true, reduced: false })).toBe('flow')
  expect(strengthsMode({ desktop: false, reduced: false })).toBe('flow')
  expect(strengthsMode({ desktop: true, reduced: true })).toBe('static')
  expect([0, .34, .68, 1].map(strengthIndex)).toEqual([0, 1, 2, 3])
})
