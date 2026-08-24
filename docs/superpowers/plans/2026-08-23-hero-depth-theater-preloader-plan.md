# Hero Illustration Depth Theater and Preloader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portfolio Hero video with the approved NESTA illustration, layer five interactive furniture PNGs with scoped GSAP depth motion, and rebuild the first-session 000–100 loader around real Hero asset readiness.

**Architecture:** A deterministic Python asset pipeline creates semantic Hero originals and responsive variants. `heroScene.js` is the single source of truth for background, furniture placement, preload sources, and depth values. `Hero` renders the static scene and delegates motion to a scoped `useHeroSceneMotion` hook; `Preloader` uses a small injectable asset loader and notifies `App` through `onReady` after the real-progress and minimum-time gates complete.

**Tech Stack:** React, Vite, Vitest, Testing Library, GSAP, `@gsap/react`, ScrollTrigger, SplitText, Python, Pillow.

---

## Implementation prerequisites

Before Task 4, apply the already selected GSAP skills:

1. `gsap-react` for scoped `useGSAP`, `contextSafe`, dependency cleanup, and `revertOnUpdate`.
2. `gsap-timeline` for labeled Preloader and Hero entrance choreography.
3. `gsap-scrolltrigger` for the top-level Hero exit timeline only.
4. `gsap-performance` for transform/opacity-only motion, `quickTo()`, bounded listeners, and selective `will-change`.
5. `gsap-core` for `matchMedia()`, eases, reduced motion, and overwrite behavior.

The project is not a Git repository. Do not initialize Git. Use verification checkpoints instead of commits.

## File structure

- Create `scripts/prepare_hero_assets.py`: copy and resize 1 background plus 5 alpha PNGs.
- Create `tests/test_prepare_hero_assets.py`: manifest, alpha, output and conversion checks.
- Create `src/data/heroScene.js`: semantic Hero assets, positions, depth values and preload list.
- Create `src/data/heroScene.test.js`: scene data and six-source uniqueness checks.
- Modify `src/components/Hero.jsx`: remove video/fallback and render the background plus five props.
- Modify `src/components/Hero.test.jsx`: assert static scene structure and no video.
- Create `src/motion/useHeroSceneMotion.js`: all Hero GSAP timelines, pointer depth and cleanup.
- Create `src/motion/useHeroSceneMotion.test.js`: motion mode and depth math tests.
- Modify `src/styles.css`: new scene layout, responsive positions, contrast and reduced-motion fallbacks.
- Modify `src/styles.test.js`: Hero scene and Preloader style regression tests.
- Create `src/utils/preloadImages.js`: injectable real asset loading with progress and failure completion.
- Create `src/utils/preloadImages.test.js`: progress, duplicate settlement and error behavior.
- Modify `src/components/Preloader.jsx`: three-digit real progress, spring prop and panel reveal.
- Create `src/components/Preloader.test.jsx`: first load, 100 state, exit and callback behavior.
- Modify `src/App.jsx`: `onReady` ownership and first-session trigger.
- Modify `src/App.test.jsx`: session skip and successful ready transition.

### Task 1: Build the six-file Hero asset pipeline

**Files:**
- Create: `scripts/prepare_hero_assets.py`
- Create: `tests/test_prepare_hero_assets.py`

- [ ] **Step 1: Write the failing standard-library asset test**

```python
import tempfile
import unittest
from pathlib import Path

from scripts.prepare_hero_assets import BACKGROUND, PROPS, output_names, prepare_assets


class PrepareHeroAssetsTest(unittest.TestCase):
    def test_manifest_contains_one_background_and_five_props(self):
        self.assertEqual(BACKGROUND.name, "2241f292694c0cb2497992ebc760bf2d.jpg")
        self.assertEqual(len(PROPS), 5)
        self.assertEqual(len(set(PROPS.values())), 5)

    def test_output_manifest_is_complete(self):
        names = output_names()
        self.assertIn("nesta-illustration-bg.jpg", names)
        self.assertIn("nesta-illustration-bg-w960.webp", names)
        self.assertIn("hero-rocking-chair.png", names)
        self.assertIn("hero-rocking-chair-w1200.webp", names)

    def test_png_conversion_preserves_transparent_corners(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            prepare_assets(Path(temp_dir))
            from PIL import Image
            image = Image.open(Path(temp_dir) / "hero-table-lamp.png").convert("RGBA")
            self.assertEqual(image.getpixel((0, 0))[3], 0)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the test and verify the missing-module failure**

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m unittest tests.test_prepare_hero_assets -v
```

