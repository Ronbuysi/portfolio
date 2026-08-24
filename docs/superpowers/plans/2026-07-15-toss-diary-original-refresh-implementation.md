# TOSS DIARY Original Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the TOSS DIARY original-evidence gallery with eight newly supplied boards and add five non-repetitive Image-2 service extensions while preserving the existing IP story.

**Architecture:** Keep `projects.js` as the content model and `IpStory.jsx` as the dedicated renderer. Add a focused `serviceExtensions` collection and a matching service section between original evidence and the existing summer campaign. All project images continue through `ResponsiveImage` with paired WebP assets.

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS Grid, built-in Image-2/imagegen, Pillow WebP conversion.

**Runtime:** Set `NODE_RUNTIME=/Users/luoen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin` before the commands below.

---

### Task 1: Add the new original evidence assets

**Files:**
- Create: `public/images/toss-diary/originals-2026/character-dna.jpg`
- Create: `public/images/toss-diary/originals-2026/expression-wordmark.jpg`
- Create: `public/images/toss-diary/originals-2026/origin-motion.jpg`
- Create: `public/images/toss-diary/originals-2026/color-sticker-language.jpg`
- Create: `public/images/toss-diary/originals-2026/packaging-blueprint.jpg`
- Create: `public/images/toss-diary/originals-2026/packaging-family.jpg`
- Create: `public/images/toss-diary/originals-2026/poster-system.jpg`
- Create: `public/images/toss-diary/originals-2026/storefront-application.jpg`
- Test: `src/data/content.test.js`

- [ ] **Step 1: Write the failing content test**

Add an assertion that the TOSS DIARY project contains exactly these eight semantic paths and no old `original-*.jpg` path:

```js
expect(ip.originals.map((item) => item.src)).toEqual([
  '/images/toss-diary/originals-2026/character-dna.jpg',
  '/images/toss-diary/originals-2026/expression-wordmark.jpg',
  '/images/toss-diary/originals-2026/origin-motion.jpg',
  '/images/toss-diary/originals-2026/color-sticker-language.jpg',
  '/images/toss-diary/originals-2026/packaging-blueprint.jpg',
  '/images/toss-diary/originals-2026/packaging-family.jpg',
  '/images/toss-diary/originals-2026/poster-system.jpg',
  '/images/toss-diary/originals-2026/storefront-application.jpg',
])
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/data/content.test.js`

Expected: FAIL because `projects.js` still references the six old original boards.

- [ ] **Step 3: Copy the eight selected source boards with semantic filenames**

Use these exact mappings without modifying the files in `/Users/luoen/Desktop/ip设计1/`:

```text
b9f6c89ee03934da69c40c43f541397a.jpg -> character-dna.jpg
0d27d4ee4cb03cf79bf5810534dd26d5.jpg -> expression-wordmark.jpg
90ce5c97402cb388c1f049c04edb7231.jpg -> origin-motion.jpg
baa36fbc37ece60abd88d09858f96c87.jpg -> color-sticker-language.jpg
a9d0cdf157b25d505646fbfa91884ee1.jpg -> packaging-blueprint.jpg
43a9aa1dd7cf9e0e84eac0399a559191.jpg -> packaging-family.jpg
410a203906e575d0a63c30ca409b8892.jpg -> poster-system.jpg
0e303f9dd355ec91170945c442e30c03.jpg -> storefront-application.jpg
```

- [ ] **Step 4: Update the `originals` data**

Use labels `CHARACTER DNA / 01` through `STOREFRONT APPLICATION / 08`, semantic alt text, and the new paths. Keep `traits`, `palette`, `summerCampaign`, and all existing extension arrays unchanged.

- [ ] **Step 5: Generate responsive WebP pairs**

For every new JPG, create quality-80 `-w960.webp` and `-w1800.webp` siblings. Do not upscale beyond the 1240px source width for the desktop file.

