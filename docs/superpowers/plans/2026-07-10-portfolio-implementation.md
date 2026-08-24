# Personal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable React + Vite single-page portfolio for Wang Chengcheng with a dark editorial visual system, local video hero, resume-based content, one real operation-design project, and a full-screen contact close.

**Architecture:** Use focused React section components composed by `App`, with all portfolio content stored in small data modules. Keep visual behavior in project-local CSS, use native anchors and media queries, and use local image/video assets with explicit fallbacks so the site remains functional without external services.

**Tech Stack:** React 19, Vite 7, Vitest, Testing Library, native CSS, local JPEG/PNG/MP4 assets, FFmpeg for the local background video.

---

## File Map

- `package.json`: scripts and dependencies.
- `index.html`: Vite document shell and metadata.
- `vite.config.js`: React and Vitest configuration.
- `src/main.jsx`: React entry point.
- `src/App.jsx`: composes all page sections.
- `src/styles.css`: tokens, layout, responsive behavior, animation, and reduced-motion rules.
- `src/data/profile.js`: public resume information only.
- `src/data/projects.js`: selected project metadata and asset paths.
- `src/components/Header.jsx`: navigation and contact CTA.
- `src/components/Hero.jsx`: local video background, fallback, identity statement, and scroll CTA.
- `src/components/About.jsx`: abstract identity artwork, biography, stats, education, and experience.
- `src/components/SelectedWork.jsx`: AI-generated cover and three original posters.
- `src/components/Strengths.jsx`: four capability cards and software list.
- `src/components/Contact.jsx`: full-screen closing CTA, public email, back-to-top, and footer.
- `src/test/setup.js`: DOM test setup.
- `src/**/*.test.jsx`: behavior and privacy regression tests.
- `public/images/operation-cover.png`: imagegen exhibition cover.
- `public/images/operation-poster-01.jpg`: original supplied poster.
- `public/images/operation-poster-02.jpg`: original supplied poster.
- `public/images/operation-poster-03.jpg`: original supplied poster.
- `public/video/hero-loop.mp4`: locally generated slow-motion hero background.
- `public/video/hero-poster.jpg`: static hero fallback.

### Task 1: Scaffold Vite and establish the test harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/styles.css`
- Create: `src/test/setup.js`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Create the package manifest and Vite configuration**

Use this `package.json`:

```json
{
  "name": "wang-chengcheng-portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

Use this `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 2: Install dependencies**

Run: `pnpm install`

Expected: dependencies install successfully and `pnpm-lock.yaml` is created.

- [ ] **Step 3: Write the failing app-shell test**

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the portfolio identity', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
})
```

Use this `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm test`

Expected: FAIL because `src/App.jsx` does not exist.

- [ ] **Step 5: Implement the minimal application shell**

Use this `src/App.jsx`:

```jsx
export default function App() {
  return <main><h1>VISUAL DESIGNER.</h1></main>
}
```

Use this `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
```

Use this `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#070707" />
    <meta name="description" content="王程程的视觉设计、AI 设计与品牌设计个人作品集。" />
    <title>王程程 — Visual / AI / Brand Designer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Use this temporary `src/styles.css` so the entry import resolves during the first test:

```css
:root { font-family: Arial, sans-serif; color: #f2f0eb; background: #070707; }
body { margin: 0; }
```

- [ ] **Step 6: Run tests and commit**

Run: `pnpm test`

Expected: PASS, 1 test.

Commit:

```bash
git add package.json pnpm-lock.yaml index.html vite.config.js src
git commit -m "chore: scaffold portfolio app"
```

### Task 2: Persist artwork and define truthful project data

**Files:**
- Create: `public/images/operation-cover.png`
- Create: `public/images/operation-poster-01.jpg`
- Create: `public/images/operation-poster-02.jpg`
- Create: `public/images/operation-poster-03.jpg`
- Create: `src/data/profile.js`
- Create: `src/data/projects.js`
- Test: `src/data/content.test.js`

