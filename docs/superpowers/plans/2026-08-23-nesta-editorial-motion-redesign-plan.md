# NESTA Editorial Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild project 007 as a progressive, recruiter-first NESTA case study that turns 48 source boards into a six-act editorial narrative with accessible GSAP motion.

**Architecture:** Keep the existing `ProjectDetail` shell and NESTA project record, but replace the monolithic story with focused NESTA section components driven by a new `caseStudy` data shape. A deterministic Python asset manifest converts the 48 source files into semantic JPG and responsive WebP assets. One scoped motion hook owns all NESTA GSAP timelines and uses `gsap.matchMedia()` for desktop, mobile, and reduced-motion cleanup.

**Tech Stack:** React, Vite, Vitest, Testing Library, GSAP, `@gsap/react`, ScrollTrigger, Python, Pillow.

---

## Implementation prerequisites

Before Task 5, read and apply these skills in order:

1. `gsap-react` for `useGSAP`, scoped selectors, `contextSafe`, and React cleanup.
2. `gsap-timeline` for labeled entrance and section timelines.
3. `gsap-scrolltrigger` for sticky/scrubbed sections, horizontal evidence movement, and refresh behavior.
4. `gsap-performance` for transform-only motion, batching, `will-change`, and avoiding layout thrash.
5. `gsap-core` for `matchMedia`, easing, defaults, and reduced-motion conditions.

The project directory is not a Git repository. Do not initialize Git implicitly. Each task ends with a verification checkpoint instead of a commit.

## File structure

- Modify `scripts/prepare_nesta_assets.py`: deterministic 48-file source manifest and responsive conversion.
- Create `tests/test_prepare_nesta_assets.py`: manifest, output naming, and conversion regression tests.
- Modify `src/data/projects.js`: replace the current NESTA fragments with the six-act `caseStudy` model.
- Modify `src/data/content.test.js`: verify all 48 unique semantic assets and the new story groups.
- Create `src/components/nesta/NestaMedia.jsx`: shared responsive figure and media-grid primitives.
- Create `src/components/nesta/NestaSections.jsx`: six presentational case-study sections.
- Create `src/components/nesta/useNestaMotion.js`: the only NESTA GSAP registration and cleanup owner.
- Modify `src/components/NestaStory.jsx`: small orchestrator that composes sections and invokes motion.
- Modify `src/components/NestaStory.test.jsx`: semantic structure, progressive evidence, media, and accessibility tests.
- Modify `src/styles.css`: scoped NESTA editorial layouts, chapter colors, responsive and reduced-motion rules.
- Modify `src/styles.test.js`: NESTA layout, aspect-ratio, mobile, and reduced-motion regression tests.

### Task 1: Replace the stale asset pipeline with the 48-file source manifest

**Files:**
- Modify: `scripts/prepare_nesta_assets.py`
- Create: `tests/test_prepare_nesta_assets.py`

- [ ] **Step 1: Write the failing manifest test**

```python
from pathlib import Path

from scripts.prepare_nesta_assets import ASSETS, output_names, prepare_assets


def test_nesta_manifest_covers_every_current_source_file():
    source = Path(r"C:/Users/86135/Desktop/作品")
    assert len(ASSETS) == 48
    assert set(ASSETS) == {path.name for path in source.iterdir() if path.is_file()}
    assert len(set(ASSETS.values())) == 48


def test_every_asset_has_original_and_responsive_outputs():
    names = output_names()
    assert len(names) == 48 * 3
    assert "hero-cover.jpg" in names
    assert "hero-cover-w960.webp" in names
    assert "hero-cover-w1800.webp" in names


def test_prepare_assets_converts_single_frame_gif(tmp_path):
    source = Path(r"C:/Users/86135/Desktop/作品")
    prepare_assets(source, tmp_path, {"竞品调研_01.gif": "competitor-vitra-overview"})
    assert (tmp_path / "competitor-vitra-overview.jpg").is_file()
    assert (tmp_path / "competitor-vitra-overview-w960.webp").is_file()
    assert (tmp_path / "competitor-vitra-overview-w1800.webp").is_file()
```

- [ ] **Step 2: Run the asset test and verify it fails**

Run:

```powershell
python -m pytest tests/test_prepare_nesta_assets.py -q
```

Expected: FAIL because the current script executes on import, references removed aggregate boards, and does not expose `output_names` or `prepare_assets`.

- [ ] **Step 3: Replace the asset manifest and make imports side-effect free**

Use this exact semantic mapping in `scripts/prepare_nesta_assets.py`:

```python
from pathlib import Path

from PIL import Image, ImageOps


SOURCE = Path(r"C:/Users/86135/Desktop/作品")
DEST = Path(__file__).resolve().parents[1] / "public" / "images" / "nesta"

ASSETS = {
    "1e6c83a0e93dfc8b01d7a3ec55f37ab5.jpg": "hero-cover",
    "2241f292694c0cb2497992ebc760bf2d.jpg": "application-illustration-world",
    "28fc79dc932dade9a9be86b8b064f811.jpg": "application-vi-board",
    "3254375487548.png": "positioning-overview",
    "41352365437657579.png": "positioning-visual",
    "64f25f02d6da06118b9a56c758d5d5d0.jpg": "application-collage",
    "a7891f23d4c412bd91a1ae0d9a041b86.jpg": "application-editorial",
    "e986ccc5cdd9a1f86cc0340f063a7ef5.jpg": "identity-color-system",
    "f38148cf53096b223e35e4f90779dcba.jpg": "identity-logo-construction",
    "fc792c3e0995c1aeb0f4d5ff41a7057c.jpg": "application-window-graphics",
    "调研_01.png": "research-market-opportunity",
    "调研_02.png": "research-user-needs",
    "调研_03.png": "research-industry-trends",
    "调研_04.png": "research-consumption-trends",
    "调研_05.png": "research-channel-positioning",
    "竞品调研_01.gif": "competitor-vitra-overview",
    "竞品调研_02.gif": "competitor-vitra-research",
    "竞品调研_03.gif": "competitor-vitra-applications",
    "竞品调研_04.gif": "competitor-muji-overview",
    "竞品调研_05.gif": "competitor-muji-research",
    "竞品调研_06.gif": "competitor-muji-applications",
    "竞品调研_07.gif": "competitor-fanji-overview",
    "竞品调研_08.gif": "competitor-fanji-research",
    "竞品调研_09.gif": "competitor-fanji-applications",
    "竞品调研_10.gif": "competitor-hay-overview",
    "竞品调研_11.gif": "competitor-hay-research",
    "竞品调研_12.gif": "competitor-hay-applications",
    "竞品调研_13.gif": "competitor-ikea-overview",
    "竞品调研_14.gif": "competitor-ikea-research",
    "竞品调研_15.png": "competitor-ikea-applications",
    "理念_01.png": "concept-overview",
    "理念_02.png": "concept-logo-lockups",
    "理念_03.png": "concept-positioning",
    "用户画像等_01.png": "opportunity-user-portraits",
    "用户画像等_02.png": "opportunity-brand-space",
    "用户画像等_03.png": "opportunity-positioning-model",
    "用户画像等_04.png": "identity-type-system",
    "用户画像等_05.png": "opportunity-swot",
    "作品背景_01.png": "brief-context",
    "作品背景_02.png": "brief-space-scene",
    "作品12124523676_01.png": "application-editorial-layout",
    "作品12124523676_02.png": "application-social-mobile",
    "作品386459827350_01.png": "application-space-poster",
    "作品386459827350_02.png": "application-product-card",
    "作品386459827350_03.png": "application-brand-story",
    "作品386459827350_04.png": "application-packaging",
    "作品947195656_01.png": "identity-symbol-library",
    "作品947195656_02.png": "identity-pattern-library",
}


def output_names(assets=ASSETS):
    return [name for basename in assets.values() for name in (
        f"{basename}.jpg", f"{basename}-w960.webp", f"{basename}-w1800.webp",
    )]


def save_width(image, destination, basename, width):
    output = image
    if image.width > width:
        height = round(image.height * width / image.width)
        output = image.resize((width, height), Image.Resampling.LANCZOS)
    output.save(destination / f"{basename}-w{width}.webp", "WEBP", quality=86, method=6)


def prepare_assets(source_dir=SOURCE, destination=DEST, assets=ASSETS):
    destination.mkdir(parents=True, exist_ok=True)
    for source_name, basename in assets.items():
        source = source_dir / source_name
        if not source.is_file():
            raise FileNotFoundError(source)
        with Image.open(source) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            image.save(destination / f"{basename}.jpg", "JPEG", quality=95, optimize=True)
            save_width(image, destination, basename, 960)
            save_width(image, destination, basename, 1800)
    return output_names(assets)


if __name__ == "__main__":
    generated = prepare_assets()
    print(f"Generated {len(generated)} NESTA files from {len(ASSETS)} source images in {DEST}")
```

- [ ] **Step 4: Run the focused test and generate the responsive assets**

Run:

```powershell
python -m pytest tests/test_prepare_nesta_assets.py -q
python scripts/prepare_nesta_assets.py
```

Expected: `3 passed` followed by `Generated 144 NESTA files from 48 source images`.

- [ ] **Step 5: Record the checkpoint**

Verify that `public/images/nesta/hero-cover.jpg`, `public/images/nesta/research-market-opportunity-w960.webp`, and `public/images/nesta/application-packaging-w1800.webp` exist. Do not delete older NESTA assets until all JS references have been migrated in Task 2.

### Task 2: Replace the NESTA data with the six-act case-study model

**Files:**
- Modify: `src/data/projects.js`
- Modify: `src/data/content.test.js`

- [ ] **Step 1: Write the failing NESTA data assertions**

Replace the current NESTA test block with:

```js
test('models NESTA as a six-act editorial case study with 48 unique source assets', () => {
  const nesta = projects.find((project) => project.id === 'nesta-furniture')
  const groups = nesta.caseStudy
  const media = [
    groups.coldOpen.media,
    ...groups.brief.media,
    ...groups.research.evidence,
    ...groups.research.competitors.flatMap((item) => item.media),
    ...groups.strategy.media,
    ...groups.identity.flatMap((item) => item.media),
    ...groups.applications.flatMap((item) => item.media),
  ]

  expect(nesta).toMatchObject({ index: '007', story: 'nesta', theme: 'nesta' })
  expect(Object.keys(groups)).toEqual([
    'coldOpen', 'brief', 'research', 'strategy', 'identity', 'applications', 'takeaway',
  ])
  expect(groups.research.insights).toHaveLength(3)
  expect(groups.research.evidence).toHaveLength(5)
  expect(groups.research.competitors).toHaveLength(5)
  expect(groups.identity).toHaveLength(4)
  expect(groups.applications).toHaveLength(4)
  expect(media).toHaveLength(48)
  expect(new Set(media.map(({ src }) => src)).size).toBe(48)
  media.forEach(({ src, alt }) => {
    expect(src).toMatch(/^\/images\/nesta\/[a-z0-9-]+\.jpg$/)
    expect(alt.length).toBeGreaterThan(5)
  })
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
pnpm test -- src/data/content.test.js
```

