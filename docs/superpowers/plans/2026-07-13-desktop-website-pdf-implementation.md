# Desktop Website PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the recomposed PDF with an uncropped PDF that preserves the current desktop website structure exactly.

**Architecture:** A Playwright export script opens the local Vite site in system Chrome at 1920px, waits for every image, and captures a declared list of complete semantic DOM segments. A Python assembler places each segment screenshot on a proportional variable-height PDF page without cropping or reflowing the image.

**Tech Stack:** Node.js, Playwright, system Chrome, Pillow, ReportLab, pypdf, Poppler.

---

### Task 1: Define and test complete semantic segments

**Files:**
- Create: `scripts/portfolio_pdf_segments.mjs`
- Create: `tests/portfolio_pdf_segments.test.mjs`

- [ ] Write a failing Node test that imports `SEGMENTS` and requires Hero, About, every project header, operation grammar, operation extensions, packaging story modules, Sanfu strategy/grammar/evidence/activation, Horsh language/timeline/stage, information modules, brand modules, IP modules, strengths, and contact.
- [ ] Run `node --test tests/portfolio_pdf_segments.test.mjs` and confirm it fails because the segment module does not exist.
- [ ] Implement `SEGMENTS` as explicit selector descriptors and make the test pass.

### Task 2: Capture the desktop website without re-layout

**Files:**
- Create: `scripts/capture_portfolio_segments.mjs`
- Create: `tmp/pdfs/website-segments/manifest.json`
- Create temporarily: `tmp/pdfs/website-segments/*.jpg`

- [ ] Launch `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` through Playwright with a 1920 × 1080 viewport.
- [ ] Navigate to `http://127.0.0.1:5173/?pdf=desktop`, scroll through the page to load lazy images, and verify every image has completed.
- [ ] For each selector descriptor, calculate a complete bounding rectangle, add only black page padding, and capture the full 1920px-wide website strip without changing DOM styles.
- [ ] Write `manifest.json` with selector, label, source bounds, screenshot dimensions, and failure count; fail the command if any required selector is missing.

### Task 3: Assemble and verify the corrected PDF

**Files:**
- Create: `scripts/assemble_website_pdf.py`
- Replace: `output/pdf/wang-chengcheng-portfolio-2026.pdf`
- Modify: `tests/test_export_portfolio_pdf.py`

- [ ] Update the PDF test to require at least 40 pages, consistent 960pt widths, proportional variable heights, file size below 80 MB, and no private phone number in the captured source audit.
- [ ] Run the Python test and confirm it fails against the old seventeen-page PDF.
- [ ] Assemble each segment JPEG as a full uncropped PDF page using its native aspect ratio and add title/author metadata.
- [ ] Run `pdftoppm` for every page, inspect contact sheets plus the user-referenced operation grammar and extension pages at full size, and repeat until no visible crop or split remains.
- [ ] Run the Node selector test, Python PDF test, existing `pnpm test`, `pdfinfo`, and `git diff --check`, then commit the corrected exporter and PDF.