- [ ] **Step 1: Copy project-bound artwork into the repository**

Run:

```bash
mkdir -p public/images public/video
cp /Users/luoen/.codex/generated_images/019f4a9a-5461-7941-a3fd-d862e916e415/exec-e8606c26-dfd2-45b3-8577-5bc23e5a39bd.png public/images/operation-cover.png
cp /Users/luoen/Desktop/作品文件-运营设计/0c618699f52e88984a7059b9bf300e6f.jpg public/images/operation-poster-01.jpg
cp /Users/luoen/Desktop/作品文件-运营设计/854049514f80d9af2c0c4090de1b34ec.jpg public/images/operation-poster-02.jpg
cp /Users/luoen/Desktop/作品文件-运营设计/c522033be946fd52ca7ae7bebbd59e8c.jpg public/images/operation-poster-03.jpg
cp public/images/operation-cover.png public/video/hero-poster.jpg
```

Expected: all five copied files exist and the original Desktop files remain unchanged.

- [ ] **Step 2: Write content tests first**

```js
import { describe, expect, test } from 'vitest'
import { profile } from './profile'
import { projects } from './projects'

describe('public content', () => {
  test('never publishes the private phone number or portrait', () => {
    const content = JSON.stringify({ profile, projects })
    expect(content).not.toMatch(/\b1[3-9]\d{9}\b/)
    expect(content).not.toMatch(/avatar|portrait|证件照/i)
  })

  test('uses the verified public email and the three supplied posters', () => {
    expect(profile.email).toBe('241022998@qq.com')
    expect(projects[0].gallery).toHaveLength(3)
    expect(projects[0].gallery.every((item) => item.src.endsWith('.jpg'))).toBe(true)
  })
})
```

- [ ] **Step 3: Run the content tests to verify they fail**

Run: `pnpm test src/data/content.test.js`

Expected: FAIL because the two data modules do not exist.

- [ ] **Step 4: Add the public profile and project data**

Use `profile.js` with these stable fields:

```js
export const profile = {
  name: '王程程',
  englishName: 'Wang Chengcheng',
  roles: ['视觉设计师', 'AI 设计师', '品牌设计师'],
  email: '241022998@qq.com',
  location: 'Shenyang, China',
  introduction: '视觉设计师与 AI 设计实践者，拥有视觉传达设计背景，目前攻读设计学硕士。关注品牌视觉、运营设计与生成式 AI 在创意流程中的融合。',
  stats: [
    { value: '03', label: '核心设计方向' },
    { value: '03', label: '设计赛事奖项' },
    { value: '2020—NOW', label: '设计旅程' },
  ],
  timeline: [
    { period: '2025.09—NOW', title: '沈阳建筑大学', detail: '设计学 · 硕士研究生' },
    { period: '2024.07—09', title: '成华教育', detail: '助教 / 平面与运营设计' },
    { period: '2020.09—2024.06', title: '广西民族大学', detail: '视觉传达设计 · 本科' },
  ],
  honors: [
    '中国大学生广告创意大赛 · 一等奖',
    '中国大学生广告创意大赛 · 二等奖',
    '未来设计师 NCDA 大赛 · 一等奖',
  ],
}
```

Use `projects.js`:

```js
export const projects = [{
  id: 'farmers-market',
  index: '001',
  title: '运营视觉设计',
  englishTitle: "Farmers' Market Campaign",
  year: '2026',
  category: 'Operation Design / Poster',
  tools: 'Illustrator / Photoshop',
  description: '围绕菜市场漫游主题展开的运营视觉，以手写字、蔬果拼贴、高饱和色彩与网点质感构建轻松而直接的传播语气。',
  cover: '/images/operation-cover.png',
  gallery: [
    { src: '/images/operation-poster-01.jpg', alt: '菜市场漫游指南购物篮主题海报' },
    { src: '/images/operation-poster-02.jpg', alt: '蔬果英文名称图形运营海报' },
    { src: '/images/operation-poster-03.jpg', alt: '菜市场漫游指南网兜主题海报' },
  ],
}]
```

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test src/data/content.test.js`

Expected: PASS, 2 tests.

Commit:

```bash
git add public src/data
git commit -m "feat: add portfolio content and artwork"
```

### Task 3: Build navigation and the video Hero

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Hero.jsx`
- Test: `src/components/Hero.test.jsx`

