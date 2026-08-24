import { render, screen, fireEvent } from '@testing-library/react'
import { projects } from '../data/projects'
import ProjectRail from './ProjectRail'

test('renders seven project entries that open their detail on click', () => {
  const onOpen = vi.fn()
  const { container } = render(<ProjectRail onOpen={onOpen} />)

  const items = container.querySelectorAll('.project-rail__item')
  expect(items).toHaveLength(7)

  for (const [index, project] of projects.entries()) {
    expect(items[index].textContent).toContain(project.index)
    expect(items[index].textContent).toContain(project.title)
  }

  fireEvent.click(items[3])
  expect(onOpen).toHaveBeenCalledWith(projects[3].id, items[3])

  fireEvent.click(items[0])
  expect(onOpen).toHaveBeenCalledWith(projects[0].id, items[0])
})
