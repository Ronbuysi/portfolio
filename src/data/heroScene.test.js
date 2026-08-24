import { expect, test } from 'vitest'
import { heroBackground, heroPreloadSources, heroProps } from './heroScene'

test('defines one background and five unique furniture layers', () => {
  expect(heroBackground.src).toBe('/images/hero/nesta-illustration-bg.jpg')
  expect(heroProps).toHaveLength(5)
  expect(new Set(heroProps.map(({ id }) => id)).size).toBe(5)
  expect(new Set(heroPreloadSources).size).toBe(6)
  expect(heroProps.map(({ depth }) => depth)).toEqual(['front', 'far', 'mid', 'front', 'mid'])
})
