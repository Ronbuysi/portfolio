import { render, screen } from '@testing-library/react'
import assetWidths from '../data/assetWidths.json'
import ResponsiveImage from './ResponsiveImage'

test('serves truthful width descriptors so browsers can pick the right variant', () => {
  const { container } = render(
    <ResponsiveImage
      src="/images/operation-market-activation.png"
      alt="运营视觉延展"
      loading="lazy"
      className="artwork"
    />,
  )

  const image = screen.getByRole('img', { name: '运营视觉延展' })
  const source = container.querySelector('source')
  const mobileWidth = assetWidths['images/operation-market-activation-w960.webp']
  const desktopWidth = assetWidths['images/operation-market-activation-w1800.webp']

  expect(mobileWidth).toBeTruthy()
  expect(desktopWidth).toBeTruthy()
  expect(image).toHaveAttribute('src', '/images/operation-market-activation-w1800.webp')
  expect(image).toHaveAttribute(
    'srcset',
    `/images/operation-market-activation-w960.webp ${mobileWidth}w, /images/operation-market-activation-w1800.webp ${desktopWidth}w`,
  )
  expect(image).toHaveAttribute('sizes')
  expect(source).toHaveAttribute('media', '(max-width: 720px)')
  expect(source).toHaveAttribute('srcset', `/images/operation-market-activation-w960.webp ${mobileWidth}w`)
  expect(source).toHaveAttribute('sizes')
  expect(source).toHaveAttribute('type', 'image/webp')
  expect(image).toHaveAttribute('loading', 'lazy')
  expect(image).toHaveClass('artwork')
})

test('falls back to plain variants when a file lacks measured metadata', () => {
  const { container } = render(
    <ResponsiveImage src="/assets/unmeasured-placeholder.png" alt="未知资产" />,
  )
  const image = screen.getByRole('img', { name: '未知资产' })
  expect(image).not.toHaveAttribute('srcset')
  expect(image).toHaveAttribute('src', '/assets/unmeasured-placeholder-w1800.webp')
})
