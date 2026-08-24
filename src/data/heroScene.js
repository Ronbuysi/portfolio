import { assetUrl } from '../utils/assetUrl'

export const heroBackground = {
  src: assetUrl('/images/hero/nesta-illustration-bg.jpg'),
  mobile: assetUrl('/images/hero/nesta-illustration-bg-w960.webp'),
  desktop: assetUrl('/images/hero/nesta-illustration-bg-w1800.webp'),
}

const prop = (id, basename, depth, className) => ({
  id,
  depth,
  className,
  src: assetUrl(`/images/hero/${basename}.png`),
  mobile: assetUrl(`/images/hero/${basename}-w960.webp`),
  desktop: assetUrl(`/images/hero/${basename}-w1800.webp`),
})

export const heroProps = [
  prop('spring-table', 'hero-spring-table', 'front', 'hero-prop--spring'),
  prop('blue-cabinet', 'hero-blue-cabinet', 'far', 'hero-prop--cabinet'),
  prop('floating-table', 'hero-floating-table', 'mid', 'hero-prop--floating'),
  prop('rocking-chair', 'hero-rocking-chair', 'front', 'hero-prop--chair'),
  prop('table-lamp', 'hero-table-lamp', 'mid', 'hero-prop--lamp'),
]

export const heroPreloadSources = [
  heroBackground.desktop,
  ...heroProps.map(({ desktop }) => desktop),
]