- [ ] **Step 6: Run the data and responsive-asset tests**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/data/content.test.js src/data/responsive-assets.test.js`

Expected: PASS with all eight new originals and both WebP variants present.

- [ ] **Step 7: Commit**

```bash
git add public/images/toss-diary/originals-2026 src/data/projects.js src/data/content.test.js
git commit -m "feat: refresh toss diary original evidence"
```

### Task 2: Generate five non-repetitive Image-2 service extensions

**Files:**
- Create: `public/images/toss-diary/service/toss-dusk-first-batch.png`
- Create: `public/images/toss-diary/service/toss-member-diary-kit.png`
- Create: `public/images/toss-diary/service/toss-service-handoff.png`
- Create: `public/images/toss-diary/service/toss-baker-toolkit.png`
- Create: `public/images/toss-diary/service/toss-order-progress.png`

- [ ] **Step 1: Load all generation references**

Use the new local boards as references, not edit targets. Every character-bearing prompt must include `character-dna.jpg`, `expression-wordmark.jpg`, and `color-sticker-language.jpg` to preserve the heart-shaped ears, wide cheeks, apron pocket, and dark-red hand-drawn line.

- [ ] **Step 2: Generate the dusk narrative Hero**

Use case: `ads-marketing`. Create a 16:9 editorial storefront scene at dusk with the first basket of bread outside the door, cream paper and dark-red signage, subtle character line art on glass, warm practical light, and generous dark negative space. Avoid clay figures, summer colors, crowds, long copy, and invented logos.

- [ ] **Step 3: Generate the member diary kit**

Use case: `product-mockup`. Create a top-down system of membership diary, date stamps, bread stamps, receipt sleeve, loyalty cards, and pencil on dark-brown metal and cream paper. Use only `TOSS DIARY`, simple dates, icons, or blank lines.

- [ ] **Step 4: Generate the service handoff scene**

Use case: `photorealistic-natural`. Show a bakery employee handing the supplied double-cup carrier, paper bag, and takeaway box to a customer. Preserve the red/cream/brown packaging geometry; keep faces secondary and natural; no extra brands or readable long text.

- [ ] **Step 5: Generate the baker toolkit**

Use case: `product-mockup`. Create an organized employee kit with apron, oven mitts, head scarf, bread lame, work badge, cloth tag, and bread-basket label, mixing cream canvas, dark-red screen print, brown leather, flour dust, and restrained stainless steel.

- [ ] **Step 6: Generate the order progress system**

Use case: `ui-mockup`. Show phone and self-order terminal screens with the running-bunny motion sequence as a bread-making progress indicator. Limit text to short numbers and icons; use placeholder lines instead of paragraphs.

- [ ] **Step 7: Inspect every output**

Reject any image that turns the character into a generic long-eared rabbit, introduces green/blue summer palettes, repeats the existing pop-up/seasonal/poster scenes, or contains prominent malformed copy. Iterate with one targeted correction when needed.

- [ ] **Step 8: Save selected files and generate WebP pairs**

Copy the five selected built-in imagegen outputs into `public/images/toss-diary/service/`, then create quality-80 `-w960.webp` and `-w1800.webp` siblings.

- [ ] **Step 9: Commit**

```bash
git add public/images/toss-diary/service
git commit -m "feat: add toss diary service extensions"
```

### Task 3: Model the service extensions

**Files:**
- Modify: `src/data/projects.js`
- Test: `src/data/content.test.js`

- [ ] **Step 1: Write the failing data test**

```js
expect(ip.serviceExtensions.map((item) => item.src)).toEqual([
  '/images/toss-diary/service/toss-dusk-first-batch.png',
  '/images/toss-diary/service/toss-member-diary-kit.png',
  '/images/toss-diary/service/toss-service-handoff.png',
  '/images/toss-diary/service/toss-baker-toolkit.png',
  '/images/toss-diary/service/toss-order-progress.png',
])
expect(ip.serviceExtensions[0].featured).toBe(true)
```

- [ ] **Step 2: Run and verify the test fails**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/data/content.test.js`

Expected: FAIL because `serviceExtensions` is undefined.

- [ ] **Step 3: Add the collection**

Each object must provide `label`, `title`, `description`, `src`, `alt`, and optional `featured`. Use labels `FIRST BATCH / 01`, `MEMBER DIARY / 02`, `SERVICE HANDOFF / 03`, `BAKER TOOLKIT / 04`, and `ORDER PROGRESS / 05`.

