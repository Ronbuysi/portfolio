# Two Poster Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Sanfu and Horsh poster series as independent, aligned projects `003` and `004`, with truthful original-poster presentation and two image-2-assisted stage backgrounds.

**Architecture:** Add two structured `story: 'poster'` project records and a focused `PosterStory` renderer selected by `SelectedWork`. The renderer shares one case-study inset with the packaging project, displays original posters without cropping, and layers them over decorative AI backgrounds rather than asking image-2 to redraw the artwork.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, CSS Grid, built-in image generation tool.

---

## File Structure

- Create `public/images/poster-projects/sanfu-puzzle-stage.png`: image-2 decorative Sanfu stage background.
- Create `public/images/poster-projects/horsh-timeline-stage.png`: image-2 decorative Horsh stage background.
- Create `public/images/poster-projects/sanfu-travel.jpg`: optimized original poster.
- Create `public/images/poster-projects/sanfu-dorm.jpg`: optimized original poster.
- Create `public/images/poster-projects/sanfu-office.jpg`: optimized original poster.
- Create `public/images/poster-projects/horsh-childhood.jpg`: optimized original poster.
- Create `public/images/poster-projects/horsh-grown-up.jpg`: optimized original poster.
- Modify `src/data/projects.js`: add projects `003` and `004` with poster-specific content.
- Modify `src/data/content.test.js`: test both new project records and forbid invented dates/results.
- Create `src/components/PosterStory.jsx`: render the shared poster stage and theme-specific story modules.
- Create `src/components/PosterStory.test.jsx`: test original/AI source labels and theme dispatch.
- Modify `src/components/SelectedWork.jsx`: dispatch poster stories and update the curated range.
- Modify `src/components/SelectedWork.test.jsx`: test all four projects and preserve operation posters.
- Modify `src/styles.css`: add shared case inset and aligned Sanfu/Horsh poster layouts.
- Modify `src/styles.test.js`: lock alignment, no-crop behavior, responsive columns, and reduced motion.

## Task 1: Generate the two image-2 stage backgrounds

**Files:**
- Create: `public/images/poster-projects/sanfu-puzzle-stage.png`
- Create: `public/images/poster-projects/horsh-timeline-stage.png`

- [ ] **Step 1: Inspect all five original posters**

Use `view_image` on:

```text
/Users/luoen/Desktop/海报1/7f44c2e6a8db33f5087c5bb3711876e3.jpg
/Users/luoen/Desktop/海报1/136481cd5c33788ffcc54f5e4b8bf2a5.jpg
/Users/luoen/Desktop/海报1/ea3ec3fb9f4774fd3b4f72efab90f618.jpg
/Users/luoen/Desktop/海报2/99204198354932f286bef44299e32063.jpg
/Users/luoen/Desktop/海报2/552b71be09cc6addedc849548442e44d.jpg
```

Expected: confirm Sanfu's puzzle border, monochrome object doodles and blue/yellow/red/purple system; confirm Horsh's cream paper, navy doodles, desk boundary and childhood/adult contrast.

- [ ] **Step 2: Generate the Sanfu puzzle stage**

Use built-in image generation with the three Sanfu posters as style references and this prompt:

```text
Use case: stylized-concept
Asset type: decorative portfolio presentation background
Primary request: Create a front-facing dark editorial exhibition stage for three portrait posters, inspired by the supplied Sanfu campaign's puzzle outlines and dense everyday-object doodles.
Input images: Images 1–3 are style references only; do not reproduce, redraw, or include their poster artwork, people, text, or logo.
Scene/backdrop: graphite-black gallery wall, three perfectly upright and equally sized empty portrait display zones in one horizontal row.
Style/medium: restrained exhibition visualization with thick black puzzle outlines, fine white object doodles, and controlled electric-blue, signal-red, warm-yellow and purple edge lights.
Composition/framing: 2048×1152 landscape; the three empty zones share one top and bottom baseline and occupy the central 78% of the image; no perspective distortion.
Constraints: empty display zones only; no readable text, no brand mark, no people, no products, no watermark; keep decoration outside the zones so original posters can be overlaid in HTML.
Avoid: cyberpunk, neon city, tilted frames, overlapping frames, mock poster content, generic 3D cards.
```

