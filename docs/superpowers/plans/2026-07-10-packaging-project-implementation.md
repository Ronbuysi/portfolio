# Packaging Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Lan Mu Xiang selenium-rich rice packaging system as Selected Work 002 and apply the release-blocking privacy, motion, accessibility, contrast, and video-delivery fixes found during base-site review.

**Architecture:** Extend the existing `projects` data with an optional warm packaging presentation and isolate packaging-only markup in `PackagingStory`. Keep `SelectedWork` responsible for shared project titles and metadata. Add a small media-query hook so Hero video is only mounted when desktop motion preferences allow it.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, native CSS, local JPEG/MP4 assets, Swift/AVFoundation.

---

## File Map

- `public/images/packaging/*.jpg`: six optimized project images copied from user source files.
- `src/data/projects.js`: project 002 metadata, colors, seasons, and image roles.
- `src/data/content.test.js`: project count, privacy, and no-invented-year regression checks.
- `src/components/PackagingStory.jsx`: warm brand story, palette, seasons, structure archive, and design-board summary.
- `src/components/PackagingStory.test.jsx`: packaging content and six-image coverage.
- `src/components/SelectedWork.jsx`: chooses standard or packaging presentation while retaining shared headings.
- `src/components/Hero.jsx`: conditionally mounts video based on motion and width.
- `src/components/Hero.test.jsx`: video-enabled and video-disabled paths.
- `src/hooks/useHeroVideo.js`: live `matchMedia` subscription.
- `src/styles.css`: warm project layout, stronger label contrast, Contact focus, entrance motion.
- `scripts/create-hero-video.swift`: optimized MP4 metadata placement.
- `docs/superpowers/plans/2026-07-10-portfolio-implementation.md`: remove the literal private number from current plan text.

### Task 1: Optimize assets and add packaging project data

**Files:**
- Create: `public/images/packaging/bag-mockup.jpg`
- Create: `public/images/packaging/brick-mockup.jpg`
- Create: `public/images/packaging/bag-dieline.jpg`
- Create: `public/images/packaging/box-dieline.jpg`
- Create: `public/images/packaging/band-dieline.jpg`
- Create: `public/images/packaging/design-board.jpg`
- Modify: `src/data/projects.js`
- Modify: `src/data/content.test.js`

- [ ] **Step 1: Copy and resize project-local images without changing source files**

Run:

```bash
mkdir -p public/images/packaging
sips -Z 2800 -s format jpeg -s formatOptions 84 /Users/luoen/Desktop/包装/大米袋装样机最终版.jpg --out public/images/packaging/bag-mockup.jpg
sips -Z 2800 -s format jpeg -s formatOptions 84 /Users/luoen/Desktop/包装/米砖样机终稿.jpg --out public/images/packaging/brick-mockup.jpg
sips -Z 3200 -s format jpeg -s formatOptions 82 /Users/luoen/Desktop/包装/袋装刀版图.jpg --out public/images/packaging/bag-dieline.jpg
sips -Z 3200 -s format jpeg -s formatOptions 82 /Users/luoen/Desktop/包装/天地盒刀版图.jpg --out public/images/packaging/box-dieline.jpg
sips -Z 3200 -s format jpeg -s formatOptions 82 /Users/luoen/Desktop/包装/腰封包装刀版图.jpg --out public/images/packaging/band-dieline.jpg
sips -Z 3000 -s format jpeg -s formatOptions 84 /Users/luoen/Desktop/70a0461beb59d21d5f28c68af1ed7c88.jpg --out public/images/packaging/design-board.jpg
```

Expected: six valid JPEG files exist under `public/images/packaging/`; no Desktop source file changes.

- [ ] **Step 2: Write failing data tests**

Replace the current assertions with:

