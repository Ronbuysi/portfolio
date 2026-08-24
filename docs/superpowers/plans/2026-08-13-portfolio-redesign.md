# Portfolio Alignment and Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated recruiter-focused redesign with one shared grid, four featured case studies, three expandable archive projects, and restrained scroll motion while preserving the current portfolio as a complete rollback version.

**Architecture:** Keep `codex/portfolio-base` and its worktree untouched as the old version. Create `codex/portfolio-redesign` in a separate worktree, layer the redesign through focused presentation data and components, and import a new `redesign.css` after the existing stylesheet so the original visual implementation remains available in Git without a destructive rewrite.

**Tech Stack:** React, Vite, Vitest, Testing Library, native CSS Grid, IntersectionObserver, requestAnimationFrame.

---

## File Map

- Create `src/data/projectPresentation.js`: maps existing project content into featured/archive presentation groups.
- Create `src/data/projectPresentation.test.js`: verifies the four featured and three archive projects and their order.
- Create `src/components/Reveal.jsx`: reusable one-time viewport reveal primitive.
- Create `src/components/Reveal.test.jsx`: verifies reveal behavior and no-observer fallback.
- Create `src/components/ParallaxMedia.jsx`: desktop-only 3–5% media parallax wrapper.
- Create `src/hooks/useParallax.js`: reduced-motion-aware requestAnimationFrame parallax hook.
- Create `src/hooks/useParallax.test.js`: verifies deterministic clamped media offsets.
- Create `src/components/ProjectIndex.jsx`: recruiter-facing overview of four featured projects.
- Create `src/components/ProjectIndex.test.jsx`: verifies links, order, labels, and covers.
- Create `src/components/ProjectArchive.jsx`: single-open expandable preview for three secondary projects.
- Create `src/components/ProjectArchive.test.jsx`: verifies accessible accordion behavior.
- Create `src/components/ProjectHeader.jsx`: shared featured-project title and metadata grid.
- Create `src/components/ProjectRail.jsx`: sticky project progress and current-section label.
- Create `src/hooks/useCaseProgress.js`: requestAnimationFrame-throttled case progress calculation.
- Create `src/hooks/useCaseProgress.test.js`: verifies progress clamping and current-heading selection.
- Create `src/components/FeaturedProject.jsx`: shared featured-case composition and story resolver.
- Create `src/redesign.css`: all new grid tokens, top-level layout, archive/index styling, motion, responsive behavior, and overrides.
- Create `src/redesign.test.js`: verifies grid tokens, zero letter spacing, mobile fallbacks, and reduced-motion rules.
- Modify `src/components/SelectedWork.jsx`: render project index, four featured projects, and archive.
- Modify `src/components/SelectedWork.test.jsx`: assert the new 4 + 3 information architecture.
- Modify `src/components/About.jsx`: add reveal boundaries and recruiter-focused layout hooks.
- Modify `src/components/Strengths.jsx`: add reveal boundaries without changing content.
- Modify `src/components/Contact.jsx`: add reveal boundary to the closing message.
- Modify `src/main.jsx`: import `redesign.css` after `styles.css`.

## Task 1: Create the isolated redesign worktree

**Files:**
- Preserve: `/Users/luoen/Documents/作品集网站/.worktrees/portfolio-base`
- Create worktree: `/Users/luoen/Documents/作品集网站/.worktrees/portfolio-redesign`

- [ ] **Step 1: Confirm the old branch is clean apart from known unrelated untracked deployment artifacts**

Run:

```bash
git -C /Users/luoen/Documents/作品集网站/.worktrees/portfolio-base status --short
```

Expected: no modified tracked source files; `deploy/`, `dist-upload/`, and Python cache directories may remain untracked.

- [ ] **Step 2: Create the redesign branch in its own worktree**

Run:

```bash
git -C /Users/luoen/Documents/作品集网站/.worktrees/portfolio-base worktree add /Users/luoen/Documents/作品集网站/.worktrees/portfolio-redesign -b codex/portfolio-redesign codex/portfolio-base
```

Expected: a new worktree on `codex/portfolio-redesign`; `codex/portfolio-base` remains checked out in the old worktree.

- [ ] **Step 3: Verify both versions are independently addressable**

Run:

```bash
git worktree list
```

Expected: separate rows for `portfolio-base` and `portfolio-redesign` on different branches.

## Task 2: Define presentation groups without mutating project content

**Files:**
- Create: `src/data/projectPresentation.js`
- Test: `src/data/projectPresentation.test.js`

- [ ] **Step 1: Write the failing grouping test**

```js
import { describe, expect, test } from 'vitest'
import { archiveProjects, featuredProjects } from './projectPresentation'

describe('project presentation groups', () => {
  test('uses four recruiter-facing featured projects in the approved order', () => {
    expect(featuredProjects.map(({ id }) => id)).toEqual([
      'farmers-market',
      'my-may-pizza',
      'toss-diary',
      'sanfu-lifestyle',
    ])
  })

  test('keeps the remaining three projects in the archive', () => {
    expect(archiveProjects.map(({ id }) => id)).toEqual([
      'lanmu-rice',
      'daodao-bar',
      'horsh-growth',
    ])
    expect(archiveProjects.every(({ archivePreview }) => archivePreview.length <= 2)).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `pnpm test -- src/data/projectPresentation.test.js`

Expected: FAIL because `projectPresentation.js` does not exist.

- [ ] **Step 3: Add presentation metadata and derived exports**

```js
import { assetUrl } from '../utils/assetUrl'
import { projects } from './projects'