Expected: three clean, aligned portrait zones with enough contrast for HTML poster overlays.

- [ ] **Step 3: Generate the Horsh timeline stage**

Use built-in image generation with the two Horsh posters as style references and this prompt:

```text
Use case: stylized-concept
Asset type: decorative portfolio presentation background
Primary request: Create a front-facing editorial timeline stage for two portrait posters, inspired by the supplied Horsh childhood and grown-up hand-drawn desk scenes.
Input images: Images 1–2 are style references only; do not reproduce, redraw, or include their poster artwork, bread package, text, or logo.
Scene/backdrop: deep charcoal space with a restrained cream-paper desktop plane; two perfectly upright, equally sized empty portrait display zones aligned horizontally.
Style/medium: tactile paper-and-ink installation; childlike toy and pencil outlines concentrated on the left, laptop/report/coffee outlines on the right, connected by one navy timeline.
Composition/framing: 2048×1152 landscape; zones occupy the central 70% and share exact top/bottom baselines; no perspective distortion.
Color palette: charcoal, cream paper, Horsh navy, small bread-gold accent.
Constraints: empty display zones only; no readable text, no logo, no people, no bread package, no watermark; decoration stays outside the overlay zones.
Avoid: photoreal office, floating UI, blue neon, tilted frames, overlapping objects on the zones.
```

Expected: two clean portrait zones and an intelligible left-to-right time contrast.

- [ ] **Step 4: Inspect both generated backgrounds**

Use `view_image` and verify:

```text
Sanfu: exactly three upright empty zones; shared baselines; no poster-like generated content.
Horsh: exactly two upright empty zones; child/adult object split; no package or text.
Both: 2048×1152, no watermark, no perspective that prevents CSS overlay.
```

If a result fails one criterion, make one targeted follow-up changing only that criterion.

- [ ] **Step 5: Copy the selected outputs into the project**

Copy from the built-in generated-images directory to the exact paths listed above. Do not overwrite packaging or operation assets.

- [ ] **Step 6: Commit the generated backgrounds**

```bash
git add public/images/poster-projects/sanfu-puzzle-stage.png \
  public/images/poster-projects/horsh-timeline-stage.png
git commit -m "feat: add poster presentation stages"
```

## Task 2: Curate and optimize the five original posters

**Files:**
- Create: `public/images/poster-projects/sanfu-travel.jpg`
- Create: `public/images/poster-projects/sanfu-dorm.jpg`
- Create: `public/images/poster-projects/sanfu-office.jpg`
- Create: `public/images/poster-projects/horsh-childhood.jpg`
- Create: `public/images/poster-projects/horsh-grown-up.jpg`

- [ ] **Step 1: Copy the originals with stable names**

```bash
mkdir -p public/images/poster-projects
cp '/Users/luoen/Desktop/海报1/7f44c2e6a8db33f5087c5bb3711876e3.jpg' public/images/poster-projects/sanfu-travel.jpg
cp '/Users/luoen/Desktop/海报1/136481cd5c33788ffcc54f5e4b8bf2a5.jpg' public/images/poster-projects/sanfu-dorm.jpg
cp '/Users/luoen/Desktop/海报1/ea3ec3fb9f4774fd3b4f72efab90f618.jpg' public/images/poster-projects/sanfu-office.jpg
cp '/Users/luoen/Desktop/海报2/99204198354932f286bef44299e32063.jpg' public/images/poster-projects/horsh-childhood.jpg
cp '/Users/luoen/Desktop/海报2/552b71be09cc6addedc849548442e44d.jpg' public/images/poster-projects/horsh-grown-up.jpg
```

- [ ] **Step 2: Convert and constrain the originals for the web**

For each copied JPEG:

```bash
sips --matchTo '/System/Library/ColorSync/Profiles/sRGB Profile.icc' "$image" >/dev/null
sips --resampleHeightWidthMax 3000 "$image" >/dev/null
```

Expected: every image is 3-channel RGB with an sRGB profile, keeps the original portrait orientation, and has a 3000px long edge without cropping.

- [ ] **Step 3: Verify exact poster count and dimensions**

