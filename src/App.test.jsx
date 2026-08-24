import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { beforeEach } from 'vitest'
import App from './App'

beforeEach(() => sessionStorage.clear())

test('renders the complete five-part portfolio', () => {
  const { container } = render(<App />)
  expect(screen.getByRole('heading', { name: /visual designer/i })).toBeInTheDocument()
  expect(container.querySelector('#about')).toBeInTheDocument()
  expect(container.querySelector('#work')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /four ways i create value/i })).toBeInTheDocument()
  expect(container.querySelector('#contact')).toBeInTheDocument()
})

test('shows the loader once per session and wires readiness to real Hero assets', () => {
  const first = render(<App />)
  expect(first.container.querySelector('.preloader')).toBeInTheDocument()
  first.unmount()

  sessionStorage.setItem('wcc-pl', '1')
  const returning = render(<App />)
  expect(returning.container.querySelector('.preloader')).not.toBeInTheDocument()

  const source = readFileSync('src/App.jsx', 'utf8')
  expect(source).toContain('<Preloader assets={heroPreloadSources} onReady={handleReady} />')
  expect(source).not.toContain('1450')
})
