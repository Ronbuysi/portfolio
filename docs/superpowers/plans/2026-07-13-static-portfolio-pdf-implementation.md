# Static Portfolio PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and visually verify a polished seventeen-page landscape PDF from the current portfolio assets.

**Architecture:** A focused ReportLab export script owns page geometry, typography, image cropping, project sequencing, and PDF metadata. A small unittest module verifies document structure and privacy constraints, while Poppler renders the artifact for visual QA.

**Tech Stack:** Python 3, ReportLab, Pillow, pypdf, pdfplumber, Poppler.

---

### Task 1: Add structural PDF tests

**Files:**
- Create: `tests/test_export_portfolio_pdf.py`

- [ ] **Step 1: Write a failing test for the export contract**

```python
import re
from pypdf import PdfReader
from scripts.export_portfolio_pdf import build_portfolio_pdf

def test_exports_seventeen_landscape_pages_without_phone(tmp_path):
    output = tmp_path / "portfolio.pdf"
    build_portfolio_pdf(output)
    reader = PdfReader(output)
    assert len(reader.pages) == 17
    assert all(float(page.mediabox.width) > float(page.mediabox.height) for page in reader.pages)
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    assert "运营视觉设计" in text
    assert "TOSS DIARY" in text
    assert re.search(r"(?<!\d)1[3-9]\d{9}(?!\d)", text) is None
```

- [ ] **Step 2: Run the test and confirm it fails because the export module does not exist**

Run: `python3 -m unittest tests/test_export_portfolio_pdf.py -v`

Expected: import failure for `scripts.export_portfolio_pdf`.

### Task 2: Implement the PDF renderer

**Files:**
- Create: `scripts/__init__.py`
- Create: `scripts/export_portfolio_pdf.py`
- Modify: `tests/test_export_portfolio_pdf.py`

- [ ] **Step 1: Create the focused page-rendering API**

Implement `build_portfolio_pdf(output_path: Path) -> Path` with helpers for `page_base`, `draw_title`, `draw_image_cover`, `draw_image_contain`, `draw_caption`, and `draw_page_number`.

- [ ] **Step 2: Register typography and colors**

Use Arial Unicode for Chinese text, Helvetica/DIN for Latin headings, `#070707` for the background, `#F2F0EB` for primary text, `#92928C` for secondary text, `#292929` for rules, and `#D8FF36` for accents.

- [ ] **Step 3: Implement the seventeen-page sequence from the approved design spec**

Each page function must use only existing assets under `public/images`, maintain the 16:9 page geometry, and avoid direct placement of long design-board images as full-page artwork.

- [ ] **Step 4: Add CLI output support**

```python
if __name__ == "__main__":
    build_portfolio_pdf(Path("output/pdf/wang-chengcheng-portfolio-2026.pdf"))
```

- [ ] **Step 5: Run the structural test and confirm it passes**

Run: `python3 -m unittest tests/test_export_portfolio_pdf.py -v`

Expected: all export contract checks pass.

### Task 3: Render and visually inspect

**Files:**
- Create: `output/pdf/wang-chengcheng-portfolio-2026.pdf`
- Create temporarily: `tmp/pdfs/wang-chengcheng-portfolio-2026-*.png`

- [ ] **Step 1: Generate the final PDF**

Run: `python3 scripts/export_portfolio_pdf.py`

Expected: a readable seventeen-page PDF in `output/pdf/`.

- [ ] **Step 2: Validate PDF metadata and text**

Run: `pdfinfo output/pdf/wang-chengcheng-portfolio-2026.pdf` and use `pdfplumber` to check page count, page size, project labels, email, and phone-number exclusion.

- [ ] **Step 3: Render every page to PNG**

Run: `pdftoppm -png -r 110 output/pdf/wang-chengcheng-portfolio-2026.pdf tmp/pdfs/wang-chengcheng-portfolio-2026`

- [ ] **Step 4: Inspect contact sheets and selected full-size pages**

Check for clipped Chinese text, inconsistent margins, low-resolution crops, accidental white backgrounds, awkward page transitions, and missing page numbers. Make only targeted layout corrections and repeat the render.

### Task 4: Final verification and commit

**Files:**
- Verify: `scripts/export_portfolio_pdf.py`
- Verify: `tests/test_export_portfolio_pdf.py`
- Verify: `output/pdf/wang-chengcheng-portfolio-2026.pdf`

- [ ] **Step 1: Run the complete project test suite**

Run: `pnpm test && python3 -m unittest tests/test_export_portfolio_pdf.py -v`

- [ ] **Step 2: Run final artifact checks**

Run: `pdfinfo output/pdf/wang-chengcheng-portfolio-2026.pdf`, `git diff --check`, and confirm the rendered PNG inspection has zero visible defects.

- [ ] **Step 3: Commit the exporter and final PDF**

```bash
git add scripts tests output/pdf docs/superpowers/plans/2026-07-13-static-portfolio-pdf-implementation.md
git commit -m "feat: export static portfolio pdf"
```