Expected: FAIL because `caseStudy` does not exist.

- [ ] **Step 3: Add a media helper and replace only the NESTA record body**

Add this helper near the top of `src/data/projects.js`:

```js
const nestaMedia = (name, alt, label) => ({
  src: assetUrl(`/images/nesta/${name}.jpg`), alt, label,
})
```

Keep the existing NESTA metadata, then replace `caseBrief` through `closing` with this shape:

```js
caseStudy: {
  coldOpen: {
    eyebrow: 'PROJECT 007 / BRAND SYSTEM',
    title: 'SPACE CARRIES LIFE.',
    role: 'Brand Strategy / Identity / Art Direction',
    media: nestaMedia('hero-cover', 'NESTA 字标覆盖复古家具生活空间', 'BRAND WORLD / 00'),
  },
  brief: {
    title: '家具之外，空间如何承载自我？',
    summary: 'NESTA 将家具从功能物件重新理解为人与空间、情绪和自我表达之间的媒介。',
    facts: [
      ['Challenge', '让家具品牌同时具备功能可信度、审美辨识度和情绪连接。'],
      ['Audience', '希望居住、工作与创作空间能够表达自我的城市生活者。'],
      ['My Role', '品牌研究、策略提炼、视觉识别、应用系统与案例叙事。'],
    ],
    media: [
      nestaMedia('brief-context', 'NESTA 项目背景与品牌命题说明', 'CONTEXT / 01'),
      nestaMedia('brief-space-scene', 'NESTA 家具空间与编辑视觉背景', 'SPACE SCENE / 02'),
    ],
  },
  research: {
    title: '不是展示调研，而是展示判断如何发生。',
    insights: [
      ['MARKET', '家具消费从购买物件转向经营生活方式。'],
      ['PEOPLE', '空间需要同时容纳居住、工作、创作与自我表达。'],
      ['GAP', '功能、极简和潮流表达成熟，但情绪连接仍有位置。'],
    ],
    evidence: [
      nestaMedia('research-market-opportunity', 'NESTA 家具市场机会研究', 'MARKET / 01'),
      nestaMedia('research-user-needs', 'NESTA 家具用户需求研究', 'USER / 02'),
      nestaMedia('research-industry-trends', 'NESTA 家具行业趋势研究', 'INDUSTRY / 03'),
      nestaMedia('research-consumption-trends', 'NESTA 家具消费趋势研究', 'CONSUMPTION / 04'),
      nestaMedia('research-channel-positioning', 'NESTA 渠道与定位研究', 'CHANNEL / 05'),
    ],
    competitors: ['vitra', 'muji', 'fanji', 'hay', 'ikea'].map((name) => ({
      name: name.toUpperCase(),
      media: ['overview', 'research', 'applications'].map((part, index) =>
        nestaMedia(`competitor-${name}-${part}`, `${name.toUpperCase()} 竞品${['概览', '特征', '应用'][index]}`, `${name.toUpperCase()} / 0${index + 1}`)),
    })),
  },
  strategy: {
    title: 'SPACE CARRIES ONESELF.',
    summary: '把研究结论收束为空间的精神容器、克制明亮的语气，以及“功能承载，情绪发生”的设计原则。',
    decisions: [
      ['ROLE', '空间的精神容器'], ['TONE', '克制、明亮、有呼吸感'], ['PRINCIPLE', '功能承载，情绪发生'],
    ],
    media: [
      nestaMedia('concept-overview', 'NESTA 品牌理念与字标概览', 'CONCEPT / 01'),
      nestaMedia('concept-logo-lockups', 'NESTA 字标组合与反白形式', 'LOCKUPS / 02'),
      nestaMedia('concept-positioning', 'NESTA 英文品牌定位陈述', 'POSITIONING / 03'),
      nestaMedia('opportunity-user-portraits', 'NESTA 三类核心用户画像', 'AUDIENCE / 04'),
      nestaMedia('opportunity-brand-space', 'NESTA 品牌机会与空间场景', 'OPPORTUNITY / 05'),
      nestaMedia('opportunity-positioning-model', 'NESTA 品牌定位模型', 'MODEL / 06'),
      nestaMedia('identity-type-system', 'NESTA 品牌标准字与字体系统', 'TYPE / 07'),
      nestaMedia('opportunity-swot', 'NESTA SWOT 决策依据', 'SWOT / 08'),
    ],
  },
  identity: [
    { key: 'logo', title: '字标结构', copy: '开放、稳定、可识别。', media: [nestaMedia('identity-logo-construction', 'NESTA 字标构造网格', 'LOGO / 01')] },
    { key: 'color', title: '颜色角色', copy: '蓝色负责识别，酒红负责承重，粉青与米白负责呼吸。', media: [nestaMedia('identity-color-system', 'NESTA RGB 色彩系统', 'COLOR / 02')] },
    { key: 'symbols', title: '家具符号', copy: '把灯、椅、桌和弹簧从产品对象转化为品牌角色。', media: [nestaMedia('identity-symbol-library', 'NESTA 家具插画符号库', 'SYMBOLS / 03')] },
    { key: 'pattern', title: '纹样节奏', copy: '用几何模块扩展出持续可用的图形系统。', media: [nestaMedia('identity-pattern-library', 'NESTA 几何纹样系统', 'PATTERN / 04')] },
  ],
  applications: [
    { key: 'editorial', title: '编辑传播', media: ['application-editorial', 'application-editorial-layout', 'positioning-overview'].map((name, index) => nestaMedia(name, 'NESTA 编辑传播与产品摄影应用', `EDITORIAL / 0${index + 1}`)) },
    { key: 'social', title: '社交内容', media: ['application-social-mobile', 'positioning-visual', 'application-collage'].map((name, index) => nestaMedia(name, 'NESTA 社交媒体与移动端内容', `SOCIAL / 0${index + 1}`)) },
    { key: 'product', title: '产品物料', media: ['application-vi-board', 'application-product-card', 'application-brand-story', 'application-packaging'].map((name, index) => nestaMedia(name, 'NESTA 产品卡、品牌物料与包装应用', `PRODUCT / 0${index + 1}`)) },
    { key: 'space', title: '空间体验', media: ['application-space-poster', 'application-window-graphics', 'application-illustration-world'].map((name, index) => nestaMedia(name, 'NESTA 空间展示、窗贴与插画世界', `SPACE / 0${index + 1}`)) },
  ],
  takeaway: {
    title: 'FROM RESEARCH TO A LIVING SYSTEM.',
    capabilities: ['研究提炼', '品牌系统', '跨触点落地'],
  },
},
```