Expected: FAIL because `scripts.prepare_hero_assets` does not exist.

- [ ] **Step 3: Implement the exact asset pipeline**

Create `scripts/prepare_hero_assets.py`:

```python
from pathlib import Path
from shutil import copy2

from PIL import Image, ImageOps


BACKGROUND = Path(r"C:/Users/86135/Desktop/作品/2241f292694c0cb2497992ebc760bf2d.jpg")
PROP_SOURCE = Path(r"C:/Users/86135/Desktop/素材")
DEST = Path(__file__).resolve().parents[1] / "public" / "images" / "hero"
PROPS = {
    "exec-332ecd8e-1118-4c8e-af89-97ed0c3265df.png": "hero-spring-table",
    "exec-683b80f9-59a4-403e-aee6-fafb5c7c2dc8.png": "hero-blue-cabinet",
    "exec-787582f0-ca6c-46b9-afde-149343620746.png": "hero-floating-table",
    "exec-b93e4aee-3686-4302-939b-c12c419ad70d.png": "hero-rocking-chair",
    "exec-dfbf2c41-8c9a-4308-b86e-56fd2649062e.png": "hero-table-lamp",
}


def output_names():
    background = ["nesta-illustration-bg.jpg", "nesta-illustration-bg-w960.webp", "nesta-illustration-bg-w1800.webp"]
    props = [name for basename in PROPS.values() for name in (
        f"{basename}.png", f"{basename}-w720.webp", f"{basename}-w1200.webp",
    )]
    return background + props


def resize(image, width):
    if image.width <= width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def prepare_assets(destination=DEST):
    destination.mkdir(parents=True, exist_ok=True)
    with Image.open(BACKGROUND) as source:
        background = ImageOps.exif_transpose(source).convert("RGB")
        background.save(destination / "nesta-illustration-bg.jpg", "JPEG", quality=95, optimize=True)
        for width in (960, 1800):
            resize(background, width).save(destination / f"nesta-illustration-bg-w{width}.webp", "WEBP", quality=88, method=6)
    for source_name, basename in PROPS.items():
        source_path = PROP_SOURCE / source_name
        copy2(source_path, destination / f"{basename}.png")
        with Image.open(source_path) as source:
            prop = ImageOps.exif_transpose(source).convert("RGBA")
            for width in (720, 1200):
                resize(prop, width).save(destination / f"{basename}-w{width}.webp", "WEBP", quality=88, method=6, lossless=True)
    return output_names()


if __name__ == "__main__":
    generated = prepare_assets()
    print(f"Generated {len(generated)} Hero assets in {DEST}")
```

- [ ] **Step 4: Run the test, generate assets and verify outputs**

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m unittest tests.test_prepare_hero_assets -v
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/prepare_hero_assets.py
```

Expected: three Python tests pass and the script reports 18 generated files.

### Task 2: Create the static Hero scene and remove video loading

**Files:**
- Create: `src/data/heroScene.js`
- Create: `src/data/heroScene.test.js`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.test.jsx`

- [ ] **Step 1: Write failing scene data and Hero tests**

`src/data/heroScene.test.js`:

```js
import { expect, test } from 'vitest'
import { heroBackground, heroProps, heroPreloadSources } from './heroScene'

test('defines one background and five unique furniture layers', () => {
  expect(heroBackground.src).toBe('/images/hero/nesta-illustration-bg.jpg')
  expect(heroProps).toHaveLength(5)
  expect(new Set(heroProps.map(({ id }) => id)).size).toBe(5)
  expect(new Set(heroPreloadSources).size).toBe(6)
  expect(heroProps.map(({ depth }) => depth)).toEqual(['front', 'far', 'mid', 'front', 'mid'])
})
```

Replace the video assertions in `Hero.test.jsx` with:

