import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import OperationStory from './OperationStory'

test('preserves three original posters and adds an original system plus five extensions', () => {
  const project = projects.find((item) => item.id === 'farmers-market')
  const { container } = render(<OperationStory project={project} />)

  expect(container.querySelectorAll('.operation-story__originals img')).toHaveLength(3)
  expect(container.querySelectorAll('.operation-story__system-evidence figure')).toHaveLength(8)
  expect(container.querySelectorAll('.operation-story__extension')).toHaveLength(5)
  expect(screen.getAllByText('ORIGINAL ARTWORK')).toHaveLength(3)
  expect(screen.getAllByText('ORIGINAL DESIGN SYSTEM')).toHaveLength(8)
  expect(screen.getAllByText('AI-ASSISTED CAMPAIGN EXTENSION')).toHaveLength(5)
  expect(screen.getByText('CAMPAIGN GRAMMAR / 01')).toBeInTheDocument()
  expect(screen.getByText('ORIGINAL SYSTEM / 02')).toBeInTheDocument()
  expect(container.querySelectorAll('.operation-story__grammar-glow')).toHaveLength(4)
  expect(container.querySelectorAll('.operation-story__grammar-glow article')).toHaveLength(4)

  const grammar = container.querySelector('.operation-story__grammar')
  const system = container.querySelector('.operation-story__system')
  const extensions = container.querySelector('.operation-story__extensions')
  expect(grammar.compareDocumentPosition(system) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(system.compareDocumentPosition(extensions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

  for (const image of container.querySelectorAll('img')) {
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
  }
})