- [ ] **Step 4: Run data tests**

Run:

```powershell
pnpm test -- src/data/content.test.js
```

Expected: PASS with the 48 unique assets and all existing six project assertions unchanged.

- [ ] **Step 5: Record the checkpoint**

Use `rg -n "fragments/|research-market-user|research-competitors|research-brand-opportunity" src/data/projects.js` and verify no stale NESTA aggregate asset paths remain.

### Task 3: Build the static six-act NESTA story before adding motion

**Files:**
- Create: `src/components/nesta/NestaMedia.jsx`
- Create: `src/components/nesta/NestaSections.jsx`
- Modify: `src/components/NestaStory.jsx`
- Modify: `src/components/NestaStory.test.jsx`

- [ ] **Step 1: Replace the component test with failing six-act assertions**

```jsx
import { fireEvent, render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import NestaStory from './NestaStory'

const project = projects.find((item) => item.id === 'nesta-furniture')

test('renders the recruiter-first six-act NESTA narrative', () => {
  const { container } = render(<NestaStory project={project} />)
  expect(container.querySelector('[data-nesta-act="cold-open"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="brief"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="research"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="strategy"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="identity"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="applications"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="takeaway"]')).toBeInTheDocument()
  expect(screen.getByText('家具之外，空间如何承载自我？')).toBeInTheDocument()
  expect(screen.getByText('FROM RESEARCH TO A LIVING SYSTEM.')).toBeInTheDocument()
})

test('keeps complete research evidence progressively available', () => {
  render(<NestaStory project={project} />)
  const details = screen.getByText('查看完整调研证据').closest('details')
  expect(details).not.toHaveAttribute('open')
  fireEvent.click(screen.getByText('查看完整调研证据'))
  expect(details).toHaveAttribute('open')
  expect(screen.getByText('VITRA')).toBeInTheDocument()
  expect(screen.getByText('IKEA')).toBeInTheDocument()
})

test('renders 48 responsive images with useful alt text', () => {
  const { container } = render(<NestaStory project={project} />)
  const images = container.querySelectorAll('img')
  expect(images).toHaveLength(48)
  images.forEach((image) => {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(image.getAttribute('alt').length).toBeGreaterThan(5)
  })
})
```

- [ ] **Step 2: Run the component test and verify it fails**

Run:

```powershell
pnpm test -- src/components/NestaStory.test.jsx
```

Expected: FAIL because the current markup uses the old overview/positioning/DNA structure.

- [ ] **Step 3: Create the shared media primitives**

Create `src/components/nesta/NestaMedia.jsx`:

```jsx
import ResponsiveImage from '../ResponsiveImage'

export function NestaFigure({ media, className = '' }) {
  return <figure className={`nesta-media ${className}`.trim()} data-media-shape={media.shape || 'auto'}>
    <ResponsiveImage src={media.src} alt={media.alt} loading="lazy" decoding="async" />
    <figcaption><span>{media.label}</span><span>NESTA ORIGINAL WORK</span></figcaption>
  </figure>
}

export function NestaMediaGrid({ media, className = '' }) {
  return <div className={`nesta-media-grid ${className}`.trim()}>
    {media.map((item) => <NestaFigure key={item.src} media={item} />)}
  </div>
}

export function NestaSectionHead({ index, label, title, copy }) {
  return <header className="nesta-section-head">
    <span>{index} / {label}</span>
    <h3>{title}</h3>
    {copy && <p>{copy}</p>}
  </header>
}
```

- [ ] **Step 4: Create the six static sections**

Create `src/components/nesta/NestaSections.jsx` with exported components `NestaColdOpen`, `NestaBrief`, `NestaResearch`, `NestaStrategy`, `NestaIdentity`, `NestaApplications`, and `NestaTakeaway`. Use native `<details>` for progressive evidence and these stable hooks:

```jsx
import { NestaFigure, NestaMediaGrid, NestaSectionHead } from './NestaMedia'

export function NestaColdOpen({ data }) {
  return <section className="nesta-cold-open" data-nesta-act="cold-open">
    <NestaFigure media={data.media} className="nesta-cold-open__media" />
    <div className="nesta-cold-open__copy" data-nesta-intro>
      <span>{data.eyebrow}</span><h3>{data.title}</h3><p>{data.role}</p>
    </div>
  </section>
}

export function NestaBrief({ data }) {
  return <section className="nesta-brief" data-nesta-act="brief">
    <NestaSectionHead index="01" label="THE BRIEF" title={data.title} copy={data.summary} />
    <dl>{data.facts.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
    <NestaMediaGrid media={data.media} />
  </section>
}

export function NestaResearch({ data }) {
  return <section className="nesta-research" data-nesta-act="research">
    <NestaSectionHead index="02" label="RESEARCH TO INSIGHT" title={data.title} />
    <div className="nesta-research__insights">{data.insights.map(([label, copy]) => <article key={label}><span>{label}</span><h4>{copy}</h4></article>)}</div>
    <details className="nesta-evidence">
      <summary>查看完整调研证据</summary>
      <NestaMediaGrid media={data.evidence} className="nesta-evidence__base" />
      <div className="nesta-competitors" data-nesta-horizontal>
        {data.competitors.map((item) => <article key={item.name}><h4>{item.name}</h4><NestaMediaGrid media={item.media} /></article>)}
      </div>
    </details>
  </section>
}

export function NestaStrategy({ data }) {
  return <section className="nesta-strategy" data-nesta-act="strategy">
    <NestaSectionHead index="03" label="STRATEGIC LEAP" title={data.title} copy={data.summary} />
    <div className="nesta-strategy__decisions">{data.decisions.map(([label, title]) => <article key={label}><span>{label}</span><h4>{title}</h4></article>)}</div>
    <NestaMediaGrid media={data.media} />
  </section>
}

export function NestaIdentity({ data }) {
  return <section className="nesta-identity" data-nesta-act="identity">
    <NestaSectionHead index="04" label="IDENTITY SYSTEM" title="从承载概念，生长出一套视觉语法。" />
    <div className="nesta-identity__grid">{data.map((item) => <article key={item.key} data-identity={item.key}><div><span>{item.key}</span><h4>{item.title}</h4><p>{item.copy}</p></div><NestaMediaGrid media={item.media} /></article>)}</div>
  </section>
}

export function NestaApplications({ data }) {
  return <section className="nesta-applications" data-nesta-act="applications">
    <NestaSectionHead index="05" label="BRAND IN USE" title="系统在真实触点中持续呼吸。" />
    <div className="nesta-applications__groups">{data.map((item) => <article key={item.key} data-application={item.key}><h4>{item.title}</h4><NestaMediaGrid media={item.media} /></article>)}</div>
  </section>
}

export function NestaTakeaway({ data }) {
  return <section className="nesta-takeaway" data-nesta-act="takeaway">
    <span>06 / TAKEAWAY</span><h3>{data.title}</h3>
    <ul>{data.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
  </section>
}
```

- [ ] **Step 5: Reduce `NestaStory.jsx` to an orchestrator**

```jsx
import { useRef } from 'react'
import {
  NestaApplications, NestaBrief, NestaColdOpen, NestaIdentity,
  NestaResearch, NestaStrategy, NestaTakeaway,
} from './nesta/NestaSections'
import useNestaMotion from './nesta/useNestaMotion'

export default function NestaStory({ project }) {
  const rootRef = useRef(null)
  useNestaMotion(rootRef)
  const story = project.caseStudy
  return <div className="nesta-story" ref={rootRef}>
    <NestaColdOpen data={story.coldOpen} />
    <NestaBrief data={story.brief} />
    <NestaResearch data={story.research} />
    <NestaStrategy data={story.strategy} />
    <NestaIdentity data={story.identity} />
    <NestaApplications data={story.applications} />
    <NestaTakeaway data={story.takeaway} />
  </div>
}
```

Create a temporary `src/components/nesta/useNestaMotion.js` that exports an inert hook so the static component can pass before Task 5:

```js
export default function useNestaMotion() {}
```

- [ ] **Step 6: Run the component tests**

Run:

```powershell
pnpm test -- src/components/NestaStory.test.jsx
```

Expected: PASS with seven act hooks, native evidence details, and 48 images.

### Task 4: Replace the old NESTA CSS with the editorial runway layout

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Add failing scoped layout tests**

```js
test('builds the NESTA editorial runway and four application rhythms', () => {
  expect(css).toMatch(/\.nesta-cold-open\s*{[^}]*min-height:\s*min\(78rem,\s*92vh\)/s)
  expect(css).toMatch(/\.nesta-brief\s+dl\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.nesta-research__insights\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
  expect(css).toMatch(/\.nesta-strategy\s*{[^}]*background:\s*var\(--nesta-blue\)/s)
  expect(css).toMatch(/\.nesta-identity__grid\s*{[^}]*grid-template-columns:\s*repeat\(12,\s*1fr\)/s)
  expect(css).toMatch(/\[data-application="editorial"\][^{]*\.nesta-media-grid\s*{[^}]*grid-auto-flow:\s*column/s)
  expect(css).toMatch(/\.nesta-takeaway\s*{[^}]*background:\s*var\(--acid\)/s)
})

test('stacks NESTA sections and removes horizontal motion hooks on mobile', () => {
  const mobileCss = cssBlock(css, '@media (max-width: 720px)')
  expect(mobileCss).toMatch(/\.nesta-brief\s+dl,[^}]*\.nesta-research__insights[^}]*{[^}]*grid-template-columns:\s*1fr/s)
  expect(mobileCss).toMatch(/\.nesta-identity__grid\s*{[^}]*display:\s*block/s)
  expect(mobileCss).toMatch(/\[data-nesta-horizontal\]\s*{[^}]*display:\s*grid/s)
})

test('keeps NESTA artwork uncropped and disables transform motion when reduced', () => {
  expect(css).toMatch(/\.nesta-media img\s*{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s)
  const reducedCss = cssBlock(css, '@media (prefers-reduced-motion: reduce)')
  expect(reducedCss).toMatch(/\.nesta-story \*\s*{[^}]*animation-duration:\s*\.01ms/s)
  expect(reducedCss).toMatch(/\.nesta-story \[data-nesta-horizontal\]\s*{[^}]*transform:\s*none/s)
})
```

