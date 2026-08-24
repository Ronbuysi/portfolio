# TOSS Summer Campaign Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single summer overview board with three independent posters, three campaign applications, and a structured responsive campaign chapter.

**Architecture:** Keep the supplied overview image only as `sourceReference` data. Add `summerCampaign.posters` and `summerCampaign.applications`, render them through focused poster/application grids inside `IpStory`, and style them with the existing IP color tokens and case-study inset.

**Tech Stack:** Built-in Image-2, React 19, CSS Grid, Vitest, Testing Library, Vite 8.

---

### Task 1: Generate six independent campaign assets

**Files:**
- Create: `public/images/toss-diary/summer-poster-picnic.png`
- Create: `public/images/toss-diary/summer-poster-market.png`
- Create: `public/images/toss-diary/summer-poster-beach.png`
- Create: `public/images/toss-diary/summer-pop-up-market.png`
- Create: `public/images/toss-diary/summer-picnic-kit.png`
- Create: `public/images/toss-diary/summer-beach-activation.png`

- [ ] Generate three distinct portrait posters with one built-in Image-2 call per poster, using the overview image as style reference and the original character sheet as identity reference.
- [ ] Generate three distinct landscape applications with one built-in Image-2 call per application.
- [ ] Inspect each image for heart-shaped ears, consistent clay material, theme-specific color, complete composition and no unwanted brands.
- [ ] Copy selected outputs into `public/images/toss-diary/`, verify non-zero dimensions and RGB color space, then commit:

```bash
git add public/images/toss-diary
git commit -m "feat: create TOSS summer campaign system"
```

### Task 2: Model the campaign with TDD

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] Add a test that expects `summerCampaign.sourceReference`, exactly three poster paths and exactly three application paths, while retaining truthful AI source labels.
- [ ] Run `pnpm exec vitest run src/data/content.test.js` and confirm failure because `summerCampaign` does not exist.
- [ ] Replace `userAiExploration` with the campaign object and the six stable asset paths.
- [ ] Run the focused data test and confirm it passes.
- [ ] Commit:

```bash
git add src/data
git commit -m "feat: model TOSS summer campaign"
```

### Task 3: Replace the single-board UI with TDD

**Files:**
- Modify: `src/components/IpStory.test.jsx`
- Modify: `src/components/IpStory.jsx`

- [ ] Add failing assertions for three `.ip-story__summer-poster` figures, three `.ip-story__summer-application` figures, six AI campaign labels, and zero rendered images whose source is `user-ai-summer-festival.png`.
- [ ] Run `pnpm exec vitest run src/components/IpStory.test.jsx` and confirm the new assertions fail.
- [ ] Implement a campaign header, native keyword/palette track, poster grid and application grid; remove the old `.ip-story__user-ai` figure.
- [ ] Keep all new images lazy-loaded with async decoding and accurate alt text.
- [ ] Run the focused component test and confirm it passes.
- [ ] Commit:

```bash
git add src/components/IpStory.jsx src/components/IpStory.test.jsx
git commit -m "feat: rebuild TOSS summer campaign chapter"
```

### Task 4: Build the aligned campaign layout with TDD

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] Add failing style tests for a three-column poster grid, uncropped portrait artwork, a two-column application grid with the first item full width, and mobile single-column collapse.
- [ ] Run `pnpm exec vitest run src/styles.test.js` and confirm failure.
- [ ] Replace the old two-column `.ip-story__summer` styles with the campaign header, palette track, poster and application rules.
- [ ] Run focused style and component tests and confirm they pass.
- [ ] Commit:

```bash
git add src/styles.css src/styles.test.js
git commit -m "style: integrate TOSS summer campaign archive"
```

### Task 5: Verify the complete site

**Files:**
- Verify: all changed source and asset files

- [ ] Run `pnpm test` and require zero failures.
- [ ] Run `pnpm build` and require a successful Vite production build.
- [ ] At desktop width verify three poster columns, three application figures, no broken images and zero occurrences of the original overview image in the rendered DOM.
- [ ] At 390×844 verify single-column poster/application grids and zero horizontal overflow.
- [ ] Verify no browser console errors and preserve the final preview tab.
