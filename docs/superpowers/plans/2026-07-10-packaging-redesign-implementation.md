# Packaging Dark Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the warm, board-like packaging case study with a six-part dark editorial narrative that uses the new source files, removes the full design board, and integrates image-2 presentation assets.

**Architecture:** Keep `SelectedWork` as the project dispatcher and rebuild `PackagingStory` around six semantic sections driven by structured packaging data. Store original and generated media under a new `public/images/packaging-redesign/` directory, use source labels to distinguish original work from AI-assisted presentation, and replace the warm CSS subsystem with dark site-native rules.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, CSS Grid, built-in image generation tool.

---

## File Structure

- Create `public/images/packaging-redesign/hero-dark.png`: image-2 dark studio presentation Hero.
- Create `public/images/packaging-redesign/material-study.png`: image-2 material macro transition.
- Create `public/images/packaging-redesign/season-installation.png`: image-2 seasonal element installation.
- Create `public/images/packaging-redesign/terrain-outro.png`: image-2 abstract rice-terrain conclusion.
- Create `public/images/packaging-redesign/scene-portrait.png`: optimized copy of the new portrait application mockup.
- Create `public/images/packaging-redesign/scene-landscape.png`: optimized copy of the new landscape application mockup.
- Create `public/images/packaging-redesign/bag-original.jpg`: optimized copy of the original bag mockup.
- Create `public/images/packaging-redesign/brick-original.jpg`: optimized copy of the original rice-brick mockup.
- Create `public/images/packaging-redesign/season-spring.jpg`, `season-summer.jpg`, `season-autumn.jpg`, `season-winter.jpg`: optimized seasonal element sources.
- Create `public/images/packaging-redesign/dieline-bag.jpg`, `dieline-band.jpg`: optimized structural evidence images.
- Modify `src/data/projects.js`: replace the old flat packaging gallery with grouped Hero, element, application, dieline, and AI-presentation data.
- Modify `src/data/content.test.js`: assert the board is absent and the new packaging groups are complete.
- Modify `src/components/PackagingStory.jsx`: render the six dark editorial sections.
- Modify `src/components/PackagingStory.test.jsx`: verify section semantics, source labels, seasons, and absence of the board.
- Modify `src/components/SelectedWork.jsx`: dispatch the new `dark-editorial` packaging theme.
- Modify `src/components/SelectedWork.test.jsx`: replace the obsolete warm-theme assertion.
- Modify `src/styles.css`: remove the warm chapter rules and add the dark packaging subsystem.
- Modify `src/styles.test.js`: lock dark backgrounds, responsive grids, and reduced-motion behavior.

## Task 1: Generate the image-2 presentation system

**Files:**
- Create: `public/images/packaging-redesign/hero-dark.png`
- Create: `public/images/packaging-redesign/material-study.png`
- Create: `public/images/packaging-redesign/season-installation.png`
- Create: `public/images/packaging-redesign/terrain-outro.png`

- [ ] **Step 1: Inspect every generation reference**

Use `view_image` on:

```text
/Users/luoen/Desktop/包装 (2)/b28c9ea9-d9c3-42d7-951f-657ac40b9086.png
/Users/luoen/Desktop/包装 (2)/28ed8db7-b28f-466e-8235-57a89f19a024.png
/Users/luoen/Desktop/包装 (2)/1.jpg
/Users/luoen/Desktop/包装 (2)/3.jpg
/Users/luoen/Desktop/包装 (2)/4.jpg
/Users/luoen/Desktop/包装 (2)/6.jpg
```

Expected: confirm the package proportions, brown/cream identity, handwritten brand lockup, four seasonal farming silhouettes, rice ears, and terrace shapes.

- [ ] **Step 2: Generate the dark studio Hero**

Use the built-in image generation tool with the two package mockups as reference images and this prompt:

