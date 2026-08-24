# Reference Motion Interaction Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有王程程作品集重构为以滚动驱动叙事、固定横向作品轨道、上下文 Cursor 和项目转场为核心的交互作品集，并为六个项目实现差异化但统一的动效。

**Architecture:** 使用 GSAP、ScrollTrigger 和 `@gsap/react` 管理桌面端的 pin/scrub 时间轴；React 数据层提供六个 `motionProfile`，Story 组件只渲染带语义标记的媒体和章节，通用 Hook 负责生命周期、响应式和 reduced-motion。移动端退化为原生纵向流，不创建自定义滚动容器。

**Tech Stack:** React 19, Vite, GSAP 3, `@gsap/react`, Three.js（保留现有依赖但本轮不新增 3D Hero）, CSS custom properties, IntersectionObserver, Vitest, Testing Library。

---

## 文件地图

- Modify: `src/App.jsx` — 注册全局 MotionProvider、Hero timeline 和项目转场来源。
- Modify: `src/components/Hero.jsx` — 增加滚动时间轴语义节点。
- Modify: `src/components/SelectedWork.jsx` — 从 `WorkRing` 切换到 `ProjectRail`。
- Create: `src/components/ProjectRail.jsx` — 桌面 pin/scrub 横向作品轨道和移动端降级。
- Delete after migration: `src/components/WorkRing.jsx` — 删除已被 ProjectRail 替换、且包含 `AUTO_SPEED` 运行错误的旧实现。
- Modify: `src/components/ProjectDetail.jsx` — 项目转场、焦点管理、触发来源和滚动锁定。
- Modify: `src/components/Cursor.jsx` — default/view/drag/close 状态。
- Modify: `src/components/ScrollFillText.jsx` — 接入统一文字进入节奏。
- Create: `src/components/ProjectTransition.jsx` — 卡片到详情的进入/退出动画。
- Create: `src/hooks/useScrollTimeline.js` — ScrollTrigger 生命周期与断点封装。
- Create: `src/hooks/useProjectTransition.js` — 触发元素 rect、备用 fade-up 和焦点恢复。
- Modify: `src/motion/useMotionPreference.js` — 输出 `isTouch`, `isDesktopMotion`, `reduced` 和 `motionAllowed`。
- Create: `src/motion/motionProfiles.js` — 六个项目的模式、章节和颜色配置。
- Create: `src/motion/motionProfiles.test.js` — 配置完整性测试。
- Modify: `src/data/projects.js` — 为六个项目增加 `motionProfile` 和 `motionSections` 引用，不修改作品素材。
- Modify: `src/components/OperationStory.jsx` — `market-route` 标记。
- Modify: `src/components/SanfuCampaignStory.jsx` — `three-phase` 标记。
- Modify: `src/components/PosterStory.jsx` — `timeline-swap` 标记。
- Modify: `src/components/DaodaoBarStory.jsx` — `pour-at-eleven` 标记。
- Modify: `src/components/BrandStory.jsx` — `pause-and-warm` 标记。
- Modify: `src/components/IpStory.jsx` — `character-keyframes` 标记。
- Modify: `src/styles.css` — 时间轴、轨道、Cursor、转场和响应式规则。
- Modify: `package.json`, `pnpm-lock.yaml` — 添加 GSAP 依赖。
- Create: `src/components/ProjectRail.test.jsx` — 作品轨道渲染、键盘和移动端语义测试。
- Create: `src/components/ProjectTransition.test.jsx` — 进入、关闭、Escape 和焦点恢复测试。
- Modify: `src/components/SelectedWork.test.jsx`, `src/App.test.jsx` — 更新旧 WorkRing 断言。

### Task 1: 建立动效配置契约并修复运行时基线

**Files:**
- Create: `src/motion/motionProfiles.js`
- Create: `src/motion/motionProfiles.test.js`
- Modify: `src/data/projects.js`
- Modify: `src/motion/useMotionPreference.js`

- [ ] **Step 1: 写失败测试，锁定六个 profile 和公共字段**

