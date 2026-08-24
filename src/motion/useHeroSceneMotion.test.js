import { expect, test } from 'vitest'
import { depthOffset, heroMotionMode, normalizedPointer } from './useHeroSceneMotion'

test('selects static, touch and desktop modes', () => {
  expect(heroMotionMode({ reduced: true, finePointer: true })).toBe('static')
  expect(heroMotionMode({ reduced: false, finePointer: false })).toBe('touch')
  expect(heroMotionMode({ reduced: false, finePointer: true })).toBe('desktop')
})

test('normalizes the pointer and maps depth to bounded offsets', () => {
  expect(normalizedPointer(0, 1000)).toBe(-1)
  expect(normalizedPointer(500, 1000)).toBe(0)
  expect(normalizedPointer(1000, 1000)).toBe(1)
  expect(depthOffset('far', 1)).toBe(8)
  expect(depthOffset('mid', 1)).toBe(14)
  expect(depthOffset('front', 1)).toBe(22)
})
