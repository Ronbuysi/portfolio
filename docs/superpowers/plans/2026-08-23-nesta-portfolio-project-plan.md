# NESTA Portfolio Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add NESTA as project 007 with a dedicated brand-story page, optimized responsive assets, and scoped GSAP interactions while preserving the existing six projects.

**Architecture:** Keep the existing data-driven project routing and add a dedicated `NestaStory` renderer selected by `story: 'nesta'`. Generate `-w960.webp` and `-w1800.webp` variants from the 17 supplied JPG boards, use existing `ResponsiveImage` and layout conventions, and scope all NESTA animation to the story root with `useGSAP` + `ScrollTrigger`.

**Tech Stack:** React, Vite, Vitest, GSAP 3, `@gsap/react`, `ScrollTrigger`, CSS, bundled Python 3.12 with Pillow 12.3.0.

---

## Files and responsibilities

- Create `scripts/prepare_nesta_assets.py`: converts the 17 supplied JPG boards into semantic responsive WebP assets without changing the source folder.
- Create `src/components/NestaStory.jsx`: renders NESTA positioning, research, brand DNA, identity, and applications, with scoped GSAP timelines and ScrollTriggers.
- Create `src/components/NestaStory.test.jsx`: verifies the NESTA story sections, all 17 boards, and image loading attributes.
- Create `src/components/ProjectDetail.test.jsx`: verifies the dynamic 007 detail counter and NESTA next-project content.
- Modify `src/data/projects.js`: append the NESTA project object and its 17 semantic board records.
- Modify `src/components/ProjectDetail.jsx`: register the `nesta` story and derive the detail counter from `projects.length`.
- Modify `src/components/SelectedWork.jsx`: derive the portfolio project count instead of displaying `006 CASES`.
- Modify `src/components/WorkRing.jsx`: derive the ring index label from `projects.length`.
- Modify `src/styles.css`: add only `.nesta-story`-scoped layout, palette, responsive, hover, pin, and GSAP state styles.
- Modify `src/data/content.test.js`: assert seven projects, NESTA metadata, 17 board records, and five color tokens.
- Modify `src/components/SelectedWork.test.jsx`: update the count assertion from `006 CASES` to `007 CASES`.

The source images remain unchanged at `C:/Users/86135/Desktop/作品/`. Generated website assets live under `public/images/nesta/` and are not referenced by random source filenames in the UI.

### Task 1: Add red tests for project data, story structure, and dynamic counts

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/components/SelectedWork.test.jsx`
- Create: `src/components/NestaStory.test.jsx`
- Create: `src/components/ProjectDetail.test.jsx`

- [ ] **Step 1: Add the failing NESTA data assertions**

Append a test to `src/data/content.test.js` that requires the project to exist before it is implemented:

```js
test('includes the NESTA furniture brand project as project 007', () => {
  const nesta = projects.find((project) => project.id === 'nesta-furniture')

  expect(projects).toHaveLength(7)
  expect(nesta).toMatchObject({
    index: '007',
    title: 'NESTA 家具品牌设计',
    englishTitle: 'NESTA Furniture Brand Identity',
    year: '2026',
    category: 'Brand Design',
    story: 'nesta',
    theme: 'nesta',
  })
  expect(nesta.research).toHaveLength(3)
  expect(nesta.brandDna.source.src).toBe('/images/nesta/concept-identity.jpg')
  expect(nesta.identity).toHaveLength(3)
  expect(nesta.applications).toHaveLength(8)
  expect(nesta.brandDna.colors.map(({ value }) => value)).toEqual([
    '#287BEA', '#FFF3EA', '#61BDD9', '#4B101C', '#F7D1D8',
  ])
})
```

- [ ] **Step 2: Add the failing story-render test**

Create `src/components/NestaStory.test.jsx` with the project fixture lookup and these assertions:

```jsx
import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import NestaStory from './NestaStory'