```js
import { describe, expect, it } from 'vitest'
import { motionProfiles, motionProfileIds } from './motionProfiles'

describe('motion profiles', () => {
  it('contains one profile for every project', () => {
    expect(motionProfileIds).toEqual([
      'market-route', 'three-phase', 'timeline-swap',
      'pour-at-eleven', 'pause-and-warm', 'character-keyframes',
    ])
    for (const id of motionProfileIds) {
      expect(motionProfiles[id].desktop).toBeDefined()
      expect(motionProfiles[id].mobile).toBeDefined()
      expect(motionProfiles[id].sections.length).toBeGreaterThan(0)
    }
  })
})
```

Run: `pnpm vitest run src/motion/motionProfiles.test.js`

Expected: FAIL because `motionProfiles.js` does not exist.

- [ ] **Step 2: 添加最小 profile 数据结构**

```js
export const motionProfiles = {
  'market-route': { desktop: 'horizontal-route', mobile: 'vertical-reveal', sections: ['originals', 'grammar', 'system', 'extensions'] },
  'three-phase': { desktop: 'phase-scrub', mobile: 'accordion-phases', sections: ['hero', 'strategy', 'grammar', 'evidence', 'activation'] },
  'timeline-swap': { desktop: 'mask-swap', mobile: 'stacked-reveal', sections: ['posters', 'timeline', 'stage'] },
  'pour-at-eleven': { desktop: 'slow-pour', mobile: 'soft-reveal', sections: ['concept', 'identity', 'originals', 'extensions'] },
  'pause-and-warm': { desktop: 'warm-pause', mobile: 'tap-highlight', sections: ['positioning', 'dna', 'standards', 'extensions'] },
  'character-keyframes': { desktop: 'keyframes', mobile: 'tap-states', sections: ['foundation', 'evidence', 'service', 'seasonal', 'expression'] },
}

export const motionProfileIds = Object.keys(motionProfiles)
```

- [ ] **Step 3: 在项目数据中接入 profile id**

为六个顶层 project object 分别添加：

```js
motionProfile: 'market-route'
```

将其余五个 id 分别写为 `three-phase`、`timeline-swap`、`pour-at-eleven`、`pause-and-warm`、`character-keyframes`。

- [ ] **Step 4: 扩展 motion preference 输出并通过测试**

保留现有 `force` 查询参数行为，新增：

```js
const isTouch = !window.matchMedia?.('(pointer: fine)')?.matches
const isDesktopMotion = window.innerWidth >= 1024 && !isTouch && motionAllowed
return { forced, reduced, motionAllowed, isTouch, isDesktopMotion }
```

在 resize 时更新断点状态；当 `reduced` 为 true 时，所有 Hook 必须立即返回，不创建 ScrollTrigger。

Run: `pnpm vitest run src/motion/motionProfiles.test.js src/data/content.test.js`

Expected: PASS。

### Task 2: 安装 GSAP 并建立可清理的 ScrollTrigger Hook

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/hooks/useScrollTimeline.js`
- Create: `src/hooks/useScrollTimeline.test.js`

- [ ] **Step 1: 安装固定版本依赖**

Run: `pnpm add gsap@3.14.2 @gsap/react@2.1.2`

- [ ] **Step 2: 写 Hook 的 reduced-motion 失败测试**

测试传入 `{ enabled: false }` 时不创建 timeline，组件卸载时调用 cleanup；测试必须使用 `vi.mock('gsap')` 记录 `context()` 和 `revert()` 调用。

- [ ] **Step 3: 实现 Hook 的统一接口**

```js
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useScrollTimeline({ scope, enabled, setup, dependencies = [] }) {
  useGSAP(() => {
    if (!enabled) return undefined
    const timeline = setup({ gsap, ScrollTrigger })
    return () => timeline?.kill?.()
  }, { scope, dependencies })
}
```

实际实现必须在 `setup` 中使用 `gsap.context` 或 `useGSAP` 自动清理，并在图片加载后调用一次 `ScrollTrigger.refresh()`。

- [ ] **Step 4: 运行 Hook 测试**

Run: `pnpm vitest run src/hooks/useScrollTimeline.test.js`

Expected: PASS。

### Task 3: 用 ProjectRail 替换失败的 WorkRing

**Files:**
- Create: `src/components/ProjectRail.jsx`
- Create: `src/components/ProjectRail.test.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`
- Delete after all imports are removed: `src/components/WorkRing.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: 写失败测试，要求六张可访问卡片**