const presentationById = {
  'farmers-market': {
    displayMode: 'featured', displayOrder: 1,
    indexCover: assetUrl('/images/operation-cover.png'),
    shortSummary: '从海报语言扩展到市场空间、摊位工具与持续运营内容。',
  },
  'my-may-pizza': {
    displayMode: 'featured', displayOrder: 2,
    indexCover: assetUrl('/images/my-may-brand/my-may-street-corner.png'),
    shortSummary: '以猫咪与披萨建立一套温暖、完整且可落地的品牌世界。',
  },
  'toss-diary': {
    displayMode: 'featured', displayOrder: 3,
    indexCover: assetUrl('/images/toss-diary/toss-hero-dark.png'),
    shortSummary: '从角色 DNA 出发，延展到包装、活动、空间和数字触点。',
  },
  'sanfu-lifestyle': {
    displayMode: 'featured', displayOrder: 4,
    indexCover: assetUrl('/images/sanfu-campaign/campaign-hero.png'),
    shortSummary: '用拼图机制连接三类生活状态与完整零售传播路径。',
  },
  'lanmu-rice': {
    displayMode: 'archive', displayOrder: 1,
    indexCover: assetUrl('/images/packaging-redesign/hero-dark.png'),
    shortSummary: '以四季农耕叙事建立富硒米包装与结构系统。',
    archivePreview: [
      assetUrl('/images/packaging-redesign/hero-dark.png'),
      assetUrl('/images/packaging-redesign/system-family-archive.png'),
    ],
  },
  'daodao-bar': {
    displayMode: 'archive', displayOrder: 2,
    indexCover: assetUrl('/images/daodao-bar/extensions/bar-exterior-hero.png'),
    shortSummary: '围绕 11 PM、树懒和倾倒动作建立深夜品牌系统。',
    archivePreview: [
      assetUrl('/images/daodao-bar/extensions/bar-exterior-hero.png'),
      assetUrl('/images/daodao-bar/originals/identity-system.jpg'),
    ],
  },
  'horsh-growth': {
    displayMode: 'archive', displayOrder: 3,
    indexCover: assetUrl('/images/poster-projects/horsh-timeline-stage.png'),
    shortSummary: '以童年与职场物件替换构成成长主题双联海报。',
    archivePreview: [
      assetUrl('/images/poster-projects/horsh-childhood.jpg'),
      assetUrl('/images/poster-projects/horsh-grown-up.jpg'),
    ],
  },
}

export const presentedProjects = projects
  .map((project) => ({ ...project, ...presentationById[project.id] }))

export const featuredProjects = presentedProjects
  .filter(({ displayMode }) => displayMode === 'featured')
  .sort((a, b) => a.displayOrder - b.displayOrder)

export const archiveProjects = presentedProjects
  .filter(({ displayMode }) => displayMode === 'archive')
  .sort((a, b) => a.displayOrder - b.displayOrder)
```

- [ ] **Step 4: Run the grouping test**

Run: `pnpm test -- src/data/projectPresentation.test.js`

Expected: PASS with 2 tests.

- [ ] **Step 5: Commit the presentation model**

```bash
git add src/data/projectPresentation.js src/data/projectPresentation.test.js
git commit -m "feat: define portfolio presentation groups"
```

## Task 3: Add the shared reveal primitive

**Files:**
- Create: `src/components/Reveal.jsx`
- Test: `src/components/Reveal.test.jsx`

- [ ] **Step 1: Write the failing Reveal tests**

```jsx
import { act, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import Reveal from './Reveal'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('reveals content when it enters the viewport', () => {
  let callback
  vi.stubGlobal('IntersectionObserver', class {
    constructor(next) { callback = next }
    observe() {}
    disconnect() {}
  })
  render(<Reveal><span>Project title</span></Reveal>)
  const region = screen.getByText('Project title').parentElement
  expect(region).not.toHaveClass('reveal--visible')
  act(() => callback([{ isIntersecting: true }]))
  expect(region).toHaveClass('reveal--visible')
})

test('shows content immediately when IntersectionObserver is unavailable', () => {
  vi.stubGlobal('IntersectionObserver', undefined)
  render(<Reveal><span>Always readable</span></Reveal>)
  expect(screen.getByText('Always readable').parentElement).toHaveClass('reveal--visible')
})
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `pnpm test -- src/components/Reveal.test.jsx`

Expected: FAIL because `Reveal.jsx` does not exist.

- [ ] **Step 3: Implement one-time reveal behavior**

```jsx
import { useEffect, useRef, useState } from 'react'

export default function Reveal({ as: Tag = 'div', children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (visible || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return <Tag
    ref={ref}
    className={`reveal${visible ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`}
    style={{ '--reveal-delay': `${delay}ms` }}
  >{children}</Tag>
}
```

- [ ] **Step 4: Run the Reveal tests**

Run: `pnpm test -- src/components/Reveal.test.jsx`

Expected: PASS with 2 tests.

- [ ] **Step 5: Commit the motion primitive**

```bash
git add src/components/Reveal.jsx src/components/Reveal.test.jsx
git commit -m "feat: add viewport reveal primitive"
```

## Task 3A: Add lightweight desktop parallax

**Files:**
- Create: `src/hooks/useParallax.js`
- Create: `src/hooks/useParallax.test.js`
- Create: `src/components/ParallaxMedia.jsx`

- [ ] **Step 1: Write the failing parallax helper test**

```js
import { expect, test } from 'vitest'
import { calculateParallaxOffset } from './useParallax'

test('keeps media parallax inside the approved five-percent range', () => {
  expect(calculateParallaxOffset({ top: 800, height: 600 }, 800)).toBe(5)
  expect(calculateParallaxOffset({ top: 100, height: 600 }, 800)).toBe(0)
  expect(calculateParallaxOffset({ top: -600, height: 600 }, 800)).toBe(-5)
})
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `pnpm test -- src/hooks/useParallax.test.js`

Expected: FAIL because `useParallax.js` does not exist.

- [ ] **Step 3: Implement the reduced-motion-aware hook**

```js
import { useEffect } from 'react'

export function calculateParallaxOffset(rect, viewportHeight) {
  const center = rect.top + rect.height / 2
  const normalized = (center - viewportHeight / 2) / viewportHeight
  return Math.max(-5, Math.min(5, normalized * 10))
}

export default function useParallax(ref) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 720px)').matches
    if (reduced || narrow) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const node = ref.current
      if (!node) return
      const offset = calculateParallaxOffset(node.getBoundingClientRect(), window.innerHeight)
      node.style.setProperty('--parallax-y', `${offset}%`)
    }
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}
```

- [ ] **Step 4: Add the media wrapper**

```jsx
import { useRef } from 'react'
import useParallax from '../hooks/useParallax'

