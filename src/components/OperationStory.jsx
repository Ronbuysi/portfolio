import { useRef } from 'react'
import ScrollFillText from './ScrollFillText'
import BorderGlow from './BorderGlow'
import ResponsiveImage from './ResponsiveImage'
import useStoryAccents from '../hooks/useStoryAccents'

function Caption({ label, source }) {
  return <figcaption><span>{label}</span><span>{source}</span></figcaption>
}

export default function OperationStory({ project }) {
  const rootRef = useRef(null)
  useStoryAccents(rootRef)
  const grammarCards = [
    { label: 'BRUSH MARK', glow: '72 100 60', colors: ['#d8ff36', '#eef2df', '#7893b8'] },
    { label: 'CUTOUT COLLAGE', glow: '228 86 56', colors: ['#2145ef', '#7ca7ff', '#d8ff36'] },
    { label: 'HALFTONE GRAIN', glow: '12 76 52', colors: ['#e34a28', '#ff916d', '#f2f0eb'] },
    { label: 'SIGNAL COLOR', glow: '48 87 54', colors: ['#f0c722', '#ffe56c', '#d8ff36'] },
  ]

  return <div className="operation-story" ref={rootRef}>
    <section className="operation-story__originals" aria-label="运营视觉原始海报">
      {project.gallery.map((image, index) => <figure key={image.src} data-reveal="clip" data-reveal-delay={index * 90}>
        <ResponsiveImage src={image.src} alt={image.alt} loading="lazy" decoding="async" />
        <Caption label={`POSTER / ${String(index + 1).padStart(2, '0')}`} source="ORIGINAL ARTWORK" />
      </figure>)}
    </section>

    <section className="operation-story__grammar">
      <div className="operation-story__grammar-copy">
        <span>CAMPAIGN GRAMMAR / 01</span>
        <ScrollFillText as="h3" text={'把逛市场的热闹感，\n变成可复制的视觉语法。'} />
        <p>保留原作中的手写笔触、拼贴关系与高饱和色块，并将它们整理成一套可延展到线下与数字渠道的活动系统。</p>
      </div>
      <div className="operation-story__grammar-grid">
        {grammarCards.map((item, index) => (
          <BorderGlow
            className="operation-story__grammar-glow"
            backgroundColor="#090909"
            borderRadius={0}
            glowRadius={14}
            glowIntensity={0.38}
            glowColor={item.glow}
            colors={item.colors}
            fillOpacity={0.06}
            key={item.label}
          >
            <article>
              <span>0{index + 1}</span><i aria-hidden="true" /><b>{item.label}</b>
            </article>
          </BorderGlow>
        ))}
      </div>
    </section>

    <section className="operation-story__system" aria-label="运营视觉原创系统补充">
      <div className="operation-story__system-head">
        <span>ORIGINAL SYSTEM / 02</span>
        <ScrollFillText as="h3" text={'从三张海报继续长成一套\n可触摸的市场系统。'} />
        <p>将新增原创设计按“背景—语言—材料—结构—应用”重新编排，保留完整作品比例，也让每张图在案例叙事中承担清晰作用。</p>
      </div>
      <div className="operation-story__system-evidence">
        {project.originalSystem.map((image, index) => <figure className="operation-story__system-card" key={image.src} data-reveal data-reveal-delay={index * 60}>
          <ResponsiveImage src={image.src} alt={image.alt} loading="lazy" decoding="async" />
          <Caption label={image.label} source="ORIGINAL DESIGN SYSTEM" />
        </figure>)}
      </div>
    </section>

    <div className="operation-story__extensions">
      {project.extensions.map((extension, index) => <section className="operation-story__extension" key={extension.src}>
        <figure>
          <ResponsiveImage src={extension.src} alt={extension.alt ?? extension.title} loading="lazy" decoding="async" />
          <Caption label={extension.label} source="AI-ASSISTED CAMPAIGN EXTENSION" />
        </figure>
        <div>
          <span>{String(index + 3).padStart(2, '0')} / CAMPAIGN SYSTEM</span>
          <h3>{extension.title}</h3>
          <p>{extension.description}</p>
        </div>
      </section>)}
    </div>
  </div>
}
