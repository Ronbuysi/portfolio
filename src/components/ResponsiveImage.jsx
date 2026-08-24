import assetWidths from '../data/assetWidths.json'

// Default slot estimate for `sizes`: story media mostly renders in multi-column
// grids on desktop and near full-width on mobile. Callers can override via prop.
const DEFAULT_SIZES = '(min-width: 1025px) 46vw, (min-width: 721px) 60vw, 92vw'

function widthFor(webpPath) {
  const key = webpPath.replace(/^\.?\//, '') // handle '/images/…' and BASE_URL-relative './images/…'
  const width = assetWidths[key]
  return Number.isFinite(width) && width > 0 ? width : null
}

export default function ResponsiveImage({ src, sizes = DEFAULT_SIZES, ...props }) {
  const extension = src.match(/\.(?:png|jpe?g)$/i)

  if (!extension) return <img src={src} {...props} />

  const base = src.slice(0, -extension[0].length)
  const mobileSrc = `${base}-w960.webp`
  const desktopSrc = `${base}-w1800.webp`
  // measured pixel widths (src/data/assetWidths.json) keep descriptors truthful —
  // several legacy variants are narrower than their filename suggests
  const mobileWidth = widthFor(mobileSrc)
  const desktopWidth = widthFor(desktopSrc)

  if (!mobileWidth || !desktopWidth) {
    return (
      <picture className="responsive-picture">
        <source media="(max-width: 720px)" srcSet={mobileSrc} type="image/webp" />
        <img {...props} src={desktopSrc} />
      </picture>
    )
  }

  return (
    <picture className="responsive-picture">
      <source media="(max-width: 720px)" srcSet={`${mobileSrc} ${mobileWidth}w`} sizes={sizes} type="image/webp" />
      <img
        {...props}
        src={desktopSrc}
        srcSet={`${mobileSrc} ${mobileWidth}w, ${desktopSrc} ${desktopWidth}w`}
        sizes={sizes}
      />
    </picture>
  )
}
