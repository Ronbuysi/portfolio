# Profile Portrait Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用最新个人照片替换 About 肖像，并保持现有暗色科技档案视觉。

**Architecture:** 保持 About 组件结构不变，仅替换项目内图片资产、尺寸属性和确定性的 CSS 裁切参数。通过组件测试与样式测试锁定路径、隐私和响应式焦点。

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS

---

### Task 1: Replace the portrait asset

**Files:**
- Create: `public/images/profile/wang-chengcheng-2026.jpg`
- Modify: `src/components/About.test.jsx`
- Modify: `src/components/About.jsx`

- [ ] 将用户原图复制为项目稳定资产。
- [ ] 先将测试期望更新为 `/images/profile/wang-chengcheng-2026.jpg` 并运行，确认失败。
- [ ] 更新 About 图片路径及 `width="828" height="1060"`。
- [ ] Run: `pnpm vitest run src/components/About.test.jsx`，确认通过。

### Task 2: Tune deterministic portrait framing

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] 先将样式测试更新为桌面 `center 30%`、移动 `center 27%` 并运行，确认失败。
- [ ] 更新裁切位置，并将滤镜调整为 `grayscale(1) contrast(1.12) brightness(.8)`。
- [ ] Run: `pnpm vitest run src/styles.test.js`，确认通过。

### Task 3: Verify

- [ ] Run: `pnpm test`。
- [ ] Run: `pnpm build`。
- [ ] Run: `git diff --check`。
- [ ] 在桌面端与 390px 移动端检查人脸焦点、单图数量和横向溢出。
- [ ] Commit: `feat: replace portfolio profile portrait`。