export default function ParallaxMedia({ children, className = '' }) {
  const ref = useRef(null)
  useParallax(ref)
  return <div ref={ref} className={`parallax-media${className ? ` ${className}` : ''}`}>{children}</div>
}
```

- [ ] **Step 5: Run the parallax test**

Run: `pnpm test -- src/hooks/useParallax.test.js`

Expected: PASS with 1 test.

- [ ] **Step 6: Commit the parallax primitive**

```bash
git add src/hooks/useParallax.js src/hooks/useParallax.test.js src/components/ParallaxMedia.jsx
git commit -m "feat: add restrained media parallax"
```

## Task 4: Build the featured project index

**Files:**
- Create: `src/components/ProjectIndex.jsx`
- Test: `src/components/ProjectIndex.test.jsx`

- [ ] **Step 1: Write the failing project-index test**

```jsx
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { featuredProjects } from '../data/projectPresentation'
import ProjectIndex from './ProjectIndex'

vi.stubGlobal('IntersectionObserver', undefined)

test('renders four ordered links to featured cases', () => {
  render(<ProjectIndex projects={featuredProjects} />)
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(4)
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '#farmers-market', '#my-may-pizza', '#toss-diary', '#sanfu-lifestyle',
  ])
  expect(screen.getByText('运营视觉设计')).toBeInTheDocument()
  expect(screen.getByText('MY MAY 品牌设计')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `pnpm test -- src/components/ProjectIndex.test.jsx`

Expected: FAIL because `ProjectIndex.jsx` does not exist.

- [ ] **Step 3: Implement the accessible index**

```jsx
import Reveal from './Reveal'
import ResponsiveImage from './ResponsiveImage'

export default function ProjectIndex({ projects }) {
  return <nav className="project-index" aria-label="重点项目">
    {projects.map((project, index) => <Reveal className="project-index__item" delay={index * 80} key={project.id}>
      <a href={`#${project.id}`}>
        <figure><ResponsiveImage src={project.indexCover} alt={`${project.title}项目封面`} loading="lazy" /></figure>
        <div className="project-index__meta">
          <span>0{index + 1} / {project.category}</span>
          <h3>{project.title}</h3>
          <p>{project.shortSummary}</p>
          <b>查看案例 ↓</b>
        </div>
      </a>
    </Reveal>)}
  </nav>
}
```

- [ ] **Step 4: Run the project-index test**

Run: `pnpm test -- src/components/ProjectIndex.test.jsx`

Expected: PASS with 1 test.

- [ ] **Step 5: Commit the project index**

```bash
git add src/components/ProjectIndex.jsx src/components/ProjectIndex.test.jsx
git commit -m "feat: add recruiter project index"
```

## Task 5: Build the single-open archive

**Files:**
- Create: `src/components/ProjectArchive.jsx`
- Test: `src/components/ProjectArchive.test.jsx`

- [ ] **Step 1: Write the failing accordion test**

```jsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { archiveProjects } from '../data/projectPresentation'
import ProjectArchive from './ProjectArchive'

vi.stubGlobal('IntersectionObserver', undefined)

