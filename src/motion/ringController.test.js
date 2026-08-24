import { expect, test } from 'vitest'
import { INPUT_PRIORITY, canWriteAngle, ringMode, scrollAngle, snapAngle } from './ringController'

test('enforces input priority', () => {
  expect(INPUT_PRIORITY).toEqual({ auto: 0, scroll: 1, settle: 2, drag: 3 })
  expect(canWriteAngle('scroll', 'auto')).toBe(true)
  expect(canWriteAngle('auto', 'drag')).toBe(false)
})

test('maps, snaps and selects ring modes', () => {
  expect(scrollAngle(.5, 7)).toBeCloseTo(-180)
  expect(snapAngle(-70, 7)).toBeCloseTo(-360 / 7)
  expect(ringMode({ desktop: true, tablet: false })).toBe('3d')
  expect(ringMode({ desktop: false, tablet: true })).toBe('track')
  expect(ringMode({ desktop: false, tablet: false })).toBe('snap')
})
