# Portfolio Chapter Atmosphere Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Hero-following portfolio sections into a continuous chapter-based color and motion narrative across About, Ticker, Work, Strengths and Contact.

**Architecture:** A single fixed `PortfolioAtmosphere` layer owns global background color, gradients, grid, curve and particles. One scoped hook interpolates chapter themes; About, Work, Strengths and Contact each own one focused GSAP story hook. WorkRing input is refactored behind a pure priority controller so scroll, drag, settle and auto rotation cannot write the ring angle simultaneously.

**Tech Stack:** React, Vite, Vitest, Testing Library, GSAP, `@gsap/react`, ScrollTrigger, Flip, ScrollToPlugin, SplitText, CSS custom properties and SVG.

---

## Required skills before implementation

Use these skills in order when their task begins:

1. `test-driven-development` for every behavior change.
2. `gsap-react` for `useGSAP`, scoped selectors, `contextSafe` and cleanup.
3. `gsap-timeline` for each chapter's single labeled timeline.
4. `gsap-scrolltrigger` for chapter theme interpolation, pin and scrub.
5. `gsap-core` for transform, opacity, CSS variables and matchMedia.
6. `gsap-performance` for quickTo, selective will-change and layout-read batching.
7. `gsap-plugins` for Flip, ScrollToPlugin and SplitText registration/cleanup.
8. `gsap-utils` for interpolate, mapRange, clamp, snap and wrap.

The project is not a Git repository. Do not initialize Git implicitly. Replace commit steps with test/build/browser checkpoints.

## File map

### Create

- `src/components/PortfolioAtmosphere.jsx`: decorative fixed layer only.
- `src/components/PortfolioAtmosphere.test.jsx`: structural and accessibility checks.
- `src/motion/portfolioThemes.js`: chapter theme data and interpolation helpers.
- `src/motion/portfolioThemes.test.js`: theme completeness and interpolation checks.
- `src/motion/usePortfolioAtmosphere.js`: global chapter background ScrollTriggers.
- `src/motion/useAboutStory.js`: About pin and timeline.
- `src/motion/useAboutStory.test.js`: mode and progress helpers.
- `src/motion/ringController.js`: WorkRing input priority and angle helpers.
- `src/motion/ringController.test.js`: deterministic controller tests.
- `src/motion/useStrengthsStory.js`: Strengths pinned timeline.
- `src/motion/useStrengthsStory.test.js`: mode and card progress helpers.
- `src/components/ProjectTransitionLayer.jsx`: optional shared-card visual transition.
- `src/components/ProjectTransitionLayer.test.jsx`: transition fallback and cleanup.

### Modify

- `src/motion/gsapSetup.js`: register ScrollToPlugin once.
- `src/App.jsx`: mount atmosphere and preserve project transition origin.
- `src/App.test.jsx`: atmosphere and transition origin behavior.
- `src/components/About.jsx`: stable content markup, SVG timeline, new story hook.
- `src/components/About.test.jsx`: stable visibility and node counts.
- `src/components/TickerTape.jsx`: section ref and chapter transition hooks.
- `src/components/SelectedWork.jsx`: Work scene shell and sticky navigation hooks.
- `src/components/WorkRing.jsx`: unified angle controller and responsive modes.
- `src/components/WorkRing.test.jsx`: desktop/tablet/mobile behavior.
- `src/components/ProjectRail.jsx`: active state and origin element callback.
- `src/components/ProjectDetail.jsx`: transition target and focus restoration.
- `src/components/Strengths.jsx`: path, active cards and dual toolkit tracks.
- `src/components/ClosingSections.test.jsx`: Strengths and Contact structure.
- `src/components/Contact.jsx`: orb pointer damping and ScrollToPlugin.
- `src/styles.css`: themes, atmosphere, chapter layouts and reduced-motion.
- `src/styles.test.js`: all static visual contracts.

## Task 1: Define chapter themes and render the fixed atmosphere layer

**Files:**
- Create: `src/motion/portfolioThemes.js`
- Create: `src/motion/portfolioThemes.test.js`
- Create: `src/components/PortfolioAtmosphere.jsx`
- Create: `src/components/PortfolioAtmosphere.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write the failing theme tests**

```js
import { expect, test } from 'vitest'
import { CHAPTER_ORDER, portfolioThemes, themeProgress } from './portfolioThemes'