```js
import { describe, expect, test } from 'vitest'
import { profile } from './profile'
import { projects } from './projects'

describe('public content', () => {
  test('never publishes a Chinese mobile number or portrait field', () => {
    const content = JSON.stringify({ profile, projects })
    expect(content).not.toMatch(/\b1[3-9]\d{9}\b/)
    expect(content).not.toMatch(/avatar|portrait|证件照/i)
  })

  test('uses the verified public email and both real projects', () => {
    expect(profile.email).toBe('241022998@qq.com')
    expect(projects).toHaveLength(2)
    expect(projects[0].gallery).toHaveLength(3)
    expect(projects[1].id).toBe('lanmu-rice')
  })

  test('does not invent a year for the packaging project', () => {
    expect(projects[1]).not.toHaveProperty('year')
    expect(projects[1].gallery).toHaveLength(5)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test src/data/content.test.js`

Expected: FAIL because only one project exists.

- [ ] **Step 4: Add the exact packaging data**

Append this object to `projects`:

```js
{
  id: 'lanmu-rice',
  index: '002',
  title: '包装设计',
  englishTitle: 'Lan Mu Xiang Rice Packaging System',
  category: 'Packaging Design',
  scope: 'Brand Visual / Dieline / Mockup',
  theme: 'warm',
  description: '面向东兰县兰木乡特色富硒米建立的包装系统。设计从地域农耕文化与水稻生长过程提取视觉线索，以米白、棕色和暖金构成自然质朴的品牌气质，并将统一语言延展至袋装礼盒、米砖腰封与天地盒结构。',
  cover: '/images/packaging/bag-mockup.jpg',
  brandSystem: {
    slogan: '真材实料 米有烦恼',
    colors: [
      { name: 'Earth Brown', value: '#9B6C43' },
      { name: 'Rice Paper', value: '#FDF7E5' },
      { name: 'Warm Gold', value: 'WARM GOLD' },
    ],
    seasons: [
      { index: '01', cn: '春种', en: 'SPRING' },
      { index: '02', cn: '夏长', en: 'SUMMER' },
      { index: '03', cn: '秋收', en: 'AUTUMN' },
      { index: '04', cn: '冬藏', en: 'WINTER' },
    ],
  },
  gallery: [
    { role: 'mockup', src: '/images/packaging/brick-mockup.jpg', alt: '兰木乡富硒米米砖腰封包装样机' },
    { role: 'dieline', src: '/images/packaging/bag-dieline.jpg', alt: '兰木乡富硒米袋装包装刀版图' },
    { role: 'dieline', src: '/images/packaging/box-dieline.jpg', alt: '兰木乡富硒米天地盒包装与内部结构刀版图' },
    { role: 'dieline-wide', src: '/images/packaging/band-dieline.jpg', alt: '兰木乡富硒米米砖腰封系列包装刀版图' },
    { role: 'board', src: '/images/packaging/design-board.jpg', alt: '兰木乡富硒米包装设计完整展板' },
  ],
}
```

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test src/data/content.test.js`

Expected: PASS, 3 tests.

Commit:

```bash
git add public/images/packaging src/data
git commit -m "feat: add packaging project content"
```

### Task 2: Build the packaging case-study presentation

**Files:**
- Create: `src/components/PackagingStory.jsx`
- Create: `src/components/PackagingStory.test.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`

- [ ] **Step 1: Write the failing packaging component test**

```jsx
import { render, screen } from '@testing-library/react'
import PackagingStory from './PackagingStory'
import { projects } from '../data/projects'

