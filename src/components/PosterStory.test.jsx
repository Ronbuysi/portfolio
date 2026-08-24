import { render, screen } from '@testing-library/react'
import PosterStory from './PosterStory'
import { projects } from '../data/projects'

test('renders two Horsh originals and its two-step timeline', () => {
  const horsh = projects.find((project) => project.id === 'horsh-growth')
  const { container } = render(<PosterStory project={horsh} />)
  expect(container.querySelector('.poster-story--horsh')).toBeInTheDocument()
  expect(container.querySelectorAll('.poster-story__originals img')).toHaveLength(2)
  expect(screen.getByText('小时候')).toBeInTheDocument()
  expect(screen.getByText('长大后')).toBeInTheDocument()
  expect(screen.getAllByText('ORIGINAL POSTER')).toHaveLength(4)
  expect(screen.getByText('AI-ASSISTED PRESENTATION')).toBeInTheDocument()

  for (const image of container.querySelectorAll('figure img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})
