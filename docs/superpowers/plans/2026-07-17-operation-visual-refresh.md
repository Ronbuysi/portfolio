# 运营视觉设计补充更新实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保留原三张海报和现有两张延展的基础上，加入八张新增原创设计与三张 Image-2 场景延展，并让桌面、手机和 PDF 输出都完整展示。

**Architecture:** 继续使用 `projects.js` 作为运营项目的唯一内容模型，在其中新增 `originalSystem` 并扩充 `extensions`。`OperationStory.jsx` 负责语义结构，`styles.css` 负责两列原创档案和既有横向延展体系，所有新位图均提供 960/1800 WebP 响应式版本。

**Tech Stack:** React、Vite、Vitest、Testing Library、CSS Grid、ResponsiveImage、Image-2、WebP。

---

### Task 1: 导入精选原创设计资产

**Files:**
- Create: `public/images/operation/originals-2026/*.jpg`
- Create: `public/images/operation/originals-2026/*-w960.webp`
- Create: `public/images/operation/originals-2026/*-w1800.webp`
- Test: `src/data/responsive-assets.test.js`

- [ ] **Step 1: 建立语义文件名映射**

复制八张选中源图并命名为 `project-background.jpg`、`visual-language.jpg`、`material-study.jpg`、`bag-blueprint.jpg`、`fabric-bag-family.jpg`、`vendor-carry-scene.jpg`、`social-cards.jpg`、`photo-poster-display.jpg`。

- [ ] **Step 2: 运行响应式资产测试并确认 RED**

先在 `projects.js` 的测试夹具中引用上述路径，运行：

```bash
pnpm exec vitest run src/data/responsive-assets.test.js
```

预期：因源图或 `-w960/-w1800.webp` 不存在而失败。

- [ ] **Step 3: 生成两种 WebP**

使用系统图像工具或工作区图像运行时，为每张源图生成宽度不超过 960 和 1800 的 WebP，保持纵横比，不裁切。

- [ ] **Step 4: 验证 GREEN**

```bash
pnpm exec vitest run src/data/responsive-assets.test.js
```

预期：新增原创资产均通过 RIFF/WEBP 与文件大小检查。

- [ ] **Step 5: 提交**

```bash
git add public/images/operation/originals-2026
git commit -m "feat: add refreshed operation originals"
```

### Task 2: 生成三张不重复的 Image-2 延展

**Files:**
- Create: `public/images/operation/extensions/market-route-wayfinding.png`
- Create: `public/images/operation/extensions/vendor-service-kit.png`
- Create: `public/images/operation/extensions/market-stamp-passport.png`
- Create: `public/images/operation/extensions/*-w960.webp`
- Create: `public/images/operation/extensions/*-w1800.webp`

- [ ] **Step 1: 生成市场路线导视图**

以购物篮海报、视觉语言板和摊主携带图为参考，生成真实市场入口的 16:9 场景；使用布旗、手写箭头、蔬果剪纸色块，避免复制现有室内摊位构图。

- [ ] **Step 2: 生成摊主运营工具包**

以布艺蔬果、袋型结构和购物袋应用为参考，生成深色工作台俯拍，包含围裙、价签、夹板、零钱袋、纸袋、布章和周转箱标签；不生成大段文字。

- [ ] **Step 3: 生成顾客集章漫游体验**

以手写字、社交卡片和配色板为参考，生成路线折页、集章册、印章、收据和小型布艺蔬果纪念物的编辑式俯拍；避免成为普通数字界面。

- [ ] **Step 4: 视觉检查与响应式转换**

逐张检查主题、色彩、手部、文字和材质；选定版本复制到项目目录，并生成 `-w960.webp` 与 `-w1800.webp`。

- [ ] **Step 5: 提交**

```bash
git add public/images/operation/extensions
git commit -m "feat: add operation field extensions"
```

### Task 3: 扩充运营项目数据模型

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] **Step 1: 写 RED 数据测试**

把现有运营测试改为：

```js
expect(operation.originalSystem).toHaveLength(8)
expect(operation.extensions).toHaveLength(5)
expect(operation.originalSystem.map((item) => item.src)).toEqual([
  '/images/operation/originals-2026/project-background.jpg',
  '/images/operation/originals-2026/visual-language.jpg',
  '/images/operation/originals-2026/material-study.jpg',
  '/images/operation/originals-2026/bag-blueprint.jpg',
  '/images/operation/originals-2026/fabric-bag-family.jpg',
  '/images/operation/originals-2026/vendor-carry-scene.jpg',
  '/images/operation/originals-2026/social-cards.jpg',
  '/images/operation/originals-2026/photo-poster-display.jpg',
])
```