测试 `<SelectedWork onOpen={vi.fn()} />` 后存在 6 个 `[data-project-card]`，每张卡片有 `href="#work/<id>"`、`aria-label`、`tabIndex=0`；按钮点击调用对应的 `onOpen`。

- [ ] **Step 2: 实现桌面端轨道结构**

```jsx
<section ref={rootRef} className="project-rail" data-project-rail>
  <div className="project-rail__viewport">
    <div ref={trackRef} className="project-rail__track">
      {projects.map((project) => (
        <a
          key={project.id}
          href={`#work/${project.id}`}
          data-project-card={project.id}
          onClick={(event) => { event.preventDefault(); onOpen(project.id, event.currentTarget) }}
        >
          <img src={coverFor(project)} alt={`${project.title}项目预览`} />
          <span>{project.index}</span>
          <strong>{project.title}</strong>
          <small>{project.category}</small>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: 实现 `pin + scrub`，不劫持滚轮**

在 `useScrollTimeline` 中使用：

```js
const distance = Math.max(0, track.scrollWidth - root.clientWidth)
gsap.timeline({
  scrollTrigger: {
    trigger: root,
    start: 'top top',
    end: () => `+=${distance + window.innerHeight}`,
    pin: true,
    scrub: 0.6,
    invalidateOnRefresh: true,
  },
}).to(track, { x: () => -distance, ease: 'none' })
```

在 `onUpdate` 中依据 progress 更新 `aria-current="true"`、编号、标题和顶端项目进度线。移动端不创建 timeline，只让轨道变成 `overflow-x: auto` 的可见卡片列表。

- [ ] **Step 4: 保留方向按钮并加入键盘控制**

桌面端左右按钮调用 `onOpen` 旁边的 `focusProject(index)`；`ArrowLeft`、`ArrowRight` 只在作品轨道获得焦点时生效。拖拽不再是必要入口。

- [ ] **Step 5: 删除 WorkRing 引用并修正测试**

确认 `rg "WorkRing|AUTO_SPEED" src` 没有结果后删除 `WorkRing.jsx`，并将旧的 `.work-ring__card` 断言改为 `[data-project-card]` 断言。

Run: `pnpm vitest run src/components/ProjectRail.test.jsx src/components/SelectedWork.test.jsx`

Expected: PASS。

### Task 4: 实现 Hero 的滚动绑定转场

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/motion/useHeroScroll.js`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Modify: `src/components/Hero.test.jsx`

- [ ] **Step 1: 给 Hero 增加稳定的语义节点**

为主标题、身份标签、视频 scrim 和 scroll cue 分别增加 `data-hero-title`、`data-hero-meta`、`data-hero-media`、`data-hero-cue`；不要使用文本内容作为动画选择器。

- [ ] **Step 2: 写桌面端 ScrollTrigger timeline**

触发范围为 `.hero` 从 `top top` 到 `bottom top`，设置 `scrub: true`、`invalidateOnRefresh: true`。时间轴按顺序执行：

```js
timeline
  .to('[data-hero-title]', { yPercent: -18, opacity: 0.12, ease: 'none' }, 0)
  .to('[data-hero-meta]', { yPercent: -8, opacity: 0.35, ease: 'none' }, 0)
  .to('[data-hero-media]', { scale: 1.06, filter: 'brightness(.34)', ease: 'none' }, 0)
  .to('[data-hero-cue]', { opacity: 0, ease: 'none' }, 0)
```

- [ ] **Step 3: 保留现有 Hero 进入动画并防止重复控制**

进入动画仍由 CSS 负责；滚动 timeline 只控制滚动阶段，不能与 `[data-reveal]` 同时修改同一属性。

- [ ] **Step 4: 在 reduced-motion 和移动端验证**

两个分支都不创建 ScrollTrigger；Hero 内容保持静态可见，视频隐藏策略沿用现有 CSS。

Run: `pnpm vitest run src/components/Hero.test.jsx`

Expected: PASS。

### Task 5: 完善 Cursor、文字揭示和项目转场

**Files:**
- Modify: `src/components/Cursor.jsx`
- Modify: `src/components/ScrollFillText.jsx`
- Create: `src/components/ProjectTransition.jsx`
- Create: `src/hooks/useProjectTransition.js`
- Create: `src/components/ProjectTransition.test.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: 扩展 Cursor 状态**

