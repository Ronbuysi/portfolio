import { useRef } from 'react'
import ScrollFillText from './ScrollFillText'
import ResponsiveImage from './ResponsiveImage'
import useStoryAccents from '../hooks/useStoryAccents'

function Caption({ label, source }) {
  return <figcaption><span>{label}</span><span>{source}</span></figcaption>
}

function OriginalEvidence({ item }) {
  return <figure className="sanfu-campaign__original">
    <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
    <Caption label={item.label} source={item.source} />
  </figure>
}

function CampaignExtension({ item, featured = false }) {
  return <section className={`sanfu-campaign__extension${featured ? ' sanfu-campaign__hero' : ''}`}>
    <figure {...(featured ? { 'data-reveal': 'clip', 'data-parallax': '5', 'data-bleed': '', 'data-offset-x': '-2' } : {})}>
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      <Caption label={item.label} source="AI-ASSISTED CAMPAIGN EXTENSION" />
    </figure>
    <div className="sanfu-campaign__extension-copy">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  </section>
}

function ProcessPresentation({ item }) {
  return <article className="sanfu-campaign__process-presentation">
    <figure>
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      <Caption label={item.label} source={item.source} />
    </figure>
    <div><h3>{item.title}</h3><p>{item.description}</p></div>
  </article>
}

function SectionGlow({ children }) {
  return <BorderGlow
    className="sanfu-campaign__section-glow"
    backgroundColor="#0d0d0d"
    borderRadius={0}
    glowRadius={16}
    glowIntensity={0.28}
    glowColor="226 85 62"
    colors={['#2145ef', '#ff425c', '#f4c327']}
    fillOpacity={0.045}
  >{children}</BorderGlow>
}

export default function SanfuCampaignStory({ project }) {
  const rootRef = useRef(null)
  useStoryAccents(rootRef)
  return <div className="sanfu-campaign" ref={rootRef}>
    <CampaignExtension item={project.extensions[0]} featured />

    <section className="sanfu-campaign__strategy-section">
      <SectionGlow><div className="sanfu-campaign__section-head">
          <span className="sanfu-campaign__label">STRATEGY TRACK / 01</span>
          <ScrollFillText as="h3" text={'三次搭法，\n回应三种处境。'} />
          <p>策略从“年轻人需要什么陪伴”出发，将职场勇气、宿舍连接与城市温度拆成连续的预热、高潮和保温阶段。</p>
      </div></SectionGlow>
      <div className="sanfu-campaign__strategy">
        {project.strategy.map((item) => <BorderGlow
          className="sanfu-campaign__strategy-glow"
          backgroundColor="#080808"
          borderRadius={0}
          glowRadius={14}
          glowIntensity={0.34}
          glowColor="226 85 62"
          colors={[item.color, '#2145ef', '#f2f0eb']}
          fillOpacity={0.05}
          key={item.index}
        ><article className="sanfu-campaign__strategy-card" style={{ '--sanfu-phase': item.color }}>
            <span>{item.index} / {item.phase}</span>
            <i aria-hidden="true" />
            <div><small>{item.audience}</small><h3>{item.title}</h3></div>
            <p>{item.description}</p>
        </article></BorderGlow>)}
      </div>
    </section>

    <section className="sanfu-campaign__grammar">
      <div className="sanfu-campaign__grammar-copy">
        <span className="sanfu-campaign__label">VISUAL GRAMMAR / 02</span>
        <h3>{project.visualLanguage.title}</h3>
        <p>拼图同时承担图形容器、组合规则与互动隐喻；人物插画提供生活温度，高彩度色块负责快速区分阶段与场景。</p>
        <div className="sanfu-campaign__keywords">
          {project.visualLanguage.keywords.map((keyword, index) => <span key={keyword}>0{index + 1} / {keyword}</span>)}
        </div>
      </div>
      <figure className="sanfu-campaign__grammar-figure">
        <ResponsiveImage src={project.visualLanguage.source} alt="三福生活场景拼图原创元素" loading="lazy" decoding="async" />
        <Caption label="PUZZLE ELEMENT LIBRARY" source="ORIGINAL VISUAL ELEMENTS" />
      </figure>
      <div className="sanfu-campaign__swatches">
        {project.visualLanguage.colors.map((color) => <article key={color.name} style={{ '--sanfu-color': color.value }}>
          <i aria-hidden="true" /><span>{color.name}</span><b>{color.value}</b>
        </article>)}
      </div>
    </section>

    <section className="sanfu-campaign__evidence-section" aria-label="三福视觉策划原创设计证据">
      <SectionGlow><div className="sanfu-campaign__section-head">
        <span className="sanfu-campaign__label">ORIGINAL EVIDENCE / 03</span>
        <ScrollFillText as="h3" text={'从三张海报，\n长成一套系统。'} />
        <p>保留海报、元素、包装和数字节点作为原创证据；它们不再被重复放大，而是共同说明视觉系统从哪里生长出来。</p>
      </div></SectionGlow>
      <div className="sanfu-campaign__evidence">
        {project.originalEvidence.map((item) => <OriginalEvidence key={item.src} item={item} />)}
      </div>
      <div className="sanfu-campaign__process-presentations">
        {project.processPresentations.map((item) => <ProcessPresentation key={item.src} item={item} />)}
      </div>
    </section>

    <section className="sanfu-campaign__activation-section">
      <SectionGlow><div className="sanfu-campaign__section-head">
        <span className="sanfu-campaign__label">CAMPAIGN APPLICATION / 04</span>
        <ScrollFillText as="h3" text={'让策略进入\n每一个接触点。'} />
        <p>线下活动、节点礼赠与数字传播共享同一套拼图语法，同时为不同人群保留各自的情绪和行为入口。</p>
      </div></SectionGlow>
      <div className="sanfu-campaign__extensions">
        {project.extensions.slice(1).map((item) => <CampaignExtension key={item.src} item={item} />)}
      </div>
    </section>

    <section className="sanfu-campaign__outro">
      <span>CAMPAIGN CONCLUSION / 05</span>
      <h3>{project.closing}</h3>
      <p>不是把图案贴到更多物件上，而是让同一套创意从洞察、互动到传播持续成立。</p>
    </section>
  </div>
}
import BorderGlow from './BorderGlow'