- [ ] **Step 2: Run the style tests and verify they fail**

Run:

```powershell
pnpm test -- src/styles.test.js
```

Expected: FAIL because the new selectors do not exist.

- [ ] **Step 3: Remove the old `.nesta-story*` and `.project--nesta .nesta-story*` blocks and add the new scoped system**

Use these required declarations as the base; keep every rule scoped to `.project--nesta` or `.nesta-*`:

```css
.project--nesta { --nesta-blue:#287bea; --nesta-cream:#fff3ea; --nesta-burgundy:#4b101c; --nesta-pink:#f7d1d8; --nesta-cyan:#61bdd9; }
.nesta-story { margin:clamp(3rem,7vw,7rem) calc(var(--case-inset) * -1) 0; color:#111; background:var(--nesta-cream); overflow:clip; }
.nesta-story > section { padding:clamp(5rem,10vw,10rem) var(--case-inset); }
.nesta-section-head { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(18rem,.8fr); gap:clamp(2rem,6vw,7rem); align-items:end; margin-bottom:clamp(3rem,7vw,7rem); }
.nesta-section-head > span,.nesta-media figcaption,.nesta-cold-open__copy > span { font:.66rem ui-monospace,monospace; letter-spacing:.12em; text-transform:uppercase; }
.nesta-section-head h3 { max-width:13ch; margin:.8rem 0 0; font-size:clamp(2.8rem,6vw,7rem); line-height:.9; letter-spacing:-.06em; }
.nesta-section-head p { max-width:36rem; margin:0; line-height:1.7; opacity:.72; }
.nesta-media { margin:0; min-width:0; background:#fff; overflow:hidden; }
.nesta-media .responsive-picture,.nesta-media img { display:block; width:100%; }
.nesta-media img { height:auto; object-fit:contain; }
.nesta-media figcaption { display:flex; justify-content:space-between; gap:1rem; padding:.7rem .85rem; color:#555; background:#fff; }
.nesta-media-grid { display:grid; gap:1rem; align-items:start; }
.nesta-cold-open { position:relative; min-height:min(78rem,92vh); display:grid; align-items:end; color:#fff; background:#070707; padding:0!important; }
.nesta-cold-open__media { grid-area:1/1; height:100%; }
.nesta-cold-open__media img { min-height:min(78rem,92vh); object-fit:cover; filter:brightness(.66); }
.nesta-cold-open__media figcaption { display:none; }
.nesta-cold-open__copy { grid-area:1/1; position:relative; z-index:1; padding:var(--case-inset); }
.nesta-cold-open__copy h3 { max-width:9ch; margin:1rem 0; font-size:clamp(4rem,10vw,11rem); line-height:.78; letter-spacing:-.08em; }
.nesta-brief dl { display:grid; grid-template-columns:repeat(3,1fr); margin:0 0 4rem; border-block:1px solid rgba(0,0,0,.22); }
.nesta-brief dl div { padding:1.2rem; border-right:1px solid rgba(0,0,0,.22); }
.nesta-brief .nesta-media-grid { grid-template-columns:1.15fr .85fr; }
.nesta-research { color:#fff; background:#070707; }
.nesta-research__insights { display:grid; grid-template-columns:repeat(3,1fr); border-block:1px solid #333; }
.nesta-research__insights article { min-height:14rem; padding:1.2rem; border-right:1px solid #333; }
.nesta-evidence { margin-top:3rem; border-top:1px solid #333; }
.nesta-evidence summary { padding:1.25rem 0; cursor:pointer; color:var(--acid); }
.nesta-evidence__base { grid-template-columns:repeat(2,1fr); }
.nesta-competitors { display:flex; width:max-content; gap:1rem; padding-top:4rem; }
.nesta-competitors > article { width:min(78vw,68rem); flex:none; }
.nesta-competitors h4 { font-size:clamp(3rem,8vw,9rem); margin:0 0 1rem; }
.nesta-competitors .nesta-media-grid { grid-template-columns:repeat(3,1fr); }
.nesta-strategy { color:#fff; background:var(--nesta-blue); }
.nesta-strategy .nesta-section-head h3 { max-width:10ch; }
.nesta-strategy__decisions { display:grid; grid-template-columns:repeat(3,1fr); border-block:1px solid rgba(255,255,255,.35); }
.nesta-strategy__decisions article { min-height:12rem; padding:1.2rem; border-right:1px solid rgba(255,255,255,.35); }
.nesta-strategy > .nesta-media-grid { grid-template-columns:repeat(2,1fr); margin-top:4rem; }
.nesta-identity { background:var(--nesta-pink); }
.nesta-identity__grid { display:grid; grid-template-columns:repeat(12,1fr); gap:1rem; }
.nesta-identity__grid > article { grid-column:span 5; display:grid; gap:1rem; align-content:start; }
.nesta-identity__grid > article:nth-child(3n+1) { grid-column:span 7; }
.nesta-applications { background:var(--nesta-cream); }
.nesta-applications__groups { display:grid; gap:clamp(5rem,10vw,10rem); }
.nesta-applications__groups > article > h4 { font-size:clamp(2rem,5vw,5rem); margin:0 0 1.5rem; }
[data-application="editorial"] .nesta-media-grid { display:grid; grid-auto-flow:column; grid-auto-columns:min(78vw,66rem); overflow:hidden; }
[data-application="social"] .nesta-media-grid { grid-template-columns:repeat(3,1fr); align-items:end; }
[data-application="product"] .nesta-media-grid { grid-template-columns:repeat(2,1fr); }
[data-application="space"] .nesta-media-grid { grid-template-columns:1fr; }
.nesta-takeaway { min-height:72vh; display:flex; flex-direction:column; justify-content:space-between; color:#070707; background:var(--acid); }
.nesta-takeaway h3 { max-width:12ch; margin:2rem 0; font-size:clamp(3.5rem,9vw,10rem); line-height:.8; letter-spacing:-.08em; }
.nesta-takeaway ul { display:grid; grid-template-columns:repeat(3,1fr); margin:0; padding:0; list-style:none; border-top:1px solid #070707; }
.nesta-takeaway li { padding:1rem 0; }
@media (max-width:720px) {
  .nesta-story > section { padding:4.5rem 1rem; }
  .nesta-section-head { grid-template-columns:1fr; }
  .nesta-cold-open__copy { padding:1rem; }
  .nesta-cold-open__copy h3 { font-size:clamp(3.5rem,19vw,6rem); }
  .nesta-brief dl,.nesta-research__insights,.nesta-strategy__decisions,.nesta-takeaway ul { grid-template-columns:1fr; }
  .nesta-brief .nesta-media-grid,.nesta-evidence__base,.nesta-strategy > .nesta-media-grid,[data-application] .nesta-media-grid { grid-template-columns:1fr; }
  .nesta-identity__grid { display:block; }
  .nesta-identity__grid > article { margin-bottom:4rem; }
  [data-nesta-horizontal] { display:grid; width:auto; }
  .nesta-competitors > article { width:auto; }
  .nesta-competitors .nesta-media-grid { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion:reduce) {
  .nesta-story * { animation-duration:.01ms!important; animation-iteration-count:1!important; scroll-behavior:auto!important; }
  .nesta-story [data-nesta-horizontal] { transform:none!important; }
}
```