test('keeps only one archive preview expanded', () => {
  render(<ProjectArchive projects={archiveProjects} />)
  const packaging = screen.getByRole('button', { name: /包装设计/ })
  const bar = screen.getByRole('button', { name: /倒倒 bar 品牌设计/ })
  expect(packaging).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(packaging)
  expect(packaging).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(bar)
  expect(packaging).toHaveAttribute('aria-expanded', 'false')
  expect(bar).toHaveAttribute('aria-expanded', 'true')
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `pnpm test -- src/components/ProjectArchive.test.jsx`

Expected: FAIL because `ProjectArchive.jsx` does not exist.

- [ ] **Step 3: Implement the archive component**

```jsx
import { useState } from 'react'
import Reveal from './Reveal'
import ResponsiveImage from './ResponsiveImage'

export default function ProjectArchive({ projects }) {
  const [openId, setOpenId] = useState(null)
  return <section className="project-archive" aria-labelledby="archive-title">
    <div className="project-archive__head">
      <p className="eyebrow">SELECTED ARCHIVE</p>
      <h2 id="archive-title">更多项目</h2>
    </div>
    <div className="project-archive__grid">
      {projects.map((project, index) => {
        const expanded = openId === project.id
        const panelId = `${project.id}-preview`
        return <Reveal as="article" className="project-archive__item" delay={index * 80} key={project.id}>
          <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpenId(expanded ? null : project.id)}>
            <figure><ResponsiveImage src={project.indexCover} alt={`${project.title}归档封面`} loading="lazy" /></figure>
            <span>0{index + 5} / {project.category}</span>
            <strong>{project.title}</strong>
            <small>{expanded ? '收起预览 ↑' : '展开预览 ↓'}</small>
          </button>
          {expanded && <div className="project-archive__preview" id={panelId}>
            <p>{project.shortSummary}</p>
            <div>{project.archivePreview.map((src, imageIndex) => <ResponsiveImage src={src} alt={`${project.title}预览 ${imageIndex + 1}`} loading="lazy" key={src} />)}</div>
          </div>}
        </Reveal>
      })}
    </div>
  </section>
}
```

- [ ] **Step 4: Run the archive test**

Run: `pnpm test -- src/components/ProjectArchive.test.jsx`

Expected: PASS with 1 test.

- [ ] **Step 5: Commit the archive**

```bash
git add src/components/ProjectArchive.jsx src/components/ProjectArchive.test.jsx
git commit -m "feat: add expandable project archive"
```

## Task 6: Add featured-case header and progress rail

**Files:**
- Create: `src/components/ProjectHeader.jsx`
- Create: `src/components/ProjectRail.jsx`
- Create: `src/hooks/useCaseProgress.js`
- Test: `src/hooks/useCaseProgress.test.js`

- [ ] **Step 1: Write failing pure-helper tests**

```js
import { expect, test } from 'vitest'
import { calculateCaseProgress, currentHeadingLabel } from './useCaseProgress'

test('clamps case progress between zero and one', () => {
  expect(calculateCaseProgress({ top: 900, height: 2000 }, 800)).toBe(0)
  expect(calculateCaseProgress({ top: -600, height: 2000 }, 800)).toBeCloseTo(.5)
  expect(calculateCaseProgress({ top: -2400, height: 2000 }, 800)).toBe(1)
})

test('uses the last heading above the reading line', () => {
  expect(currentHeadingLabel([
    { top: 100, text: 'Overview' },
    { top: 500, text: 'Applications' },
  ], 360)).toBe('Overview')
})
```

- [ ] **Step 2: Run the helper tests and verify failure**

Run: `pnpm test -- src/hooks/useCaseProgress.test.js`

Expected: FAIL because `useCaseProgress.js` does not exist.

- [ ] **Step 3: Implement the hook and pure helpers**

```js
import { useEffect, useState } from 'react'

export function calculateCaseProgress(rect, viewportHeight) {
  const distance = Math.max(rect.height - viewportHeight, 1)
  return Math.min(1, Math.max(0, -rect.top / distance))
}

export function currentHeadingLabel(headings, readingLine) {
  return headings.filter(({ top }) => top <= readingLine).at(-1)?.text || 'OVERVIEW'
}

export default function useCaseProgress(articleRef) {
  const [state, setState] = useState({ progress: 0, label: 'OVERVIEW' })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const article = articleRef.current
      if (!article) return
      const rect = article.getBoundingClientRect()
      const headings = [...article.querySelectorAll('h3')].map((heading) => ({
        top: heading.getBoundingClientRect().top,
        text: heading.textContent.trim(),
      }))
      setState({
        progress: calculateCaseProgress(rect, window.innerHeight),
        label: currentHeadingLabel(headings, window.innerHeight * .45),
      })
    }
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [articleRef])
  return state
}
```

- [ ] **Step 4: Add the shared project header and rail**

```jsx
// src/components/ProjectHeader.jsx
import Reveal from './Reveal'

export default function ProjectHeader({ project, order }) {
  return <Reveal className="project-header">
    <div className="project-header__identity">
      <span>0{order} / {project.category}</span>
      <h2>{project.title}</h2>
      <p>{project.englishTitle}</p>
    </div>
    <dl>
      {project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}
      {project.scope && <div><dt>Scope</dt><dd>{project.scope}</dd></div>}
      {project.tools && <div><dt>Tools</dt><dd>{project.tools}</dd></div>}
    </dl>
    <p className="project-header__summary">{project.description}</p>
  </Reveal>
}
```

```jsx
// src/components/ProjectRail.jsx
export default function ProjectRail({ order, project, progress, label }) {
  return <aside className="project-rail" aria-label={`${project.title}浏览进度`}>
    <span>0{order}</span>
    <strong>{project.category}</strong>
    <p>{label}</p>
    <div aria-hidden="true"><i style={{ transform: `scaleY(${progress})` }} /></div>
  </aside>
}
```

- [ ] **Step 5: Run the hook tests**

Run: `pnpm test -- src/hooks/useCaseProgress.test.js`

Expected: PASS with 2 tests.

- [ ] **Step 6: Commit the header and rail**

```bash
git add src/components/ProjectHeader.jsx src/components/ProjectRail.jsx src/hooks/useCaseProgress.js src/hooks/useCaseProgress.test.js
git commit -m "feat: add featured case navigation"
```

## Task 7: Compose featured projects and rewire SelectedWork

**Files:**
- Create: `src/components/FeaturedProject.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`

- [ ] **Step 1: Replace the old seven-full-story expectation with the 4 + 3 contract**

```jsx
test('renders four full case studies and three archive entries', () => {
  const { container } = render(<SelectedWork />)
  expect(container.querySelectorAll('.featured-project')).toHaveLength(4)
  expect(container.querySelectorAll('.project-archive__item')).toHaveLength(3)
  expect(screen.getByRole('heading', { name: '运营视觉设计' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'MY MAY 品牌设计' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'TOSS DIARY IP 设计' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '生活新搭案' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /包装设计/ })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /倒倒 bar 品牌设计/ })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /成长日常/ })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the SelectedWork test and verify the expected failure**

Run: `pnpm test -- src/components/SelectedWork.test.jsx`

Expected: FAIL because all seven projects are still rendered as full `.project` articles.

- [ ] **Step 3: Implement FeaturedProject**

```jsx
import { useRef } from 'react'
import BrandStory from './BrandStory'
import IpStory from './IpStory'
import OperationStory from './OperationStory'
import ParallaxMedia from './ParallaxMedia'
import ProjectHeader from './ProjectHeader'
import ProjectRail from './ProjectRail'
import Reveal from './Reveal'
import ResponsiveImage from './ResponsiveImage'
import SanfuCampaignStory from './SanfuCampaignStory'
import useCaseProgress from '../hooks/useCaseProgress'

const stories = {
  operation: OperationStory,
  brand: BrandStory,
  ip: IpStory,
  campaign: SanfuCampaignStory,
}

export default function FeaturedProject({ project, order }) {
  const articleRef = useRef(null)
  const { progress, label } = useCaseProgress(articleRef)
  const Story = stories[project.story]
  const themeClasses = [project.theme && `project--${project.theme}`, project.story && `project--${project.story}`].filter(Boolean).join(' ')
  return <article ref={articleRef} id={project.id} className={`project featured-project ${themeClasses}`}>
    <ProjectHeader project={project} order={order} />
    <Reveal className="featured-project__hero">
      <ParallaxMedia>
        <figure><ResponsiveImage src={project.indexCover} alt={`${project.title}核心视觉`} loading="lazy" /></figure>
      </ParallaxMedia>
    </Reveal>
    <div className="featured-project__body">
      <ProjectRail project={project} order={order} progress={progress} label={label} />
      <div className="featured-project__story"><Story project={project} /></div>
    </div>
  </article>
}
```

- [ ] **Step 4: Rebuild SelectedWork around the new information architecture**

```jsx
import { archiveProjects, featuredProjects } from '../data/projectPresentation'
import FeaturedProject from './FeaturedProject'
import ProjectArchive from './ProjectArchive'
import ProjectIndex from './ProjectIndex'

export default function SelectedWork() {
  return <section id="work" className="work section shell">
    <div className="section-head">
      <p className="eyebrow">SELECTED WORK</p>
      <span>04 FEATURED / 03 ARCHIVE</span>
    </div>
    <ProjectIndex projects={featuredProjects} />
    <div className="featured-projects">
      {featuredProjects.map((project, index) => <FeaturedProject project={project} order={index + 1} key={project.id} />)}
    </div>
    <ProjectArchive projects={archiveProjects} />
  </section>
}
```

- [ ] **Step 5: Run SelectedWork and content tests**

Run: `pnpm test -- src/components/SelectedWork.test.jsx src/data/content.test.js`

Expected: PASS; four full cases, three archive controls, and all original operation artwork remain available.

- [ ] **Step 6: Commit the information architecture**

```bash
git add src/components/FeaturedProject.jsx src/components/SelectedWork.jsx src/components/SelectedWork.test.jsx
git commit -m "feat: restructure portfolio case studies"
```

## Task 8: Add the redesign stylesheet and top-level reveal hooks

**Files:**
- Create: `src/redesign.css`
- Create: `src/redesign.test.js`
- Modify: `src/main.jsx`
- Modify: `src/components/About.jsx`
- Modify: `src/components/Strengths.jsx`
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Write failing CSS-contract tests**

```js
import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

const css = readFileSync('src/redesign.css', 'utf8')

test('defines one recruiter-focused grid and spacing system', () => {
  expect(css).toContain('--layout-columns: 12')
  expect(css).toContain('--space-section: clamp(6rem, 9vw, 10rem)')
  expect(css).toMatch(/\.portfolio-grid\s*{[^}]*grid-template-columns:\s*repeat\(var\(--layout-columns\)/s)
})

test('keeps visible typography at zero letter spacing', () => {
  expect(css).toMatch(/body\s*{[^}]*letter-spacing:\s*0/s)
})

test('disables reveal motion, sticky rails, and parallax on reduced motion or mobile', () => {
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.reveal[^}]*transform:\s*none/s)
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*?\.project-rail[^}]*position:\s*static/s)
})
```

- [ ] **Step 2: Run the CSS tests and verify failure**

Run: `pnpm test -- src/redesign.test.js`

Expected: FAIL because `redesign.css` does not exist.

- [ ] **Step 3: Create the stylesheet with the approved tokens and component rules**

Create `src/redesign.css` with these complete sections:

```css
:root {
  --layout-columns: 12;
  --layout-max: 1600px;
  --layout-gutter: 24px;
  --page-edge: 32px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 48px;
  --space-5: 96px;
  --space-section: clamp(6rem, 9vw, 10rem);
}