test('defines the approved four chapter themes in page order', () => {
  expect(CHAPTER_ORDER).toEqual(['about', 'work', 'strengths', 'contact'])
  expect(Object.keys(portfolioThemes)).toEqual(CHAPTER_ORDER)
  expect(portfolioThemes.about.background).toBe('#071426')
  expect(portfolioThemes.work.background).toBe('#FFF3EA')
  expect(portfolioThemes.strengths.background).toBe('#4B101C')
  expect(portfolioThemes.contact.background).toBe('#D8FF36')
})

test('clamps theme transition progress', () => {
  expect(themeProgress(-1)).toBe(0)
  expect(themeProgress(.4)).toBe(.4)
  expect(themeProgress(2)).toBe(1)
})
```

- [ ] **Step 2: Run and verify the missing module failure**

```powershell
pnpm test -- src/motion/portfolioThemes.test.js
```

- [ ] **Step 3: Implement the theme model**

```js
import { gsap } from './gsapSetup'

export const CHAPTER_ORDER = ['about', 'work', 'strengths', 'contact']

export const portfolioThemes = {
  about: { background:'#071426', foreground:'#FFF3EA', accent:'#61BDD9', gridAlpha:.13, curveAlpha:.45, glowA:['24%','32%','42rem','.34'], glowB:['78%','68%','34rem','.2'] },
  work: { background:'#FFF3EA', foreground:'#17171A', accent:'#287BEA', gridAlpha:.18, curveAlpha:.34, glowA:['72%','26%','38rem','.18'], glowB:['18%','76%','30rem','.12'] },
  strengths: { background:'#4B101C', foreground:'#FFF3EA', accent:'#287BEA', gridAlpha:.08, curveAlpha:.28, glowA:['18%','24%','34rem','.26'], glowB:['78%','72%','40rem','.2'] },
  contact: { background:'#D8FF36', foreground:'#0E0E0E', accent:'#287BEA', gridAlpha:0, curveAlpha:0, glowA:['16%','18%','46rem','.3'], glowB:['82%','76%','38rem','.2'] },
}

export const themeProgress = gsap.utils.clamp(0, 1)
export const interpolateColor = (from, to, progress) => gsap.utils.interpolate(from, to, themeProgress(progress))
```

- [ ] **Step 4: Write the failing atmosphere component test**

```jsx
import { render } from '@testing-library/react'
import PortfolioAtmosphere from './PortfolioAtmosphere'

