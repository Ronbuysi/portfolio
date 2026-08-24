import { render } from '@testing-library/react'
import TickerTape from './TickerTape'

test('renders the ticker as the About-to-Work threshold', () => {
  const { container } = render(<TickerTape />)
  expect(container.querySelector('[data-chapter-threshold="work"]')).toBeInTheDocument()
  expect(container.querySelectorAll('.ticker__half')).toHaveLength(2)
})