```jsx
test('renders the NESTA illustration scene and five furniture props without video', () => {
  const { container } = render(<Hero />)
  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view selected work/i })).toHaveAttribute('href', '#work')
  expect(container.querySelector('video')).toBeNull()
  expect(container.querySelector('.hero__scene-bg img')).toHaveAttribute('src', '/images/hero/nesta-illustration-bg-w1800.webp')
  expect(container.querySelectorAll('[data-hero-prop]')).toHaveLength(5)
  expect(container.querySelector('.hero__scroll-cue')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests and verify missing scene data / old video failures**

```powershell
pnpm test -- src/data/heroScene.test.js src/components/Hero.test.jsx
```

- [ ] **Step 3: Create scene data**

```js
import { assetUrl } from '../utils/assetUrl'

export const heroBackground = {
  src: assetUrl('/images/hero/nesta-illustration-bg.jpg'),
  mobile: assetUrl('/images/hero/nesta-illustration-bg-w960.webp'),
  desktop: assetUrl('/images/hero/nesta-illustration-bg-w1800.webp'),
}

const prop = (id, basename, depth, className) => ({
  id, depth, className,
  src: assetUrl(`/images/hero/${basename}.png`),
  mobile: assetUrl(`/images/hero/${basename}-w720.webp`),
  desktop: assetUrl(`/images/hero/${basename}-w1200.webp`),
})

export const heroProps = [
  prop('spring-table', 'hero-spring-table', 'front', 'hero-prop--spring'),
  prop('blue-cabinet', 'hero-blue-cabinet', 'far', 'hero-prop--cabinet'),
  prop('floating-table', 'hero-floating-table', 'mid', 'hero-prop--floating'),
  prop('rocking-chair', 'hero-rocking-chair', 'front', 'hero-prop--chair'),
  prop('table-lamp', 'hero-table-lamp', 'mid', 'hero-prop--lamp'),
]

export const heroPreloadSources = [heroBackground.desktop, ...heroProps.map(({ desktop }) => desktop)]
```

- [ ] **Step 4: Replace Hero video/fallback with static scene markup**

Remove `useHeroVideo`, the `<video>`, old fallback and video imports. Render this before scrim:

```jsx
<picture className="hero__scene-bg" aria-hidden="true">
  <source media="(max-width: 720px)" srcSet={heroBackground.mobile} type="image/webp" />
  <img src={heroBackground.desktop} alt="" />
</picture>
<div className="hero__props" aria-hidden="true">
  {heroProps.map((item) => <picture
    className={`hero-prop ${item.className}`}
    data-hero-prop={item.id}
    data-depth={item.depth}
    key={item.id}
  >
    <source media="(max-width: 720px)" srcSet={item.mobile} type="image/webp" />
    <img src={item.desktop} alt="" />
  </picture>)}
</div>
```

- [ ] **Step 5: Run data and Hero component tests**

```powershell
pnpm test -- src/data/heroScene.test.js src/components/Hero.test.jsx
```

### Task 3: Build the depth-theater layout before motion

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Add failing Hero layout tests**

```js
test('builds the illustration Hero depth layers without video selectors', () => {
  expect(css).toMatch(/\.hero__scene-bg\s*{[^}]*position:\s*absolute[^}]*inset:\s*0/s)
  expect(css).toMatch(/\.hero__scene-bg img\s*{[^}]*object-fit:\s*cover/s)
  expect(css).toMatch(/\.hero__props\s*{[^}]*position:\s*absolute[^}]*pointer-events:\s*none/s)
  expect(css).toMatch(/\.hero-prop--spring\s*{[^}]*left:\s*clamp\(/s)
  expect(css).toMatch(/\.hero-prop--chair\s*{[^}]*right:\s*clamp\(/s)
  expect(css).toMatch(/\.hero__title\s*{[^}]*z-index:\s*2[^}]*opacity:/s)
})

