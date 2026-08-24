import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import DaodaoBarStory from './DaodaoBarStory'

test('renders the Daodao Bar concept, identity, originals and brand extensions', () => {
  const project = projects.find((item) => item.id === 'daodao-bar')
  const { container } = render(<DaodaoBarStory project={project} />)

  expect(container.querySelectorAll('.daodao-story__concept-card')).toHaveLength(4)
  expect(container.querySelectorAll('.daodao-story__identity-rule')).toHaveLength(4)
  expect(container.querySelectorAll('.daodao-story__original')).toHaveLength(9)
  expect(container.querySelectorAll('.daodao-story__extension')).toHaveLength(6)
  expect(screen.getAllByText('ORIGINAL BRAND DESIGN')).toHaveLength(9)
  expect(screen.getAllByText('AI-ASSISTED BRAND EXTENSION')).toHaveLength(6)
  const conceptHead = container.querySelector('.daodao-story__concept-head h3')
  expect(conceptHead?.textContent).toContain('倒掉不属于你的重量。')
  expect(screen.getByText('Pour it out. Stay a while.')).toBeInTheDocument()

  for (const image of container.querySelectorAll('img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})

test('shows each supplied original board exactly once', () => {
  const project = projects.find((item) => item.id === 'daodao-bar')
  const { container } = render(<DaodaoBarStory project={project} />)

  for (const src of [
    '/images/daodao-bar/originals/brand-story.jpg',
    '/images/daodao-bar/originals/identity-system.jpg',
    '/images/daodao-bar/originals/application-blueprint.jpg',
    '/images/daodao-bar/originals/pour-poster.jpg',
    '/images/daodao-bar/originals/color-language.jpg',
    '/images/daodao-bar/originals/retail-touchpoints.jpg',
    '/images/daodao-bar/originals/night-poster-system.jpg',
    '/images/daodao-bar/originals/brand-family.jpg',
    '/images/daodao-bar/originals/character-language.jpg',
  ]) {
    const optimizedSrc = src.replace(/\.jpg$/, '-w1800.webp')
    expect(container.querySelectorAll(`img[src="${optimizedSrc}"]`)).toHaveLength(1)
  }
})