test('renders all NESTA story sections and 17 board images', () => {
  const project = projects.find((item) => item.id === 'nesta-furniture')
  const { container } = render(<NestaStory project={project} />)

  expect(container.querySelector('.nesta-story__positioning')).toBeInTheDocument()
  expect(container.querySelector('.nesta-story__research')).toBeInTheDocument()
  expect(container.querySelector('.nesta-story__dna')).toBeInTheDocument()
  expect(container.querySelector('.nesta-story__identity')).toBeInTheDocument()
  expect(container.querySelector('.nesta-story__applications')).toBeInTheDocument()
  expect(container.querySelectorAll('img')).toHaveLength(17)
  expect(screen.getByText('Space carries life. Space carries oneself.')).toBeInTheDocument()

  for (const image of container.querySelectorAll('img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})

test('renders the NESTA brand DNA tokens', () => {
  const project = projects.find((item) => item.id === 'nesta-furniture')
  render(<NestaStory project={project} />)

  expect(screen.getByText('SPACE / 空间')).toBeInTheDocument()
  expect(screen.getByText('ONESELF / 自我')).toBeInTheDocument()
  expect(screen.getByText('#287BEA')).toBeInTheDocument()
  expect(screen.getByText('#4B101C')).toBeInTheDocument()
})
```

- [ ] **Step 3: Update the count assertion to the required new behavior**

In `src/components/SelectedWork.test.jsx`, change the existing exact text assertion to:

```js
expect(screen.getByText('007 CASES')).toBeInTheDocument()
```

Create `src/components/ProjectDetail.test.jsx` with the mocked callbacks and the NESTA project:

```jsx
import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import ProjectDetail from './ProjectDetail'

test('shows the dynamic project count and NESTA next-project title', () => {
  const nesta = projects.find((item) => item.id === 'nesta-furniture')
  render(<ProjectDetail projectId={nesta.id} onClose={() => {}} onStep={() => {}} />)

  expect(screen.getByText('007 / 007')).toBeInTheDocument()
  expect(screen.getByText('NESTA 家具品牌设计')).toBeInTheDocument()
  expect(screen.getByText('运营视觉设计')).toBeInTheDocument()
})
```

- [ ] **Step 4: Run the red tests**

Run from `C:\Users\86135\Desktop\作品集网站-可迁移版-2026-08-21\旧版作品集`:

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' test
```

Expected: the new NESTA tests fail because the project, story component, and dynamic count changes do not exist yet; existing unrelated tests remain identifiable in the output.

### Task 2: Generate responsive NESTA WebP assets

**Files:**
- Create: `scripts/prepare_nesta_assets.py`
- Create: `public/images/nesta/*-w960.webp`
- Create: `public/images/nesta/*-w1800.webp`

- [ ] **Step 1: Add the asset conversion script**

Create `scripts/prepare_nesta_assets.py` with this behavior:

```python
from pathlib import Path
from PIL import Image, ImageOps

SOURCE = Path(r'C:/Users/86135/Desktop/作品')
DEST = Path(__file__).resolve().parents[1] / 'public' / 'images' / 'nesta'
ASSETS = {
    '1e6c83a0e93dfc8b01d7a3ec55f37ab5.jpg': 'hero-cover',
    '18e3032e58087b5b5a185e9d529218b6.jpg': 'positioning-overview',
    '411f4fb71f45ef6bf9315d147607cdac.jpg': 'concept-identity',
    '423efcef593e7e1efcf656be996b9cf2.jpg': 'research-market-user',
    '96e764bc005a4b4afe1d9fd3c6208416.jpg': 'research-competitors',
    'e34447a4f0964205eaae8a6b85031471.jpg': 'research-brand-opportunity',
    'f38148cf53096b223e35e4f90779dcba.jpg': 'identity-logo-construction',
    'e986ccc5cdd9a1f86cc0340f063a7ef5.jpg': 'identity-color-system',
    'e7f221a6f39a9d76eab1a77ff1bff039.jpg': 'identity-pattern-language',
    '28fc79dc932dade9a9be86b8b064f811.jpg': 'application-vi-board',
    'a7891f23d4c412bd91a1ae0d9a041b86.jpg': 'application-editorial',
    '559bf7966a94c052c02bd9cc2e8a7f46.jpg': 'application-social',
    'b8a2ccce7206744dced31b3f5f4b26be.jpg': 'application-spatial-display',
    '64f25f02d6da06118b9a56c758d5d5d0.jpg': 'application-collage',
    'fc792c3e0995c1aeb0f4d5ff41a7057c.jpg': 'application-brand-story',
    'fff254e05b4d3699e22830d2683a22b8.jpg': 'application-space-scene',
    '2241f292694c0cb2497992ebc760bf2d.jpg': 'application-illustration-world',
}

def convert(source: Path, basename: str, width: int) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((width, width), Image.Resampling.LANCZOS)
        image.save(DEST / f'{basename}-w{width}.webp', 'WEBP', quality=86, method=6)

DEST.mkdir(parents=True, exist_ok=True)
for source_name, basename in ASSETS.items():
    source = SOURCE / source_name
    if not source.is_file():
        raise FileNotFoundError(source)
    convert(source, basename, 960)
    convert(source, basename, 1800)
```

- [ ] **Step 2: Run the conversion**

Run:

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\prepare_nesta_assets.py
```

Expected: 34 WebP files are created under `public/images/nesta/`, with no files written into the source folder.

- [ ] **Step 3: Verify generated dimensions and counts**

Run a read-only Pillow check that opens every generated file, asserts `format == 'WEBP'`, asserts the filename suffix is `-w960.webp` or `-w1800.webp`, and asserts the image width is at most the requested width. Expected: 34 files, 0 unreadable files, 0 width violations.

### Task 3: Add the NESTA data and dynamic project count

**Files:**
- Modify: `src/data/projects.js`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/WorkRing.jsx`

- [ ] **Step 1: Append the NESTA project object**

Append `nesta-furniture` after the current `toss-diary` object. Use the exact metadata from the approved design and use `.jpg` source bases such as `assetUrl('/images/nesta/hero-cover.jpg')`; `ResponsiveImage` will resolve them to the generated WebP variants.

Use these array lengths and source bases:

```js
research: [
  { label: 'MARKET / USER / INDUSTRY RESEARCH / 01', src: assetUrl('/images/nesta/research-market-user.jpg'), alt: 'NESTA 市场机会、用户需求、行业趋势与消费趋势研究板' },
  { label: 'COMPETITOR SCAN / 02', src: assetUrl('/images/nesta/research-competitors.jpg'), alt: 'NESTA Vitra、MUJI、梵几、HAY 与 IKEA 竞品调研板' },
  { label: 'BRAND OPPORTUNITY / 03', src: assetUrl('/images/nesta/research-brand-opportunity.jpg'), alt: 'NESTA 用户画像、品牌机会、定位模型与 SWOT 研究板' },
],
brandDna: {
  source: { src: assetUrl('/images/nesta/concept-identity.jpg'), alt: 'NESTA 品牌概念、标志变体与视觉原则' },
  keywords: ['SPACE / 空间', 'ONESELF / 自我', 'CARRY / 承载', 'GROWTH / 成长'],
  colors: [
    { name: 'NESTA Blue', value: '#287BEA' },
    { name: 'Soft Cream', value: '#FFF3EA' },
    { name: 'Signal Cyan', value: '#61BDD9' },
    { name: 'Deep Burgundy', value: '#4B101C' },
    { name: 'Quiet Pink', value: '#F7D1D8' },
  ],
},
identity: [
  { label: 'LOGO CONSTRUCTION / 01', src: assetUrl('/images/nesta/identity-logo-construction.jpg'), alt: 'NESTA 标志构造网格与留白规范' },
  { label: 'COLOR SYSTEM / 02', src: assetUrl('/images/nesta/identity-color-system.jpg'), alt: 'NESTA RGB 色彩系统与应用色板' },
  { label: 'PATTERN LANGUAGE / 03', src: assetUrl('/images/nesta/identity-pattern-language.jpg'), alt: 'NESTA 家具插画与几何纹样系统' },
],
applications: [
  { label: 'VI BOARD / 01', src: assetUrl('/images/nesta/application-vi-board.jpg'), alt: 'NESTA 海报、产品卡、吊牌与办公物料应用' },
  { label: 'EDITORIAL / 02', src: assetUrl('/images/nesta/application-editorial.jpg'), alt: 'NESTA 家具摄影、图标与品牌信息编辑组合' },
  { label: 'SOCIAL / 03', src: assetUrl('/images/nesta/application-social.jpg'), alt: 'NESTA 社交媒体卡片与移动端内容应用' },
  { label: 'SPATIAL DISPLAY / 04', src: assetUrl('/images/nesta/application-spatial-display.jpg'), alt: 'NESTA 空间陈列、海报、吊牌与家具场景应用' },
  { label: 'BRAND COLLAGE / 05', src: assetUrl('/images/nesta/application-collage.jpg'), alt: 'NESTA 家具、插画与品牌图形空间拼贴' },
  { label: 'BRAND STORY / 06', src: assetUrl('/images/nesta/application-brand-story.jpg'), alt: 'NESTA 家具符号与情绪关键词品牌故事场景' },
  { label: 'SPACE SCENE / 07', src: assetUrl('/images/nesta/application-space-scene.jpg'), alt: 'NESTA 家具品牌背景与生活方式空间场景' },
  { label: 'ILLUSTRATION WORLD / 08', src: assetUrl('/images/nesta/application-illustration-world.jpg'), alt: 'NESTA Where Life Breathes 插画生活空间' },
],
```

- [ ] **Step 2: Make all portfolio totals dynamic**

Use `const projectCount = String(projects.length).padStart(3, '0')` in each component that displays a total, then render `${projectCount} CASES`, `INDEX / ${projectCount}`, and `${project.index} / ${projectCount}`. Keep `projects.length` as the single source of truth; do not add another count constant.

- [ ] **Step 3: Run the data and count tests**

Run:

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' test -- src/data/content.test.js src/components/SelectedWork.test.jsx src/components/ProjectDetail.test.jsx
```

Expected: data and count tests pass once the story component import exists; the dedicated story test remains red until Task 4.

### Task 4: Build the NESTA story component and GSAP interactions

**Files:**
- Create: `src/components/NestaStory.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/styles.css`
- Test: `src/components/NestaStory.test.jsx`

- [ ] **Step 1: Add the story renderer and scoped GSAP setup**

In `NestaStory.jsx`, import `useRef`, `useGSAP`, `gsap`, and `ScrollTrigger` from `../motion/gsapSetup`, create `rootRef`, and register the story in the existing `STORIES` map. The component must render exactly 17 images: `project.cover`, one `project.positioning` board, `project.brandDna.source`, three `research` records, three `identity` records, and eight `applications` records.

The GSAP setup must follow this shape:

```jsx
useGSAP((context, contextSafe) => {
  const mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
    const { desktop, reduceMotion } = conditions
    const intro = gsap.timeline({ defaults: { duration: reduceMotion ? 0 : 0.7, ease: 'power3.out' } })
    intro.from('.nesta-story__intro-item', { autoAlpha: 0, y: reduceMotion ? 0 : 28, stagger: reduceMotion ? 0 : 0.08 })

    if (!reduceMotion) {
      ScrollTrigger.batch('.nesta-story__research-card', {
        start: 'top 84%',
        onEnter: (elements) => gsap.to(elements, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.65, overwrite: 'auto' }),
      })
      gsap.timeline({
        scrollTrigger: { trigger: '.nesta-story__dna', start: 'top 75%', end: '+=900', scrub: 1, pin: desktop ? '.nesta-story__dna-inner' : false },
      })
        .to('.nesta-story__pattern-layer', { x: desktop ? 120 : 40, rotation: desktop ? 4 : 0, ease: 'none' })
        .to('.nesta-story__swatch', { y: -18, stagger: 0.08 }, '<')
    }

    if (!reduceMotion) {
      const cards = [...rootRef.current.querySelectorAll('.nesta-story__application-card')]
      const xTo = cards.map((card) => gsap.quickTo(card, 'x', { duration: 0.35, ease: 'power3.out' }))
      const yTo = cards.map((card) => gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power3.out' }))
      const onMove = contextSafe((event) => {
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect()
          const px = (event.clientX - rect.left) / rect.width - 0.5
          const py = (event.clientY - rect.top) / rect.height - 0.5
          if (event.target instanceof Node && card.contains(event.target)) { xTo[index](px * 10); yTo[index](py * 10) }
          else { xTo[index](0); yTo[index](0) }
        })
      })
      rootRef.current.addEventListener('pointermove', onMove)
      return () => rootRef.current.removeEventListener('pointermove', onMove)
    }
  }, rootRef)
  return () => mm.revert()
}, { scope: rootRef })
```

Keep the implementation structure shown above: preserve the scope, matchMedia conditions, top-to-bottom trigger order, transform/autoAlpha-only motion, and cleanup behavior. Use `ScrollTrigger.refresh()` once after the initial image/font layout settles, not inside a pointer or scroll callback.

- [ ] **Step 2: Add the NESTA-scoped CSS**

Add rules under `.nesta-story` in `src/styles.css` for:

```css
.nesta-story { --nesta-blue: #287BEA; --nesta-cream: #FFF3EA; --nesta-cyan: #61BDD9; --nesta-burgundy: #4B101C; --nesta-pink: #F7D1D8; --nesta-inset: var(--case-inset); }
.nesta-story__research-card, .nesta-story__application-card { opacity: 0; transform: translateY(2rem); }
.nesta-story__application-card { will-change: transform; transition: box-shadow .3s ease, border-color .3s ease; }
.nesta-story__application-card:hover { border-color: var(--nesta-blue); box-shadow: 0 1.5rem 3rem rgba(0,0,0,.28); }
@media (prefers-reduced-motion: reduce) {
  .nesta-story__research-card, .nesta-story__application-card { opacity: 1; transform: none; }
  .nesta-story__application-card { will-change: auto; }
}
```

Add the section grids and mobile breakpoint rules using the existing `.project` spacing and `.responsive-picture` conventions. The desktop DNA pin must animate the inner child, not the pinned trigger itself; the mobile layout must remove pin spacing and flow vertically.

- [ ] **Step 3: Run the focused story tests**

Run:

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' test -- src/components/NestaStory.test.jsx src/components/ProjectDetail.test.jsx
```

Expected: the NESTA story and dynamic detail tests pass with 17 images and the GSAP setup harmless in jsdom.

### Task 5: Integrate assets, run the full suite, and build

**Files:**
- Modify: `dist/` only through the Vite build output; do not hand-edit generated files.

- [ ] **Step 1: Run the full test suite**

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' test
```

Expected: all pre-existing tests plus the new NESTA tests pass, with zero failures.

- [ ] **Step 2: Run the production build**

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' build
```

Expected: Vite exits with code 0 and emits the client bundle without missing-module or asset-resolution errors.

- [ ] **Step 3: Verify every generated asset is referenced by a reachable source**

Use a read-only PowerShell check to extract `nesta` paths from `src/data/projects.js`, derive their `-w960.webp` and `-w1800.webp` counterparts, and assert all 34 files exist under `public/images/nesta/`. Expected: 34/34 asset paths exist.

### Task 6: Verify the live project in the in-app browser

**Files:**
- No source changes; use the running local Vite server and existing browser tab.

- [ ] **Step 1: Open the NESTA detail route**

Navigate the existing local tab to `http://localhost:5174/#work/nesta-furniture`, wait for `load`, and keep the tab visible as the user-facing deliverable.

- [ ] **Step 2: Verify visible and interactive state**

Check the DOM for `NESTA 家具品牌设计`, `007 / 007`, the five story sections, 17 image elements, and the `NEXT PROJECT` control. Trigger the return-to-list and next/previous controls once each, then reopen NESTA.

- [ ] **Step 3: Verify browser diagnostics**

Read the browser console for `error` and `warning` entries, inspect all 17 image elements for `complete === true` and `naturalWidth > 0` after scrolling through the detail, and confirm no missing asset request appears. Expected: no console errors/warnings and all 17 NESTA images load.

- [ ] **Step 4: Verify reduced-motion behavior**

If the browser exposes the reduced-motion setting, enable it for a focused check; otherwise verify the CSS fallback and `matchMedia` branch in tests. Expected: content remains readable without pinning/parallax/hover rotation.

No Git commit step is included because the portfolio directory is not a Git repository. The implementation handoff will report the changed files and fresh test/build/browser evidence instead.