- [ ] **Step 4: Run and verify the data test passes**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/data/content.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.js src/data/content.test.js
git commit -m "feat: model toss diary service story"
```

### Task 4: Render the service section and update truth labels

**Files:**
- Modify: `src/components/IpStory.jsx`
- Test: `src/components/IpStory.test.jsx`

- [ ] **Step 1: Write the failing component tests**

Assert that the component renders eight original figures, uses `ORIGINAL IP DESIGN`, renders five `.ip-story__service-item` elements, marks one `.ip-story__service-item--featured`, and displays `AI-ASSISTED SERVICE EXTENSION` five times.

- [ ] **Step 2: Run and verify the test fails**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/components/IpStory.test.jsx`

Expected: FAIL because the service section and new source label do not exist.

- [ ] **Step 3: Add a focused renderer**

```jsx
function ServiceExtension({ item }) {
  return <article className={`ip-story__service-item${item.featured ? ' ip-story__service-item--featured' : ''}`}>
    <figure>
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      <Caption label={item.label} source="AI-ASSISTED SERVICE EXTENSION" />
    </figure>
    <div className="ip-story__service-copy">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  </article>
}
```

- [ ] **Step 4: Insert the new section**

Render a `BAKERY SERVICE / 03` section after original evidence and before summer campaign. Map all five service items, then renumber the later visible section labels and the final conclusion sequentially.

- [ ] **Step 5: Update the original source label**

Change `ORIGINAL CHARACTER ARTWORK` to `ORIGINAL IP DESIGN` in `OriginalBoard`.

- [ ] **Step 6: Run and verify the component tests pass**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/components/IpStory.test.jsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/IpStory.jsx src/components/IpStory.test.jsx
git commit -m "feat: render toss diary service extensions"
```

### Task 5: Add the portfolio-aligned layout

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

- [ ] **Step 1: Write a failing style contract test**

Assert the stylesheet contains `.ip-story__service-grid`, `.ip-story__service-item--featured`, `.ip-story__service-copy`, and a mobile rule that makes `.ip-story__service-grid` one column.

- [ ] **Step 2: Run and verify the test fails**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/styles.test.js`

Expected: FAIL because the service selectors are absent.

- [ ] **Step 3: Implement desktop styles**

Use a two-column grid with an `.8rem` gap. The featured item spans both columns. Images use 16:9, `object-fit: cover`, dark matte backgrounds, thin line outlines, restrained glass captions, and the existing IP red/cream/brown accents. Copy blocks use the existing archive inset and muted body type.

- [ ] **Step 4: Preserve original boards without cropping**

Keep `.ip-story__source-grid` at two columns and `.ip-story__original img` at `width: 100%; height: auto; object-fit: contain`.

- [ ] **Step 5: Add mobile styles**

At the existing 720px breakpoint, set `.ip-story__service-grid { grid-template-columns: 1fr; }` and reset the featured item to a normal single-column span.

- [ ] **Step 6: Run and verify style tests pass**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/styles.test.js`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/styles.css src/styles.test.js
git commit -m "style: integrate toss diary service archive"
```

### Task 6: Verify the local result without deployment

**Files:**
- Verify only; do not modify or sync `dist/`.

- [ ] **Step 1: Run focused tests**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm exec vitest run src/data/content.test.js src/data/responsive-assets.test.js src/components/IpStory.test.jsx src/components/SelectedWork.test.jsx src/styles.test.js`

Expected: all focused tests PASS.

- [ ] **Step 2: Run the complete test suite**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm test`

Expected: all test files and tests PASS.

- [ ] **Step 3: Build locally**

Run: `PATH="$NODE_RUNTIME:$PATH" pnpm build`

Expected: Vite build completes; the existing chunk-size warning is non-blocking.

- [ ] **Step 4: Inspect desktop and mobile layouts**

Start the local Vite server, inspect the TOSS DIARY section at approximately 1440px and 390px widths, and verify that all original boards are complete, the featured service image spans the section, the remaining four images align in a 2×2 grid, and mobile has no horizontal overflow.

- [ ] **Step 5: Verify local-only scope**

Confirm no command copied files into `dist/`, pushed Git, or triggered GitHub Pages. Report the local preview URL and changed files only.
