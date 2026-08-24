import { expect, test } from 'vitest'
import { isGlobalProjectMotionTarget } from './globalProjectMotion'

test('shares the global motion grammar across every project figure, NESTA included', () => {
  document.body.innerHTML = `
    <article class="project">
      <figure id="standard"><img alt="standard" /></figure>
      <div class="nesta-story"><figure id="nesta"><img alt="nesta" /></figure></div>
    </article>
  `

  expect(isGlobalProjectMotionTarget(document.querySelector('#standard'))).toBe(true)
  expect(isGlobalProjectMotionTarget(document.querySelector('#nesta'))).toBe(true)
})
