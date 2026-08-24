# TOSS DIARY IP Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add TOSS DIARY as project 006 with original character evidence, a user-directed AI style exploration, four Image-2 extensions, and a responsive dark editorial case-study chapter.

**Architecture:** Extend the existing project data model with one `story: 'ip'` record and render it through a focused `IpStory` component. Keep source artwork, user AI exploration, and new AI extensions in separate arrays so captions remain truthful. Add isolated `.ip-story` CSS using the shared case inset and existing responsive breakpoint.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, CSS Grid, built-in Image-2 generation.

---

### Task 1: Persist and classify source assets

**Files:**
- Create: `public/images/toss-diary/original-character-system.jpg`
- Create: `public/images/toss-diary/original-expressions.jpg`
- Create: `public/images/toss-diary/original-motion.jpg`
- Create: `public/images/toss-diary/original-stickers.jpg`
- Create: `public/images/toss-diary/original-applications.jpg`
- Create: `public/images/toss-diary/original-posters.jpg`
- Create: `public/images/toss-diary/user-ai-summer-festival.png`

- [ ] Copy the seven supplied files non-destructively to the stable project paths above.
- [ ] Verify every copied image has non-zero dimensions with `sips -g pixelWidth -g pixelHeight public/images/toss-diary/*`.
- [ ] Commit with `git commit -m "assets: archive TOSS DIARY source work"`.

### Task 2: Generate four portfolio extensions

**Files:**
- Create: `public/images/toss-diary/toss-hero-dark.png`
- Create: `public/images/toss-diary/toss-character-lineup.png`
- Create: `public/images/toss-diary/toss-pop-up-space.png`
- Create: `public/images/toss-diary/toss-merch-digital.png`

- [ ] Generate each 2048×1152 asset with built-in Image-2 using the relevant original board and the user summer image as references.
- [ ] Inspect each output for the heart-shaped ears, wide rabbit face, warm clay material, palette fidelity, clean 16:9 composition, and absence of unwanted brand text.
- [ ] Copy selected outputs from the generated-image location into `public/images/toss-diary/`.
- [ ] Verify all four files are RGB/sRGB 16:9 images and commit with `git commit -m "feat: create TOSS DIARY IP extensions"`.

### Task 3: Add the project data model with TDD

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] Add a failing test that expects six projects, `toss-diary` at index `006`, six original boards, one `userAiExploration`, and four AI extensions.
- [ ] Run `pnpm exec vitest run src/data/content.test.js` and confirm the new assertions fail.
- [ ] Add the `story: 'ip'` project object with exact stable asset paths and truthful source labels.
- [ ] Run the focused test and confirm it passes.
- [ ] Commit with `git commit -m "feat: model TOSS DIARY IP project"`.

### Task 4: Build the IP case-study component with TDD

**Files:**
- Create: `src/components/IpStory.jsx`
- Create: `src/components/IpStory.test.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`

- [ ] Write tests expecting six source images, one user AI exploration, four `.ip-story__extension` sections, source labels, lazy loading, async decoding, `.project--ip`, and six selected projects.
- [ ] Run the four focused component tests and confirm they fail because `IpStory` is not implemented.
- [ ] Implement `IpStory` with Character Source, Expression & Motion, Original Applications, Summer Style Exploration, AI Extensions, and the dark closing scene.
- [ ] Import and dispatch `IpStory` for `story === 'ip'`, add `.project--ip`, and update the section range to `001—006`.
- [ ] Run focused tests and confirm they pass.
- [ ] Commit with `git commit -m "feat: add TOSS DIARY case-study chapter"`.

### Task 5: Style the chapter with TDD

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] Add failing style tests for the shared `--case-inset`, two-column source grid, three-column application grid, 16:9 extension grid, `contain` for source boards, and mobile single-column collapse.
- [ ] Run `pnpm exec vitest run src/styles.test.js` and confirm the assertions fail.
- [ ] Add the dark archive CSS with red/cream/deep-brown accents, restrained glass captions, fixed grid gaps, and the existing 720px breakpoint.
- [ ] Run the focused style and component suites and confirm they pass.
- [ ] Commit with `git commit -m "style: integrate TOSS DIARY IP archive"`.

### Task 6: Verify the finished site

**Files:**
- Verify: all changed source and asset files

- [ ] Run `pnpm test` and require zero failures.
- [ ] Run `pnpm build` and require a successful Vite production build.
- [ ] Inspect the live site at desktop size: six projects, complete source images, two/three-column grids, four AI extensions, no image failures, no console errors.
- [ ] Inspect at 390×844: single-column chapter, zero horizontal overflow, no broken images.
- [ ] Confirm no phone-number pattern appears in visible page text.
- [ ] Run `git diff --check` and confirm the worktree is clean after the final commit.

### Scope Addition: Expression, Seasonal and Motion Systems

The user expanded the scope after the initial four generated assets. The implementation adds `toss-expression-system.png`, `toss-sticker-chat.png`, `toss-seasonal-world.png`, and `toss-motion-storyboard.png`, models them as `expressionExtensions` and `campaignExtensions`, renders two dedicated two-column modules, and extends desktop/mobile tests accordingly.
