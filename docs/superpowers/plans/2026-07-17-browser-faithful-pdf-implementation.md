# Browser-Faithful Portfolio PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export the current desktop portfolio as an uncropped, non-overlapping, duplicate-free PDF.

**Architecture:** A small capture-layout module groups repeated DOM items by desktop row and normalizes exact source bounds. The Playwright capture script uses those helpers and hashes each screenshot to prevent duplicate pages. The Python assembler places captures on variable-height black pages with independent matte spacing, then verification rasterizes the PDF and audits page hashes.

**Tech Stack:** Node.js, Playwright, Chrome DevTools Protocol, Python, Pillow, ReportLab, pypdf, Poppler.

---

### Task 1: Define row grouping and exact bounds

**Files:**
- Create: `scripts/portfolio_pdf_layout.mjs`
- Create: `tests/portfolio_pdf_layout.test.mjs`

- [ ] Write failing Vitest cases proving that two cards with the same vertical position become one row, later rows remain separate, and normalized capture bounds do not apply source padding.
- [ ] Run `pnpm exec vitest run tests/portfolio_pdf_layout.test.mjs` and verify failure because the layout module does not exist.
- [ ] Implement `groupBoxesByRow()` and `normalizeCaptureBounds()` with a four-pixel row tolerance.
- [ ] Re-run the focused test and verify it passes.

### Task 2: Make capture ranges unique and duplicate-safe

**Files:**
- Modify: `scripts/capture_portfolio_segments.mjs`
- Modify: `scripts/portfolio_pdf_segments.mjs`
- Modify: `tests/portfolio_pdf_segments.test.mjs`

- [ ] Add failing tests requiring repeated selectors to declare row grouping and semantic modules to use zero source padding.
- [ ] Update capture iteration so `all` selectors are grouped by row before screenshotting.
- [ ] Remove source padding from capture bounds and record the requested PDF matte separately.
- [ ] Hash each JPEG before writing it; skip and record exact duplicates without incrementing the page index.
- [ ] Re-run the focused Node tests.

### Task 3: Add independent black PDF matte and validation

**Files:**
- Modify: `scripts/assemble_website_pdf.py`
- Modify: `tests/test_assemble_website_pdf.py`

- [ ] Add failing Python tests for matte-adjusted page height and manifest duplicate metadata.
- [ ] Draw each capture centered between black top and bottom mattes while retaining the full screenshot width and aspect ratio.
- [ ] Reject manifests with failed images or unresolved duplicate pages.
- [ ] Re-run the Python assembler tests.

### Task 4: Generate and visually verify the portfolio PDF

**Files:**
- Replace: `output/pdf/wang-chengcheng-portfolio-2026.pdf`
- Generate temporarily: `tmp/pdfs/website-segments/*`
- Generate temporarily: `tmp/pdfs/rendered/*`

- [ ] Run Vite locally at `127.0.0.1:5173`.
- [ ] Capture every current semantic desktop block at 1920px and confirm zero failed selectors or images.
- [ ] Assemble the stable PDF output.
- [ ] Render all pages with Poppler and create a contact sheet.
- [ ] Audit raster hashes for exact duplicates and inspect the operation, packaging, Sanfu, brand, IP, cover, and contact transitions at full resolution.
- [ ] Run `pnpm test`, Python PDF tests, `pdfinfo`, and `git diff --check` before delivery.

