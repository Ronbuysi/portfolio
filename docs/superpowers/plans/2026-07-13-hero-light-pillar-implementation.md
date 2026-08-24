# Hero Light Pillar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add performance-conscious React Bits LightPillar ambience to the Hero, About, and Strengths sections.

**Architecture:** A self-contained `LightPillar` component owns Three.js setup, shader uniforms, rendering, resize, document/viewport visibility pause, fallback, and cleanup. Hero, About, and Strengths provide section-specific colors and CSS layers every canvas behind readable content.

**Tech Stack:** React 19, Three.js, GLSL, CSS, Vitest, Testing Library

---

### Task 1: Component contract

**Files:**
- Create `src/components/LightPillar.jsx`, `src/components/LightPillar.css`, and `src/components/LightPillar.test.jsx`.
- Modify `package.json` and `pnpm-lock.yaml` by adding `three`.

- [ ] Write a failing test for a decorative container and WebGL/reduced-motion static fallback.
- [ ] Run `pnpm vitest run src/components/LightPillar.test.jsx` and verify failure because the component is missing.
- [ ] Install `three` and implement the supplied shader with complete cleanup and visibility pause.
- [ ] Re-run the focused test and verify it passes.

### Task 2: Hero integration

**Files:**
- Modify Hero, About, Strengths and their tests, plus `src/styles.css` and `src/styles.test.js`.

- [ ] Add failing assertions for one pillar in each non-work section, decorative semantics, and media/scrim/pillar stacking.
- [ ] Render the Hero pillar with acid-green/cool-blue colors and lower-opacity rotated variants in About and Strengths.
- [ ] Add mask, opacity, z-index, mobile, reduced-motion, and static fallback styles.
- [ ] Run focused tests and verify they pass.

### Task 3: Verification

- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Run `git diff --check`.
- [ ] Browser-check canvas/fallback presence, stacking, responsive overflow, and console errors.
- [ ] Commit with `git commit -m "feat: add hero light pillar ambience"`.