```bash
find public/images/poster-projects -maxdepth 1 -type f -print | sort
file public/images/poster-projects/*.jpg
sips -g pixelWidth -g pixelHeight -g space -g profile public/images/poster-projects/*.jpg
```

Expected: five JPEGs plus two generated PNGs; every JPEG is non-zero, RGB/sRGB, portrait, and no larger than 3000px on the long edge.

- [ ] **Step 4: Commit the original poster media**

```bash
git add public/images/poster-projects/*.jpg
git commit -m "feat: curate two poster series"
```

## Task 3: Add the two poster project records

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] **Step 1: Write failing data tests**

Append to `src/data/content.test.js`:

```js
test('models Sanfu and Horsh as independent poster projects', () => {
  expect(projects).toHaveLength(4)
  const sanfu = projects.find((project) => project.id === 'sanfu-lifestyle')
  const horsh = projects.find((project) => project.id === 'horsh-growth')
  expect(sanfu).toMatchObject({ index: '003', category: 'Poster Design', story: 'poster', theme: 'sanfu' })
  expect(horsh).toMatchObject({ index: '004', category: 'Poster Design', story: 'poster', theme: 'horsh' })
  expect(sanfu.posters).toHaveLength(3)
  expect(horsh.posters).toHaveLength(2)
  expect(sanfu.visualLanguage.colors).toHaveLength(4)
  expect(horsh.timeline).toHaveLength(2)
})

test('does not invent poster dates or campaign results', () => {
  const posterProjects = projects.filter((project) => project.story === 'poster')
  for (const project of posterProjects) {
    expect(project).not.toHaveProperty('year')
    expect(project).not.toHaveProperty('results')
    expect(project).not.toHaveProperty('metrics')
  }
})
```

Change the existing public-content assertion from `projects.toHaveLength(2)` to `projects.toHaveLength(4)`.

- [ ] **Step 2: Run the data test and verify RED**

```bash
pnpm test -- src/data/content.test.js
```

Expected: FAIL because projects `003` and `004` do not exist.

- [ ] **Step 3: Add the Sanfu data object**

Append after packaging in `src/data/projects.js`:

```js
{
  id: 'sanfu-lifestyle',
  index: '003',
  title: '生活新搭案',
  englishTitle: 'Sanfu Lifestyle Puzzle Campaign',
  category: 'Poster Design',
  scope: 'Campaign Illustration / Poster System',
  story: 'poster',
  theme: 'sanfu',
  description: '围绕旅行、宿舍与职场三种生活状态，以拼图轮廓连接高饱和人物插画和黑白生活物件，形成统一但可延展的系列运营海报。',
  posters: [
    { index: '01', label: 'TRAVEL', src: '/images/poster-projects/sanfu-travel.jpg', alt: '三福生活新搭案旅行主题海报' },
    { index: '02', label: 'DORM', src: '/images/poster-projects/sanfu-dorm.jpg', alt: '三福生活新搭案宿舍主题海报' },
    { index: '03', label: 'OFFICE', src: '/images/poster-projects/sanfu-office.jpg', alt: '三福生活新搭案职场主题海报' },
  ],
  presentation: '/images/poster-projects/sanfu-puzzle-stage.png',
  visualLanguage: {
    title: '同一块拼图，三种生活状态',
    colors: [
      { name: 'Electric Blue', value: '#2145EF' },
      { name: 'Signal Red', value: '#FF425C' },
      { name: 'Warm Yellow', value: '#F4C327' },
      { name: 'Puzzle Purple', value: '#7D36C8' },
    ],
  },
}
```

- [ ] **Step 4: Add the Horsh data object**

Append after Sanfu:

```js
{
  id: 'horsh-growth',
  index: '004',
  title: '成长日常',
  englishTitle: 'Horsh Everyday Growth Posters',
  category: 'Poster Design',
  scope: 'Campaign Illustration / Poster System',
  story: 'poster',
  theme: 'horsh',
  description: '以豪士面包为不变的视觉中心，通过童年玩具与成年职场物件的替换，建立“小时候 / 长大后”的双联画叙事。',
  posters: [
    { index: '01', label: 'CHILDHOOD', src: '/images/poster-projects/horsh-childhood.jpg', alt: '豪士成长日常小时候主题海报' },
    { index: '02', label: 'GROWN-UP', src: '/images/poster-projects/horsh-grown-up.jpg', alt: '豪士成长日常长大后主题海报' },
  ],
  presentation: '/images/poster-projects/horsh-timeline-stage.png',
  timeline: [
    { index: '01', en: 'CHILDHOOD', cn: '小时候', description: '玩具、画笔、积木与零食构成自由而密集的童年桌面。' },
    { index: '02', en: 'GROWN-UP', cn: '长大后', description: '电脑、报表、咖啡和通勤物件替代玩具，产品始终处于视觉中心。' },
  ],
}
```