body { letter-spacing: 0; }
body :where(h1, h2, h3, h4, p, a, span, strong, small, dt, dd, time) { letter-spacing: 0; }
.shell { width: min(var(--layout-max), calc(100vw - (2 * var(--page-edge)))); }
.section { padding-block: var(--space-section); }
.portfolio-grid { display: grid; grid-template-columns: repeat(var(--layout-columns), minmax(0, 1fr)); gap: var(--layout-gutter); }

.reveal { opacity: 0; transform: translate3d(0, 24px, 0); transition: opacity 560ms cubic-bezier(.2,.7,.2,1), transform 560ms cubic-bezier(.2,.7,.2,1); transition-delay: var(--reveal-delay); }
.reveal--visible { opacity: 1; transform: translate3d(0, 0, 0); }

.about__lead { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--layout-gutter); }
.about__portrait { grid-column: 1 / span 3; width: auto; }
.about__lead-copy { grid-column: 5 / span 7; }
.about__details { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--layout-gutter); }
.stats { grid-column: 1 / -1; }
.timeline { grid-column: 1 / span 7; }
.honors-block { grid-column: 9 / -1; }
.about__details > .text-link { grid-column: 9 / -1; justify-self: start; }

.project-index { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--layout-gutter); margin-top: var(--space-4); }
.project-index__item { min-width: 0; }
.project-index__item a { height: 100%; display: grid; grid-template-rows: auto 1fr; border: 1px solid var(--line); background: #0d0d0d; }
.project-index__item figure { aspect-ratio: 16 / 10; overflow: hidden; }
.project-index__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 500ms cubic-bezier(.2,.7,.2,1); }
.project-index__meta { min-height: 14rem; padding: var(--space-3); display: flex; flex-direction: column; align-items: flex-start; }
.project-index__meta span, .project-index__meta b { color: var(--acid); font: 650 .62rem/1.2 ui-monospace, monospace; }
.project-index__meta h3 { margin-top: auto; font-size: clamp(2rem, 4vw, 4.5rem); line-height: .92; }
.project-index__meta p { margin-top: var(--space-2); max-width: 34rem; color: var(--muted); line-height: 1.7; }
.project-index__meta b { margin-top: var(--space-3); }
.project-index__item a:hover, .project-index__item a:focus-visible { border-color: var(--acid); }
.project-index__item a:hover img, .project-index__item a:focus-visible img { transform: scale(1.02); }

