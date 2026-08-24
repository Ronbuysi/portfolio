# Selective Border Glow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cursor-responsive border glow to the About portrait, four Strengths cards, and four operation-design visual grammar cards without affecting artwork presentation.

**Architecture:** Create a self-contained `BorderGlow` component and stylesheet based on the supplied React Bits source. Wrap only the approved portrait and capability cards, with component-specific preset props and responsive CSS adjustments.

**Tech Stack:** React 19, CSS custom properties, Vitest, Testing Library

---

### Task 1: BorderGlow component

**Files:**
- Create: `src/components/BorderGlow.jsx`
- Create: `src/components/BorderGlow.css`
- Create: `src/components/BorderGlow.test.jsx`

- [ ] Write tests asserting rendered structure, CSS variables, and pointer updates.
- [ ] Run `pnpm vitest run src/components/BorderGlow.test.jsx` and verify failure because the component is missing.
- [ ] Implement the supplied component without external dependencies, including decorative `aria-hidden` markup and pointer-leave reset.
- [ ] Add restrained CSS plus coarse-pointer, reduced-motion, and reduced-transparency fallbacks.
- [ ] Re-run the focused test and verify it passes.

### Task 2: Selective integration

**Files:**
- Modify: `src/components/About.jsx`
- Modify: `src/components/About.test.jsx`
- Modify: `src/components/Strengths.jsx`
- Modify: `src/components/ClosingSections.test.jsx`
- Modify: `src/components/OperationStory.jsx`
- Modify: `src/components/OperationStory.test.jsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] Add failing integration tests for one portrait glow, four capability glows, and four operation visual-grammar glows.
- [ ] Run the focused tests and verify the missing glow wrappers fail.
- [ ] Wrap the approved elements with square, low-intensity presets and adjust grid/portrait selectors for the new wrapper layer.
- [ ] Add CSS assertions for the approved wrapper classes and responsive behavior.
- [ ] Run focused tests and verify they pass.

### Task 3: Verification

**Files:**
- Verify all changed files and the live site.

- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Run `git diff --check`.
- [ ] Browser-check desktop pointer behavior, mobile static fallback, and horizontal overflow.
- [ ] Commit with `git commit -m "feat: add selective border glow accents"`.

### Task 4: Narrative frame expansion

**Files:**
- Modify the Sanfu, Information, Brand, IP, and Packaging story components and their tests.
- Modify `src/styles.css` and `src/styles.test.js`.

- [ ] Add failing count assertions for section frames and comparable text cards.
- [ ] Wrap only text-led frames with project-colored, low-intensity `BorderGlow` presets.
- [ ] Restore every affected grid, height, border, and mobile rule on the new wrapper layer.
- [ ] Run focused tests, then repeat the full verification commands from Task 3.