- [ ] **Step 5: Run the target test and verify GREEN**

```bash
pnpm test -- src/data/content.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit the project data**

```bash
git add src/data/projects.js src/data/content.test.js
git commit -m "feat: model two poster case studies"
```

## Task 4: Build the shared PosterStory component

**Files:**
- Create: `src/components/PosterStory.jsx`
- Create: `src/components/PosterStory.test.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`

- [ ] **Step 1: Write failing PosterStory tests**

Create `src/components/PosterStory.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import PosterStory from './PosterStory'
import { projects } from '../data/projects'

test('renders three Sanfu originals and its visual-language module', () => {
  const sanfu = projects.find((project) => project.id === 'sanfu-lifestyle')
  const { container } = render(<PosterStory project={sanfu} />)
  expect(container.querySelector('.poster-story--sanfu')).toBeInTheDocument()
  expect(container.querySelectorAll('.poster-story__originals img')).toHaveLength(3)
  expect(screen.getByText('同一块拼图，三种生活状态')).toBeInTheDocument()
  expect(screen.getAllByText('ORIGINAL POSTER')).toHaveLength(6)
  expect(screen.getByText('AI-ASSISTED PRESENTATION')).toBeInTheDocument()
})

test('renders two Horsh originals and its two-step timeline', () => {
  const horsh = projects.find((project) => project.id === 'horsh-growth')
  const { container } = render(<PosterStory project={horsh} />)
  expect(container.querySelector('.poster-story--horsh')).toBeInTheDocument()
  expect(container.querySelectorAll('.poster-story__originals img')).toHaveLength(2)
  expect(screen.getByText('小时候')).toBeInTheDocument()
  expect(screen.getByText('长大后')).toBeInTheDocument()
  expect(screen.getAllByText('ORIGINAL POSTER')).toHaveLength(4)
  expect(screen.getByText('AI-ASSISTED PRESENTATION')).toBeInTheDocument()
})
```

The source-label counts include both the original grid and the stage overlay.

- [ ] **Step 2: Update SelectedWork tests before implementation**

In `src/components/SelectedWork.test.jsx`:

```jsx
expect(container.querySelectorAll('.project')).toHaveLength(4)
expect(screen.getByRole('heading', { name: '生活新搭案' })).toBeInTheDocument()
expect(screen.getByRole('heading', { name: '成长日常' })).toBeInTheDocument()
expect(container.querySelectorAll('.project--poster')).toHaveLength(2)
expect(screen.getByText('CURATED PROJECTS / 001—004')).toBeInTheDocument()
```

Keep the existing assertion that exactly three operation-poster images remain under `.project__gallery`.

- [ ] **Step 3: Run the component tests and verify RED**

```bash
pnpm test -- src/components/PosterStory.test.jsx src/components/SelectedWork.test.jsx
```

Expected: FAIL because `PosterStory` and the two project articles do not exist.

- [ ] **Step 4: Implement PosterStory**

Create `src/components/PosterStory.jsx`:

```jsx
function PosterFigure({ poster, inStage = false }) {
  return <figure className={inStage ? 'poster-story__stage-frame' : undefined}>
    <img src={poster.src} alt={poster.alt} loading="lazy" />
    <figcaption><span>{poster.label} / {poster.index}</span><span>ORIGINAL POSTER</span></figcaption>
  </figure>
}

