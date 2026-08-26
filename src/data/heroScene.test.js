import { expect, test } from 'vitest'
import { heroBackground, heroPreloadSources, heroProps } from './heroScene'

test('defines one background and five unique furniture layers', () => {
  expect(heroBackground.src).toBe('/images/hero/nesta-illustration-bg.jpg')
  expect(heroProps).toHaveLength(5)
  expect(new Set(heroProps.map(({ id }) => id)).size).toBe(5)
  // 预加载只保留预加载器展示的弹簧桌；背景由 index.html 的 link preload 按 DPR 预载
  expect(heroPreloadSources).toEqual([heroProps[0].desktop])
  expect(heroProps.map(({ depth }) => depth)).toEqual(['front', 'far', 'mid', 'front', 'mid'])
})

test('hero props serve w960 (rendered ≤420px; w1800 wasted bandwidth)', () => {
  heroProps.forEach(({ desktop }) => {
    expect(desktop).toMatch(/-w960\.webp$/)
  })
})
