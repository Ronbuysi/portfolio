# Complete Static Portfolio PDF Design

## Correction Being Made

The first PDF was a seventeen-page curated edit. It omitted many website sections and used cover cropping for several project images. The replacement must represent the current website as a complete static portfolio rather than a shortened selection.

## Format

- Capture the live desktop website at a 1920px viewport with its existing 1700px content shell.
- Preserve the current desktop structure, typography, glass cards, BorderGlow frames, image proportions, captions, and spacing exactly as rendered in the browser.
- Export one PDF page per complete semantic website block. Page heights may vary so no image, card grid, or story module is cut by a page boundary.
- Scale each captured block uniformly to a 960pt PDF width; never crop or recompose project images inside the exporter.
- Cover photography remains the website's live Hero composition.

## Required Content

- Cover, profile, project index, strengths, toolkit, and contact.
- Every project image referenced by the current website project data.
- Code-native explanation sections represented as designed PDF pages, including:
  - operation campaign grammar and four visual principles;
  - packaging narrative, four-season system, applications, structures, dielines, and material studies;
  - Sanfu strategy phases, campaign grammar, original evidence, process labs, activations, gifting, and digital extensions;
  - Horsh diptych logic and timeline;
  - Suan Ye information hierarchy and visual grammar;
  - MY MAY brand concept, original boards, VI rules, and touchpoints;
  - TOSS DIARY character foundation, original evidence, expression system, seasonal campaign, spatial and digital extensions.

## Page Pattern

The exporter captures the Hero, About, selected-work heading, each project header, and every direct story module using its actual browser bounding box. Repeated extension grids are captured at their complete container or item boundary. The PDF does not redraw website content with ReportLab; ReportLab only places the captured browser blocks onto proportional PDF pages.

## Verification

- Automated selector test requires every major website module, including the user's referenced operation grammar and extension sections.
- Runtime export must capture at least 40 semantic pages and report zero failed selectors.
- Source audit must confirm all 75 website project images exist and no private phone number is present in the rendered page text.
- PDF page widths must be consistent while page heights remain proportional to the captured website blocks.
- Poppler renders all pages for contact-sheet and selected full-page review.

## Output

The corrected file replaces `output/pdf/wang-chengcheng-portfolio-2026.pdf` so the user has one stable deliverable path.