function SanfuLanguage({ language }) {
  return <section className="poster-story__language">
    <div className="poster-story__module-copy">
      <span className="poster-story__label">VISUAL LANGUAGE / 01</span>
      <h3>{language.title}</h3>
      <p>拼图结构连接三种生活状态，黑白物件线稿让高饱和人物成为视觉中心。</p>
    </div>
    <div className="poster-story__swatches">
      {language.colors.map((color) => <div key={color.name}>
        <i style={{ '--poster-color': color.value }} />
        <b>{color.name}</b><span>{color.value}</span>
      </div>)}
    </div>
  </section>
}

function HorshTimeline({ timeline }) {
  return <section className="poster-story__timeline" aria-label="成长时间轴">
    {timeline.map((item) => <article key={item.index}>
      <span>{item.index} / {item.en}</span>
      <i aria-hidden="true" />
      <b>{item.cn}</b>
      <p>{item.description}</p>
    </article>)}
  </section>
}

export default function PosterStory({ project }) {
  return <div className={`poster-story poster-story--${project.theme}`}>
    <section className={`poster-story__originals poster-story__originals--${project.posters.length}`} aria-label={`${project.title}原始海报`}>
      {project.posters.map((poster) => <PosterFigure key={poster.src} poster={poster} />)}
    </section>

    {project.visualLanguage && <SanfuLanguage language={project.visualLanguage} />}
    {project.timeline && <HorshTimeline timeline={project.timeline} />}

    <section className="poster-story__stage" aria-label={`${project.title}AI辅助展示场景`}>
      <img className="poster-story__stage-bg" src={project.presentation} alt="" loading="lazy" />
      <div className={`poster-story__stage-frames poster-story__stage-frames--${project.posters.length}`}>
        {project.posters.map((poster) => <PosterFigure key={poster.src} poster={poster} inStage />)}
      </div>
      <span className="poster-story__stage-source">AI-ASSISTED PRESENTATION</span>
    </section>
  </div>
}
```

- [ ] **Step 5: Dispatch PosterStory from SelectedWork**

Import `PosterStory` and change the article/story selection:

```jsx
<article className={`project${project.theme ? ` project--${project.theme}` : ''}${project.story === 'poster' ? ' project--poster' : ''}`} key={project.id}>

{project.theme === 'dark-editorial'
  ? <PackagingStory project={project} />
  : project.story === 'poster'
    ? <PosterStory project={project} />
    : <StandardStory project={project} />}
```

Change the section-head range to:

```jsx
<span>CURATED PROJECTS / 001—004</span>
```

- [ ] **Step 6: Run target and full tests**

```bash
pnpm test -- src/components/PosterStory.test.jsx src/components/SelectedWork.test.jsx
pnpm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit the component integration**

```bash
git add src/components/PosterStory.jsx src/components/PosterStory.test.jsx \
  src/components/SelectedWork.jsx src/components/SelectedWork.test.jsx
git commit -m "feat: present two independent poster stories"
```

## Task 5: Add aligned poster-project styling

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing CSS contract tests**

Append to `src/styles.test.js`:

```js
test('shares one case-study inset across packaging and poster projects', () => {
  expect(css).toMatch(/\.project\s*{[^}]*--case-inset:\s*clamp\(1\.5rem,\s*3\.2vw,\s*3rem\)/s)
  expect(css).toMatch(/\.project--dark-editorial\s*{[^}]*--pack-inset:\s*var\(--case-inset\)/s)
  expect(css).toMatch(/\.poster-story\s*{[^}]*--poster-inset:\s*var\(--case-inset\)/s)
})

test('keeps original poster artwork uncropped and top-aligned', () => {
  expect(css).toMatch(/\.poster-story__originals\s*{[^}]*align-items:\s*start/s)
  expect(css).toMatch(/\.poster-story__originals img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
})

test('uses three and two aligned poster columns on desktop', () => {
  expect(css).toMatch(/\.poster-story__originals--3[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.poster-story__originals--2[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
})

test('stacks poster projects on narrow screens', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*\.poster-story__originals\s*{[^}]*grid-template-columns:\s*1fr/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*\.poster-story__stage-frames\s*{[^}]*display:\s*none/s)
})

test('stops poster story motion for reduced-motion users', () => {
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.poster-story__timeline i,[^}]*\.poster-story__language::after\s*{[^}]*animation:\s*none/s)
})
```

- [ ] **Step 2: Run the style tests and verify RED**

```bash
pnpm test -- src/styles.test.js
```

