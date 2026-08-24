export function preloadImages(sources, { ImageCtor = Image, onProgress = () => {} } = {}) {
  let settled = 0
  let failed = 0
  onProgress(0)

  if (!sources.length) {
    onProgress(100)
    return Promise.resolve({ total: 0, failed: 0 })
  }

  const load = (src) => new Promise((resolve) => {
    const image = new ImageCtor()
    let finished = false
    const finish = (didFail) => {
      if (finished) return
      finished = true
      failed += didFail ? 1 : 0
      settled += 1
      onProgress(Math.round(settled / sources.length * 100))
      resolve()
    }
    image.onload = () => finish(false)
    image.onerror = () => finish(true)
    image.src = src
  })

  return Promise.all(sources.map(load)).then(() => ({ total: sources.length, failed }))
}