test('renders one inert fixed atmosphere with two glows, grid, curve and particles', () => {
  const { container } = render(<PortfolioAtmosphere />)
  const root = container.querySelector('.portfolio-atmosphere')
  expect(root).toHaveAttribute('aria-hidden', 'true')
  expect(container.querySelectorAll('.portfolio-atmosphere__glow')).toHaveLength(2)
  expect(container.querySelector('.portfolio-atmosphere__grid')).toBeInTheDocument()
  expect(container.querySelector('.portfolio-atmosphere__curve')).toBeInTheDocument()
  expect(container.querySelectorAll('.portfolio-atmosphere__particle')).toHaveLength(4)
})
```

- [ ] **Step 5: Implement `PortfolioAtmosphere.jsx`**

Render one root, two glow spans, one grid span, one SVG curve with a single path, four particle spans and one noise span. Use no state and no event handlers.

- [ ] **Step 6: Add failing CSS assertions**

```js
test('keeps the portfolio atmosphere fixed, inert and variable-driven', () => {
  expect(css).toMatch(/\.portfolio-atmosphere\s*{[^}]*position:\s*fixed[^}]*pointer-events:\s*none[^}]*background:\s*var\(--atmo-bg\)/s)
  expect(css).toMatch(/\.portfolio-atmosphere__grid\s*{[^}]*opacity:\s*var\(--atmo-grid-alpha\)/s)
  expect(css).toMatch(/\.portfolio-atmosphere__curve\s*{[^}]*opacity:\s*var\(--atmo-curve-alpha\)/s)
})
```

- [ ] **Step 7: Implement Atmosphere CSS and run focused tests**

The root must be fixed under `main`, cover the viewport, use `overflow:hidden`, and define About as static default. Glows use CSS variables for position/size/alpha. Grid uses two linear gradients. Curve and particles animate only by transform/opacity.

```powershell
pnpm test -- src/motion/portfolioThemes.test.js src/components/PortfolioAtmosphere.test.jsx src/styles.test.js
```

## Task 2: Add the single global chapter-theme controller

**Files:**
- Create: `src/motion/usePortfolioAtmosphere.js`
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Add a failing App structure test**

```jsx
test('mounts one atmosphere between Hero and main content', () => {
  const { container } = render(<App />)
  const atmosphere = container.querySelector('.portfolio-atmosphere')
  const main = container.querySelector('main')
  expect(atmosphere).toBeInTheDocument()
  expect(atmosphere.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})
```

- [ ] **Step 2: Implement the hook's pure state writer**

Export `applyAtmosphereTheme(root, from, to, progress)` so it can be tested without scrolling. It must set all approved CSS variables using `interpolateColor`, `gsap.utils.interpolate`, `mapRange` and `clamp`.

- [ ] **Step 3: Write and run the pure writer test**

Create a div, call `applyAtmosphereTheme(div, about, work, .5)`, and assert `--atmo-bg`, `--atmo-fg`, accent, grid alpha and both glow positions are set.

- [ ] **Step 4: Implement `usePortfolioAtmosphere(rootRef)`**

Use scoped `useGSAP`. In desktop mode, create transitions in DOM order for `#about`, `#work`, `.strengths`, `#contact`, each with `start:'top bottom'`, `end:'top 35%'`, `scrub:1`, and `onUpdate` calling the pure writer. Do not pin the atmosphere. In reduced-motion and mobile, use standalone `ScrollTrigger.create({ toggleClass/onEnter })` or IntersectionObserver to apply final themes without scrub.

- [ ] **Step 5: Integrate in App**

Mount `<PortfolioAtmosphere ref={atmosphereRef} />` after Hero and before main. Call `usePortfolioAtmosphere(atmosphereRef)` once in App or let the component own its root hook. Ensure only one instance exists.

- [ ] **Step 6: Run focused tests and inspect static chapter backgrounds**

```powershell
pnpm test -- src/App.test.jsx src/motion/portfolioThemes.test.js src/components/PortfolioAtmosphere.test.jsx
```

## Task 3: Rebuild About as a stable scroll story

**Files:**
- Create: `src/motion/useAboutStory.js`
- Create: `src/motion/useAboutStory.test.js`
- Modify: `src/components/About.jsx`
- Modify: `src/components/About.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write pure mode tests**

```js
import { expect, test } from 'vitest'
import { aboutMode, aboutNodeProgress } from './useAboutStory'

test('pins only desktop users without reduced motion', () => {
  expect(aboutMode({ desktop:true, reduced:false })).toBe('pinned')
  expect(aboutMode({ desktop:false, reduced:false })).toBe('flow')
  expect(aboutMode({ desktop:true, reduced:true })).toBe('static')
})

test('clamps timeline node progress', () => {
  expect(aboutNodeProgress(-.2)).toBe(0)
  expect(aboutNodeProgress(.6)).toBe(.6)
  expect(aboutNodeProgress(1.2)).toBe(1)
})
```

- [ ] **Step 2: Write About markup tests**

Assert one `data-about-pin`, one SVG `.about__path` with a path, timeline node count equal to profile timeline length, three stat nodes, three honor cards, and that `.about__lead-copy` does not carry `data-reveal`.

- [ ] **Step 3: Modify About markup**

Wrap portrait and lead copy in `.about__pin-stage`. Remove `data-reveal` from essential lead copy. Add stat node spans, SVG path, per-timeline data hooks, honor card class and atmosphere focus data attributes.

- [ ] **Step 4: Implement `useAboutStory`**

- Desktop: pin `.about__pin-stage`, animate children only, duration/end based on stage height, scrub `.8`.
- Flow: no pin, use ScrollTrigger.batch for stats/timeline/honors.
- Static: apply final classes immediately.
- Animate portrait filter custom property, image yPercent, grid yPercent, `ABOUT` ghost xPercent, path strokeDashoffset and node activation.
- Use one timeline for the pin and one batch for below-pin items; no essential element starts hidden in CSS.

- [ ] **Step 5: Add section CSS**

Set About's static final background to transparent over Atmosphere, add navy local contrast panels, stat grid, SVG path, honor cards and mobile flow. Add explicit tests that `.about__lead-copy` has visible opacity by default and mobile contains no sticky/pin height.

- [ ] **Step 6: Run tests and browser-check About**

```powershell
pnpm test -- src/motion/useAboutStory.test.js src/components/About.test.jsx src/styles.test.js
```

## Task 4: Turn Ticker into the About-to-Work threshold

**Files:**
- Modify: `src/components/TickerTape.jsx`
- Modify: `src/components/ClosingSections.test.jsx` or create `src/components/TickerTape.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write failing structure and CSS tests**

Assert `.ticker` has a ref/data chapter hook, two halves remain, and CSS defines a scaleY/clip-based entrance without animating height.

- [ ] **Step 2: Refactor Ticker motion**

Keep one `gsap.ticker` loop. Add `gsap.quickTo(track,'skewX')`; derive velocity from scroll delta using `gsap.utils.clamp`. Add one ScrollTrigger timeline that reveals the band with `scaleY` and converts its bottom rule to the Work blue baseline on leave. Pause on hover and when IntersectionObserver reports offscreen.

- [ ] **Step 3: Add reduced-motion fallback**

Do not register the ticker loop. Render the two halves as a static wrapping token strip with transform none.

- [ ] **Step 4: Run Ticker and style tests**

```powershell
pnpm test -- src/components/TickerTape.test.jsx src/styles.test.js
```

## Task 5: Extract a deterministic WorkRing input controller

**Files:**
- Create: `src/motion/ringController.js`
- Create: `src/motion/ringController.test.js`
- Modify: `src/components/WorkRing.jsx`

- [ ] **Step 1: Write failing controller tests**

```js
import { expect, test } from 'vitest'
import { INPUT_PRIORITY, canWriteAngle, ringMode, scrollAngle, snapAngle } from './ringController'

test('enforces drag > settle > scroll > auto priority', () => {
  expect(INPUT_PRIORITY).toEqual({ auto:0, scroll:1, settle:2, drag:3 })
  expect(canWriteAngle('scroll', 'auto')).toBe(true)
  expect(canWriteAngle('auto', 'drag')).toBe(false)
})

test('maps and snaps ring angles deterministically', () => {
  expect(scrollAngle(.5, 7)).toBeCloseTo(-180)
  expect(snapAngle(-70, 7)).toBeCloseTo(-360 / 7)
})

test('uses 3d, track and snap modes by breakpoint', () => {
  expect(ringMode({ desktop:true, tablet:false })).toBe('3d')
  expect(ringMode({ desktop:false, tablet:true })).toBe('track')
  expect(ringMode({ desktop:false, tablet:false })).toBe('snap')
})
```

- [ ] **Step 2: Implement pure helpers**

Use `gsap.utils.clamp`, `snap` and `wrap`. Provide `createRingController(initialAngle)` with `acquire(source)`, `release(source)`, `canWrite(source)`, `setAngle(source,value)` and `snapshot()`.

- [ ] **Step 3: Run the controller tests**

```powershell
pnpm test -- src/motion/ringController.test.js
```

- [ ] **Step 4: Replace ad-hoc writer checks in WorkRing**

Keep current refs and visual functions, but route auto, scroll, drag, settle, buttons and range through the controller. Every higher-priority acquire pauses/kills lower-priority writers. One 1200ms idle timer is the only path that may resume auto.

- [ ] **Step 5: Add scroll-driven angle**

In 3D mode, create one ScrollTrigger on the Work stage with `start:'top 78%'`, `end:'bottom 22%'`, `scrub:.8`; onUpdate attempts controller scroll ownership and writes `scrollAngle(progress, count)`. Do not put the Work stage inside another pinned ScrollTrigger.

- [ ] **Step 6: Add WorkRing source tests**

Assert controller import, one idle delay, no direct `A.current.angle +=` outside the controller adapter, and all existing buttons/slider/card links remain accessible.

## Task 6: Rebuild Work as the cream blueprint gallery

**Files:**
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`
- Modify: `src/components/ProjectRail.jsx`
- Modify: `src/components/WorkRing.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write failing Work structure tests**

Assert `.work__scene`, `.work__blueprint-grid`, `.work__orbit`, sticky ProjectRail, four meta cells, ring mode data attribute and current accent CSS variable.

- [ ] **Step 2: Add Work scene markup**

Wrap intro, rail and ring in `.work__scene`. Add decorative blueprint grid/orbit as aria-hidden. Expose `data-work-mode` from ring mode. Keep all project links and existing `onOpen` behavior.

- [ ] **Step 3: Sync active project theme**

On front index change, set `--work-accent` on Work root from project accent and dispatch a local callback to ProjectRail. Tween the CSS variable color over `.35s`; do not rebuild grid DOM.

- [ ] **Step 4: Add responsive variants**

- 3D mode: current ring with scroll/drag/button control.
- Track mode: 2D horizontal flex cards with previous/next buttons.
- Snap mode: native overflow-x and scroll-snap; no auto rotation or perspective.

- [ ] **Step 5: Add cream/blueprint CSS**

Static Work background must be cream even without Atmosphere. Use dark text, blue baseline, active accent halo, sticky rail, front-card emphasis and explicit mobile overflow containment.

- [ ] **Step 6: Run Work tests and browser QA**

```powershell
pnpm test -- src/components/SelectedWork.test.jsx src/components/WorkRing.test.jsx src/styles.test.js
```

## Task 7: Add optional Flip card-to-detail transition and focus restoration

**Files:**
- Create: `src/components/ProjectTransitionLayer.jsx`
- Create: `src/components/ProjectTransitionLayer.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`
- Modify: `src/components/ProjectRail.jsx`
- Modify: `src/components/WorkRing.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/motion/gsapSetup.js`

- [ ] **Step 1: Confirm plugin registration test**

Extend the existing GSAP setup test or add a source assertion for `Flip` and `ScrollToPlugin` registration at module scope. Import ScrollToPlugin from `gsap/ScrollToPlugin` and register it once with existing plugins.

- [ ] **Step 2: Write transition-layer tests**

Assert the component renders nothing when origin is null, renders one fixed clone when origin data exists, removes it after complete, and calls fallback completion when Flip is unavailable.

- [ ] **Step 3: Extend App open/close state**

Change `openProject(id, originElement)` to store origin element, its project id, ring angle and active element. ProjectRail and WorkRing pass `event.currentTarget`. Closing clears detail, restores focus in `requestAnimationFrame`, and returns WorkRing to the saved angle.

- [ ] **Step 4: Implement the visual transition**

Clone only the card visual, place it at the origin rect, then use Flip/`Flip.fit()` to animate toward `.pdetail__transition-target`. Use duration `.68`, `power3.inOut`, `absolute:true`, `scale:true`. Remove the clone on complete/interrupt/unmount. Skip entirely for reduced motion.

- [ ] **Step 5: Run App, WorkRing and ProjectDetail tests**

```powershell
pnpm test -- src/components/ProjectTransitionLayer.test.jsx src/App.test.jsx src/components/WorkRing.test.jsx src/components/ProjectDetail.test.jsx
```

## Task 8: Build the Strengths ability laboratory

**Files:**
- Create: `src/motion/useStrengthsStory.js`
- Create: `src/motion/useStrengthsStory.test.js`
- Modify: `src/components/Strengths.jsx`
- Modify: `src/components/ClosingSections.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write pure helper tests**

```js
test('selects pinned, flow and static Strengths modes', () => {
  expect(strengthsMode({ desktop:true, reduced:false })).toBe('pinned')
  expect(strengthsMode({ desktop:false, reduced:false })).toBe('flow')
  expect(strengthsMode({ desktop:true, reduced:true })).toBe('static')
})

test('maps progress to one of four active cards', () => {
  expect(strengthIndex(0)).toBe(0)
  expect(strengthIndex(.34)).toBe(1)
  expect(strengthIndex(.68)).toBe(2)
  expect(strengthIndex(1)).toBe(3)
})
```

- [ ] **Step 2: Add Strengths structure**

Add `.strengths__stage`, one SVG path with four nodes, `data-strength-card` on four cards, `aria-current`, four atmosphere light spans and two Toolkit track halves moving in opposite directions.

- [ ] **Step 3: Implement one main timeline**

Desktop pins only `.strengths__stage`; animate its children. Use labels `card-0` to `card-3`; update aria-current and background custom variables in onUpdate using `strengthIndex`. Flow mode batches cards. Static mode marks every card final and shows a wrapping Toolkit list.

- [ ] **Step 4: Gate tilt and spotlight**

Pointer handlers run only on the current card. On active-index change remove handlers from old card and attach to new. Use quickTo for x/y/rotation; reset on leave.

- [ ] **Step 5: Add burgundy laboratory CSS and tests**

Static fallback background is burgundy, cards remain visible, current card has blue edge, nodes use acid, Toolkit tracks do not create page overflow.

```powershell
pnpm test -- src/motion/useStrengthsStory.test.js src/components/ClosingSections.test.jsx src/styles.test.js
```

## Task 9: Upgrade the Strengths-to-Contact transition and Contact interactions

**Files:**
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/ClosingSections.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write failing Contact tests**

Assert one `.contact__wipe`, two orbs, three title lines, email, back-to-top button/link with data scroll target, and blue scan span.

- [ ] **Step 2: Add the transition wipe**

Create one yellow circular child inside Contact. A top-level ScrollTrigger timeline scales it from `.08` to `1.5` as Contact enters. Animate the child, not the Contact section layout.

- [ ] **Step 3: Extend SplitText and orb motion**

Split by lines/chars only as needed. Use different x/y start directions per line. Create two pairs of quickTo setters for orb pointer following; pointerleave resets. Mobile/reduced skips handlers and uses one short opacity pulse.

- [ ] **Step 4: Add ScrollToPlugin Back to Top**

Wrap click in `contextSafe`; prevent default only when motion is allowed. Call `gsap.to(window,{duration:.9,scrollTo:{y:'#home',offsetY:0},ease:'power3.inOut'})`. Preserve the normal `href="#home"` fallback.

- [ ] **Step 5: Add Contact scan CSS and tests**

Email hover moves a NESTA Blue pseudo/child line from scaleX 0 to 1. Keep focus-visible equivalent. Ensure wipe/orbs are behind content.

```powershell
pnpm test -- src/components/ClosingSections.test.jsx src/styles.test.js
```

## Task 10: Full regression and browser verification

**Files:**
- Modify only files listed above when verification exposes a regression.

- [ ] **Step 1: Run all automated checks**

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m unittest tests.test_prepare_hero_assets tests.test_prepare_nesta_assets -v
pnpm test
pnpm build
```

- [ ] **Step 2: Browser-check 1440×1000**

Verify continuous Hero→About→Ticker→Work→Strengths→Contact themes, About visibility and pin stability, Ticker threshold, Work control priority, project open/close focus restoration, Strengths card sequence, Contact wipe/orbs/Back to Top and zero new console errors.

- [ ] **Step 3: Browser-check 1024×768**

Verify no About/Strengths pin, Work 2D track mode, no clipped sticky rail, complete theme colors and zero horizontal overflow caused by new components.

- [ ] **Step 4: Browser-check 390×844**

Verify natural About flow, static/wrapping Ticker, Work scroll-snap, four Strengths cards, static Contact orbs, accessible links, zero trapped scrolling and zero new horizontal overflow.

- [ ] **Step 5: Verify reduced motion**

Confirm final section colors, no pin/scrub/Flip/SplitText dependency, all content visible and links functional.

- [ ] **Step 6: Runtime audit**

```powershell
rg -n "TB[D]|TO[D]O|FIXM[E]|markers:\s*true|GSDevTools|ScrollSmoother" src scripts tests
```

Expected: no placeholders, dev markers, GSDevTools or second smooth-scroll system.
