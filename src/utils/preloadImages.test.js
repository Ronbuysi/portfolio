import { expect, test } from 'vitest'
import { preloadImages } from './preloadImages'

class FakeImage {
  static instances = []
  constructor() { FakeImage.instances.push(this) }
  set src(value) { this.value = value }
}

test('reports every source and treats errors as settled progress', async () => {
  FakeImage.instances = []
  const progress = []
  const promise = preloadImages(['/a.webp', '/b.webp'], {
    ImageCtor: FakeImage,
    onProgress: (value) => progress.push(value),
  })

  FakeImage.instances[0].onload()
  FakeImage.instances[1].onerror()

  await expect(promise).resolves.toEqual({ total: 2, failed: 1 })
  expect(progress).toEqual([0, 50, 100])
})
