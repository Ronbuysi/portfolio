export function groupBoxesByRow(boxes, tolerance = 4) {
  const sorted = [...boxes].sort((a, b) => a.y - b.y || a.index - b.index)
  const rows = []

  for (const box of sorted) {
    const row = rows.find((candidate) => Math.abs(candidate.anchorY - box.y) <= tolerance)
    if (!row) {
      rows.push({
        anchorY: box.y,
        y: box.y,
        bottom: box.y + box.height,
        height: box.height,
        indices: [box.index],
      })
      continue
    }

    row.y = Math.min(row.y, box.y)
    row.bottom = Math.max(row.bottom, box.y + box.height)
    row.height = row.bottom - row.y
    row.indices.push(box.index)
  }

  return rows.map(({ anchorY, bottom, ...row }) => row)
}

export function normalizeCaptureBounds(bounds, pageHeight) {
  const top = Math.max(0, Math.round(bounds.y))
  const bottom = Math.min(pageHeight, Math.round(bounds.y + bounds.height))
  return { top, bottom, height: Math.max(1, bottom - top) }
}

export function tileCaptureBounds(bounds, maxTileHeight = 900) {
  const tiles = []

  for (let offset = 0; offset < bounds.height; offset += maxTileHeight) {
    tiles.push({
      top: bounds.top + offset,
      height: Math.min(maxTileHeight, bounds.height - offset),
      offset,
    })
  }

  return tiles
}
