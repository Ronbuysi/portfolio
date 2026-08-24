import { useRef } from 'react'
import ScrollFillText from './ScrollFillText'
import BorderGlow from './BorderGlow'
import ResponsiveImage from './ResponsiveImage'
import useStoryAccents from '../hooks/useStoryAccents'

function Caption({ label, source }) {
  return <figcaption><span>{label}</span><span>{source}</span></figcaption>
}

function SectionGlow({ children }) {
  return <BorderGlow
    className="daodao-story__section-glow"
    backgroundColor="#07090d"
    borderRadius={0}
    glowRadius={18}
    glowIntensity={0.3}
    glowColor="205 74 46"
    colors={['#1f8acc', '#fdf7d8', '#492b12']}
    fillOpacity={0.045}
  >{children}</BorderGlow>
}

function Extension({ item, hero = false }) {
  return <article className={`daodao-story__extension${hero ? ' daodao-story__hero' : ''}`}>
    <figure {...(hero ? { 'data-reveal': 'clip', 'data-parallax': '5', 'data-bleed': '', 'data-offset-x': '2' } : {})}>
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      <Caption label={item.label} source="AI-ASSISTED BRAND EXTENSION" />
    </figure>
    <div className="daodao-story__extension-copy">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  </article>
}

function OriginalBoard({ item, index = 0 }) {
  return <figure className="daodao-story__original" data-reveal data-reveal-delay={index * 60}>
    <div className="daodao-story__original-matte">
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
    </div>
    <Caption label={item.label} source="ORIGINAL BRAND DESIGN" />
  </figure>
}

export default function DaodaoBarStory({ project }) {
  const rootRef = useRef(null)
  useStoryAccents(rootRef)
  const [hero, ...extensions] = project.extensions

  return <div className="daodao-story" ref={rootRef}>
    <Extension item={hero} hero />

    <section className="daodao-story__concept">
      <SectionGlow><header className="daodao-story__section-head daodao-story__concept-head">
        <span className="daodao-story__label">BRAND CONCEPT / 01</span>
        <ScrollFillText as="h3" text={'倒掉不属于你的\n重量。'} />
        <p>这里不是用酒精逃离生活，而是给城市人一个被允许的暂停。十一点以后，慵懒、暂停、放松与虚度共同组成品牌的情绪坐标。</p>
      </header></SectionGlow>
      <div className="daodao-story__concept-grid">
        {project.brandConcepts.map((concept) => <BorderGlow
          className="daodao-story__concept-glow"
          backgroundColor="#07090d"
          borderRadius={0}
          glowRadius={14}
          glowIntensity={0.28}
          glowColor="205 74 46"
          colors={['#1f8acc', '#fdf7d8', '#492b12']}
          fillOpacity={0.04}
          key={concept.index}
        ><article className="daodao-story__concept-card">
          <span>{concept.index} / {concept.label}</span>
          <i aria-hidden="true" />
          <h4>{concept.title}</h4>
          <p>{concept.description}</p>
        </article></BorderGlow>)}
      </div>
    </section>

    <section className="daodao-story__identity">
      <SectionGlow><header className="daodao-story__section-head">
        <span className="daodao-story__label">IDENTITY GRAMMAR / 02</span>
        <ScrollFillText as="h3" text={'一个角色，\n四条识别规则。'} />
        <p>保留原作最有辨识度的树懒和倾倒动作，再用容器轮廓与时间锚点建立可以跨越平面、空间和产品的统一语法。</p>
      </header></SectionGlow>
      <div className="daodao-story__identity-rules">
        {project.identityRules.map((rule) => <article className="daodao-story__identity-rule" key={rule.index}>
          <span>{rule.index} / {rule.label}</span>
          <div className={`daodao-story__identity-mark daodao-story__identity-mark--${rule.index}`} aria-hidden="true" />
          <h4>{rule.title}</h4>
          <p>{rule.description}</p>
        </article>)}
      </div>
    </section>

    <section className="daodao-story__originals-section">
      <SectionGlow><header className="daodao-story__section-head">
        <span className="daodao-story__label">ORIGINAL EVIDENCE / 03</span>
        <ScrollFillText as="h3" text={'先看原作，\n再看系统\n如何长大。'} />
        <p>九张原创设计完整保留品牌故事、标志、角色、色彩与触点证据。展板被放入统一暗色画廊，而不是直接作为巨大页面使用。</p>
      </header></SectionGlow>
      <div className="daodao-story__originals">
        {project.originals.map((item, index) => <OriginalBoard item={item} index={index} key={item.src} />)}
      </div>
    </section>

    <section className="daodao-story__extension-section">
      <SectionGlow><header className="daodao-story__section-head">
        <span className="daodao-story__label">BRAND EXTENSION / 04</span>
        <ScrollFillText as="h3" text={'从一套视觉，\n进入完整的\n深夜体验。'} />
        <p>门店、吧台、会员、传播、导视与外带家族共享同一组角色和材质语言，让品牌在真实消费路径里保持连续。</p>
      </header></SectionGlow>
      <div className="daodao-story__extensions">
        {extensions.map((item) => <Extension item={item} key={item.src} />)}
      </div>
    </section>

    <section className="daodao-story__outro">
      <span>BRAND CONCLUSION / 05 · 11 PM</span>
      <h3>{project.closing}</h3>
      <p>十一点以后，倒掉白天的重量，留一点时间给自己。</p>
    </section>
  </div>
}