```text
Use case: product-mockup
Asset type: full-width portfolio case-study Hero
Primary request: Re-stage the supplied Lan Mu Xiang rice packaging as a premium dark editorial product photograph.
Input images: Image 1 and Image 2 are packaging identity and proportion references; preserve the package front, cream-and-earth-brown palette, handwritten Chinese brand lockup, illustration placement, and rectangular carton proportions.
Scene/backdrop: graphite-black studio, matte mineral plinth, deep negative space.
Composition/framing: 16:9 landscape, two packages slightly offset, product centered-right with usable negative space on the left.
Lighting/mood: low-key museum lighting, warm grazing light on paper texture, one extremely restrained acid-green rim light.
Constraints: do not redesign the packaging; do not add or rewrite text; do not add logos, badges, people, props, watermarks, or decorative grain stalks that cover the package.
Avoid: bright beige room, generic luxury cosmetics look, neon city, science-fiction UI, illegible replacement typography.
```

Expected: one high-quality landscape result with truthful package geometry and no invented copy.

- [ ] **Step 3: Generate the material macro study**

Use the built-in image generation tool with this prompt:

```text
Use case: product-mockup
Asset type: portfolio transition image
Primary request: Create a dark editorial macro still life inspired by rice packaging materials.
Scene/backdrop: matte graphite table with black negative space.
Subject: loose white rice grains, fibrous cream paper, an earth-brown ink swatch, a precise package fold, and a subtle embossed line.
Composition/framing: 3:2 landscape, asymmetrical crop, generous dark area.
Lighting/mood: directional museum light, shallow depth of field, restrained film grain.
Color palette: graphite black, rice-paper cream, earth brown, one tiny acid-green reflected highlight.
Constraints: no readable words, no logo, no complete package, no hands, no watermark.
```

Expected: a material-focused image that can sit between original application images without impersonating a packaging design deliverable.

- [ ] **Step 4: Generate the seasonal element installation**

Use the built-in image generation tool with `1.jpg`, `3.jpg`, `4.jpg`, and `6.jpg` as references and this prompt:

```text
Use case: stylized-concept
Asset type: portfolio identity-system visualization
Primary request: Recompose the supplied flat farming silhouettes and rice-ear motifs as a restrained digital archive installation.
Input images: Images 1–4 define the single-color silhouette language for spring seeding, summer growth, autumn harvest, and winter storage.
Scene/backdrop: black gallery space with four transparent smoked-acrylic panels in one horizontal sequence.
Style/medium: graphic installation photography; flat brown and warm-gray silhouettes, fine technical lines, no realism in the figures.
Composition/framing: 3:2 landscape, four panels readable as one system.
Lighting/mood: low-key, quiet, precise, faint acid-green index lights under the panels.
Constraints: preserve the supplied silhouette character; no faces, no new ethnic costume details, no text, no logos, no watermark.
Avoid: cyberpunk, hologram spectacle, blue neon, photoreal people.
```

Expected: the four seasonal ideas read as a system and still resemble the supplied graphic language.

- [ ] **Step 5: Generate the abstract terrain outro**

Use the built-in image generation tool with this prompt:

```text
Use case: stylized-concept
Asset type: portfolio case-study outro background
Primary request: Build an abstract visual system connecting terraced fields, rice grains, and packaging structure.
Scene/backdrop: deep black spatial field.
Subject: fine topographic terrace contours, sparse rice-grain trajectories, a quiet structural grid, and four acid-green index nodes.
Style/medium: high-end editorial data sculpture, tactile rather than screen-like.
Composition/framing: 16:9 landscape, visual density concentrated on the right, negative space on the left for typography.
Color palette: black, graphite, warm earth brown, rice-paper white, acid green only for four nodes.
Constraints: no text, no logo, no package, no people, no watermark.
Avoid: spaceship interface, neon city, glowing globe, generic AI light trails.
```

Expected: a dark conclusion image that supports the phrase “From land to package.”

- [ ] **Step 6: Inspect and select the four results**

