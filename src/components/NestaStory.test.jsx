import { fireEvent, render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import NestaStory from './NestaStory'

const project = projects.find((item) => item.id === 'nesta-furniture')

test('renders the recruiter-first six-act NESTA narrative', () => {
  const { container } = render(<NestaStory project={project} />)

  expect(container.querySelector('[data-nesta-act="cold-open"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="brief"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="research"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="strategy"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="identity"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="applications"]')).toBeInTheDocument()
  expect(container.querySelector('[data-nesta-act="takeaway"]')).toBeInTheDocument()
  expect(screen.getByText('家具之外，空间如何承载自我？')).toBeInTheDocument()
  expect(screen.getByText('FROM RESEARCH TO A LIVING SYSTEM.')).toBeInTheDocument()
  expect(screen.getByText('展开完整调研与竞品档案')).toBeInTheDocument()
})

test('opens the complete research archive from a prominent disclosure entrance', () => {
  const { container } = render(<NestaStory project={project} />)

  const details = container.querySelector('details.nesta-evidence')
  const trigger = container.querySelector('.nesta-evidence__trigger')
  expect(details).toBeInTheDocument()
  expect(details).not.toHaveAttribute('open')
  expect(trigger).toBeInTheDocument()
  expect(screen.getByText('展开完整调研与竞品档案')).toBeInTheDocument()
  expect(screen.getByText('20 BOARDS')).toBeInTheDocument()
  fireEvent.click(trigger)
  expect(details).toHaveAttribute('open')
  expect(screen.getByText('收起完整调研与竞品档案')).toBeInTheDocument()
  expect(screen.getByText('VITRA')).toBeInTheDocument()
  expect(screen.getByText('IKEA')).toBeInTheDocument()
})

test('renders 48 responsive images with useful alt text', () => {
  const { container } = render(<NestaStory project={project} />)
  const images = container.querySelectorAll('img')

  expect(images).toHaveLength(48)
  images.forEach((image) => {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(image.getAttribute('alt').length).toBeGreaterThan(5)
  })
  expect(container.querySelectorAll('.nesta-media figcaption')).toHaveLength(0)
})