并断言最后三张 extension 为 `market-route-wayfinding.png`、`vendor-service-kit.png`、`market-stamp-passport.png`。

- [ ] **Step 2: 运行测试确认 RED**

```bash
pnpm exec vitest run src/data/content.test.js
```

预期：`originalSystem` 未定义且 extension 数量仍为 2。

- [ ] **Step 3: 实现 GREEN 数据**

在运营项目对象中新增八个带 `label/alt/src` 的 `originalSystem` 项，并为三张新延展加入 `label/title/description/src`。

- [ ] **Step 4: 运行测试确认 GREEN**

```bash
pnpm exec vitest run src/data/content.test.js
```

- [ ] **Step 5: 提交**

```bash
git add src/data/content.test.js src/data/projects.js
git commit -m "feat: model operation original system"
```

### Task 4: 渲染原创系统补充章节

**Files:**
- Modify: `src/components/OperationStory.test.jsx`
- Modify: `src/components/OperationStory.jsx`

- [ ] **Step 1: 写 RED 组件测试**

断言 `.operation-story__system-evidence` 存在、包含 8 个 figure、出现 8 次 `ORIGINAL DESIGN SYSTEM`，并位于语法模块之后、延展模块之前；原海报数量仍为 3，总延展数量为 5。

- [ ] **Step 2: 运行测试确认 RED**

```bash
pnpm exec vitest run src/components/OperationStory.test.jsx
```

- [ ] **Step 3: 实现语义结构**

在语法模块之后加入带标题“从海报继续长成一套可触摸的市场系统”的 section，并用 `project.originalSystem.map` 渲染完整比例图片和原创来源标签。延展序号从现有逻辑连续生成。

- [ ] **Step 4: 运行测试确认 GREEN**

```bash
pnpm exec vitest run src/components/OperationStory.test.jsx
```

- [ ] **Step 5: 提交**

```bash
git add src/components/OperationStory.test.jsx src/components/OperationStory.jsx
git commit -m "feat: render operation system evidence"
```

### Task 5: 完成暗色档案排版与移动端适配

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: 写 RED 样式测试**

断言：系统说明块使用暗色径向渐变；桌面证据网格为两列；图片 `height:auto` 与 `object-fit:contain`；移动媒体查询把证据网格改为单列；延展继续为 16:9。

- [ ] **Step 2: 运行测试确认 RED**

```bash
pnpm exec vitest run src/styles.test.js
```

- [ ] **Step 3: 实现 GREEN 样式**

新增 `.operation-story__system`、`__system-head`、`__system-evidence` 和 `__system-card`。使用 1px 边框、克制磨砂说明层、两列完整展板；720px 以下单列，移除多余最小高度和横向间距。

- [ ] **Step 4: 运行测试确认 GREEN**

```bash
pnpm exec vitest run src/styles.test.js
```

- [ ] **Step 5: 提交**

```bash
git add src/styles.test.js src/styles.css
git commit -m "style: integrate operation system archive"
```

### Task 6: 更新 PDF 分段并做最终验证

**Files:**
- Modify: `tests/portfolio_pdf_segments.test.mjs`
- Modify: `scripts/portfolio_pdf_segments.mjs`

- [ ] **Step 1: 写 RED PDF 测试**

要求 `Operation grammar` 之后出现：

```js
{ label: 'Operation system evidence', selector: '#farmers-market .operation-story__system', pad: 24 }
```

- [ ] **Step 2: 运行测试确认 RED**

```bash
pnpm exec vitest run tests/portfolio_pdf_segments.test.mjs
```

- [ ] **Step 3: 添加 PDF 分段并确认 GREEN**

更新 `portfolio_pdf_segments.mjs`，再次运行上述测试。

- [ ] **Step 4: 运行完整验证**

```bash
pnpm test
pnpm exec vite build --outDir /tmp/codex-operation-final-build --emptyOutDir
git diff --check
```

预期：全部测试通过、构建退出码为 0、无 diff whitespace 错误。

- [ ] **Step 5: 浏览器视觉 QA**

在 `http://127.0.0.1:5173/#farmers-market` 检查 1440×1000 和 390×844：原创证据 8 张完整加载、不裁切；延展图加载对应 1800/960 WebP；无横向溢出；章节顺序正确。

- [ ] **Step 6: 提交**

```bash
git add tests/portfolio_pdf_segments.test.mjs scripts/portfolio_pdf_segments.mjs
git commit -m "fix: include operation system in portfolio output"
```