Open each result with `view_image` and validate:

```text
Hero: package proportions and front graphics remain credible.
Material study: no accidental readable text or logo.
Season installation: four panels and supplied silhouette character are visible.
Terrain outro: exactly four acid-green nodes and no generic science-fiction motifs.
```

If one result fails, make one targeted follow-up generation changing only the failed property.

- [ ] **Step 7: Copy selected results into the project**

Copy the selected built-in outputs from `$CODEX_HOME/generated_images/` into the four paths listed above. Do not overwrite the existing `public/images/packaging/` assets.

- [ ] **Step 8: Commit the generated presentation assets**

```bash
git add public/images/packaging-redesign/hero-dark.png \
  public/images/packaging-redesign/material-study.png \
  public/images/packaging-redesign/season-installation.png \
  public/images/packaging-redesign/terrain-outro.png
git commit -m "feat: add dark packaging presentation assets"
```

## Task 2: Prepare the selected original source media

**Files:**
- Create: `public/images/packaging-redesign/scene-portrait.png`
- Create: `public/images/packaging-redesign/scene-landscape.png`
- Create: `public/images/packaging-redesign/bag-original.jpg`
- Create: `public/images/packaging-redesign/brick-original.jpg`
- Create: `public/images/packaging-redesign/season-spring.jpg`
- Create: `public/images/packaging-redesign/season-summer.jpg`
- Create: `public/images/packaging-redesign/season-autumn.jpg`
- Create: `public/images/packaging-redesign/season-winter.jpg`
- Create: `public/images/packaging-redesign/dieline-bag.jpg`
- Create: `public/images/packaging-redesign/dieline-band.jpg`

- [ ] **Step 1: Create the destination directory**

```bash
mkdir -p public/images/packaging-redesign
```

- [ ] **Step 2: Copy the selected originals with stable names**

```bash
cp '/Users/luoen/Desktop/包装 (2)/28ed8db7-b28f-466e-8235-57a89f19a024.png' public/images/packaging-redesign/scene-portrait.png
cp '/Users/luoen/Desktop/包装 (2)/b28c9ea9-d9c3-42d7-951f-657ac40b9086.png' public/images/packaging-redesign/scene-landscape.png
cp '/Users/luoen/Desktop/包装 (2)/大米袋装样机最终版.jpg' public/images/packaging-redesign/bag-original.jpg
cp '/Users/luoen/Desktop/包装 (2)/米砖样机终稿.jpg' public/images/packaging-redesign/brick-original.jpg
cp '/Users/luoen/Desktop/包装 (2)/1.jpg' public/images/packaging-redesign/season-spring.jpg
cp '/Users/luoen/Desktop/包装 (2)/3.jpg' public/images/packaging-redesign/season-summer.jpg
cp '/Users/luoen/Desktop/包装 (2)/4.jpg' public/images/packaging-redesign/season-autumn.jpg
cp '/Users/luoen/Desktop/包装 (2)/6.jpg' public/images/packaging-redesign/season-winter.jpg
cp '/Users/luoen/Desktop/包装 (2)/袋装刀版图.jpg' public/images/packaging-redesign/dieline-bag.jpg
cp '/Users/luoen/Desktop/包装 (2)/腰封包装刀版图.jpg' public/images/packaging-redesign/dieline-band.jpg
```

- [ ] **Step 3: Optimize oversized JPEGs without changing composition**

Use `sips` to constrain the long edge of the bag, brick, seasonal, and dieline JPEGs to 2600px while keeping the PNG scene mockups at their source dimensions:

```bash
for image in public/images/packaging-redesign/*.jpg; do
  sips --resampleHeightWidthMax 2600 "$image" >/dev/null
done
```

Expected: each JPEG remains visually sharp for the 1700px shell and no image exceeds the source dimensions.

- [ ] **Step 4: Verify the copied media**