.featured-project { margin-top: clamp(9rem, 14vw, 15rem); padding-top: 0; scroll-margin-top: 2rem; }
.project-header { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--layout-gutter); padding-block: var(--space-4); border-top: 1px solid var(--line); }
.project-header__identity { grid-column: 1 / span 7; }
.project-header__identity > span { color: var(--acid); font: 650 .65rem/1.2 ui-monospace, monospace; }
.project-header h2 { margin-top: var(--space-2); font-size: clamp(3.5rem, 7vw, 8rem); line-height: .88; }
.project-header__identity > p { margin-top: var(--space-1); color: var(--muted); }
.project-header dl { grid-column: 9 / -1; display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); padding: 0; outline: 0; background: none; backdrop-filter: none; }
.project-header__summary { grid-column: 5 / span 6; margin-top: var(--space-3); color: var(--muted); font-size: clamp(1rem, 1.4vw, 1.3rem); line-height: 1.75; }
.featured-project__hero { aspect-ratio: 16 / 9; overflow: hidden; }
.parallax-media, .featured-project__hero figure, .featured-project__hero img { width: 100%; height: 100%; }
.parallax-media figure { transform: translate3d(0, var(--parallax-y, 0), 0) scale(1.05); }
.featured-project__hero img { object-fit: cover; transform: scale(1.03); transition: transform 900ms cubic-bezier(.2,.7,.2,1); }
.featured-project__hero.reveal--visible img { transform: scale(1); }
.featured-project__body { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--layout-gutter); margin-top: var(--space-5); align-items: start; }
.project-rail { grid-column: 1 / span 3; position: sticky; top: var(--space-3); min-height: 20rem; padding-right: var(--space-3); display: flex; flex-direction: column; }
.project-rail > span { color: var(--acid); font: 700 .7rem/1 ui-monospace, monospace; }
.project-rail > strong { margin-top: var(--space-2); font-size: 1rem; }
.project-rail > p { margin-top: auto; color: var(--muted); font: .62rem/1.4 ui-monospace, monospace; text-transform: uppercase; }
.project-rail > div { width: 1px; height: 7rem; margin-top: var(--space-2); background: var(--line); overflow: hidden; }
.project-rail i { display: block; width: 100%; height: 100%; background: var(--acid); transform-origin: top; }
.featured-project__story { grid-column: 4 / -1; min-width: 0; }
.featured-project__story > :first-child { margin-top: 0; }

