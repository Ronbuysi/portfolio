# Restrained Glass System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one restrained frosted-glass hierarchy to navigation, controls, metadata and image labels without obscuring portfolio artwork.

**Architecture:** Define shared glass tokens in `:root`, apply them to small or medium overlay surfaces, and preserve solid artwork and contact surfaces. Add feature and fallback tests before implementation.

**Tech Stack:** CSS backdrop-filter, Vitest CSS contract tests, React/Vite.

## Task 1: Add CSS contracts

- [ ] Add failing assertions for shared glass variables, header/button blur, project metadata glass, overlay labels, fallback support and solid Contact.
- [ ] Run `pnpm exec vitest run src/styles.test.js` and verify RED.

## Task 2: Implement the glass hierarchy

- [ ] Add `--glass-*` variables and shared backdrop rules.
- [ ] Apply light glass to header/buttons and medium glass to metadata and overlay labels.
- [ ] Add `@supports not (backdrop-filter: blur(1px))` opaque fallback, mobile blur reduction and reduced-transparency fallback.
- [ ] Keep `.contact` fully opaque and avoid filters on artwork images.

## Task 3: Verify

- [ ] Run focused and full tests plus `pnpm build`.
- [ ] Inspect desktop and 390×844 layouts for readability, overflow and filter scope.
- [ ] Commit with `style: add restrained glass hierarchy`.
