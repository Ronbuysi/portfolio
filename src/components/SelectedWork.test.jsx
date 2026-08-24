import { render, screen, fireEvent } from '@testing-library/react'
import { projects } from '../data/projects'
import SelectedWork from './SelectedWork'

test('renders the work intro and a star-ring index of seven projects', () => {
  const { container } = render(<SelectedWork onOpen={() => {}} />)

  expect(container.querySelector('.work-intro__title')).toBeInTheDocument()
  expect(screen.getByText('007 CASES')).toBeInTheDocument()

  expect(container.querySelectorAll('.project-rail')).toHaveLength(1)
  expect(container.querySelectorAll('.project-rail__item')).toHaveLength(7)
  expect(container.querySelectorAll('.work-ring__card')).toHaveLength(7)

  const cards = Array.from(container.querySelectorAll('.work-ring__card'))
  for (const [index, project] of projects.entries()) {
    expect(cards[index].getAttribute('href')).toBe(`#work/${project.id}`)
    expect(cards[index].textContent).toContain(project.title)
  }
})

test('rail entries open their project detail on click', () => {
  const opened = []
  const { container } = render(<SelectedWork onOpen={(id) => opened.push(id)} />)

  const items = Array.from(container.querySelectorAll('.project-rail__item'))
  for (const [index, item] of items.entries()) {
    fireEvent.click(item)
    expect(opened).toContain(projects[index].id)
  }
  expect(opened).toHaveLength(projects.length)
})

test('ring card click opens the corresponding detail', () => {
  const opened = []
  const { container } = render(<SelectedWork onOpen={(id) => opened.push(id)} />)
  const cards = Array.from(container.querySelectorAll('.work-ring__card'))

  fireEvent.click(cards[4])
  expect(opened).toContain(projects[4].id)

  fireEvent.click(cards[0])
  expect(opened).toContain(projects[0].id)
})