test('turns the design board into a complete packaging story', () => {
  render(<PackagingStory project={projects[1]} />)
  expect(screen.getByText('真材实料 米有烦恼')).toBeInTheDocument()
  for (const label of ['#9B6C43', '#FDF7E5', 'WARM GOLD', '春种', '夏长', '秋收', '冬藏']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
  expect(screen.getAllByRole('img')).toHaveLength(6)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test src/components/PackagingStory.test.jsx`

Expected: FAIL because `PackagingStory` does not exist.

- [ ] **Step 3: Implement `PackagingStory`**

Use this structure:

```jsx
export default function PackagingStory({ project }) {
  const [brick, bagDieline, boxDieline, bandDieline, board] = project.gallery
  return <>
    <figure className="packaging-cover">
      <img src={project.cover} alt="兰木乡富硒米袋装礼盒包装样机" loading="lazy" />
      <figcaption><span>PACKAGING FAMILY / HERO MOCKUP</span><span>ORIGINAL ARTWORK</span></figcaption>
    </figure>
    <section className="brand-story">
      <div className="brand-story__copy"><span>BRAND STORY / 01</span><h3>{project.brandSystem.slogan}</h3><p>{project.description}</p></div>
      <div className="palette">{project.brandSystem.colors.map((color) => <div key={color.name}><i style={{ '--swatch': color.value.startsWith('#') ? color.value : undefined }} /><b>{color.value}</b><span>{color.name}</span></div>)}</div>
      <div className="seasons">{project.brandSystem.seasons.map((season) => <div key={season.index}><span>{season.index} / {season.en}</span><b>{season.cn}</b></div>)}</div>
    </section>
    <figure className="packaging-brick"><img src={brick.src} alt={brick.alt} loading="lazy" /><figcaption><span>RICE BRICK / MOCKUP</span><span>VISUAL SYSTEM APPLICATION</span></figcaption></figure>
    <div className="dieline-grid">{[bagDieline, boxDieline].map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption><span>STRUCTURE / DIELINE</span><span>ORIGINAL ARTWORK</span></figcaption></figure>)}</div>
    <figure className="band-dieline"><img src={bandDieline.src} alt={bandDieline.alt} loading="lazy" /><figcaption><span>SERIES / BAND DIELINE</span><span>DIMENSIONS PRESERVED</span></figcaption></figure>
    <section className="design-board"><img src={board.src} alt={board.alt} loading="lazy" /><div><span>COMPLETE DESIGN BOARD / 03</span><h3>从视觉语言到包装结构</h3><p>完整展板作为项目总结，呈现配色、字体、农耕元素、包装展开与产品延展之间的一致性。</p></div></section>
  </>
}
```

- [ ] **Step 4: Integrate packaging presentation into `SelectedWork`**

Import `PackagingStory`, add this exact standard-project helper, and update the project loop so Year is omitted when absent and Scope is rendered when present:

```jsx
function StandardStory({ project }) {
  return <>
    <figure className="project__cover">
      <img src={project.cover} alt={`${project.title}展陈视觉`} loading="eager" />
      <figcaption><span>CASE STUDY COVER</span><span>AI-ASSISTED PRESENTATION / ORIGINAL POSTERS PRESERVED</span></figcaption>
    </figure>
    <div className="project__gallery">
      {project.gallery.map((image, index) => <figure key={image.src}>
        <img src={image.src} alt={image.alt} loading="lazy" />
        <figcaption><span>POSTER / {String(index + 1).padStart(2, '0')}</span><span>ORIGINAL ARTWORK</span></figcaption>
      </figure>)}
    </div>
  </>
}

{projects.map((project) => <article className={`project${project.theme === 'warm' ? ' project--warm' : ''}`} key={project.id}>
  <div className="project__heading">
    <div><span className="project__index">/{project.index}</span><h2>{project.title}</h2><p>{project.englishTitle}</p></div>
    <dl>
      <div><dt>Category</dt><dd>{project.category}</dd></div>
      {project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}
      {project.tools && <div><dt>Tools</dt><dd>{project.tools}</dd></div>}
      {project.scope && <div><dt>Scope</dt><dd>{project.scope}</dd></div>}
    </dl>
  </div>
  <p className="project__description">{project.description}</p>
  {project.theme === 'warm' ? <PackagingStory project={project} /> : <StandardStory project={project} />}
</article>)}
```

Add `project--warm` when `project.theme === 'warm'`. Update `SelectedWork.test.jsx` to expect headings for both `运营视觉设计` and `包装设计`, plus ten images total across both projects.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test src/components/PackagingStory.test.jsx src/components/SelectedWork.test.jsx`

Expected: PASS, both files.

Commit:

```bash
git add src/components
git commit -m "feat: present packaging design case study"
```

### Task 3: Add the warm packaging layout and visual polish

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add complete packaging layout styles**

Add selectors for:

```css
.project--warm { margin-top: clamp(9rem, 15vw, 16rem); padding: clamp(2rem, 4vw, 4rem); background: #f5ecd8; color: #4f331d; }
.project--warm .project__index, .project--warm .project__heading p { color: #9b6c43; }
.project--warm .project__description { color: #745d48; }
.project--warm dl { border-color: #bda98d; }
.project--warm dt { color: #856a50; }
.packaging-cover, .packaging-brick, .band-dieline { margin-top: 3rem; background: #e8d9bc; overflow: hidden; }
.packaging-cover img, .packaging-brick img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
.brand-story { margin-top: .8rem; padding: clamp(2rem, 4vw, 4rem); background: #9b6c43; color: #fdf7e5; }
.brand-story__copy { display: grid; grid-template-columns: .7fr 1fr; gap: 3rem; align-items: end; }
.brand-story__copy h3 { font-size: clamp(3rem, 6vw, 7rem); line-height: .88; letter-spacing: -.06em; }
.brand-story__copy p { line-height: 1.8; color: #f4e7d2; }
.palette { display: flex; gap: 1rem; margin: 3rem 0; }
.palette div { display: grid; gap: .35rem; font: .65rem monospace; }
.palette i { width: 4rem; height: 4rem; border: 1px solid #fdf7e566; border-radius: 50%; background: var(--swatch, linear-gradient(135deg,#edc568,#fff7d9)); }
.palette span { opacity: .7; }
.seasons { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid #fdf7e566; border-bottom: 1px solid #fdf7e566; }
.seasons div { min-height: 9rem; padding: 1rem; border-right: 1px solid #fdf7e566; display: flex; flex-direction: column; justify-content: space-between; }
.seasons div:last-child { border-right: 0; }
.seasons span { font: .62rem monospace; }
.seasons b { font-size: 1.8rem; }
.dieline-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; margin-top: 3rem; }
.dieline-grid figure, .band-dieline { background: #fffaf0; }
.dieline-grid img, .band-dieline img { width: 100%; aspect-ratio: 1.25; object-fit: contain; }
.design-board { display: grid; grid-template-columns: .72fr 1.28fr; gap: 3rem; align-items: center; margin-top: 3rem; padding: clamp(2rem,4vw,4rem); background: #e9dfc9; }
.design-board img { width: 100%; max-height: 48rem; object-fit: contain; }
.design-board h3 { margin: 1rem 0; font-size: clamp(2rem, 4vw, 4.5rem); line-height: .92; letter-spacing: -.05em; }
.design-board p { color: #745d48; line-height: 1.8; }
@media (max-width: 720px) {
  .project--warm { margin-inline: -16px; padding: 16px; }
  .brand-story__copy, .design-board, .dieline-grid { grid-template-columns: 1fr; }
  .seasons { grid-template-columns: 1fr 1fr; }
  .palette { flex-wrap: wrap; }
}
```

- [ ] **Step 2: Run full tests and commit**

Run: `pnpm test`

Expected: all tests PASS.

Commit:

```bash
git add src/styles.css
git commit -m "style: add warm packaging chapter"
```

### Task 4: Fix reviewed privacy, motion, focus, contrast, and entrance issues

**Files:**
- Create: `src/hooks/useHeroVideo.js`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.test.jsx`
- Modify: `src/components/About.test.jsx`
- Modify: `src/styles.css`
- Modify: `docs/superpowers/plans/2026-07-10-portfolio-implementation.md`

- [ ] **Step 1: Write failing Hero media-preference tests**

Use these exact tests:

```jsx
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import Hero from './Hero'

function setMediaMatch(matches) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test('mounts the video when desktop motion is allowed', () => {
  setMediaMatch(true)
  const { container } = render(<Hero />)
  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view selected work/i })).toHaveAttribute('href', '#work')
  expect(container.querySelector('video')).toHaveAttribute('poster', '/video/hero-poster.jpg')
})