.operation-story__grammar-copy, .operation-story__system-head,
.sanfu-campaign__section-head, .sanfu-campaign__extension-copy,
.brand-story__extension-copy,
.ip-story__foundation-copy, .ip-story__system-head, .ip-story__extension-copy {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--layout-gutter);
}
.operation-story__grammar-copy > span, .operation-story__system-head > span,
.sanfu-campaign__section-head > span, .brand-story__extension-copy > span,
.ip-story__foundation-copy > span, .ip-story__system-head > span, .ip-story__extension-copy > span { grid-column: 1 / span 2; }
.operation-story__grammar-copy > h3, .operation-story__system-head > h3,
.sanfu-campaign__section-head > h3, .brand-story__extension-copy > h3,
.ip-story__foundation-copy > h3, .ip-story__system-head > h3, .ip-story__extension-copy > h3 { grid-column: 3 / span 6; }
.operation-story__grammar-copy > p, .operation-story__system-head > p,
.sanfu-campaign__section-head > p, .brand-story__extension-copy > p,
.ip-story__foundation-copy > p, .ip-story__system-head > p, .ip-story__extension-copy > p { grid-column: 9 / -1; }
.sanfu-campaign__extension-copy > h3 { grid-column: 1 / span 7; }
.sanfu-campaign__extension-copy > p { grid-column: 9 / -1; }
.brand-story__concept { grid-template-columns: repeat(12, minmax(0, 1fr)); }
.brand-story__concept > h3 { grid-column: 1 / span 7; }
.brand-story__concept > p { grid-column: 9 / -1; }

.project-archive { margin-top: clamp(10rem, 16vw, 17rem); padding-top: var(--space-4); border-top: 1px solid var(--line); }
.project-archive__head { display: flex; justify-content: space-between; align-items: end; }
.project-archive__head h2 { font-size: clamp(2.5rem, 5vw, 6rem); }
.project-archive__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--layout-gutter); margin-top: var(--space-4); align-items: start; }
.project-archive__item { border: 1px solid var(--line); background: #0d0d0d; }
.project-archive__item button { width: 100%; padding: 0; border: 0; color: inherit; background: transparent; text-align: left; cursor: pointer; }
.project-archive__item button figure { aspect-ratio: 4 / 3; overflow: hidden; }
.project-archive__item button img { width: 100%; height: 100%; object-fit: cover; }
.project-archive__item button > span, .project-archive__item button > strong, .project-archive__item button > small { display: block; margin-inline: var(--space-2); }
.project-archive__item button > span { margin-top: var(--space-2); color: var(--acid); font: .6rem/1.2 ui-monospace, monospace; }
.project-archive__item button > strong { margin-top: var(--space-3); font-size: 1.35rem; }
.project-archive__item button > small { margin-block: var(--space-2); color: var(--muted); }
.project-archive__preview { grid-column: 1 / -1; padding: var(--space-3); border-top: 1px solid var(--line); }
.project-archive__preview p { max-width: 32rem; color: var(--muted); line-height: 1.7; }
.project-archive__preview > div { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); margin-top: var(--space-3); }

.strengths__grid { grid-template-columns: repeat(2, 1fr); }
.strengths__grid > .reveal { min-width: 0; }
.contact__inner { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--layout-gutter); }
.contact__inner > .eyebrow { grid-column: 1 / -1; }
.contact h2 { grid-column: 1 / span 10; align-self: center; }
.contact footer { grid-column: 1 / -1; }

@media (max-width: 960px) {
  :root { --page-edge: 24px; --layout-gutter: 20px; }
  .about__portrait { grid-column: 1 / span 4; }
  .about__lead-copy { grid-column: 6 / -1; }
  .project-header__identity { grid-column: 1 / span 8; }
  .project-header dl { grid-column: 9 / -1; }
}

