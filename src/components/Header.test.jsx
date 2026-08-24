import { act, fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Header from './Header'

test('stays in the hero instead of becoming a fixed floating bar', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 1000 })
  const { container } = render(<section id="home"><Header /></section>)
  const hero = container.querySelector('#home')
  const header = screen.getByRole('banner')

  Object.defineProperty(hero, 'offsetHeight', { configurable: true, value: 1000 })
  Object.defineProperty(header, 'offsetHeight', { configurable: true, value: 92 })

  expect(header).not.toHaveClass('header--floating')

  window.scrollY = 909
  act(() => fireEvent.scroll(window))
  expect(header).not.toHaveClass('header--floating')
})
