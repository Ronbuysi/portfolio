import { render, screen } from '@testing-library/react'
import Hero from './Hero'

test('renders the NESTA illustration scene and five furniture props without video', () => {
  const { container } = render(<Hero />)

  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view selected work/i })).toHaveAttribute('href', '#work')
  expect(container.querySelector('video')).toBeNull()
  expect(container.querySelector('.hero__scene-bg img')).toHaveAttribute('src', '/images/hero/nesta-illustration-bg-w1800.webp')
  expect(container.querySelectorAll('[data-hero-prop]')).toHaveLength(5)
  expect(container.querySelector('.hero__scroll-cue')).toBeInTheDocument()
})