使用 `data-cursor="view" | "drag" | "close"`，Cursor 只在 fine pointer 且未 reduced-motion 时挂载：

- `view`: 环形指针扩大，中心显示 `VIEW`。
- `drag`: 作品轨道获得焦点或拖拽时显示方向箭头。
- `close`: 项目详情关闭按钮显示 `CLOSE`。

环形指针继续使用单一 RAF，位置使用 `translate3d`，状态切换只修改 class。

- [ ] **Step 2: 将 ScrollFillText 的动画限制为一次性揭示**

桌面端文字使用 20–24px 位移、0.56s 时长和最多 80ms 错峰；reduced-motion 立即显示。不要对中文正文逐字拆分，标题最多按行或词组拆分。

- [ ] **Step 3: 实现项目进入/退出 Hook**

`useProjectTransition` 接收 `{ sourceElement, open, onComplete }`，保存 source rect；鼠标点击使用 rect 起点的 clip-path，键盘触发使用 `opacity + translateY`。清理时恢复 source 的 aria 状态和焦点。

- [ ] **Step 4: 将 ProjectDetail 变成可访问 dialog**

打开时：设置 `role="dialog"`、`aria-modal="true"`、标题 `aria-labelledby`、Escape 关闭、左右键切换；把焦点移到返回按钮。关闭时恢复 `document.documentElement.style.overflow` 和触发卡片焦点，并用 15px scrollbar compensation 防止页面横跳。

- [ ] **Step 5: 通过交互测试**

测试鼠标打开、键盘 Enter 打开、Escape 关闭、返回焦点、上一个/下一个项目和 reduced-motion 无动画但内容可见。

Run: `pnpm vitest run src/components/ProjectTransition.test.jsx src/components/SelectedWork.test.jsx`

Expected: PASS。

### Task 6: 为六个 Story 接入专属 motion profile

**Files:**
- Modify: `src/components/OperationStory.jsx`
- Modify: `src/components/SanfuCampaignStory.jsx`
- Modify: `src/components/PosterStory.jsx`
- Modify: `src/components/DaodaoBarStory.jsx`
- Modify: `src/components/BrandStory.jsx`
- Modify: `src/components/IpStory.jsx`
- Modify: `src/styles.css`
- Modify: `src/components/OperationStory.test.jsx`
- Modify: `src/components/SanfuCampaignStory.test.jsx`
- Modify: `src/components/PosterStory.test.jsx`
- Modify: `src/components/DaodaoBarStory.test.jsx`
- Modify: `src/components/BrandStory.test.jsx`
- Modify: `src/components/IpStory.test.jsx`

- [ ] **Step 1: 运营视觉设计使用 `data-motion="market-route"`**

实现本 Task 前必须先完整阅读 `docs/superpowers/plans/2026-08-22-reference-motion-asset-level-addendum.md`；该附录是逐图验收标准，下面的通用 profile 不能替代它。每接入一张素材，都要登记其展示角色、焦点保护、进入触发、移动端降级和 reduced-motion 行为。

给原始海报、四个 grammar card、原创系统和五个 extension section 添加语义标记；实现路线 progress、顺序高亮、图片 clip reveal 和 focus/hover 箭头。验收：滚动顺序必须是海报 → 视觉语法 → 原创系统 → 市场应用。

- [ ] **Step 2: 生活新搭案使用 `data-motion="three-phase"`**

将三张 strategy card 与 `LIGHT / CONNECT / WARM` 节点连接到同一个 progress；当前阶段改变 CSS custom property `--sanfu-phase`，并让 activation extension 使用同一进度节奏。移动端改为三个点击展开面板。

- [ ] **Step 3: 成长日常使用 `data-motion="timeline-swap"`**

为两张海报建立同一比例的 stage 容器，以 `clip-path` 和 opacity 做儿童/成人物件切换；时间轴保持可见并同步 `aria-current`。不对海报本身做大角度旋转。

- [ ] **Step 4: 倒倒 bar 使用 `data-motion="pour-at-eleven"`**

为概念、身份规则和扩展模块添加低频进度动画；11 PM 刻度只使用 transform rotate 3–6deg 和亮度变化，避免持续闪烁。hover/focus 只改变当前卡片边框和小幅位移。

