# Browser-Faithful Portfolio PDF Design

## Goal

Export the current 1920px desktop portfolio exactly as it appears in the browser while preventing artwork crops, overlapping page ranges, and repeated pages.

## Root Causes Being Corrected

- The previous capture expanded every DOM block with source padding. Adjacent captures therefore contained the same pixels around their shared boundary, producing visible split lines and repeated artwork fragments.
- Selectors marked `all` captured every grid item as a full-width strip. Two cards on the same desktop row shared the same vertical bounds, so the exporter created byte-identical PDF pages.

## Capture Model

- Render the live Vite site in Chrome at a fixed 1920 × 1080 desktop viewport.
- Keep the existing browser layout and image rendering unchanged.
- Capture complete semantic modules from their exact vertical bounds. Source captures never expand into neighboring content.
- For repeated grid items, group elements that share a desktop row and capture that row once using the union of its vertical bounds.
- Keep large semantic modules intact, even when the resulting PDF page is taller than a standard screen. This is preferable to cutting artwork.

## Page Separation

- The PDF assembler adds a small black matte above and below each captured module.
- The matte creates a clean visual pause without copying pixels from adjacent website content.
- Hero, profile, and full-screen ending pages may opt out of the matte when their captured composition already fills the page.

## Duplicate Protection

- Every rendered capture receives a SHA-256 fingerprint.
- A capture whose image bytes match an earlier capture is skipped and recorded in the manifest.
- The final verification also compares rasterized PDF pages and fails if any exact duplicate remains.

## Output and Verification

- Stable output: `output/pdf/wang-chengcheng-portfolio-2026.pdf`.
- All images must load before capture, with no private phone number in page text.
- Every captured source range must be unique and non-overlapping with another capture created from the same semantic row.
- The PDF is rendered with Poppler. A contact sheet and selected full-resolution pages are inspected for clean black breaks, complete artwork, readable text, and no duplicated page.

