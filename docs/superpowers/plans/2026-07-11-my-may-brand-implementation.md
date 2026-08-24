# MY MAY Brand Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MY MAY as project `005`, preserve four original brand boards, and create three image-2-assisted brand extensions for space, takeaway and city touchpoints.

**Architecture:** Add a `story: 'brand'` project record and a focused `BrandStory` component selected by `SelectedWork`. Keep original boards as evidence, keep generated images decorative and explicitly labeled, and share the existing case-study inset and responsive system.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, CSS Grid, built-in image generation.

---

## File Structure

- Create `public/images/my-may-brand/original-positioning.jpg`: optimized original positioning board.
- Create `public/images/my-may-brand/original-identity.jpg`: optimized original identity board.
- Create `public/images/my-may-brand/original-applications.jpg`: optimized original application board.
- Create `public/images/my-may-brand/original-experience.jpg`: optimized original experience board.
- Create `public/images/my-may-brand/my-may-street-corner.png`: AI-assisted spatial extension.
- Create `public/images/my-may-brand/my-may-takeaway-system.png`: AI-assisted takeaway ecosystem.
- Create `public/images/my-may-brand/my-may-city-touchpoints.png`: AI-assisted city touchpoints.
- Modify `src/data/projects.js`: add project `005`.
- Modify `src/data/content.test.js`: test brand data and no invented metrics.
- Create `src/components/BrandStory.jsx`: render the MY MAY brand chapter.
- Create `src/components/BrandStory.test.jsx`: test source labels, modules and image loading.
- Modify `src/components/SelectedWork.jsx`: dispatch `story: 'brand'` and update range.
- Modify `src/components/SelectedWork.test.jsx`: verify five projects and brand dispatch.
- Modify `src/styles.css`: add aligned brand chapter layouts.
- Modify `src/styles.test.js`: lock alignment, no-crop and responsive behavior.

## Task 1: Curate the four original boards

- [ ] Copy the four supplied JPEGs to their stable names in `public/images/my-may-brand/`.
- [ ] Convert each CMYK file to sRGB with `/System/Library/ColorSync/Profiles/sRGB Profile.icc` using `sips --matchTo`.
- [ ] Keep the original 1240×1754 portrait ratio and verify every output is RGB/sRGB, decodable and non-zero.
- [ ] Commit with `feat: curate MY MAY brand boards`.

## Task 2: Generate three brand extensions

- [ ] Generate `my-may-street-corner.png` as a 2048×1152 front-facing night street-corner store, using the four boards only as style references. Keep orange/cream/black, cat-ear geometry and warm handcrafted material; no readable text, new logo, people, watermark or cyberpunk lighting.
- [ ] Generate `my-may-takeaway-system.png` as a 2048×1152 editorial tabletop set of pizza box, paper bag, cup, sleeve, seals and napkins. Preserve the cat/pizza visual language without redrawing the exact logo; no readable copy or watermark.
- [ ] Generate `my-may-city-touchpoints.png` as a 2048×1152 urban touchpoint scene with lightbox, bench, delivery box and street sign. Keep the scene restrained and people-free with no readable text or watermark.
- [ ] Inspect each asset for brand consistency, clean composition and absence of unwanted text, then copy selected outputs into `public/images/my-may-brand/`.
- [ ] Commit with `feat: extend MY MAY brand world`.

## Task 3: Add the brand project data with TDD

- [ ] Add failing tests to `src/data/content.test.js` requiring five projects and `my-may-pizza` with `index: '005'`, `category: 'Brand Design'`, `story: 'brand'`, four originals, three extensions, three colors and no `year/results/metrics`.
- [ ] Run `pnpm test -- src/data/content.test.js` and verify RED.
- [ ] Add the exact data record with title `MY MAY 品牌设计`, English title `MY MAY Pizza Brand World`, brand positioning copy, original paths, extension paths, keywords and colors from the spec.
- [ ] Run the focused test and verify GREEN.
- [ ] Commit with `feat: model MY MAY brand case study`.

## Task 4: Build and dispatch BrandStory with TDD

- [ ] Create failing `BrandStory.test.jsx` assertions for four original images, three AI labels, `loading="lazy"`, `decoding="async"`, brand DNA, and closing statement.
- [ ] Update `SelectedWork.test.jsx` to require five project articles, one `.project--brand`, and `CURATED PROJECTS / 001—005`; verify RED.
- [ ] Implement `BrandStory.jsx` with original-evidence grid, DNA cards, three AI extension figures and outro.
- [ ] Update `SelectedWork.jsx` to import and dispatch `BrandStory` when `story === 'brand'`, add `project--brand`, and update the curated range.
- [ ] Run focused tests and verify GREEN.
- [ ] Commit with `feat: add MY MAY brand story`.

## Task 5: Add aligned brand styling with TDD

- [ ] Add failing CSS assertions for `--brand-inset: var(--case-inset)`, two-column original grid, `object-fit: contain`, three-column DNA cards, 16:9 AI scenes, direct section width/margin alignment, mobile single columns, and reduced-motion behavior.
- [ ] Run `pnpm test -- src/styles.test.js` and verify RED.
- [ ] Implement `.brand-story` styles using orange `#E1540F`, cream `#FEFBEB`, black `#0A090A`, outlines instead of layout-changing borders, and existing project spacing.
- [ ] Keep desktop original boards in two columns, DNA in three columns and AI scenes full-width 16:9; switch all grids to one column at 720px without changing AI scene aspect ratio.
- [ ] Run focused and full tests, then `pnpm build`; verify GREEN and successful build.
- [ ] Commit with `style: integrate MY MAY brand chapter`.

## Task 6: Final verification

- [ ] Run all tests and production build with the bundled workspace Node/pnpm runtime.
- [ ] Verify the browser renders five projects, four original boards, three AI extension scenes, no phone number and no console errors.
- [ ] Verify desktop alignment and mobile single-column layout at 390×844 with every AI scene remaining 16:9.
- [ ] Run `git diff --check` and confirm a clean worktree.