- [ ] **Step 5: MY MAY 使用 `data-motion="pause-and-warm"`**

为品牌 DNA、色板、VI 标准和五组 extension 添加暖橙 CSS property；媒体 hover 时降低局部动画 speed，并显示一次性暖光 highlight，触摸设备使用 450ms 的短暂高亮。

- [ ] **Step 6: TOSS DIARY 使用 `data-motion="character-keyframes"`**

将 foundation、service、summer、expression 和 seasonal/campaign 模块接入统一的六状态 progress；表情和角色动作支持键盘 focus 与触摸点击，不为每个状态建立独立 interval。

- [ ] **Step 7: 为六个 Story 增加内容无关的语义测试**

测试每个 Story 在 `motionAllowed=false` 时仍渲染全部关键标题、图片 alt 和 conclusion，不依赖动画 class 才能显示。

Run: `pnpm vitest run src/components/*Story.test.jsx`

Expected: PASS。

### Task 7: 完成响应式、降级和性能边界

**Files:**
- Modify: `src/styles.css`
- Modify: `src/motion/useMotionPreference.js`
- Modify: `src/hooks/useScrollTimeline.js`
- Modify: `src/components/ProjectRail.jsx`
- Modify: `src/components/ProjectDetail.jsx`
- Modify: `src/components/ResponsiveImage.jsx`

- [ ] **Step 1: 固定三个断点行为**

`>=1024px` 使用 pin/scrub；`768–1023px` 使用普通横向 overflow rail；`<768px` 使用纵向流。每个断点都必须有固定 aspect-ratio，不能让图片加载后推动文本。

- [ ] **Step 2: 完成 reduced-motion 降级**

当系统设置 reduced motion 且 URL 没有 `motion=force` 时：隐藏 Hero video、移除 clip-path、禁用 Cursor、禁用 pin/scrub、立即显示文字和图片。`motion=force` 只用于本地演示，生产环境不显示 `MOTION: FORCED` 徽标。

- [ ] **Step 3: 限制 ScrollTrigger refresh**

图片和字体完成后统一调用 `ScrollTrigger.refresh()`；resize 使用 200ms debounce；组件卸载时 kill 所有 timeline 和 trigger。禁止在 React render 中读取 `getBoundingClientRect()`。

- [ ] **Step 4: 通过静态和运行时检查**

Run: `rg "AUTO_SPEED|window\.on|setInterval" src`

Expected: 没有 `AUTO_SPEED`，没有未清理的全局 scroll handler，角色状态不使用每卡片 interval。

### Task 8: 进行完整验证和交付前视觉 QA

**Files:**
- Modify: `tests/static_deployment.test.mjs` only if the new dependency changes static asset assertions.
- Create: `docs/superpowers/qa/2026-08-22-reference-motion-qa.md`

- [ ] **Step 1: 运行自动测试**

Run: `pnpm test`

Expected: 所有测试通过；测试数量不少于当前 108 项加上本计划新增测试。

- [ ] **Step 2: 构建生产版本**

Run: `pnpm build`

Expected: Vite build 成功，`dist-upload` 或现有静态部署目录中的资源引用没有绝对本地路径。

- [ ] **Step 3: 浏览器检查桌面端**

在 `http://localhost:5173/?motion=force` 使用 1440×1000 检查：Hero 滚动转场、About 进入、横向作品轨道、六个项目打开/关闭、左右项目切换、Cursor 四态。控制台错误数量必须为 0。

- [ ] **Step 4: 浏览器检查平板和手机端**

在 1024×768、768×1024、390×844 检查：没有横向页面溢出、没有无法关闭的固定层、卡片可点击、长中文标题不被裁切、图片加载后布局不跳动。

- [ ] **Step 5: 检查 reduced-motion**

通过 DevTools 模拟 `prefers-reduced-motion: reduce`，确认所有内容立即可见、没有 pin/scrub、没有自动视频和自定义 Cursor；键盘仍能完成整个作品浏览。

- [ ] **Step 6: 写 QA 结论**

在 `docs/superpowers/qa/2026-08-22-reference-motion-qa.md` 记录每个视口、每个项目、每种 motion preference 的通过结果，并记录所有浏览器控制台错误为 0。