test('uses only the static fallback when motion is disabled or the screen is small', () => {
  setMediaMatch(false)
  const { container } = render(<Hero />)
  expect(container.querySelector('video')).toBeNull()
  expect(container.querySelector('.hero__fallback')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify the disabled-video case fails**

Run: `pnpm test src/components/Hero.test.jsx`

Expected: FAIL because Hero always mounts `<video>`.

- [ ] **Step 3: Implement `useHeroVideo`**

```js
import { useEffect, useState } from 'react'

const query = '(min-width: 721px) and (prefers-reduced-motion: no-preference)'

export default function useHeroVideo() {
  const [enabled, setEnabled] = useState(() => window.matchMedia?.(query).matches ?? false)
  useEffect(() => {
    const media = window.matchMedia?.(query)
    if (!media) return undefined
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return enabled
}
```

In `Hero`, call the hook and wrap the current `<video>` in `{videoEnabled && (...)}`.

- [ ] **Step 4: Remove current-tree private literals**

Change `About.test.jsx` to `expect(container).not.toHaveTextContent(/\b1[3-9]\d{9}\b/)`. Replace the literal number in the existing implementation plan with `<private mobile number>`. Verify with:

Run: `rg -n '\b1[3-9][0-9]{9}\b' src docs || true`

Expected: no output. Do not rewrite Git history in this task; before any public repository push, warn that earlier local commits retain the original literal.

- [ ] **Step 5: Apply focus, contrast, and entrance polish**

Add:

```css
:root { --label-muted: #85857f; }
.stats span, .mini-label, .project dt, .project figcaption, .toolkit { color: var(--label-muted); }
.contact a:focus-visible { outline-color: var(--ink); }
@keyframes hero-enter { from { opacity: 0; transform: translateY(1.2rem); } to { opacity: 1; transform: translateY(0); } }
.header, .hero__content > * { animation: hero-enter .8s both cubic-bezier(.2,.7,.2,1); }
.hero__content h1 { animation-delay: .08s; }
.hero__footer { animation-delay: .16s; }
```

The existing reduced-motion rule must reduce these animation durations to `.01ms`.

- [ ] **Step 6: Run tests and commit**

Run: `pnpm test`

Expected: all tests PASS.

Commit:

```bash
git add src docs/superpowers/plans/2026-07-10-portfolio-implementation.md
git commit -m "fix: harden privacy motion and accessibility"
```

### Task 5: Optimize Hero video for network playback

**Files:**
- Modify: `scripts/create-hero-video.swift`
- Regenerate: `public/video/hero-loop.mp4`

- [ ] **Step 1: Enable network optimization**

Insert `writer.shouldOptimizeForNetworkUse = true` immediately after creating `AVAssetWriter` and before `startWriting()`.

- [ ] **Step 2: Regenerate and inspect MP4 atom order**

Run:

```bash
swift scripts/create-hero-video.swift public/video/hero-poster.jpg public/video/hero-loop.mp4
python3 -c "from pathlib import Path; b=Path('public/video/hero-loop.mp4').read_bytes(); print('moov', b.find(b'moov'), 'mdat', b.find(b'mdat')); assert b.find(b'moov') < b.find(b'mdat')"
```

Expected: `moov` offset is smaller than `mdat` offset.

- [ ] **Step 3: Commit**

```bash
git add scripts/create-hero-video.swift public/video/hero-loop.mp4
git commit -m "perf: optimize hero video delivery"
```

### Task 6: Final verification and visual QA

**Files:**
- Verify all implementation files.

- [ ] **Step 1: Run automated verification**

Run: `pnpm test && pnpm build && git diff --check && git status --short --branch`

Expected: all tests PASS, Vite build succeeds, no diff errors, clean feature branch.

- [ ] **Step 2: Browser-check 1440×1000, 1920×1080, and 720×900**

Verify no horizontal overflow, two project titles, ten project images loaded, six packaging images undistorted, dielines fully contained, warm palette labels readable, Contact fills a viewport, and console has no warnings/errors.

- [ ] **Step 3: Request final code review**

Review the new commit range against both approved specs. Fix all Critical and Important issues before offering branch integration.