@media (max-width: 720px) {
  :root { --page-edge: 16px; --layout-gutter: 16px; --space-section: 6rem; }
  .about__lead, .about__details, .project-header, .featured-project__body, .contact__inner { grid-template-columns: 1fr; }
  .about__portrait, .about__lead-copy, .stats, .timeline, .honors-block, .about__details > .text-link,
  .project-header__identity, .project-header dl, .project-header__summary, .project-rail, .featured-project__story,
  .contact__inner > .eyebrow, .contact h2, .contact footer { grid-column: 1; }
  .about__portrait { width: min(58vw, 230px); }
  .about__lead-copy { margin-top: var(--space-3); }
  .about h2 { font-size: clamp(2rem, 9vw, 3rem); }
  .project-index, .project-archive__grid { grid-template-columns: 1fr; }
  .project-header dl { margin-top: var(--space-3); }
  .project-header__summary { margin-top: var(--space-2); }
  .project-rail { position: static; min-height: auto; padding: var(--space-2) 0; border-bottom: 1px solid var(--line); }
  .project-rail > p, .project-rail > div { display: none; }
  .featured-project__body { margin-top: var(--space-4); }
  .project-archive__preview > div { grid-template-columns: 1fr; }
  .strengths__grid { grid-template-columns: 1fr; }
  .parallax-media figure { transform: none; }
  .operation-story__grammar-copy, .operation-story__system-head,
  .sanfu-campaign__section-head, .sanfu-campaign__extension-copy,
  .brand-story__concept, .brand-story__extension-copy,
  .ip-story__foundation-copy, .ip-story__system-head, .ip-story__extension-copy { grid-template-columns: 1fr; }
  .operation-story__grammar-copy > *, .operation-story__system-head > *,
  .sanfu-campaign__section-head > *, .sanfu-campaign__extension-copy > *,
  .brand-story__concept > *, .brand-story__extension-copy > *,
  .ip-story__foundation-copy > *, .ip-story__system-head > *, .ip-story__extension-copy > * { grid-column: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal--visible { opacity: 1; transform: none; transition: none; }
  .featured-project__hero img, .project-index__item img { transform: none; transition: none; }
  .parallax-media figure { transform: none; }
}
```

- [ ] **Step 4: Import the new stylesheet after the old stylesheet**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './redesign.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
```

- [ ] **Step 5: Replace existing top-level elements with Reveal while preserving their DOM shape**

Add `import Reveal from './Reveal'` to `About.jsx`, `Strengths.jsx`, and `Contact.jsx`.

In `About.jsx`, replace only the existing wrapper tags; keep their full current children unchanged:

```jsx
<Reveal className="about__lead-copy">
  <p className="eyebrow">PROFILE / 2026</p>
  <h2>把视觉直觉，变成<br />清晰有力的设计语言。</h2>
  <p className="about__intro">{profile.introduction}</p>
</Reveal>
```

Change `<div className="about__details">` to `<Reveal className="about__details">` and its matching closing `</div>` to `</Reveal>`. Do not add another wrapper.

In `Strengths.jsx`, replace the current `h2` with the same semantic element rendered by Reveal:

```jsx
<Reveal as="h2" aria-label="Four ways I create value.">FOUR WAYS<br />I CREATE VALUE<span>.</span></Reveal>
```

Extend `Reveal` to pass remaining props to `Tag` so the `aria-label` is preserved:

```jsx
import { useEffect, useRef, useState } from 'react'

export default function Reveal({ as: Tag = 'div', children, className = '', delay = 0, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (visible || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return <Tag
    {...props}
    ref={ref}
    className={`reveal${visible ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`}
    style={{ '--reveal-delay': `${delay}ms` }}
  >{children}</Tag>
}
```

In `Contact.jsx`, replace the current `h2` with:

```jsx
<Reveal as="h2">LET&apos;S MAKE<br />SOMETHING<br />MEMORABLE.</Reveal>
```

These replacements preserve the existing selectors `.about__lead-copy`, `.about__details`, `.strengths h2`, and `.contact h2`, so no card nesting or layout wrapper is introduced.

- [ ] **Step 6: Run CSS, component, and full tests**

Run: `pnpm test`

Expected: all existing and new Vitest tests PASS.

- [ ] **Step 7: Commit the visual system**

```bash
git add src/redesign.css src/redesign.test.js src/main.jsx src/components/Reveal.jsx src/components/About.jsx src/components/Strengths.jsx src/components/Contact.jsx
git commit -m "feat: apply unified portfolio grid and motion"
```

## Task 9: Visual QA and responsive correction

**Files:**
- Modify: `src/redesign.css`
- Verify: `src/components/FeaturedProject.jsx`
- Verify: `src/components/ProjectArchive.jsx`
- Verify: `src/components/ProjectIndex.jsx`
- Verify: `src/components/ProjectRail.jsx`

- [ ] **Step 1: Run the full automated suite**

Run: `pnpm test`

Expected: all tests PASS with no unhandled React warnings.

- [ ] **Step 2: Build the isolated redesign**

Run: `pnpm build`

Expected: Vite exits with code 0 and writes `dist/`.

- [ ] **Step 3: Start the redesign preview on a separate port**

Run: `pnpm dev -- --port 5174`

Expected: the redesign is available at `http://localhost:5174/`; the old version can still be run from `portfolio-base` on port `5173`.

- [ ] **Step 4: Capture and inspect required viewports**

Use browser screenshots at:

- 1440 × 1000
- 1024 × 768
- 390 × 844

Verify:

- Hero, About, project index, project headers, featured stories, archive, Strengths, and Contact share the same page edge.
- No horizontal overflow or clipped Chinese/English headings.
- Four featured cases appear before the archive.
- Archive accordion keeps one item open.
- Sticky rail remains inside its project and becomes static at 720px.
- Reveal motion does not resize or displace neighboring content.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm all content is immediately visible, hero video is disabled by the existing rule, and no sticky/parallax animation blocks reading.

- [ ] **Step 6: Check browser console and key asset responses**

Expected: no console errors; index covers and archive previews return successful responses.

- [ ] **Step 7: Commit visual corrections**

```bash
git add src/redesign.css src/components/FeaturedProject.jsx src/components/ProjectArchive.jsx src/components/ProjectIndex.jsx src/components/ProjectRail.jsx
git diff --cached --quiet || git commit -m "fix: polish redesign across responsive viewports"
```

If visual QA required no correction, the cached diff remains empty and no extra commit is created.

## Task 10: Prove rollback safety and hand off both versions

**Files:**
- No product files required.

- [ ] **Step 1: Verify old-version source has not changed**

Run:

```bash
git -C /Users/luoen/Documents/作品集网站/.worktrees/portfolio-base status --short
```

Expected: no tracked source modifications caused by the redesign.

- [ ] **Step 2: Verify branch separation**

Run:

```bash
git log --oneline --decorate --all -8
```

Expected: redesign implementation commits exist only on `codex/portfolio-redesign`; `codex/portfolio-base` remains the rollback branch.

- [ ] **Step 3: Record local preview locations**

Old version:

```text
/Users/luoen/Documents/作品集网站/.worktrees/portfolio-base
```

New version:

```text
/Users/luoen/Documents/作品集网站/.worktrees/portfolio-redesign
```

- [ ] **Step 4: Run final verification**

Run:

```bash
pnpm test && pnpm build
```

Expected: tests PASS and build exits with code 0 in the redesign worktree.

Do not replace the NAS deployment or `wcc.2004.kdns.fr` until the user explicitly approves the redesign preview.
