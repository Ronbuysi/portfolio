import { render, screen } from '@testing-library/react'
import { projects } from '../data/projects'
import ProjectDetail from './ProjectDetail'

test('shows the dynamic project count and NESTA next-project title', () => {
  const nesta = projects.find((item) => item.id === 'nesta-furniture')
  render(<ProjectDetail projectId={nesta.id} onClose={() => {}} onStep={() => {}} />)

  expect(screen.getByText('007 / 007')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'NESTA 家具品牌设计' })).toBeInTheDocument()
  expect(screen.getByText('运营视觉设计')).toBeInTheDocument()
})

test('returns to the top of the detail when switching projects', () => {
  const { rerender } = render(<ProjectDetail projectId="farmers-market" onClose={() => {}} onStep={() => {}} />)
  const overlay = document.querySelector('.pdetail')
  overlay.scrollTop = 2400
  expect(overlay.scrollTop).toBe(2400)

  rerender(<ProjectDetail projectId="sanfu-lifestyle" onClose={() => {}} onStep={() => {}} />)
  expect(document.querySelector('.pdetail').scrollTop).toBe(0)
})

test('arrow keys switch projects but not while the lightbox is open', () => {
  const onStep = vi.fn()
  const { rerender } = render(<ProjectDetail projectId="farmers-market" onClose={() => {}} onStep={onStep} />)

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
  expect(onStep).toHaveBeenCalledWith(1)
  onStep.mockClear()

  const lightbox = document.createElement('div')
  lightbox.className = 'lightbox is-open'
  document.body.appendChild(lightbox)

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  expect(onStep).not.toHaveBeenCalled()

  rerender(<ProjectDetail projectId="farmers-market" onClose={() => {}} onStep={onStep} />)
  lightbox.remove()
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
  expect(onStep).toHaveBeenCalledWith(-1)
})
