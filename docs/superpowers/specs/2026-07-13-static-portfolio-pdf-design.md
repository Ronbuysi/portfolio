# Static Portfolio PDF Design

## Goal

Export the current portfolio website as a polished, standalone landscape PDF for desktop viewing and portfolio submissions. The PDF should feel designed for pages rather than printed from a long webpage.

## Format

- 16:9 landscape pages at 960 × 540 pt.
- Seventeen pages with a fixed dark editorial system.
- Maximum one dominant image per page, with supporting images used only where they clarify a system or sequence.
- Dark charcoal background, warm white typography, acid green index accents, thin grey rules, and restrained blue glass glows.
- No phone number. Email is included only on the final page.

## Page Sequence

1. Cover - name, roles, and visual designer statement.
2. Profile and contents - portrait, short introduction, capabilities, and seven-project index.
3-4. Farmers' Market operation design - campaign identity, poster trio, market and digital extensions.
5-6. Lan Mu Xiang packaging - dark hero, seasonal system, structure and material extensions.
7-8. Sanfu lifestyle campaign - strategic three-match structure and spatial/digital activation.
9. Horsh growth posters - childhood/adulthood diptych and timeline presentation.
10-11. Suan Ye information design - information hierarchy, exhibition and editorial/digital extensions.
12-13. MY MAY brand design - brand world, identity rules, retail and digital touchpoints.
14-16. TOSS DIARY IP - character foundation, expressions/merch, summer campaign and spatial applications.
17. Capabilities and contact - four strengths, toolkit, email, and portfolio closing line.

## Image Treatment

- Existing 16:9 extensions are placed edge-to-edge inside image panels using proportional crop.
- Portrait and poster artwork use contained frames to preserve original composition.
- Original long design boards are not placed as full pages.
- Every image receives a small project label and source line where space permits.

## Technical Approach

- Generate the PDF with ReportLab from the existing `public/images` assets.
- Use system Arial Unicode for Chinese text and Helvetica/DIN for Latin display typography.
- Keep all page geometry and content in a dedicated export script so the website remains unchanged.
- Validate page count, landscape ratio, private-phone exclusion, and required project labels with automated tests.
- Render the final PDF with Poppler and visually inspect page images and a contact sheet before delivery.

## Output

- Final file: `output/pdf/wang-chengcheng-portfolio-2026.pdf`
- Intermediate renders: `tmp/pdfs/wang-chengcheng-portfolio-2026-*.png`
