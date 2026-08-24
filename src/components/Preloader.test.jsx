import { act, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Preloader from './Preloader'

test('shows three-digit progress and calls onReady once after the minimum gate', async () => {
  vi.useFakeTimers()
  const onReady = vi.fn()
  const loadAssets = vi.fn(async (_assets, { onProgress }) => {
    onProgress(0)
    onProgress(50)
    onProgress(100)
    return { total: 6, failed: 0 }
  })
  const { container } = render(<Preloader
    assets={['a', 'b', 'c', 'd', 'e', 'f']}
    loadAssets={loadAssets}
    minDuration={100}
    maxDuration={500}
    onReady={onReady}
  />)

  expect(screen.getByText('000')).toBeInTheDocument()
  expect(screen.getByText('WANG CHENGCHENG')).toBeInTheDocument()
  expect(container.querySelector('.preloader__spring img')).toBeInTheDocument()
  await act(async () => { await vi.advanceTimersByTimeAsync(900) })
  await act(async () => { await vi.advanceTimersByTimeAsync(300) })
  expect(onReady).toHaveBeenCalledTimes(1)
  vi.useRealTimers()
})
