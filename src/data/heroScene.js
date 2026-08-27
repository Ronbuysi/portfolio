import { assetUrl } from '../utils/assetUrl'

export const heroBackground = {
  src: assetUrl('/images/hero/nesta-illustration-bg.jpg'),
  // 手机端：竖版插画封面「Where Life Breathes」（完整构图，无道具分层）
  mobile: assetUrl('/images/hero/where-life-breathes-mobile-w960.webp'),
  desktop: assetUrl('/images/hero/nesta-illustration-bg-w1800.webp'),
}

// 道具在桌面上最大渲染 ~420px 宽，w960 已覆盖 2x 屏；w1800 纯属浪费带宽
const prop = (id, basename, depth, className) => ({
  id,
  depth,
  className,
  src: assetUrl(`/images/hero/${basename}.png`),
  mobile: assetUrl(`/images/hero/${basename}-w960.webp`),
  desktop: assetUrl(`/images/hero/${basename}-w960.webp`),
})

export const heroProps = [
  prop('spring-table', 'hero-spring-table', 'front', 'hero-prop--spring'),
  prop('blue-cabinet', 'hero-blue-cabinet', 'far', 'hero-prop--cabinet'),
  prop('floating-table', 'hero-floating-table', 'mid', 'hero-prop--floating'),
  prop('rocking-chair', 'hero-rocking-chair', 'front', 'hero-prop--chair'),
  prop('table-lamp', 'hero-table-lamp', 'mid', 'hero-prop--lamp'),
]

// 预加载只保留预加载器展示的弹簧桌；背景（LCP）由 index.html 的
// <link rel="preload" imagesrcset> 按 DPR 精确预载，避免 JS 预载拉错变体。
export const heroPreloadSources = [
  heroProps[0].desktop,
]