test('keeps all five props on mobile while disabling pointer-heavy decoration', () => {
  expect(css).toMatch(/@media \(max-width:\s*720px\)[\s\S]*?\.hero-prop--cabinet\s*{[^}]*width:/s)
  expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.hero-prop\s*{[^}]*transform:\s*none/s)
})
```

- [ ] **Step 2: Run style tests and verify the new selector failures**

```powershell
pnpm test -- src/styles.test.js
```

- [ ] **Step 3: Replace the old video/fallback CSS with the approved composition**

Add scoped rules for `.hero__scene-bg`, `.hero__props`, `.hero-prop`, five position classes, title/baseline contrast, 1024px and 720px placement, and reduced-motion static transforms. Required properties:

```css
.hero__scene-bg,.hero__scene-bg img,.hero__props { position:absolute; inset:0; width:100%; height:100%; }
.hero__scene-bg { z-index:0; overflow:hidden; }
.hero__scene-bg img { object-fit:cover; object-position:center; }
.hero__props { z-index:3; pointer-events:none; overflow:hidden; }
.hero-prop { position:absolute; display:block; transform-origin:50% 80%; will-change:transform,opacity,filter; }
.hero-prop img { width:100%; height:auto; filter:drop-shadow(0 1.5rem 2.5rem rgba(2,9,32,.3)); }
.hero-prop--cabinet { top:clamp(5rem,10vh,9rem); right:clamp(-7rem,-4vw,-2rem); width:clamp(16rem,25vw,29rem); }
.hero-prop--floating { top:clamp(5rem,11vh,10rem); left:42%; width:clamp(14rem,22vw,25rem); }
.hero-prop--lamp { top:27%; left:clamp(-5rem,-2vw,-1rem); width:clamp(11rem,17vw,20rem); }
.hero-prop--chair { right:clamp(-3rem,2vw,3rem); bottom:clamp(-4rem,-2vh,-1rem); width:clamp(18rem,29vw,34rem); }
.hero-prop--spring { left:clamp(-3rem,2vw,3rem); bottom:clamp(-5rem,-2vh,-1rem); width:clamp(15rem,24vw,28rem); }
```

Keep Header above props. Put the title between background and props with a translucent fill/stroke treatment and a localized text shadow. Use scrim gradients rather than global brightness filters.

- [ ] **Step 4: Run styles and inspect the static Hero in the visible browser**

```powershell
pnpm test -- src/styles.test.js src/components/Hero.test.jsx
```

### Task 4: Add the scoped GSAP Hero scene motion

**Files:**
- Create: `src/motion/useHeroSceneMotion.js`
- Create: `src/motion/useHeroSceneMotion.test.js`
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Write failing pure motion tests**

```js
import { expect, test } from 'vitest'
import { heroMotionMode, normalizedPointer, depthOffset } from './useHeroSceneMotion'

test('selects static, touch and desktop modes', () => {
  expect(heroMotionMode({ reduced: true, finePointer: true })).toBe('static')
  expect(heroMotionMode({ reduced: false, finePointer: false })).toBe('touch')
  expect(heroMotionMode({ reduced: false, finePointer: true })).toBe('desktop')
})

