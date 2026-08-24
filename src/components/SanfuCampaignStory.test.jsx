import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import SanfuCampaignStory from './SanfuCampaignStory'

test('renders Sanfu as a three-stage campaign with original evidence and six extensions', () => {
  const project = projects.find((item) => item.id === 'sanfu-lifestyle')
  const { container } = render(<SanfuCampaignStory project={project} />)

  expect(container.querySelectorAll('.sanfu-campaign__strategy-card')).toHaveLength(3)
  expect(container.querySelectorAll('.sanfu-campaign__section-glow')).toHaveLength(3)
  expect(container.querySelectorAll('.sanfu-campaign__strategy-glow')).toHaveLength(3)
  expect(container.querySelectorAll('.sanfu-campaign__original')).toHaveLength(3)
  expect(container.querySelectorAll('.sanfu-campaign__process-presentation')).toHaveLength(2)
  expect(container.querySelectorAll('.sanfu-campaign__extension')).toHaveLength(8)
  expect(screen.getAllByText('ORIGINAL CAMPAIGN ARTWORK')).toHaveLength(3)
  expect(screen.getAllByText('AI-ASSISTED PROCESS PRESENTATION')).toHaveLength(2)
  expect(screen.getAllByText('AI-ASSISTED CAMPAIGN EXTENSION')).toHaveLength(8)
  expect(container.querySelector('img[src="/images/sanfu-campaign/original-packaging.jpg"]')).not.toBeInTheDocument()
  expect(container.querySelector('img[src="/images/sanfu-campaign/original-elements.jpg"]')).not.toBeInTheDocument()
  expect(container.querySelector('img[src="/images/sanfu-campaign/original-numerals.jpg"]')).not.toBeInTheDocument()
  expect(screen.getByText('一搭就“亮”')).toBeInTheDocument()
  expect(screen.getByText('一搭就“合”')).toBeInTheDocument()
  expect(screen.getByText('一搭就“暖”')).toBeInTheDocument()
  expect(screen.getByText('Different lives. One shared way to connect.')).toBeInTheDocument()

  for (const image of container.querySelectorAll('img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})

test('shows each supplied Sanfu poster only once inside original evidence', () => {
  const project = projects.find((item) => item.id === 'sanfu-lifestyle')
  const { container } = render(<SanfuCampaignStory project={project} />)

  for (const src of [
    '/images/poster-projects/sanfu-travel.jpg',
    '/images/poster-projects/sanfu-dorm.jpg',
    '/images/poster-projects/sanfu-office.jpg',
  ]) {
    const optimizedSrc = src.replace(/\.jpg$/, '-w1800.webp')
    expect(container.querySelectorAll(`img[src="${optimizedSrc}"]`)).toHaveLength(1)
  }
})
