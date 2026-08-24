import { render } from '@testing-library/react'
import PortfolioAtmosphere from './PortfolioAtmosphere'

test('renders one inert fixed atmosphere', () => {
  const { container } = render(<PortfolioAtmosphere />)
  expect(container.querySelector('.portfolio-atmosphere')).toHaveAttribute('aria-hidden', 'true')
  expect(container.querySelectorAll('.portfolio-atmosphere__glow')).toHaveLength(2)
  expect(container.querySelector('.portfolio-atmosphere__grid')).toBeInTheDocument()
  expect(container.querySelector('.portfolio-atmosphere__curve')).toBeInTheDocument()
  expect(container.querySelectorAll('.portfolio-atmosphere__particle')).toHaveLength(4)
})