- [ ] **Step 4: Run style and component tests**

Run:

```powershell
pnpm test -- src/styles.test.js src/components/NestaStory.test.jsx
```

Expected: PASS. Open the existing visible browser and confirm hot reload shows the six-act static layout before any GSAP motion is added.

### Task 5: Add scoped GSAP timelines and accessible motion fallbacks

**Files:**
- Modify: `src/components/nesta/useNestaMotion.js`
- Create: `src/components/nesta/useNestaMotion.test.js`

- [ ] **Step 1: Write the failing pure motion-mode test**

```js
import { describe, expect, test } from 'vitest'
import { nestaMotionMode } from './useNestaMotion'

describe('nestaMotionMode', () => {
  test('uses static mode for reduced motion', () => {
    expect(nestaMotionMode({ desktop: true, reduceMotion: true })).toBe('static')
  })
  test('uses flow mode below the desktop breakpoint', () => {
    expect(nestaMotionMode({ desktop: false, reduceMotion: false })).toBe('flow')
  })
  test('uses editorial motion on desktop', () => {
    expect(nestaMotionMode({ desktop: true, reduceMotion: false })).toBe('editorial')
  })
})
```

- [ ] **Step 2: Run the motion test and verify it fails**

Run:

```powershell
pnpm test -- src/components/nesta/useNestaMotion.test.js
```

Expected: FAIL because `nestaMotionMode` is not exported.

- [ ] **Step 3: Implement the scoped motion hook**

Replace the inert hook with:

```js
import { gsap, ScrollTrigger, scrollerFor, useGSAP, motionAllowed } from '../../motion/gsapSetup'

export function nestaMotionMode({ desktop, reduceMotion }) {
  if (reduceMotion) return 'static'
  return desktop ? 'editorial' : 'flow'
}

export default function useNestaMotion(rootRef) {
  useGSAP((context, contextSafe) => {
    const root = rootRef.current
    if (!root || !motionAllowed()) return undefined
    const q = gsap.utils.selector(root)
    const scroller = scrollerFor(root)
    const withScroller = scroller ? { scroller } : {}
    const media = gsap.matchMedia()

    media.add({
      desktop: '(min-width: 721px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, ({ conditions }) => {
      const mode = nestaMotionMode(conditions)
      if (mode === 'static') return undefined
      const cleanups = []

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-nesta-intro] > *'), { autoAlpha: 0, y: 28, duration: .72, stagger: .08 })
        .from(q('.nesta-cold-open__media img'), { clipPath: 'inset(0 14%)', scale: 1.04, duration: 1.05 }, '-=.5')

      ScrollTrigger.batch(q('.nesta-research__insights article, .nesta-identity__grid > article'), {
        start: 'top 86%', once: true, interval: .08, batchMax: mode === 'editorial' ? 3 : 1,
        ...withScroller,
        onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .08, overwrite: true }),
      })

      const strategy = q('.nesta-strategy')[0]
      if (strategy) {
        gsap.timeline({ scrollTrigger: { trigger: strategy, start: 'top 78%', end: 'top 34%', scrub: mode === 'editorial' ? .8 : false, ...withScroller } })
          .from(q('.nesta-strategy .nesta-section-head h3'), { clipPath: 'inset(0 100% 0 0)', duration: 1 })
          .from(q('.nesta-strategy__decisions article'), { y: 24, autoAlpha: 0, stagger: .1 }, '<.15')
      }

      if (mode === 'editorial') {
        const evidence = q('[data-nesta-horizontal]')[0]
        const evidenceDetails = evidence?.closest('details')
        if (evidence && evidenceDetails) {
          const createEvidenceTrigger = contextSafe(() => {
            ScrollTrigger.getById('nesta-evidence')?.kill()
            if (!evidenceDetails.open) return
            const distance = Math.max(0, evidence.scrollWidth - evidenceDetails.clientWidth)
            if (!distance) return
            gsap.to(evidence, { x: -distance, ease: 'none', scrollTrigger: { id: 'nesta-evidence', trigger: evidence, start: 'top 18%', end: `+=${distance}`, pin: true, scrub: 1, invalidateOnRefresh: true, ...withScroller } })
            ScrollTrigger.refresh()
          })
          evidenceDetails.addEventListener('toggle', createEvidenceTrigger)
          createEvidenceTrigger()
          cleanups.push(() => evidenceDetails.removeEventListener('toggle', createEvidenceTrigger))
        }

        q('.nesta-applications__groups > article').forEach((section, index) => {
          const mediaNodes = section.querySelectorAll('.nesta-media')
          gsap.from(mediaNodes, { xPercent: index % 2 ? 5 : -5, autoAlpha: 0, stagger: .08, scrollTrigger: { trigger: section, start: 'top 82%', once: true, ...withScroller } })
        })

        q('.nesta-media').forEach((card) => {
          const xTo = gsap.quickTo(card, 'x', { duration: .3, ease: 'power3.out' })
          const yTo = gsap.quickTo(card, 'y', { duration: .3, ease: 'power3.out' })
          const rotateTo = gsap.quickTo(card, 'rotation', { duration: .35, ease: 'power3.out' })
          const move = contextSafe((event) => {
            const rect = card.getBoundingClientRect()
            const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5
            const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5
            xTo(x * 10); yTo(y * 6); rotateTo(x)
          })
          const reset = contextSafe(() => { xTo(0); yTo(0); rotateTo(0) })
          card.addEventListener('pointermove', move)
          card.addEventListener('pointerleave', reset)
          cleanups.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', reset) })
        })
      }

      return () => cleanups.forEach((cleanup) => cleanup())
    })

    const refresh = () => ScrollTrigger.refresh()
    let cancelled = false
    Promise.all(Array.from(root.querySelectorAll('img')).map((img) => img.decode?.().catch(() => undefined)))
      .then(() => { if (!cancelled) refresh() })
    return () => { cancelled = true; media.revert() }
  }, { scope: rootRef })
}
```

- [ ] **Step 4: Run the focused motion and component tests**

Run:

```powershell
pnpm test -- src/components/nesta/useNestaMotion.test.js src/components/NestaStory.test.jsx
```

Expected: PASS. JSDOM stays on the reduced-motion path while the pure helper verifies all three modes.

- [ ] **Step 5: Check the visible browser after hot reload**

At `http://localhost:5174/#work/nesta-furniture`, verify the intro mask, insight reveals, blue strategy transition, and application reveals. Expand “查看完整调研证据” and verify the desktop horizontal evidence section is created only while the details element is open.

### Task 6: Full regression, build, and live browser verification

**Files:**
- Modify if required by failures: only files already listed in Tasks 1–5.

- [ ] **Step 1: Run every automated check**

Run:

```powershell
python -m pytest tests/test_prepare_nesta_assets.py -q
pnpm test
pnpm build
```

Expected: all Python tests pass, all Vitest tests pass, and Vite emits a successful production build.

- [ ] **Step 2: Verify desktop layout in the visible in-app browser**

Use the existing `http://localhost:5174/#work/nesta-furniture` tab at 1440×1000. Confirm:

- Project detail opens at `007 / 007` and keeps previous/next navigation.
- Six-act reading order is visible.
- The cold-open image is not distorted.
- Research details are collapsed by default and all 20 research/competitor boards appear after expansion.
- Strategy is the only full-blue high-intensity transition.
- Four identity decisions and four application groups are present.
- The acid takeaway returns to the portfolio language.
- The browser console contains no React, image, GSAP, ScrollTrigger, ResizeObserver, or uncaught errors.

- [ ] **Step 3: Verify tablet and mobile**

Temporarily test 1024×768 and 390×844. At 390×844 verify:

- No horizontal overflow.
- No pinning, horizontal scrub, pointer tilt, or clipped text.
- All media keep their intrinsic ratio.
- Details/summary is keyboard and touch operable.
- The project can be closed and navigation remains reachable.

Reset the viewport override after verification.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload the NESTA detail, and verify all content is immediately visible with no pin, scrub, scaling, rotation, or word-stagger dependency.

- [ ] **Step 5: Final source and artifact audit**

Run:

```powershell
rg -n "TB[D]|TO[D]O|FIXM[E]|research-market-user|research-competitors|fragments/" src scripts tests
```

Expected: no placeholders and no stale NESTA aggregate references. Preserve the original 48 files in `C:/Users/86135/Desktop/作品/` unchanged.
