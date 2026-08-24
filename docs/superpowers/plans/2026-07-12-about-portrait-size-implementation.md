# About Fixed Portrait Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the About portrait visually connected to the title and introduction at every breakpoint, with details flowing below as a separate full-width module.

**Architecture:** Split the existing About markup into a `about__lead` grid containing the portrait and introductory copy, plus a `about__details` block containing stats, timeline, honors and email. Responsive CSS changes the Lead columns without ever turning the portrait into a standalone row.

**Tech Stack:** CSS Grid, Vitest static CSS assertions, in-app responsive browser verification.

---

### Task 1: Group portrait and introductory copy with TDD

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`
- Modify: `src/components/About.test.jsx`
- Modify: `src/components/About.jsx`

- [ ] **Step 1: Write the failing style assertions**

```js
test('keeps portrait and introductory copy in one lead block', () => {
  const { container } = render(<About />)
  expect(container.querySelector('.about__lead')).toContainElement(screen.getByRole('img'))
  expect(container.querySelector('.about__lead-copy')).toHaveTextContent('PROFILE / 2026')
  expect(container.querySelector('.about__details')).toHaveTextContent('SELECTED HONORS')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run src/styles.test.js`

Expected: FAIL because the Lead and Details wrappers do not exist.

- [ ] **Step 3: Implement fixed desktop/tablet/mobile sizes**

```css
.about__lead { display: grid; grid-template-columns: 320px minmax(0, 1fr); }
@media (max-width: 960px) { .about__lead { grid-template-columns: 240px minmax(0, 1fr); } }
@media (max-width: 720px) { .about__lead { grid-template-columns: 112px minmax(0, 1fr); } }
```

- [ ] **Step 4: Verify GREEN and production behavior**

Run: `pnpm exec vitest run src/styles.test.js && pnpm test && pnpm build`

Expected: all tests pass and Vite build exits successfully.

- [ ] **Step 5: Verify desktop and mobile layout in the browser**

At desktop, assert the Lead has two columns and portrait width is 320px. At 960px and 390×844, assert the portrait and title remain side-by-side and document horizontal overflow is zero.

- [ ] **Step 6: Commit**

```bash
git add src/styles.css src/styles.test.js docs/superpowers
git commit -m "style: keep About portrait compact"
```