Expected: FAIL because the shared case inset and poster classes are absent.

- [ ] **Step 3: Introduce the shared inset without regressing packaging**

Change the existing `.project` rule to include:

```css
.project { --case-inset: clamp(1.5rem, 3.2vw, 3rem); padding-top: clamp(4rem, 7vw, 8rem); }
.project--dark-editorial { --pack-inset: var(--case-inset); }
```

Keep the existing packaging alignment tests green by retaining `--pack-inset` as the alias used by packaging selectors.

- [ ] **Step 4: Add the core aligned poster layout**

```css
.poster-story { --poster-inset: var(--case-inset); }
.poster-story > section { width:100%; margin-inline:0; }
.poster-story__originals { display:grid; gap:.8rem; align-items:start; }
.poster-story__originals--3 { grid-template-columns:repeat(3,1fr); }
.poster-story__originals--2 { grid-template-columns:repeat(2,1fr); }
.poster-story__originals figure { min-width:0; background:#0d0d0d; }
.poster-story__originals img { display:block; width:100%; height:auto; object-fit:contain; }
.poster-story__originals figcaption,.poster-story__stage-frame figcaption { padding:.72rem 0 0; }
```

- [ ] **Step 5: Add the Sanfu visual-language module**

```css
.poster-story__language { position:relative; margin-top:clamp(6rem,10vw,11rem); display:grid; grid-template-columns:.72fr 1.28fr; outline:1px solid var(--line); overflow:hidden; }
.poster-story__module-copy { min-height:24rem; padding:var(--poster-inset); border-right:1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between; }
.poster-story__label { color:var(--acid); font:600 .62rem/1.2 ui-monospace,monospace; letter-spacing:.12em; }
.poster-story__module-copy h3 { margin:1rem 0; font-size:clamp(2.8rem,5vw,6rem); line-height:.88; letter-spacing:-.06em; }
.poster-story__module-copy p { color:var(--muted); line-height:1.8; }
.poster-story__swatches { display:grid; grid-template-columns:repeat(2,1fr); }
.poster-story__swatches div { min-height:12rem; padding:var(--poster-inset); border-right:1px solid var(--line); border-bottom:1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between; }
.poster-story__swatches i { width:3rem; height:3rem; border-radius:50%; background:var(--poster-color); }
.poster-story__language::after { content:""; position:absolute; left:0; bottom:0; width:34%; height:1px; background:#2145ef; animation:poster-line 3.2s ease-in-out infinite alternate; }
```

- [ ] **Step 6: Add the Horsh timeline module**

```css
.poster-story__timeline { margin-top:clamp(6rem,10vw,11rem); display:grid; grid-template-columns:repeat(2,1fr); border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
.poster-story__timeline article { min-height:18rem; padding:var(--poster-inset); border-right:1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between; }
.poster-story__timeline article:last-child { border-right:0; }
.poster-story__timeline span { color:var(--muted); font:.62rem monospace; }
.poster-story__timeline i { width:.65rem; height:.65rem; border-radius:50%; background:#164f91; box-shadow:0 0 1.2rem rgba(22,79,145,.7); animation:poster-node 2.8s ease-in-out infinite; }
.poster-story__timeline b { font-size:clamp(2rem,4vw,4.5rem); letter-spacing:-.05em; }
.poster-story__timeline p { max-width:27rem; color:var(--muted); line-height:1.7; }
```

- [ ] **Step 7: Add the shared AI stage with original overlays**

```css
.poster-story__stage { position:relative; min-height:clamp(36rem,56vw,62rem); margin-top:clamp(6rem,10vw,11rem); overflow:hidden; background:#0d0d0d; }
.poster-story__stage-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.poster-story__stage-frames { position:absolute; z-index:1; inset:8% var(--poster-inset) 10%; display:grid; gap:clamp(.6rem,1.4vw,1.4rem); align-items:start; }
.poster-story__stage-frames--3 { grid-template-columns:repeat(3,1fr); }
.poster-story__stage-frames--2 { grid-template-columns:repeat(2,1fr); padding-inline:8%; }
.poster-story__stage-frame { min-width:0; padding:.45rem; background:#090909; box-shadow:0 1.5rem 4rem rgba(0,0,0,.5); }
.poster-story__stage-frame img { display:block; width:100%; height:auto; object-fit:contain; }
.poster-story__stage-source { position:absolute; z-index:2; right:var(--poster-inset); bottom:var(--poster-inset); color:var(--acid); font:.59rem monospace; }
@keyframes poster-line { to { width:100%; } }
@keyframes poster-node { 50% { opacity:.35; transform:scale(.72); } }
```

