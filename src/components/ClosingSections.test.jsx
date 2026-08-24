import { render, screen } from '@testing-library/react'
import Strengths from './Strengths'
import Contact from './Contact'

test('renders the four approved capabilities', () => {
  const { container } = render(<Strengths />)
  for (const label of ['视觉系统', '品牌表达', 'AI 共创', '动态叙事']) {
    expect(screen.getByRole('heading', { name: label })).toBeInTheDocument()
  }
  expect(container.querySelectorAll('.strengths__glow')).toHaveLength(4)
  expect(container.querySelectorAll('.strengths__glow article')).toHaveLength(4)
  expect(container.querySelector('.strengths__path path')).toBeInTheDocument()
  expect(container.querySelectorAll('[data-strength-card]')).toHaveLength(4)
  expect(container.querySelectorAll('.toolkit__track')).toHaveLength(2)
})

test('uses email and a progressive back-to-top contact ending', () => {
  const { container } = render(<Contact />)
  expect(screen.getByRole('link', { name: /241022998@qq.com/i })).toHaveAttribute('href', 'mailto:241022998@qq.com')
  expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#home')
  expect(container.querySelector('.contact__wipe')).toBeInTheDocument()
  expect(container.querySelectorAll('.contact__orb')).toHaveLength(2)
  expect(container.querySelector('.contact__email-scan')).toBeInTheDocument()
})
