import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import BrandStory from './BrandStory'

test('renders original MY MAY evidence and three AI-assisted extensions', () => {
  const project = projects.find((item) => item.id === 'my-may-pizza')
  const { container } = render(<BrandStory project={project} />)

  expect(container.querySelectorAll('.brand-story__originals img')).toHaveLength(4)
  expect(container.querySelectorAll('.brand-story__extension')).toHaveLength(3)
  expect(container.querySelectorAll('.brand-story__concept-glow')).toHaveLength(1)
  expect(container.querySelectorAll('.brand-story__rule-glow')).toHaveLength(4)
  expect(screen.getAllByText('ORIGINAL BRAND ARTWORK')).toHaveLength(4)
  expect(screen.getAllByText('AI-ASSISTED BRAND EXTENSION')).toHaveLength(3)
  expect(screen.getByText('A pause, served warm.')).toBeInTheDocument()

  for (const image of container.querySelectorAll('img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})

test('renders the three-part brand DNA without inventing results', () => {
  const project = projects.find((item) => item.id === 'my-may-pizza')
  render(<BrandStory project={project} />)

  expect(screen.getByText('PAUSE / 暂停')).toBeInTheDocument()
  expect(screen.getByText('PIZZA / 手作')).toBeInTheDocument()
  expect(screen.getByText('PAWS / 陪伴')).toBeInTheDocument()
  expect(screen.getByText('#E1540F')).toBeInTheDocument()
})

test('renders logo standards and two VI application extensions', () => {
  const project = projects.find((item) => item.id === 'my-may-pizza')
  const { container } = render(<BrandStory project={project} />)

  expect(container.querySelector('.brand-story__standards')).toBeInTheDocument()
  expect(screen.getByText('LOGO STANDARDS / 03')).toBeInTheDocument()
  expect(screen.getByText('1× CAT EAR')).toBeInTheDocument()
  expect(screen.getByText('24 PX / 12 MM')).toBeInTheDocument()
  expect(screen.getByText('CREAM ON ORANGE')).toBeInTheDocument()
  expect(container.querySelectorAll('.brand-story__vi-extension')).toHaveLength(2)
  expect(screen.getAllByText('AI-ASSISTED VI EXTENSION')).toHaveLength(2)
})
