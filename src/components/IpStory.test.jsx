import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import IpStory from './IpStory'

test('separates original IP evidence, rebuilt summer campaign and new extensions', () => {
  const project = projects.find((item) => item.id === 'toss-diary')
  const { container } = render(<IpStory project={project} />)

  expect(container.querySelectorAll('.ip-story__original')).toHaveLength(8)
  expect(screen.getAllByText('ORIGINAL IP DESIGN')).toHaveLength(8)
  expect(container.querySelectorAll('.ip-story__service-item')).toHaveLength(5)
  expect(container.querySelectorAll('.ip-story__service-item--featured')).toHaveLength(1)
  expect(screen.getAllByText('AI-ASSISTED SERVICE EXTENSION')).toHaveLength(5)
  expect(container.querySelectorAll('.ip-story__summer-poster')).toHaveLength(3)
  expect(container.querySelectorAll('.ip-story__summer-application')).toHaveLength(3)
  expect(screen.getAllByText('AI-ASSISTED SUMMER CAMPAIGN EXTENSION')).toHaveLength(6)
  expect(container.querySelector('img[src="/images/toss-diary/user-ai-summer-festival.png"]')).not.toBeInTheDocument()
  expect(container.querySelectorAll('.ip-story__extension')).toHaveLength(4)
  expect(screen.getAllByText('AI-ASSISTED IP EXTENSION')).toHaveLength(4)
  expect(container.querySelectorAll('.ip-story__expression-extension')).toHaveLength(2)
  expect(screen.getAllByText('AI-ASSISTED EXPRESSION EXTENSION')).toHaveLength(2)
  expect(container.querySelectorAll('.ip-story__campaign-extension')).toHaveLength(2)
  expect(container.querySelectorAll('.ip-story__section-glow')).toHaveLength(3)
  expect(container.querySelectorAll('.ip-story__summer-track-glow')).toHaveLength(3)
  expect(screen.getAllByText('AI-ASSISTED CAMPAIGN EXTENSION')).toHaveLength(2)
  expect(screen.getByText('BAKERY SERVICE / 03')).toBeInTheDocument()
  expect(screen.getByText('SUMMER CAMPAIGN / 04')).toBeInTheDocument()
  expect(screen.getByText('EXPRESSION SYSTEM / 05')).toBeInTheDocument()
  expect(screen.getByText('SEASONAL & MOTION / 06')).toBeInTheDocument()
  expect(screen.getByText('VISUAL CONCLUSION / 07')).toBeInTheDocument()
  expect(screen.getByText('Every loaf starts a little story.')).toBeInTheDocument()

  for (const image of container.querySelectorAll('img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})

test('renders the original three-color and character-trait system', () => {
  const project = projects.find((item) => item.id === 'toss-diary')
  render(<IpStory project={project} />)

  expect(screen.getByText('#9F2E24')).toBeInTheDocument()
  expect(screen.getByText('#FFFEF8')).toBeInTheDocument()
  expect(screen.getByText('#552D2A')).toBeInTheDocument()
  expect(screen.getByText('HEART-SHAPED EARS')).toBeInTheDocument()
  expect(screen.getByText('BREAD-LED STORY')).toBeInTheDocument()
})

test('orders original evidence, bakery service and summer campaign sections', () => {
  const project = projects.find((item) => item.id === 'toss-diary')
  const { container } = render(<IpStory project={project} />)
  const story = container.querySelector('.ip-story')
  const sectionOrder = Array.from(story.children)
    .filter((element) => element.matches('.ip-story__evidence, .ip-story__service, .ip-story__summer-campaign'))
    .map((element) => element.className)

  expect(sectionOrder).toEqual([
    'ip-story__evidence',
    'ip-story__service',
    'ip-story__summer-campaign',
  ])
})

test('renders semantic service items and propagates their image alt text', () => {
  const project = projects.find((item) => item.id === 'toss-diary')
  const { container } = render(<IpStory project={project} />)
  const serviceItems = Array.from(container.querySelectorAll('.ip-story__service-item'))

  expect(serviceItems).toHaveLength(5)
  serviceItems.forEach((item, index) => {
    const figure = item.querySelector(':scope > figure')
    const copy = item.querySelector(':scope > .ip-story__service-copy')

    expect(item.tagName).toBe('ARTICLE')
    expect(figure).toBeInTheDocument()
    expect(copy).toBeInTheDocument()
    expect(copy.querySelector(':scope > h4')).toHaveTextContent(project.serviceExtensions[index].title)
  })

  const featuredImage = serviceItems[0].querySelector('figure img')
  expect(featuredImage).toHaveAttribute(
    'alt',
    '黄昏烘焙门店外摆放第一炉面包篮与暗红玻璃标识的服务场景',
  )
  expect(featuredImage).not.toHaveAttribute('alt', '')
})