- [ ] **Step 8: Add 960px, 720px and reduced-motion rules**

```css
@media (max-width:960px) {
  .poster-story__language { grid-template-columns:1fr; }
  .poster-story__module-copy { border-right:0; border-bottom:1px solid var(--line); }
}

@media (max-width:720px) {
  .poster-story__originals { grid-template-columns:1fr; }
  .poster-story__stage { min-height:28rem; }
  .poster-story__stage-frames { display:none; }
  .poster-story__timeline { grid-template-columns:1fr; }
  .poster-story__timeline article:first-child { border-right:0; border-bottom:1px solid var(--line); }
  .poster-story__swatches { grid-template-columns:1fr; }
}

@media (prefers-reduced-motion:reduce) {
  .poster-story__timeline i,.poster-story__language::after { animation:none; }
}
```

The mobile stage intentionally hides the duplicated overlay frames because the same original posters already appear immediately above in a full, uncropped single column. The generated background and its AI source label remain visible.

- [ ] **Step 9: Run style, full tests, and build**

```bash
pnpm test -- src/styles.test.js
pnpm test
pnpm build
git diff --check
```

Expected: all commands pass.

- [ ] **Step 10: Commit the aligned poster styling**

```bash
git add src/styles.css src/styles.test.js
git commit -m "style: add aligned poster case studies"
```

## Task 6: Verify the complete four-project portfolio

**Files:**
- Verify all files changed by Tasks 1–5.

- [ ] **Step 1: Run automated verification**

```bash
pnpm test
pnpm build
git diff --check
```

Expected: every test passes, the production build succeeds, and no whitespace error is reported.

- [ ] **Step 2: Scan runtime content and privacy**

```bash
rg -n '\b1[3-9][0-9]{9}\b|design-board|COMPLETE DESIGN BOARD|完整展板' src public/images/poster-projects || true
```

Expected: no private phone number and no restored packaging board references.

- [ ] **Step 3: Verify all poster assets in the running page**

Evaluate:

```js
({
  projects: document.querySelectorAll('#work .project').length,
  posterProjects: document.querySelectorAll('#work .project--poster').length,
  originalPosterLabels: [...document.querySelectorAll('.poster-story figcaption span:last-child')].filter((node) => node.textContent === 'ORIGINAL POSTER').length,
  aiLabels: [...document.querySelectorAll('.poster-story__stage-source')].map((node) => node.textContent),
  brokenImages: [...document.querySelectorAll('.poster-story img')].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
  overflow: document.documentElement.scrollWidth > innerWidth,
})
```

Expected: `projects: 4`, `posterProjects: 2`, `originalPosterLabels: 10`, two AI labels, no broken images, and no overflow.

- [ ] **Step 4: Perform visual QA**

Check:

```text
1920×1080: shell remains about 1700px; all project modules share the same left/right baseline.
1440×1000: Sanfu triptych and Horsh diptych are readable and top-aligned.
960px: project text and visual-language modules do not overflow.
720×900: original grids stack to one column; duplicated stage overlays are hidden; posters remain uncropped and the AI background remains visible.
```

- [ ] **Step 5: Verify source honesty and reduced motion**

Confirm original poster art is unchanged in both the direct grid and AI-stage overlays. Emulate reduced motion and confirm the Sanfu line and Horsh timeline nodes stay static.

- [ ] **Step 6: Inspect console output**

Expected: no missing-asset, React-key, invalid-DOM or CSS errors.

- [ ] **Step 7: Commit only tested QA fixes**

If visual QA reveals a defect, first reproduce it with a failing automated contract, implement the smallest fix, rerun Steps 1–6, and commit:

```bash
git add <tested-files>
git commit -m "fix: polish aligned poster stories"
```

Do not create an empty commit when no correction is required.