```bash
find public/images/packaging-redesign -maxdepth 1 -type f -print | sort
sips -g pixelWidth -g pixelHeight public/images/packaging-redesign/*
```

Expected: all fourteen generated/original assets exist, have non-zero dimensions, and preserve their intended portrait or landscape orientation.

- [ ] **Step 5: Commit the selected original media**

```bash
git add public/images/packaging-redesign
git commit -m "feat: curate packaging redesign source media"
```

## Task 3: Replace the packaging data model

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] **Step 1: Write the failing data tests**

Replace the packaging assertions in `src/data/content.test.js` with:

```js
test('structures the packaging project as a dark editorial case study', () => {
  const packaging = projects.find((project) => project.id === 'lanmu-rice')
  expect(packaging).toBeDefined()
  expect(packaging).not.toHaveProperty('year')
  expect(packaging.theme).toBe('dark-editorial')
  expect(packaging.elements).toHaveLength(4)
  expect(packaging.applications).toHaveLength(4)
  expect(packaging.dielines).toHaveLength(2)
  expect(Object.keys(packaging.aiPresentation)).toEqual(['hero', 'materials', 'installation', 'outro'])
})

test('never includes the complete packaging board', () => {
  const packagingText = JSON.stringify(projects.find((project) => project.id === 'lanmu-rice'))
  expect(packagingText).not.toMatch(/design-board|complete design board|board/i)
})
```

- [ ] **Step 2: Run the data tests and verify RED**

```bash
pnpm test -- src/data/content.test.js
```

Expected: FAIL because the current project uses `theme: 'warm'`, a flat `gallery`, and a `board` role.

- [ ] **Step 3: Replace the packaging project object**

Update the `lanmu-rice` object in `src/data/projects.js` to this structure:

```js
{
  id: 'lanmu-rice',
  index: '002',
  title: '包装设计',
  englishTitle: 'Lan Mu Xiang Rice Packaging System',
  category: 'Packaging Design',
  scope: 'Brand Visual / Dieline / AI Presentation',
  theme: 'dark-editorial',
  description: '面向东兰县兰木乡特色富硒米建立的包装系统。设计从地域农耕文化与水稻生长过程提取视觉线索，将人物、稻穗与梯田组织成从春种到冬藏的品牌叙事，并延展至袋装、米砖腰封与礼盒结构。',
  elements: [
    { index: '01', cn: '春种', en: 'SPRING / SEEDING', src: '/images/packaging-redesign/season-spring.jpg', alt: '春种农耕人物剪影元素' },
    { index: '02', cn: '夏长', en: 'SUMMER / GROWTH', src: '/images/packaging-redesign/season-summer.jpg', alt: '夏长稻穗生长剪影元素' },
    { index: '03', cn: '秋收', en: 'AUTUMN / HARVEST', src: '/images/packaging-redesign/season-autumn.jpg', alt: '秋收人物剪影元素' },
    { index: '04', cn: '冬藏', en: 'WINTER / STORAGE', src: '/images/packaging-redesign/season-winter.jpg', alt: '冬藏稻米储存剪影元素' },
  ],
  applications: [
    { src: '/images/packaging-redesign/scene-portrait.png', alt: '兰木乡富硒米包装纵向场景样机', source: 'ORIGINAL MOCKUP' },
    { src: '/images/packaging-redesign/scene-landscape.png', alt: '兰木乡富硒米包装梯田场景样机', source: 'ORIGINAL MOCKUP' },
    { src: '/images/packaging-redesign/bag-original.jpg', alt: '兰木乡富硒米袋装包装样机', source: 'ORIGINAL MOCKUP' },
    { src: '/images/packaging-redesign/brick-original.jpg', alt: '兰木乡富硒米米砖腰封包装样机', source: 'ORIGINAL MOCKUP' },
  ],
  dielines: [
    { src: '/images/packaging-redesign/dieline-bag.jpg', alt: '袋装包装前后版与侧面结构', label: 'DIELINE / BAG' },
    { src: '/images/packaging-redesign/dieline-band.jpg', alt: '四季米砖腰封系列结构', label: 'DIELINE / BAND' },
  ],
  aiPresentation: {
    hero: '/images/packaging-redesign/hero-dark.png',
    materials: '/images/packaging-redesign/material-study.png',
    installation: '/images/packaging-redesign/season-installation.png',
    outro: '/images/packaging-redesign/terrain-outro.png',
  },
}
```

