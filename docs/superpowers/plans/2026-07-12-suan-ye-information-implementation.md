# Suan Ye Information Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 精简三福包装证据并新增节点应用，同时把两张酸嘢海报扩展为位于豪士之后的完整信息设计项目。

**Architecture:** 三福继续使用 `SanfuCampaignStory`，只调整结构化数据。酸嘢采用独立 `InformationStory` 组件，由 `SelectedWork` 根据 `story: information` 路由；原创海报与 AI 延展分开标注。

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS Grid, built-in Image-2

---

### Task 1: 生成并整理项目资产

**Files:**
- Create: `public/images/information-design/suan-ye-overview.jpg`
- Create: `public/images/information-design/suan-ye-character.jpg`
- Create: `public/images/information-design/exhibition-hero.png`
- Create: `public/images/information-design/character-system.png`
- Create: `public/images/information-design/market-wayfinding.png`
- Create: `public/images/information-design/editorial-kit.png`
- Create: `public/images/information-design/digital-system.png`
- Create: `public/images/sanfu-campaign/node-window.png`
- Create: `public/images/sanfu-campaign/node-member-kit.png`

- [ ] 复制两张原创信息海报到稳定项目路径。
- [ ] 使用三福数字系统为参考，分别生成节点橱窗和会员礼赠卡。
- [ ] 使用两张酸嘢海报为参考，逐张生成展览、角色、市集、出版物和数字界面。
- [ ] 用 `sips -g pixelWidth -g pixelHeight` 检查所有新资产。
- [ ] Commit: `feat: create information design extension assets`。

### Task 2: 精简并扩展三福数据

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`
- Modify: `src/components/SanfuCampaignStory.test.jsx`

- [ ] 先写失败测试：`originalEvidence` 为 5、`extensions` 为 8、数据中不存在 `original-packaging.jpg`。
- [ ] Run: `pnpm vitest run src/data/content.test.js src/components/SanfuCampaignStory.test.jsx`，确认失败。
- [ ] 删除包装展版数据，新增 `node-window.png` 和 `node-member-kit.png` 两项延展。
- [ ] 更新组件测试中的数量断言并运行至通过。
- [ ] Commit: `feat: refine Sanfu node campaign evidence`。

### Task 3: 新增信息设计数据模型

**Files:**
- Modify: `src/data/content.test.js`
- Modify: `src/data/projects.js`

- [ ] 写失败测试，断言项目总数为 7，酸嘢为 005，品牌和 IP 顺延为 006、007。
- [ ] 断言酸嘢有 2 张原创海报、4 个信息层、5 张延展且无 results/metrics。
- [ ] Run: `pnpm vitest run src/data/content.test.js`，确认失败。
- [ ] 在豪士之后插入 `story: information` 项目并顺延后续序号。
- [ ] Run: `pnpm vitest run src/data/content.test.js`，确认通过。
- [ ] Commit: `feat: model Suan Ye information design project`。

### Task 4: 新建信息设计案例组件

**Files:**
- Create: `src/components/InformationStory.jsx`
- Create: `src/components/InformationStory.test.jsx`
- Modify: `src/components/SelectedWork.jsx`
- Modify: `src/components/SelectedWork.test.jsx`

- [ ] 写失败测试，断言 2 个原创证据、4 个信息层级、5 个 AI 延展和正确来源标签。
- [ ] Run: `pnpm vitest run src/components/InformationStory.test.jsx src/components/SelectedWork.test.jsx`，确认失败。
- [ ] 实现 Hero、架构、原创证据、视觉语法、延展与 Outro，并接入 SelectedWork。
- [ ] 确保全部图片带 `loading="lazy"` 与 `decoding="async"`。
- [ ] Run focused tests，确认通过。
- [ ] Commit: `feat: add information design case study`。

### Task 5: 完成响应式信息档案版式

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] 写失败测试：信息层四列、原创海报两列、延展两列、移动端单列。
- [ ] Run: `pnpm vitest run src/styles.test.js`，确认失败。
- [ ] 使用黑色档案框架、荧光绿信号色、完整海报比例与 16:9 延展画面完成样式。
- [ ] Run focused style test，确认通过。
- [ ] Commit: `style: compose information design archive`。

### Task 6: 完整验证

**Files:**
- Verify all changed files and assets.

- [ ] Run: `pnpm test`，要求零失败。
- [ ] Run: `pnpm build`，要求 Vite 退出码 0。
- [ ] Run: `git diff --check`，要求无空白错误。
- [ ] 验证全部新资产返回 HTTP 200。
- [ ] 检查桌面端与 390px 移动端：七个项目、酸嘢位置正确、无横向溢出、三福包装展版不出现。
