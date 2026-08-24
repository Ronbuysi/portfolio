# Profile Portrait Implementation Plan

**Goal:** Replace the About module's abstract typographic portrait with the user's authorized photo in the approved deep-navy duotone treatment while preserving privacy and responsive alignment.

**Architecture:** Keep `About` data and copy unchanged. Add one optimized local image, render it in a semantic figure, and implement all visual transformation with CSS so the original face remains untouched.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, CSS Grid.

## Task 1: Curate the authorized photo

- Copy the supplied JPEG to `public/images/profile/wang-chengcheng.jpg`.
- Convert to sRGB and constrain the long edge to 2200px without cropping.
- Verify portrait orientation, RGB color and decode integrity.

## Task 2: Update About with tests first

- Change `About.test.jsx` to require one image with meaningful alt text and continue forbidding phone numbers.
- Verify the test fails before implementation.
- Replace `.about__art` W/C/C markup with a figure containing the photo, grid overlay, role labels and name caption.
- Verify the component test passes.

## Task 3: Add the approved duotone layout

- Add deep navy/gray-white treatment using CSS filters and blend layers.
- Keep the shared About grid and align the image to the content top.
- Add responsive rules that preserve the image above content on narrow screens.
- Add CSS regression assertions for `object-fit`, portrait focal point and responsive layout.

## Task 4: Verify

- Run focused About/style tests, then the complete test suite and production build.
- Inspect the About section in the local browser at desktop and mobile widths when browser control is available.