- [ ] **Step 1: Write failing Hero behavior tests**

```jsx
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

test('exposes identity, work navigation, and a video fallback', () => {
  const { container } = render(<Hero />)
  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view selected work/i })).toHaveAttribute('href', '#work')
  expect(container.querySelector('video')).toHaveAttribute('poster', '/video/hero-poster.jpg')
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test src/components/Hero.test.jsx`

Expected: FAIL because `Hero.jsx` does not exist.

- [ ] **Step 3: Implement `Header` and `Hero`**

Use this `Header.jsx`:

```jsx
import { profile } from '../data/profile'

export default function Header() {
  return <header className="header shell">
    <a className="wordmark" href="#home">WANG CC™</a>
    <nav aria-label="Primary navigation">
      <a href="#work">WORK</a>
      <a href="#about">ABOUT</a>
      <a href="#contact">CONTACT</a>
    </nav>
    <a className="header__contact" href={`mailto:${profile.email}`}>LET'S TALK ↗</a>
  </header>
}
```

Use this `Hero.jsx`:

```jsx
import Header from './Header'

export default function Hero() {
  return <section id="home" className="hero">
    <video className="hero__video" autoPlay muted loop playsInline poster="/video/hero-poster.jpg" aria-hidden="true">
      <source src="/video/hero-loop.mp4" type="video/mp4" />
    </video>
    <div className="hero__fallback" aria-hidden="true" />
    <div className="hero__scrim" aria-hidden="true" />
    <Header />
    <div className="hero__content shell">
      <p className="eyebrow">Visual × AI × Brand</p>
      <h1>VISUAL<br />DESIGNER<span>.</span></h1>
      <div className="hero__footer">
        <p>SHENYANG / CHINA<br />AVAILABLE FOR CREATIVE WORK</p>
        <a className="round-link" href="#work">VIEW SELECTED WORK ↓</a>
      </div>
    </div>
  </section>
}
```

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test src/components/Hero.test.jsx`

Expected: PASS, 1 test.

Commit:

```bash
git add src/components
git commit -m "feat: add editorial video hero"
```

### Task 4: Build the resume-based About section

**Files:**
- Create: `src/components/About.jsx`
- Test: `src/components/About.test.jsx`

- [ ] **Step 1: Write failing privacy and timeline tests**

```jsx
import { render, screen } from '@testing-library/react'
import About from './About'

