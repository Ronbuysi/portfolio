# Sanfu Visual Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将三福项目从三张独立海报升级为包含策略、原创证据和多触点延展的视觉策划案例。

**Architecture:** 保持 `projects.js` 作为内容数据源，新建专用 `SanfuCampaignStory` 组件承载策略档案结构，并由 `SelectedWork` 根据 `story: campaign` 路由。AI 位图只负责展示场景，准确文案和来源标签由 React 输出。

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS Grid, built-in Image-2

---

### Task 1: 整理原创素材与生成六张延展图

**Files:**
- Create: `public/images/sanfu-campaign/original-elements.jpg`
- Create: `public/images/sanfu-campaign/original-packaging.jpg`
- Create: `public/images/sanfu-campaign/original-numerals.jpg`
- Create: `public/images/sanfu-campaign/campaign-hero.png`
- Create: `public/images/sanfu-campaign/workplace-activation.png`
- Create: `public/images/sanfu-campaign/campus-activation.png`
- Create: `public/images/sanfu-campaign/city-activation.png`
- Create: `public/images/sanfu-campaign/packaging-system.png`
- Create: `public/images/sanfu-campaign/social-system.png`

- [ ] **Step 1: 复制三张原创辅助展版**

将元素、包装和数字节点展版复制到稳定的项目路径，并使用语义化文件名。

- [ ] **Step 2: 用 Image-2 逐张生成六张延展资产**

每个提示都引用原创拼图元素与包装展版，固定蓝、黄、粉、紫色谱，避免大段生成文字和伪造品牌标识。

- [ ] **Step 3: 检查尺寸、主体和视觉一致性**

Run: `sips -g pixelWidth -g pixelHeight public/images/sanfu-campaign/*`

- [ ] **Step 4: Commit**

```bash
git add public/images/sanfu-campaign
git commit -m "feat: create Sanfu campaign extension assets"
```

### Task 2: 重构三福内容模型

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] **Step 1: Write the failing data test**

```js
expect(sanfu).toMatchObject({ category: 'Visual Campaign', story: 'campaign' })
expect(sanfu.strategy).toHaveLength(3)
expect(sanfu.originalEvidence).toHaveLength(6)
expect(sanfu.extensions).toHaveLength(6)
expect(sanfu).not.toHaveProperty('presentation')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/data/content.test.js`
Expected: FAIL because Sanfu is still a poster story.

- [ ] **Step 3: Implement the campaign data**

Replace the old presentation model with `strategy`, `visualLanguage`, `originalEvidence`, and `extensions`; keep the three poster files inside `originalEvidence` only.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/data/content.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/content.test.js src/data/projects.js
git commit -m "feat: model Sanfu as a visual campaign"
```

### Task 3: 新建三福专属案例组件

**Files:**
- Create: `src/components/SanfuCampaignStory.jsx`
- Create: `src/components/SanfuCampaignStory.test.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`
- Modify: `src/components/PosterStory.test.jsx`

- [ ] **Step 1: Write failing component tests**

```jsx
expect(container.querySelectorAll('.sanfu-campaign__strategy-card')).toHaveLength(3)
expect(container.querySelectorAll('.sanfu-campaign__original')).toHaveLength(6)
expect(container.querySelectorAll('.sanfu-campaign__extension')).toHaveLength(6)
expect(screen.getAllByText('ORIGINAL CAMPAIGN ARTWORK')).toHaveLength(6)
expect(screen.getAllByText('AI-ASSISTED CAMPAIGN EXTENSION')).toHaveLength(6)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/SanfuCampaignStory.test.jsx src/components/SelectedWork.test.jsx`
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the component and route**

Build `hero`, `strategy`, `grammar`, `evidence`, `extensions`, and `outro` sections. Every image receives `loading="lazy"` and `decoding="async"`; the first hero can use eager loading only if performance tests require it.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/SanfuCampaignStory.test.jsx src/components/SelectedWork.test.jsx src/components/PosterStory.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: add Sanfu campaign case study"
```

### Task 4: 建立暗色策略档案版式

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing layout tests**

```js
expect(css).toMatch(/\.sanfu-campaign__strategy\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
expect(css).toMatch(/\.sanfu-campaign__evidence\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s)
expect(css).toMatch(/\.sanfu-campaign__extensions\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/s)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/styles.test.js`
Expected: FAIL because campaign selectors do not exist.

- [ ] **Step 3: Implement desktop and mobile CSS**

Use 1700px shell inheritance, dark borders, restrained glass captions, three-column strategy/evidence, and one-feature-plus-two-column extension hierarchy. At `max-width: 720px`, all grids become one column and no element keeps a multi-column span.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/styles.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css src/styles.test.js
git commit -m "style: compose Sanfu campaign archive"
```

### Task 5: 完整验证

**Files:**
- Verify: all touched files and public assets

- [ ] **Step 1: Run the full suite**

Run: `pnpm test`
Expected: all tests pass with zero failures.

- [ ] **Step 2: Run production build**

Run: `pnpm build`
Expected: Vite exits 0 and emits `dist` assets.

- [ ] **Step 3: Check whitespace and worktree state**

Run: `git diff --check && git status --short`
Expected: no whitespace errors; only intentional files remain.

- [ ] **Step 4: Verify local preview**

Check `/` and `#sanfu-lifestyle` at desktop and mobile widths. Confirm six extensions, six original evidence items, no duplicated standalone poster chapter, no broken image, and no horizontal overflow.
