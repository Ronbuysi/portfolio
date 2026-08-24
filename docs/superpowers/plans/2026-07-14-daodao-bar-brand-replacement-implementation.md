# 倒倒 bar 品牌项目替换 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用倒倒 bar 品牌案例完整替换第 005 项酸嘢项目，并加入 6 张 Image-2 品牌延展。

**Architecture:** 保持 `projects` 七项目数组和现有项目顺序，第 005 项改为 `story: bar-brand`。新增独立 `DaodaoBarStory` 组件承载品牌概念、视觉语法、原创证据和 AI 延展；`SelectedWork` 只负责按 story 路由。所有原作与生成图存入独立 `public/images/daodao-bar/` 目录。

**Tech Stack:** React 19、Vite、Vitest、Testing Library、CSS、Image-2 built-in image generation。

---

### Task 1: 锁定新项目的数据契约

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/components/SelectedWork.test.jsx`
- Replace: `src/components/InformationStory.test.jsx` → `src/components/DaodaoBarStory.test.jsx`

- [ ] **Step 1: 写失败的数据测试**

将原酸嘢断言替换为：第 005 项 ID 是 `daodao-bar`、类别是 `Brand Design`、story 是 `bar-brand`、theme 是 `daodao`；`originals` 为 9 张，`extensions` 为 6 张，且序列中不包含 `suan-ye-information`。

- [ ] **Step 2: 写失败的组件路由测试**

在 `SelectedWork.test.jsx` 断言出现“倒倒 bar 品牌设计”、`.project--bar-brand`、`.daodao-story`，并断言“酸嘢图鉴”和 `.information-story` 不存在。

- [ ] **Step 3: 写失败的故事组件测试**

新测试渲染 `DaodaoBarStory`，断言 4 个概念卡、4 个视觉规则、9 个原创展板、6 个 AI 延展，以及来源标签 `ORIGINAL BRAND DESIGN` 和 `AI-ASSISTED BRAND EXTENSION`。

- [ ] **Step 4: 运行测试并确认按预期失败**

Run: `pnpm vitest run src/data/content.test.js src/components/SelectedWork.test.jsx src/components/DaodaoBarStory.test.jsx`

Expected: 因 `daodao-bar` 数据和 `DaodaoBarStory` 尚不存在而失败。

### Task 2: 整理原作与生成品牌延展

**Files:**
- Create: `public/images/daodao-bar/originals/*.jpg`
- Create: `public/images/daodao-bar/extensions/*.png`

- [ ] **Step 1: 复制并语义化命名 9 张原作**

使用不改动源文件的复制方式，命名为：`brand-story.jpg`、`identity-system.jpg`、`application-blueprint.jpg`、`pour-poster.jpg`、`color-language.jpg`、`retail-touchpoints.jpg`、`night-poster-system.jpg`、`brand-family.jpg`、`character-language.jpg`。

- [ ] **Step 2: 生成夜间街角门店 Hero**

以 `identity-system.jpg`、`night-poster-system.jpg` 和 `retail-touchpoints.jpg` 为参考，生成 16:9 蓝黑夜间街角酒吧，保留树懒酒杯图形与蓝奶油色系统，输出 `bar-exterior-hero.png`。

- [ ] **Step 3: 生成吧台物料系统**

以 `brand-family.jpg` 和 `color-language.jpg` 为参考，生成俯视吧台场景，包含菜单、杯垫、酒标、火柴、餐巾与玻璃杯，输出 `bar-counter-system.png`。

- [ ] **Step 4: 生成 11 PM 会员礼盒**

生成深蓝与奶油色的会员卡、徽章、火柴盒、小酒杯、故事卡和收藏盒，输出 `eleven-pm-member-kit.png`。

- [ ] **Step 5: 生成夜间海报传播矩阵**

生成城市夜墙、竖屏和社交卡片的统一视觉传播场景，输出 `night-campaign-system.png`。

- [ ] **Step 6: 生成空间导视系统**

生成店内蓝色灯箱、桌号、洗手间符号、酒单分类与出口导视，输出 `interior-wayfinding.png`。

- [ ] **Step 7: 生成桌面品牌全家福**

生成外带纸袋、杯套、酒瓶、罐装饮品、杯垫、菜单和树懒角色贴纸的暗色棚拍，输出 `takeaway-family.png`。

- [ ] **Step 8: 检查生成结果**

逐张确认：16:9、品牌蓝奶油色一致、树懒图形未被替换成新角色、无无关 Logo、无水印、没有明显乱码占据视觉中心。

### Task 3: 实现倒倒 bar 数据与组件

**Files:**
- Modify: `src/data/projects.js`
- Create: `src/components/DaodaoBarStory.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Delete: `src/components/InformationStory.test.jsx`

- [ ] **Step 1: 替换第 005 项数据**

数据字段使用 `brandConcepts`、`identityRules`、`originals`、`extensions`、`closing`；原图和延展路径严格对应 Task 2 的文件名。

- [ ] **Step 2: 创建 `DaodaoBarStory`**

组件包含 Hero、概念、语法、原创证据、延展和收尾六段；所有图片设置 `loading="lazy" decoding="async"`，Hero 图片来源仍为项目数据，不硬编码。

- [ ] **Step 3: 更新 `SelectedWork` 路由**

导入 `DaodaoBarStory`，为 `story === 'bar-brand'` 添加 `.project--bar-brand`，并在 story 分支中渲染新组件。

- [ ] **Step 4: 运行目标测试并确认通过**

Run: `pnpm vitest run src/data/content.test.js src/components/SelectedWork.test.jsx src/components/DaodaoBarStory.test.jsx`

Expected: 全部通过。

- [ ] **Step 5: 提交数据与组件**

```bash
git add src/data/projects.js src/components/SelectedWork.jsx src/components/SelectedWork.test.jsx src/components/DaodaoBarStory.jsx src/components/DaodaoBarStory.test.jsx src/data/content.test.js public/images/daodao-bar
git commit -m "feat: replace suan ye with daodao bar brand"
```

### Task 4: 建立暗色蓝黑案例样式

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: 写失败的样式测试**

断言 `.daodao-story` 定义 `--bar-blue: #1f8acc` 和 `--bar-cream: #fdf7d8`；原创区桌面 2 栏、图片 `object-fit: contain`；延展区 2 栏、图片框为 16:9；移动端原创与延展均为单列。

- [ ] **Step 2: 运行样式测试确认失败**

Run: `pnpm vitest run src/styles.test.js`

Expected: 因 `.daodao-story` 样式不存在而失败。

- [ ] **Step 3: 实现桌面与移动样式**

删除酸嘢专属 CSS，新增蓝黑背景、奶油证据画框、玻璃概念卡、两栏作品证据、两栏延展和整屏收尾；不改变其他项目样式。

- [ ] **Step 4: 运行样式与组件测试**

Run: `pnpm vitest run src/styles.test.js src/components/DaodaoBarStory.test.jsx src/components/SelectedWork.test.jsx`

Expected: 全部通过。

### Task 5: 同步 PDF 分段与视觉 QA

**Files:**
- Modify: `scripts/portfolio_pdf_segments.mjs`
- Modify: `tests/portfolio_pdf_segments.test.mjs`

- [ ] **Step 1: 先修改 PDF 分段测试**

要求标签包含 `Daodao header`、`Daodao concept`、`Daodao identity`、`Daodao originals`、`Daodao extensions`、`Daodao conclusion`，并不再要求 Information 项。

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest run tests/portfolio_pdf_segments.test.mjs`

Expected: 缺少 Daodao 分段而失败。

- [ ] **Step 3: 更新分段选择器**

将 `suan-ye-information` 的分段替换为 `daodao-bar` 和 `.daodao-story__*` 选择器。

- [ ] **Step 4: 桌面与移动端浏览器 QA**

在 1920 × 1080 与 390 × 844 下检查：项目顺序正确、原展板不裁切、延展图主体完整、无横向溢出、酸嘢不再出现。

- [ ] **Step 5: 运行全量验证**

Run: `pnpm test && pnpm build && git diff --check`

Expected: 96+ 测试通过、Vite 构建成功、无 diff 格式错误。