test('normalizes the pointer and maps depth to bounded offsets', () => {
  expect(normalizedPointer(0, 1000)).toBe(-1)
  expect(normalizedPointer(500, 1000)).toBe(0)
  expect(normalizedPointer(1000, 1000)).toBe(1)
  expect(depthOffset('far', 1)).toBe(8)
  expect(depthOffset('mid', 1)).toBe(14)
  expect(depthOffset('front', 1)).toBe(22)
})
```

- [ ] **Step 2: Run the test and verify the missing hook failure**

```powershell
pnpm test -- src/motion/useHeroSceneMotion.test.js
```

- [ ] **Step 3: Implement the motion hook using the approved GSAP skills**

The hook must export the three pure helpers above and use:

```js
useGSAP((context, contextSafe) => {
  const root = rootRef.current
  const q = gsap.utils.selector(root)
  const mm = gsap.matchMedia()
  mm.add({ finePointer:'(pointer:fine)', reduced:'(prefers-reduced-motion:reduce)' }, ({ conditions }) => {
    const mode = heroMotionMode(conditions)
    if (mode === 'static') return undefined

    const entrance = gsap.timeline({ paused:true, defaults:{ ease:'power4.out' } })
      .addLabel('background')
      .from(q('.hero__scene-bg img'), { scale:1.06, filter:'blur(8px)', duration:1.1 }, 'background')
      .addLabel('title', .12)
      .from(titleChars, { yPercent:118, duration:.9, stagger:.045 }, 'title')
      .addLabel('props-far', .38)
      .fromTo(q('[data-depth="far"]'), { autoAlpha:0, y:18 }, { autoAlpha:1, y:0, duration:.62, immediateRender:false }, 'props-far')
      .addLabel('props-mid', .48)
      .fromTo(q('[data-depth="mid"]'), { autoAlpha:0, y:24 }, { autoAlpha:1, y:0, duration:.68, stagger:.08, immediateRender:false }, 'props-mid')
      .addLabel('props-front', .6)
      .fromTo(q('[data-depth="front"]'), { autoAlpha:0, y:32, scale:.94 }, { autoAlpha:1, y:0, scale:1, duration:.72, stagger:.1, immediateRender:false }, 'props-front')
      .addLabel('meta', .78)
      .from(q('.hero__meta-row, .hero__baseline, .hero__edge-label'), { autoAlpha:0, y:16, duration:.55, stagger:.08 }, 'meta')

    if (ready) entrance.play()
    return () => { /* remove listeners and revert SplitText */ }
  }, root)
  return () => mm.revert()
}, { scope:rootRef, dependencies:[ready], revertOnUpdate:true })
```

Inside the desktop branch, build one setter record per background/prop with `qx` and `qy` from `gsap.quickTo()`. The single `pointermove` handler computes `normalizedPointer(event.clientX, root.clientWidth)` and its y equivalent, then applies `depthOffset(element.dataset.depth, normalizedValue)`. `pointerleave` sends every setter to zero. Add `pointerenter` and `click` handlers per prop through `contextSafe()` for the five named feedback timelines; store and remove every listener in the returned cleanup. Create one top-level ScrollTrigger timeline on `root` that scales the background to `1.04`, moves far/mid/front props by 8/14/22px in their approved directions, and fades/translates `.hero__content` as Hero leaves.

Do not keep the old motion block inside `Hero.jsx`; the component should only render and call `useHeroSceneMotion(rootRef, ready)`.

- [ ] **Step 4: Run motion and Hero tests**

```powershell
pnpm test -- src/motion/useHeroSceneMotion.test.js src/components/Hero.test.jsx
```

### Task 5: Rebuild Preloader around real Hero asset progress

**Files:**
- Create: `src/utils/preloadImages.js`
- Create: `src/utils/preloadImages.test.js`
- Modify: `src/components/Preloader.jsx`
- Create: `src/components/Preloader.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] **Step 1: Write failing loader utility tests**

Define a fake `ImageCtor` whose instances expose `onload`, `onerror` and `src`. Assert:

```js
test('reports every source and treats errors as settled progress', async () => {
  const progress = []
  const promise = preloadImages(['/a.webp','/b.webp'], { ImageCtor:FakeImage, onProgress:(value) => progress.push(value) })
  FakeImage.instances[0].onload()
  FakeImage.instances[1].onerror()
  await expect(promise).resolves.toEqual({ total:2, failed:1 })
  expect(progress).toEqual([0, 50, 100])
})
```

- [ ] **Step 2: Run and verify the missing utility failure**

```powershell
pnpm test -- src/utils/preloadImages.test.js
```

- [ ] **Step 3: Implement the injectable loader**

```js
export function preloadImages(sources, { ImageCtor = Image, onProgress = () => {} } = {}) {
  let settled = 0
  let failed = 0
  onProgress(0)
  const load = (src) => new Promise((resolve) => {
    const image = new ImageCtor()
    let finished = false
    const finish = (didFail) => {
      if (finished) return
      finished = true
      failed += didFail ? 1 : 0
      settled += 1
      onProgress(Math.round(settled / sources.length * 100))
      resolve()
    }
    image.onload = () => finish(false)
    image.onerror = () => finish(true)
    image.src = src
  })
  return Promise.all(sources.map(load)).then(() => ({ total:sources.length, failed }))
}
```

- [ ] **Step 4: Write failing Preloader and App behavior tests**

Create `src/components/Preloader.test.jsx`:

```jsx
import { act, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Preloader from './Preloader'

test('shows three-digit progress and calls onReady once after the minimum gate', async () => {
  vi.useFakeTimers()
  const onReady = vi.fn()
  const loadAssets = vi.fn(async (_assets, { onProgress }) => {
    onProgress(0); onProgress(50); onProgress(100)
    return { total:6, failed:0 }
  })
  const { container } = render(<Preloader
    assets={['a','b','c','d','e','f']}
    loadAssets={loadAssets}
    minDuration={1200}
    maxDuration={3500}
    onReady={onReady}
  />)
  expect(screen.getByText('000')).toBeInTheDocument()
  expect(screen.getByText('WANG CHENGCHENG')).toBeInTheDocument()
  expect(container.querySelector('.preloader__spring img')).toBeInTheDocument()
  await act(async () => { await vi.advanceTimersByTimeAsync(1200) })
  await act(async () => { await vi.advanceTimersByTimeAsync(1200) })
  expect(onReady).toHaveBeenCalledTimes(1)
  vi.useRealTimers()
})
```

Update `src/App.test.jsx` with explicit `sessionStorage.clear()` in `beforeEach`, then add:

```jsx
test('shows the first-session loader and skips it after the session marker', () => {
  const first = render(<App />)
  expect(first.container.querySelector('.preloader')).toBeInTheDocument()
  first.unmount()
  sessionStorage.setItem('wcc-pl', '1')
  const returning = render(<App />)
  expect(returning.container.querySelector('.preloader')).not.toBeInTheDocument()
})
```

- [ ] **Step 5: Implement the Preloader data flow**

- `Preloader` receives `{ assets=heroPreloadSources, onReady, loadAssets=preloadImages, minDuration=1200, maxDuration=3500 }`.
- Start `preloadImages` and a 1200ms minimum timer concurrently.
- Update a `targetProgressRef`; use a single GSAP tween to make the displayed three-digit value catch up.
- Start a 3500ms failsafe that completes the gate even if a source never settles.
- At the gate, tween display to 100, spring table `scaleY` to `.84` and back, then split two blue panels away from center.
- Call `onReady` exactly once after exit completion.
- Clean resource flags, timers and timeline on unmount.

Update App:

```jsx
const [ready, setReady] = useState(readInitialReady)
const handleReady = useCallback(() => {
  try { sessionStorage.setItem('wcc-pl', '1') } catch { /* ignore */ }
  setReady(true)
}, [])

{!ready && <Preloader assets={heroPreloadSources} onReady={handleReady} />}
<Hero ready={ready} />
```

Remove the fixed 1450ms App timer and the old `done` prop path.

- [ ] **Step 6: Replace Preloader CSS**

Create black base, two NESTA Blue split panels, large bottom-aligned `.preloader__num`, top-left meta, spring table image, progress rule, mobile layout, and reduced-motion direct fade. Remove the acid veil selectors.

- [ ] **Step 7: Run loader, App and style tests**

```powershell
pnpm test -- src/utils/preloadImages.test.js src/components/Preloader.test.jsx src/App.test.jsx src/styles.test.js
```

### Task 6: Full verification and visible browser QA

**Files:**
- Modify only files already listed if verification reveals a failing regression.

- [ ] **Step 1: Run every automated check**

```powershell
& 'C:\Users\86135\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m unittest tests.test_prepare_hero_assets -v
pnpm test
pnpm build
```

- [ ] **Step 2: Force a first-session load in the development browser**

Clear only `sessionStorage['wcc-pl']` in the local development tab through an explicit app-supported test path or by opening a fresh temporary tab. Verify 000–100, spring feedback, panel split, Hero entrance, and `wcc-pl` being set. Do not inspect unrelated storage.

- [ ] **Step 3: Verify the live Hero at 1440×1000**

Confirm background focal point, all five props, title layer, navigation, button, pointer depth return-to-zero, individual hover feedback, scroll exit and zero new console errors.

- [ ] **Step 4: Verify 1024×768 and 390×844**

Confirm all five props remain present, no text or navigation is blocked, no horizontal overflow, touch has no pointer-follow loop, and background is not stretched. Reset viewport afterward.

- [ ] **Step 5: Verify reduced-motion behavior through tests and available browser emulation**

Confirm no SplitText stagger, float, parallax, bounce or scroll displacement is required to see the Hero content. The Preloader should show 100 and fade without a split.

- [ ] **Step 6: Audit stale video and placeholder references**

```powershell
rg -n "hero-loop-web|hero-poster|useHeroVideo|TB[D]|TO[D]O|FIXM[E]" src scripts tests
```

Expected: no active Hero video/fallback references and no placeholders in changed implementation files.
