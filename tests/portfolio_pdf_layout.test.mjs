import { describe, expect, it } from 'vitest'

import { groupBoxesByRow, normalizeCaptureBounds, tileCaptureBounds } from '../scripts/portfolio_pdf_layout.mjs'

describe('desktop PDF row grouping', () => {
  it('captures two cards on the same desktop row only once', () => {
    const rows = groupBoxesByRow([
      { index: 0, y: 100, height: 220 },
      { index: 1, y: 101.5, height: 198 },
      { index: 2, y: 410, height: 160 },
    ])

    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ y: 100, height: 220, indices: [0, 1] })
    expect(rows[1]).toMatchObject({ y: 410, height: 160, indices: [2] })
  })

  it('keeps nearby but distinct rows separate outside the tolerance', () => {
    const rows = groupBoxesByRow([
      { index: 0, y: 100, height: 100 },
      { index: 1, y: 105, height: 100 },
    ], 4)

    expect(rows).toHaveLength(2)
  })
})

describe('desktop PDF source bounds', () => {
  it('uses exact element bounds without copying neighboring page pixels', () => {
    expect(normalizeCaptureBounds({ y: 100.4, height: 300.2 }, 1000)).toEqual({
      top: 100,
      bottom: 401,
      height: 301,
    })
  })

  it('clips exact bounds to the browser document', () => {
    expect(normalizeCaptureBounds({ y: -20, height: 1100 }, 1000)).toEqual({
      top: 0,
      bottom: 1000,
      height: 1000,
    })
  })

  it('rounds a shared fractional boundary to one non-overlapping pixel', () => {
    const before = normalizeCaptureBounds({ y: 100.4, height: 200.2 }, 1000)
    const after = normalizeCaptureBounds({ y: 300.6, height: 100 }, 1000)

    expect(before.bottom).toBe(301)
    expect(after.top).toBe(301)
  })
})

describe('desktop PDF tiled painting', () => {
  it('covers a tall semantic block exactly without gaps or overlap', () => {
    expect(tileCaptureBounds({ top: 100, height: 2000 }, 900)).toEqual([
      { top: 100, height: 900, offset: 0 },
      { top: 1000, height: 900, offset: 900 },
      { top: 1900, height: 200, offset: 1800 },
    ])
  })

  it('keeps short blocks as a single painted tile', () => {
    expect(tileCaptureBounds({ top: 50, height: 600 }, 900)).toEqual([
      { top: 50, height: 600, offset: 0 },
    ])
  })
})