test('renders verified experience without a phone number or portrait image', () => {
  const { container } = render(<About />)
  expect(screen.getByText('沈阳建筑大学')).toBeInTheDocument()
  expect(screen.getByText('广西民族大学')).toBeInTheDocument()
  expect(screen.getByText(/未来设计师 NCDA 大赛/)).toBeInTheDocument()
  expect(container).not.toHaveTextContent(/\b1[3-9]\d{9}\b/)
  expect(container.querySelector('img')).toBeNull()
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test src/components/About.test.jsx`

Expected: FAIL because `About.jsx` does not exist.

- [ ] **Step 3: Implement the About section**

Use this `About.jsx`:

```jsx
import { profile } from '../data/profile'

export default function About() {
  return <section id="about" className="about section shell">
    <div className="about__art" aria-hidden="true">
      <span>W</span><span>C</span><span>C</span>
      <small>IDENTITY / NO PORTRAIT</small>
    </div>
    <div className="about__content">
      <p className="eyebrow">PROFILE / 2026</p>
      <h2>把视觉直觉，变成<br />清晰有力的设计语言。</h2>
      <p className="about__intro">{profile.introduction}</p>
      <div className="stats">
        {profile.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>
      <ol className="timeline">
        {profile.timeline.map((item) => <li key={item.period}>
          <time>{item.period}</time><div><strong>{item.title}</strong><span>{item.detail}</span></div>
        </li>)}
      </ol>
      <ul className="honors" aria-label="设计赛事荣誉">
        {profile.honors.map((honor) => <li key={honor}>{honor}</li>)}
      </ul>
      <a className="text-link" href={`mailto:${profile.email}`}>{profile.email} ↗</a>
    </div>
  </section>
}
```

This component deliberately contains no `<img>`, phone number, birth date, or hometown.

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test src/components/About.test.jsx`

Expected: PASS, 1 test.

Commit:

```bash
git add src/components/About.jsx src/components/About.test.jsx
git commit -m "feat: add resume-based about section"
```

### Task 5: Build the operation-design case study

**Files:**
- Create: `src/components/SelectedWork.jsx`
- Test: `src/components/SelectedWork.test.jsx`

- [ ] **Step 1: Write failing project rendering tests**

```jsx
import { render, screen } from '@testing-library/react'
import SelectedWork from './SelectedWork'

test('renders the generated cover and every supplied poster', () => {
  render(<SelectedWork />)
  expect(screen.getByRole('heading', { name: '运营视觉设计' })).toBeInTheDocument()
  expect(screen.getAllByRole('img')).toHaveLength(4)
  expect(screen.getByText("Farmers' Market Campaign")).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test src/components/SelectedWork.test.jsx`

Expected: FAIL because `SelectedWork.jsx` does not exist.

- [ ] **Step 3: Implement the selected-work section**

Use this `SelectedWork.jsx`:

```jsx
import { projects } from '../data/projects'

export default function SelectedWork() {
  return <section id="work" className="work section shell">
    <div className="section-head"><p className="eyebrow">SELECTED WORK</p><span>2024—2026</span></div>
    {projects.map((project) => <article className="project" key={project.id}>
      <div className="project__heading">
        <div><span className="project__index">/{project.index}</span><h2>{project.title}</h2><p>{project.englishTitle}</p></div>
        <dl>
          <div><dt>Category</dt><dd>{project.category}</dd></div>
          <div><dt>Year</dt><dd>{project.year}</dd></div>
          <div><dt>Tools</dt><dd>{project.tools}</dd></div>
        </dl>
      </div>
      <p className="project__description">{project.description}</p>
      <figure className="project__cover">
        <img src={project.cover} alt={`${project.title}展陈视觉`} loading="eager" />
        <figcaption>CASE STUDY COVER / AI-ASSISTED PRESENTATION</figcaption>
      </figure>
      <div className="project__gallery">
        {project.gallery.map((image, index) => <figure key={image.src}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          <figcaption>POSTER / {String(index + 1).padStart(2, '0')}</figcaption>
        </figure>)}
      </div>
    </article>)}
  </section>
}
```

The code contains no client name, reach metric, or invented outcome.

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test src/components/SelectedWork.test.jsx`

Expected: PASS, 1 test.

Commit:

```bash
git add src/components/SelectedWork.jsx src/components/SelectedWork.test.jsx
git commit -m "feat: add operation design case study"
```

### Task 6: Build strengths and the full-screen contact close

**Files:**
- Create: `src/components/Strengths.jsx`
- Create: `src/components/Contact.jsx`
- Test: `src/components/ClosingSections.test.jsx`

- [ ] **Step 1: Write failing capability and contact tests**

```jsx
import { render, screen } from '@testing-library/react'
import Strengths from './Strengths'
import Contact from './Contact'

test('renders the four approved capabilities', () => {
  render(<Strengths />)
  for (const label of ['视觉系统', '品牌表达', 'AI 共创', '动态叙事']) {
    expect(screen.getByRole('heading', { name: label })).toBeInTheDocument()
  }
})

test('uses email as the only direct contact action', () => {
  render(<Contact />)
  expect(screen.getByRole('link', { name: /241022998@qq.com/i })).toHaveAttribute('href', 'mailto:241022998@qq.com')
  expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#home')
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test src/components/ClosingSections.test.jsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement both sections**

Use this `Strengths.jsx`:

```jsx
const strengths = [
  ['视觉系统', '从色彩、字体到版式，建立可持续的视觉语言。'],
  ['品牌表达', '让概念拥有准确、鲜明且一致的品牌形象。'],
  ['AI 共创', '将生成式工具融入灵感探索与视觉生产。'],
  ['动态叙事', '用 AE 与节奏设计，让静态概念进入时间维度。'],
]

export default function Strengths() {
  return <section className="strengths section shell">
    <p className="eyebrow">WHAT I BRING</p>
    <h2>FOUR WAYS<br />I CREATE VALUE<span>.</span></h2>
    <div className="strengths__grid">
      {strengths.map(([title, copy], index) => <article key={title}>
        <span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div>
      </article>)}
    </div>
    <p className="toolkit">AI · PS · AE · ID · CHATGPT · MIDJOURNEY · GEMINI · CLAUDE</p>
  </section>
}
```

Use this `Contact.jsx`:

```jsx
import { profile } from '../data/profile'

export default function Contact() {
  return <section id="contact" className="contact">
    <div className="contact__inner shell">
      <p className="eyebrow">AVAILABLE FOR CREATIVE COLLABORATION</p>
      <h2>LET'S MAKE<br />SOMETHING<br />MEMORABLE.</h2>
      <footer>
        <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>
        <a href="#home">BACK TO TOP ↑</a>
        <span>© 2026 WCC</span>
      </footer>
    </div>
  </section>
}
```

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test src/components/ClosingSections.test.jsx`

Expected: PASS, 2 tests.

Commit:

```bash
git add src/components
git commit -m "feat: add capabilities and contact close"
```

### Task 7: Compose the site and implement the dark editorial visual system

**Files:**
- Modify: `src/App.jsx`
- Create: `src/styles.css`
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Expand the app test to cover all five required sections**

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the complete five-part portfolio', () => {
  const { container } = render(<App />)
  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
  expect(container.querySelector('#about')).toBeInTheDocument()
  expect(container.querySelector('#work')).toBeInTheDocument()
  expect(screen.getByText('FOUR WAYS I CREATE VALUE.')).toBeInTheDocument()
  expect(container.querySelector('#contact')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the app test to verify it fails**

Run: `pnpm test src/App.test.jsx`

Expected: FAIL because the minimal shell does not compose the sections.

- [ ] **Step 3: Compose all components**

Use this component order:

```jsx
import Hero from './components/Hero'
import About from './components/About'
import SelectedWork from './components/SelectedWork'
import Strengths from './components/Strengths'
import Contact from './components/Contact'

export default function App() {
  return <>
    <Hero />
    <main>
      <About />
      <SelectedWork />
      <Strengths />
      <Contact />
    </main>
  </>
}
```

- [ ] **Step 4: Implement the visual system in `src/styles.css`**

Use this complete responsive CSS as the implementation baseline:

```css
:root {
  font-family: Inter, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #f2f0eb;
  background: #070707;
  font-synthesis: none;
  --ink: #070707;
  --panel: #0d0d0d;
  --paper: #f2f0eb;
  --muted: #8b8b86;
  --line: #292929;
  --acid: #d8ff36;
  --shell: 1700px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--ink); }
body { margin: 0; min-width: 320px; overflow-x: hidden; background: var(--ink); }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
figure, h1, h2, h3, p, dl, dd { margin: 0; }
button, a { -webkit-tap-highlight-color: transparent; }
a:focus-visible { outline: 2px solid var(--acid); outline-offset: 5px; }
.shell { width: min(var(--shell), calc(100vw - 64px)); margin-inline: auto; }
.section { padding-block: clamp(7rem, 11vw, 13rem); }
.eyebrow { color: var(--acid); font: 600 .7rem/1.2 ui-monospace, SFMono-Regular, monospace; letter-spacing: .14em; text-transform: uppercase; }

.hero { position: relative; min-height: 100svh; isolation: isolate; overflow: hidden; background: #0b0c0a; }
.hero__video, .hero__fallback, .hero__scrim { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero__video { z-index: -3; object-fit: cover; filter: saturate(.72) brightness(.48); }
.hero__fallback { z-index: -4; background: url('/video/hero-poster.jpg') center/cover no-repeat; }
.hero__scrim { z-index: -2; background: linear-gradient(180deg, rgba(0,0,0,.52), transparent 34%, rgba(0,0,0,.74)), radial-gradient(circle at 73% 38%, transparent, #050505 72%); }
.header { height: 92px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; position: relative; z-index: 2; border-bottom: 1px solid rgba(255,255,255,.16); font: 600 .72rem/1 ui-monospace, monospace; letter-spacing: .08em; }
.header nav { display: flex; gap: 2.2rem; }
.header__contact { justify-self: end; border: 1px solid rgba(255,255,255,.5); border-radius: 999px; padding: .9rem 1.2rem; }
.hero__content { min-height: calc(100svh - 92px); padding: clamp(5rem, 12vh, 9rem) 0 2.3rem; display: flex; flex-direction: column; justify-content: space-between; }
.hero h1 { font-size: clamp(5rem, 11vw, 13rem); line-height: .72; letter-spacing: -.085em; font-weight: 720; }
.hero h1 span, .strengths h2 span { color: var(--acid); }
.hero__footer { display: flex; justify-content: space-between; align-items: end; color: #b4b4ae; font: .68rem/1.6 ui-monospace, monospace; letter-spacing: .05em; }
.round-link { display: grid; place-items: center; width: 10.5rem; height: 3.4rem; padding-inline: 1rem; border: 1px solid rgba(255,255,255,.42); border-radius: 999px; color: var(--paper); }

.about { display: grid; grid-template-columns: minmax(300px, .8fr) minmax(520px, 1.3fr); gap: clamp(4rem, 9vw, 11rem); align-items: center; }
.about__art { position: relative; min-height: 660px; overflow: hidden; border: 1px solid var(--line); background: repeating-linear-gradient(112deg, #0a0a0a 0 16px, #111 16px 17px); display: flex; flex-direction: column; justify-content: center; }
.about__art span { font-size: clamp(7rem, 12vw, 14rem); font-weight: 800; line-height: .55; letter-spacing: -.12em; color: #181818; }
.about__art span:nth-child(2) { align-self: center; color: #222; }
.about__art span:nth-child(3) { align-self: end; color: var(--acid); }
.about__art small { position: absolute; left: 1.2rem; bottom: 1.2rem; color: #777; font: .62rem monospace; }
.about h2 { margin: 1.2rem 0 2.2rem; font-size: clamp(2.5rem, 4.4vw, 5rem); line-height: .98; letter-spacing: -.055em; }
.about__intro { max-width: 46rem; color: var(--muted); font-size: clamp(1rem, 1.35vw, 1.35rem); line-height: 1.75; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 3.7rem 0; padding-top: 1rem; border-top: 1px solid var(--line); }
.stats strong { display: block; font-size: clamp(1.7rem, 3vw, 3rem); letter-spacing: -.05em; }
.stats span { display: block; margin-top: .4rem; color: #686863; font: .63rem monospace; }
.timeline { margin: 0 0 2.5rem; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.timeline li { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; padding: 1.2rem 0; border-bottom: 1px solid var(--line); }
.timeline time { color: var(--acid); font: .68rem monospace; }
.timeline strong, .timeline span { display: block; }
.timeline span { margin-top: .3rem; color: var(--muted); font-size: .88rem; }
.honors { margin: 0 0 2.5rem; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.honors li { padding: .9rem 0; border-bottom: 1px solid var(--line); color: var(--muted); font-size: .9rem; }
.text-link { display: inline-block; border-bottom: 1px solid var(--paper); padding-bottom: .4rem; }

.section-head { display: flex; justify-content: space-between; align-items: end; padding-bottom: 1rem; border-bottom: 1px solid var(--line); color: var(--muted); font: .7rem monospace; }
.project { padding-top: clamp(4rem, 7vw, 8rem); }
.project__heading { display: grid; grid-template-columns: 1.25fr 1fr; gap: 4rem; align-items: end; }
.project__index { color: var(--acid); font: .72rem monospace; }
.project__heading h2 { margin: .7rem 0 .6rem; font-size: clamp(3.8rem, 7vw, 8rem); line-height: .86; letter-spacing: -.075em; }
.project__heading p { color: var(--muted); font-size: clamp(1rem, 1.5vw, 1.4rem); }
.project dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; border-top: 1px solid var(--line); padding-top: 1rem; }
.project dl div { min-width: 0; }
.project dt { margin-bottom: .45rem; color: #686863; font: .62rem monospace; text-transform: uppercase; }
.project dd { font-size: .82rem; line-height: 1.4; }
.project__description { max-width: 58rem; margin: 3.2rem 0; color: var(--muted); font-size: clamp(1.05rem, 1.55vw, 1.45rem); line-height: 1.7; }
.project figure { background: #111; overflow: hidden; }
.project img { width: 100%; transition: transform .65s cubic-bezier(.2,.7,.2,1); }
.project figure:hover img { transform: scale(1.018); }
.project__cover { aspect-ratio: 16/9; }
.project__cover img { height: 100%; object-fit: cover; }
.project figcaption { padding: .7rem .2rem 0; color: #676762; font: .61rem monospace; }
.project__gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: .8rem; margin-top: 4rem; align-items: start; }
.project__gallery img { width: 100%; aspect-ratio: 1240/1754; object-fit: cover; }

.strengths h2 { margin: 1.2rem 0 4rem; font-size: clamp(4rem, 8.5vw, 10rem); line-height: .79; letter-spacing: -.085em; }
.strengths__grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.strengths__grid article { min-height: 310px; padding: 1.4rem; border: 1px solid var(--line); margin-right: -1px; display: flex; flex-direction: column; justify-content: space-between; transition: background .25s, color .25s; }
.strengths__grid article > span { color: var(--acid); font: .68rem monospace; }
.strengths__grid h3 { font-size: clamp(1.4rem, 2.2vw, 2.3rem); letter-spacing: -.035em; }
.strengths__grid p { margin-top: 1rem; color: var(--muted); line-height: 1.65; }
.strengths__grid article:hover { background: var(--acid); color: var(--ink); }
.strengths__grid article:hover span, .strengths__grid article:hover p { color: var(--ink); }
.toolkit { margin-top: 1.4rem; color: #64645f; font: .65rem/1.7 monospace; letter-spacing: .07em; }

.contact { min-height: 100svh; background: var(--acid); color: var(--ink); }
.contact__inner { min-height: 100svh; padding: clamp(3rem, 7vw, 7rem) 0 2rem; display: flex; flex-direction: column; justify-content: space-between; }
.contact .eyebrow { color: #273000; }
.contact h2 { font-size: clamp(4.5rem, 11vw, 13.5rem); line-height: .72; letter-spacing: -.09em; }
.contact footer { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; padding-top: 1rem; border-top: 1px solid var(--ink); font: 700 .72rem monospace; }
.contact footer span { justify-self: end; }

@media (max-width: 1100px) {
  .about { grid-template-columns: .75fr 1.25fr; gap: 3rem; }
  .about__art { min-height: 520px; }
  .project__heading { grid-template-columns: 1fr; gap: 2rem; }
  .strengths__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 720px) {
  .shell { width: min(100% - 32px, var(--shell)); }
  .section { padding-block: 6rem; }
  .header { height: 72px; grid-template-columns: 1fr auto; }
  .header nav { display: none; }
  .hero__content { min-height: calc(100svh - 72px); padding-top: 6rem; }
  .hero h1 { font-size: clamp(4.3rem, 20vw, 7rem); }
  .hero__footer { align-items: start; gap: 1.5rem; flex-direction: column; }
  .about { grid-template-columns: 1fr; }
  .about__art { min-height: 360px; }
  .stats { grid-template-columns: 1fr 1fr; }
  .timeline li { grid-template-columns: 1fr; gap: .5rem; }
  .project dl { grid-template-columns: 1fr 1fr; }
  .project__gallery { grid-template-columns: 1fr; }
  .strengths__grid { grid-template-columns: 1fr; }
  .strengths__grid article { min-height: 230px; }
  .contact h2 { font-size: clamp(4rem, 19vw, 7rem); }
  .contact footer { grid-template-columns: 1fr auto; row-gap: 1.2rem; }
  .contact footer span { justify-self: start; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .hero__video { display: none; }
}
```

- [ ] **Step 5: Run the full test suite and commit**

Run: `pnpm test`

Expected: PASS, all tests.

Commit:

```bash
git add src
git commit -m "feat: compose dark editorial portfolio"
```

### Task 8: Generate the local Hero video and verify production output

**Files:**
- Create: `public/video/hero-loop.mp4`
- Modify: `.gitignore`

- [ ] **Step 1: Generate a restrained local motion background**

Run this FFmpeg command from the project root:

```bash
ffmpeg -y -loop 1 -i public/video/hero-poster.jpg -vf "scale=2200:-2,crop=1920:1080,zoompan=z='min(zoom+0.00025,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1920x1080:fps=30,eq=brightness=-0.48:contrast=1.1:saturation=0.72,fade=t=in:st=0:d=1,fade=t=out:st=9:d=1" -t 10 -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart public/video/hero-loop.mp4
```

Expected: a ten-second 1920×1080 H.264 MP4 with a slow zoom, dark exposure, no audio, and browser-compatible pixel format.

- [ ] **Step 2: Add repository hygiene rules**

Add these lines to `.gitignore`:

```gitignore
node_modules/
dist/
.DS_Store
.superpowers/
tmp/
```

- [ ] **Step 3: Run automated verification**

Run: `pnpm test && pnpm build`

Expected: all Vitest tests PASS; Vite reports a successful production build in `dist/`.

- [ ] **Step 4: Run the app and inspect desktop layouts**

Run: `pnpm dev`

Inspect at 1440×1000 and 1920×1080. Verify:

- no horizontal scrolling or clipped headings;
- video plays silently and the poster appears before playback;
- all four project images load without distortion;
- navigation reaches Work, About, and Contact;
- no phone number or portrait appears anywhere;
- email and back-to-top links are correct;
- Contact fills the viewport and forms a clean visual ending.

- [ ] **Step 5: Commit the verified asset and final polish**

```bash
git add .gitignore public/video src/styles.css
git commit -m "feat: add local hero motion and responsive polish"
```

### Task 9: Final evidence and handoff

**Files:**
- Verify only: all implementation files.

- [ ] **Step 1: Re-run final checks from a clean command**

Run: `pnpm test && pnpm build && git status --short`

Expected: tests and build succeed; only intentionally uncommitted files, if any, appear.

- [ ] **Step 2: Report the working preview**

Provide the local preview URL, the test/build evidence, the project asset locations, and any explicit next-step options for replacing the Hero video or adding later case studies.
