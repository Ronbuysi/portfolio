import { render, screen } from '@testing-library/react'
import BorderGlow from './BorderGlow'

test('renders a flat frame with the supplied content and background', () => {
  const { container } = render(
    <BorderGlow
      className="portrait-glow"
      backgroundColor="#0b1d3c"
      borderRadius={0}
      glowRadius={18}
      colors={['#d8ff36', '#5b8cff', '#f2f0eb']}
    >
      <span>Portfolio content</span>
    </BorderGlow>,
  )

  const card = container.querySelector('.border-glow-card.portrait-glow')
  expect(card).toBeInTheDocument()
  expect(screen.getByText('Portfolio content')).toBeInTheDocument()
  expect(card.querySelector('.edge-light')).toBeNull()
  expect(card.style.getPropertyValue('--card-bg')).toBe('#0b1d3c')
  expect(card.style.getPropertyValue('--border-radius')).toBe('0px')
})

test('ignores legacy glow props and renders plain children', () => {
  const { container } = render(<BorderGlow><span>Interactive card</span></BorderGlow>)
  const card = container.querySelector('.border-glow-card')
  expect(card).toBeInTheDocument()
  expect(screen.getByText('Interactive card')).toBeInTheDocument()
  expect(card.style.getPropertyValue('--edge-proximity')).toBe('')
})