- [ ] **Step 4: Run the data tests and verify GREEN**

```bash
pnpm test -- src/data/content.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit the data model**

```bash
git add src/data/projects.js src/data/content.test.js
git commit -m "feat: model dark packaging case study"
```

## Task 4: Rebuild the packaging story component

**Files:**
- Modify: `src/components/PackagingStory.test.jsx`
- Modify: `src/components/PackagingStory.jsx`

- [ ] **Step 1: Write the failing component tests**

Replace `src/components/PackagingStory.test.jsx` with:

```jsx
import { render, screen } from '@testing-library/react'
import PackagingStory from './PackagingStory'
import { projects } from '../data/projects'

test('renders the packaging case study as six editorial sections', () => {
  const { container } = render(<PackagingStory project={projects[1]} />)
  for (const section of ['packaging-hero', 'element-lab', 'season-track', 'application-grid', 'structure-evidence', 'packaging-outro']) {
    expect(container.querySelector(`.${section}`)).toBeInTheDocument()
  }
})

test('labels original work and AI-assisted presentation honestly', () => {
  render(<PackagingStory project={projects[1]} />)
  expect(screen.getAllByText('ORIGINAL MOCKUP')).toHaveLength(4)
  expect(screen.getAllByText('AI-ASSISTED PRESENTATION').length).toBeGreaterThanOrEqual(2)
})

