import { useRef } from 'react'
import ScrollFillText from './ScrollFillText'
import ResponsiveImage from './ResponsiveImage'
import useStoryAccents from '../hooks/useStoryAccents'

function OriginalBoard({ board, index = 0 }) {
  return <figure data-reveal data-reveal-delay={index * 60}>
    <ResponsiveImage src={board.src} alt={board.alt} loading="lazy" decoding="async" />
    <figcaption><span>{board.label}</span><span>ORIGINAL BRAND ARTWORK</span></figcaption>
  </figure>
}

function BrandExtension({ extension, index }) {
  return <section className={`brand-story__extension brand-story__extension--${index + 1}`}>
    <figure {...(index === 0 ? { 'data-reveal': 'clip', 'data-parallax': '5', 'data-bleed': '', 'data-offset-x': '2' } : {})}>
      <ResponsiveImage src={extension.src} alt="" loading="lazy" decoding="async" />
      <figcaption><span>{extension.label}</span><span>AI-ASSISTED BRAND EXTENSION</span></figcaption>
    </figure>
    <div className="brand-story__extension-copy">
      <span>{String(index + 1).padStart(2, '0')} / BRAND WORLD</span>
      <h3>{extension.title}</h3>
      <p>{extension.description}</p>
    </div>
  </section>
}

function ViExtension({ extension, index }) {
  return <section className="brand-story__vi-extension">
    <figure>
      <ResponsiveImage src={extension.src} alt="" loading="lazy" decoding="async" />
      <figcaption><span>{extension.label}</span><span>AI-ASSISTED VI EXTENSION</span></figcaption>
    </figure>
    <div>
      <span>{String(index + 1).padStart(2, '0')} / VI APPLICATION</span>
      <h3>{extension.title}</h3>
      <p>{extension.description}</p>
    </div>
  </section>
}

export default function BrandStory({ project }) {
  const rootRef = useRef(null)
  useStoryAccents(rootRef)
  return <div className="brand-story" ref={rootRef}>
    <BorderGlow
      className="brand-story__concept-glow"
      backgroundColor="#0d0d0d"
      borderRadius={0}
      glowRadius={18}
      glowIntensity={0.26}
      glowColor="18 88 47"
      colors={['#e1540f', '#f7a56d', '#fefbeb']}
      fillOpacity={0.045}
    ><section className="brand-story__concept">
        <span className="brand-story__label">BRAND POSITIONING / 01</span>
        <ScrollFillText as="h3" text={'城市里的\n温暖暂停键。'} />
        <p>{project.positioning}</p>
    </section></BorderGlow>

    <section className="brand-story__standards" aria-label="MY MAY 标志规范">
      <div className="brand-story__standards-intro">
        <span className="brand-story__label">LOGO STANDARDS / 03</span>
        <ScrollFillText as="h3" text={'让猫耳轮廓\n成为识别尺度。'} />
        <p>从原始品牌展板提取核心标志，在统一的留白、最小尺寸与反白规则下建立稳定的应用边界。</p>
      </div>
      <figure className="brand-story__logo-proof">
        <ResponsiveImage src={project.viStandards.logoSource} alt="MY MAY 原始品牌标志与辅助图形" loading="lazy" decoding="async" />
        <figcaption><span>PRIMARY MARK / SOURCE</span><span>ORIGINAL IDENTITY SOURCE</span></figcaption>
      </figure>
      <div className="brand-story__rules">
        {project.viStandards.rules.map((rule, index) => <BorderGlow
          className="brand-story__rule-glow"
          backgroundColor="#0d0d0d"
          borderRadius={0}
          glowRadius={13}
          glowIntensity={0.3}
          glowColor="18 88 47"
          colors={['#e1540f', '#fefbeb', '#7f3a1d']}
          fillOpacity={0.05}
          key={rule.label}
        ><article>
            <span>0{index + 1}</span><b>{rule.label}</b><strong>{rule.value}</strong>
        </article></BorderGlow>)}
      </div>
      <div className="brand-story__pattern" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => <span key={index}>MY MAY ◇</span>)}
      </div>
    </section>

    <div className="brand-story__vi-applications">
      {project.viExtensions.map((extension, index) => <ViExtension key={extension.src} extension={extension} index={index} />)}
    </div>

    <section className="brand-story__originals" aria-label="MY MAY 原始品牌设计">
      {project.originals.map((board, index) => <OriginalBoard key={board.src} board={board} index={index} />)}
    </section>

    <section className="brand-story__dna" aria-label="MY MAY 品牌视觉基因">
      <div className="brand-story__dna-intro">
        <span className="brand-story__label">BRAND DNA / 02</span>
        <ScrollFillText as="h3" text={'Pizza.\nPaws. Peace.'} />
      </div>
      <div className="brand-story__keywords">
        {project.brandDna.keywords.map((keyword, index) => <article key={keyword}>
          <span>0{index + 1}</span><strong>{keyword}</strong>
        </article>)}
      </div>
      <div className="brand-story__colors">
        {project.brandDna.colors.map((color) => <div key={color.name} style={{ '--brand-color': color.value }}>
          <i aria-hidden="true" /><span>{color.name}</span><b>{color.value}</b>
        </div>)}
      </div>
    </section>

    <div className="brand-story__extensions">
      {project.extensions.map((extension, index) => <BrandExtension key={extension.src} extension={extension} index={index} />)}
    </div>

    <section className="brand-story__outro">
      <span>VISUAL CONCLUSION / 04</span>
      <h3>{project.closing}</h3>
      <p>从一只抱着披萨的猫，延展出一间店、一套外带系统，以及城市中的温暖触点。</p>
    </section>
  </div>
}
import BorderGlow from './BorderGlow'
