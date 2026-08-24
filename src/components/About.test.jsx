import { render, screen } from '@testing-library/react'
import About from './About'

test('renders the authorized profile portrait while keeping the phone number private', () => {
  const { container } = render(<About />)
  expect(screen.getByText('沈阳建筑大学')).toBeInTheDocument()
  expect(screen.getByText('广西民族大学')).toBeInTheDocument()
  expect(screen.getByText(/未来设计师 NCDA 大赛/)).toBeInTheDocument()
  const portrait = screen.getByRole('img', { name: '王程程，视觉设计师与 AI 设计师个人肖像' })
  const portraitGlow = container.querySelector('.about__portrait-glow')
  expect(portrait).toHaveAttribute('src', '/images/profile/wang-chengcheng-2026-w1800.webp')
  expect(portrait.closest('picture')?.querySelector('source')).toHaveAttribute(
    'srcset',
    '/images/profile/wang-chengcheng-2026-w960.webp 828w',
  )
  expect(portrait).toHaveAttribute('width', '828')
  expect(portrait).toHaveAttribute('height', '1060')
  expect(container.querySelectorAll('img')).toHaveLength(1)
  expect(portraitGlow).toContainElement(portrait)
  expect(container.querySelectorAll('.about__portrait-glow')).toHaveLength(1)
  expect(container).not.toHaveTextContent(/\b1[3-9]\d{9}\b/)
})

test('keeps the portrait and introduction in one lead while details flow below', () => {
  const { container } = render(<About />)
  const lead = container.querySelector('.about__lead')
  const leadCopy = container.querySelector('.about__lead-copy')
  const details = container.querySelector('.about__details')

  expect(lead).toContainElement(screen.getByRole('img', { name: '王程程，视觉设计师与 AI 设计师个人肖像' }))
  expect(leadCopy).toHaveTextContent('PROFILE / 2026')
  expect(leadCopy).toHaveTextContent('把视觉直觉，变成')
  expect(details).toHaveTextContent('SELECTED HONORS')
  expect(details).toHaveTextContent('241022998@qq.com')
  expect(container.querySelector('[data-about-pin]')).toBeInTheDocument()
  expect(leadCopy).not.toHaveAttribute('data-reveal')
  expect(container.querySelectorAll('.about__stat')).toHaveLength(3)
  expect(container.querySelector('.about__path path')).toBeInTheDocument()
  expect(container.querySelectorAll('[data-about-node]')).toHaveLength(3)
  expect(container.querySelectorAll('.honors__card')).toHaveLength(3)
})