test('keeps the four seasons but removes the complete board', () => {
  render(<PackagingStory project={projects[1]} />)
  for (const season of ['春种', '夏长', '秋收', '冬藏']) {
    expect(screen.getByText(season)).toBeInTheDocument()
  }
  expect(screen.queryByText(/完整展板|COMPLETE DESIGN BOARD/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the component tests and verify RED**

```bash
pnpm test -- src/components/PackagingStory.test.jsx
```

Expected: FAIL because the six sections and honest source labels do not exist.

- [ ] **Step 3: Implement the six-section component**

Replace `src/components/PackagingStory.jsx` with a component that renders:

```jsx
const MediaCaption = ({ label, source }) => (
  <figcaption><span>{label}</span><span>{source}</span></figcaption>
)

export default function PackagingStory({ project }) {
  return <>
    <section className="packaging-hero" aria-label="包装设计暗色展示主视觉">
      <img src={project.aiPresentation.hero} alt="兰木乡富硒米包装暗色展示场景" loading="lazy" />
      <div className="packaging-hero__caption">
        <span>LAN MU XIANG / PACKAGING SYSTEM</span>
        <b>AI-ASSISTED PRESENTATION</b>
      </div>
    </section>

    <section className="element-lab">
      <div className="element-lab__copy">
        <span className="packaging-label">ELEMENT LABORATORY / 01</span>
        <h3>把地域文化<br />拆成识别语言</h3>
        <p>{project.description}</p>
      </div>
      <figure className="element-lab__installation">
        <img src={project.aiPresentation.installation} alt="四季农耕图形数字档案装置" loading="lazy" />
        <MediaCaption label="FOUR SEASONS / INSTALLATION" source="AI-ASSISTED PRESENTATION" />
      </figure>
    </section>

    <section className="season-track" aria-label="农耕四季叙事">
      {project.elements.map((element) => <article key={element.index}>
        <span>{element.index} / {element.en}</span>
        <i aria-hidden="true" />
        <b>{element.cn}</b>
      </article>)}
    </section>

    <section className="application-grid">
      {project.applications.map((image, index) => <figure key={image.src} className={`application-grid__item application-grid__item--${index + 1}`}>
        <img src={image.src} alt={image.alt} loading="lazy" />
        <MediaCaption label={`APPLICATION / 0${index + 1}`} source={image.source} />
      </figure>)}
      <figure className="application-grid__materials">
        <img src={project.aiPresentation.materials} alt="米粒、纸张与棕色油墨材质研究" loading="lazy" />
        <MediaCaption label="MATERIAL STUDY" source="AI-ASSISTED PRESENTATION" />
      </figure>
    </section>

    <section className="structure-evidence">
      <div className="structure-evidence__copy">
        <span className="packaging-label">STRUCTURE EVIDENCE / 02</span>
        <h3>从平面视觉<br />进入包装结构</h3>
      </div>
      <div className="structure-evidence__grid">
        {project.dielines.map((image) => <figure key={image.src}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          <MediaCaption label={image.label} source="ORIGINAL ARTWORK / DETAIL" />
        </figure>)}
      </div>
    </section>

    <section className="packaging-outro">
      <img src={project.aiPresentation.outro} alt="" loading="lazy" />
      <div><span className="packaging-label">VISUAL CONCLUSION / 03</span><h3>From land<br />to package.</h3><p>地域、四季与包装结构，共同构成一套可延展的品牌视觉语言。</p></div>
      <span className="packaging-outro__source">AI-ASSISTED PRESENTATION</span>
    </section>
  </>
}
```

- [ ] **Step 4: Run the component tests and verify GREEN**

```bash
pnpm test -- src/components/PackagingStory.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Run all tests**

```bash
pnpm test
```

Expected: all tests pass; update any old image-count assertion in `SelectedWork.test.jsx` to assert the new group structure rather than the removed flat gallery.

- [ ] **Step 6: Commit the component rewrite**

```bash
git add src/components/PackagingStory.jsx src/components/PackagingStory.test.jsx src/components/SelectedWork.test.jsx
git commit -m "feat: rebuild packaging editorial narrative"
```

## Task 5: Replace the warm CSS with the dark packaging system

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`

- [ ] **Step 1: Write failing CSS contract tests**

Append to `src/styles.test.js`:

```js
test('keeps the packaging case study in the site dark system', () => {
  expect(css).not.toMatch(/\.project--warm\s*{/)
  expect(css).not.toMatch(/\.design-board\s*{/)
  expect(css).toMatch(/\.packaging-hero\s*{[^}]*background:\s*#0d0d0d/s)
  expect(css).toMatch(/\.element-lab\s*{[^}]*border[^;]*var\(--line\)/s)
})

test('adapts packaging grids and season nodes for narrow screens', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*\.season-track\s*{[^}]*grid-template-columns:\s*1fr 1fr/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*\.application-grid\s*{[^}]*grid-template-columns:\s*1fr/s)
})

test('disables packaging motion for reduced-motion users', () => {
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.season-track i[^}]*animation:\s*none/s)
})
```

- [ ] **Step 2: Run the CSS tests and verify RED**

```bash
pnpm test -- src/styles.test.js
```

Expected: FAIL because the warm CSS still exists and the dark section classes are absent.

- [ ] **Step 3: Delete the old warm packaging rules**

Remove rules for:

```text
.project--warm
.packaging-cover
.packaging-brick
.brand-story
.brand-story__copy
.palette
.seasons
.dieline-grid
.band-dieline
.design-board
```

Also remove their narrow-screen overrides.

- [ ] **Step 4: Add the dark packaging rules**

Implement these layout contracts in `src/styles.css`:

```css
.project--dark-editorial { --pack-brown:#9b6c43; --pack-cream:#fdf7e5; --pack-gold:#edc568; margin-top:clamp(9rem,15vw,16rem); }
.packaging-hero { position:relative; min-height:clamp(34rem,62vw,68rem); margin-top:3rem; overflow:hidden; background:#0d0d0d; }
.packaging-hero img { width:100%; height:100%; position:absolute; inset:0; object-fit:cover; }
.packaging-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg,transparent 44%,rgba(0,0,0,.82)); }
.packaging-hero__caption { position:absolute; z-index:1; left:1.5rem; right:1.5rem; bottom:1.4rem; display:flex; justify-content:space-between; color:var(--paper); font:.62rem monospace; letter-spacing:.1em; }
.packaging-hero__caption b { color:var(--acid); }
.element-lab { display:grid; grid-template-columns:.72fr 1.28fr; margin-top:.8rem; border:1px solid var(--line); }
.element-lab__copy { min-height:34rem; padding:clamp(2rem,4vw,4rem); border-right:1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between; }
.element-lab h3,.structure-evidence h3,.packaging-outro h3 { margin:1rem 0; font-size:clamp(3rem,6vw,7rem); line-height:.86; letter-spacing:-.065em; }
.element-lab p,.packaging-outro p { color:var(--muted); line-height:1.8; }
.element-lab__installation img { width:100%; height:100%; min-height:34rem; object-fit:cover; }
.season-track { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--line); }
.season-track article { min-height:12rem; padding:1.2rem; border-right:1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between; }
.season-track article:last-child { border-right:0; }
.season-track span { color:var(--label-muted); font:.62rem monospace; }
.season-track i { width:.65rem; height:.65rem; border-radius:50%; background:var(--acid); box-shadow:0 0 1.8rem rgba(216,255,54,.5); animation:season-pulse 2.8s ease-in-out infinite; }
.season-track b { font-size:clamp(1.5rem,2.4vw,2.4rem); }
.application-grid { display:grid; grid-template-columns:1.35fr .65fr; gap:.8rem; margin-top:clamp(6rem,10vw,10rem); align-items:start; }
.application-grid__item--1 { grid-row:span 2; }
.application-grid__item--4,.application-grid__materials { grid-column:1 / -1; }
.application-grid img { width:100%; object-fit:cover; }
.application-grid__item--1 img { aspect-ratio:1/1.22; }
.application-grid__item--2 img,.application-grid__item--3 img { aspect-ratio:1; }
.application-grid__item--4 img,.application-grid__materials img { aspect-ratio:16/9; }
.structure-evidence { margin-top:clamp(8rem,12vw,14rem); padding:clamp(2rem,4vw,4rem); border:1px solid var(--line); }
.structure-evidence__grid { display:grid; grid-template-columns:1fr 1fr; gap:.8rem; margin-top:3rem; }
.structure-evidence__grid figure { background:#101010; }
.structure-evidence__grid img { width:100%; aspect-ratio:1.35; object-fit:cover; object-position:center; filter:saturate(.45) brightness(.72); }
.packaging-outro { position:relative; min-height:clamp(36rem,62vw,68rem); margin-top:clamp(8rem,12vw,14rem); overflow:hidden; background:#0d0d0d; display:flex; align-items:flex-end; }
.packaging-outro > img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.packaging-outro::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.08)); }
.packaging-outro > div { position:relative; z-index:1; max-width:44rem; padding:clamp(2rem,5vw,6rem); }
.packaging-outro__source { position:absolute; z-index:1; right:1.5rem; bottom:1.5rem; color:var(--acid); font:.6rem monospace; }
@keyframes season-pulse { 50% { opacity:.36; transform:scale(.72); } }
```

- [ ] **Step 5: Add the 960px and 720px adaptations**

```css
@media (max-width:960px) {
  .element-lab { grid-template-columns:1fr; }
  .element-lab__copy { border-right:0; border-bottom:1px solid var(--line); }
}

@media (max-width:720px) {
  .packaging-hero { min-height:26rem; }
  .packaging-hero__caption { align-items:flex-start; flex-direction:column; gap:.5rem; }
  .season-track { grid-template-columns:1fr 1fr; }
  .season-track article:nth-child(2) { border-right:0; }
  .season-track article:nth-child(-n+2) { border-bottom:1px solid var(--line); }
  .application-grid,.structure-evidence__grid { grid-template-columns:1fr; }
  .application-grid__item--1 { grid-row:auto; }
  .application-grid__item--4,.application-grid__materials { grid-column:auto; }
}

@media (prefers-reduced-motion:reduce) {
  .season-track i { animation:none; }
}
```

- [ ] **Step 6: Update the packaging theme class dispatcher**

In `src/components/SelectedWork.jsx`, make the article class and story dispatch follow the data theme:

```jsx
<article className={`project project--${project.theme ?? 'default'}`} key={project.id}>

{project.theme === 'dark-editorial'
  ? <PackagingStory project={project} />
  : <StandardStory project={project} />}
```

In `src/components/SelectedWork.test.jsx`, replace the obsolete warm assertion:

```jsx
expect(container.querySelector('.project--dark-editorial')).toBeInTheDocument()
expect(container.querySelector('.project--warm')).not.toBeInTheDocument()
```

- [ ] **Step 7: Run the CSS and full test suites**

```bash
pnpm test -- src/styles.test.js
pnpm test
```

Expected: all tests pass.

- [ ] **Step 8: Commit the dark packaging layout**

```bash
git add src/styles.css src/styles.test.js src/components/SelectedWork.jsx src/components/SelectedWork.test.jsx
git commit -m "style: integrate packaging into dark editorial system"
```

## Task 6: Verify the finished redesign

**Files:**
- Verify: all files changed by Tasks 1–5

- [ ] **Step 1: Run automated verification**

```bash
pnpm test
pnpm build
git diff --check
```

Expected: all tests pass, production build succeeds, and `git diff --check` reports no whitespace errors.

- [ ] **Step 2: Verify the full board is absent from source and runtime data**

```bash
rg -n 'design-board|COMPLETE DESIGN BOARD|完整展板|project--warm|brand-story' src public/images/packaging-redesign || true
```

Expected: no output.

- [ ] **Step 3: Verify asset loading in the browser**

Open the local Vite page, navigate to `#work`, and confirm with browser evaluation:

```js
({
  packagingSections: [...document.querySelectorAll('#work .project--dark-editorial section')].map((section) => section.className),
  brokenImages: [...document.querySelectorAll('.project--dark-editorial img')].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
  hasBoard: document.body.innerText.includes('完整展板') || document.body.innerText.includes('COMPLETE DESIGN BOARD'),
  documentWidth: document.documentElement.scrollWidth,
  viewportWidth: innerWidth,
})
```

Expected: six named sections, `brokenImages: []`, `hasBoard: false`, and equal document/viewport widths.

- [ ] **Step 4: Perform visual QA at three widths**

Check:

```text
1920×1080: shell remains about 1700px; dark Hero and outro fill the section; no warm page panel.
1440×1000: application grid hierarchy remains clear; captions are readable.
720×900: seasons are 2×2; application and structure grids are one column; no horizontal overflow.
```

Expected: the packaging chapter feels continuous with the rest of the portfolio and no image is clipped unintentionally.

- [ ] **Step 5: Check reduced motion**

Emulate `prefers-reduced-motion: reduce` and verify the seasonal nodes do not pulse and no newly added scroll motion runs.

- [ ] **Step 6: Inspect the browser console**

Expected: no errors or warnings caused by missing assets, invalid JSX, or CSS.

- [ ] **Step 7: Commit any verification-only corrections**

If browser QA reveals a defect, reproduce it with a failing test, implement the minimal fix, rerun Steps 1–6, and commit:

```bash
git add <tested-files>
git commit -m "fix: polish dark packaging presentation"
```

If no correction is needed, do not create an empty commit.
