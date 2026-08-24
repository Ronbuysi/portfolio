import { useRef } from 'react'
import ScrollFillText from './ScrollFillText'
import ResponsiveImage from './ResponsiveImage'
import useStoryAccents from '../hooks/useStoryAccents'

function Caption({ label, source }) {
  return <figcaption><span>{label}</span><span>{source}</span></figcaption>
}

function OriginalBoard({ board, index = 0 }) {
  return <figure className="ip-story__original" data-reveal data-reveal-delay={index * 60}>
    <ResponsiveImage src={board.src} alt={board.alt} loading="lazy" decoding="async" />
    <Caption label={board.label} source="ORIGINAL IP DESIGN" />
  </figure>
}

function ServiceExtension({ item }) {
  return <article className={`ip-story__service-item${item.featured ? ' ip-story__service-item--featured' : ''}`}>
    <figure>
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      <Caption label={item.label} source="AI-ASSISTED SERVICE EXTENSION" />
    </figure>
    <div className="ip-story__service-copy">
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  </article>
}

function Extension({ extension, index, hero = false }) {
  return <section className={`ip-story__extension${hero ? ' ip-story__hero' : ''}`}>
    <figure {...(hero ? { 'data-reveal': 'clip', 'data-parallax': '5', 'data-bleed': '', 'data-offset-x': '-2' } : {})}>
      <ResponsiveImage src={extension.src} alt="" loading="lazy" decoding="async" />
      <Caption label={extension.label} source="AI-ASSISTED IP EXTENSION" />
    </figure>
    <div className="ip-story__extension-copy">
      <span>{String(index + 1).padStart(2, '0')} / CHARACTER WORLD</span>
      <h3>{extension.title}</h3>
      <p>{extension.description}</p>
    </div>
  </section>
}

function SystemExtension({ item, className, source }) {
  return <article className={className}>
    <figure>
      <ResponsiveImage src={item.src} alt="" loading="lazy" decoding="async" />
      <Caption label={item.label} source={source} />
    </figure>
    <div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  </article>
}

function SummerPoster({ poster }) {
  return <figure className="ip-story__summer-poster">
    <div className="ip-story__summer-poster-frame">
      <ResponsiveImage src={poster.src} alt={poster.alt} loading="lazy" decoding="async" />
    </div>
    <Caption label={poster.label} source="AI-ASSISTED SUMMER CAMPAIGN EXTENSION" />
  </figure>
}

function SummerApplication({ item }) {
  return <article className="ip-story__summer-application">
    <figure>
      <ResponsiveImage src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      <Caption label={item.label} source="AI-ASSISTED SUMMER CAMPAIGN EXTENSION" />
    </figure>
    <div className="ip-story__summer-application-copy">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  </article>
}

function SystemGlow({ children }) {
  return <BorderGlow
    className="ip-story__section-glow"
    backgroundColor="#0d0d0d"
    borderRadius={0}
    glowRadius={16}
    glowIntensity={0.26}
    glowColor="4 58 38"
    colors={['#9f2e24', '#fffef8', '#552d2a']}
    fillOpacity={0.04}
  >{children}</BorderGlow>
}

export default function IpStory({ project }) {
  const rootRef = useRef(null)
  useStoryAccents(rootRef)
  return <div className="ip-story" ref={rootRef}>
    <Extension extension={project.extensions[0]} index={0} hero />

    <section className="ip-story__foundation">
      <div className="ip-story__foundation-copy">
        <span className="ip-story__label">CHARACTER FOUNDATION / 01</span>
        <ScrollFillText as="h3" text={'一对心形兔耳，\n打开面包日记。'} />
        <p>{project.description}</p>
      </div>
      <div className="ip-story__traits">
        {project.traits.map((trait, index) => <article key={trait}>
          <span>0{index + 1}</span><b>{trait}</b>
        </article>)}
      </div>
      <div className="ip-story__palette">
        {project.palette.map((color) => <article key={color.name} style={{ '--ip-color': color.value }}>
          <i aria-hidden="true" /><span>{color.name}</span><b>{color.value}</b>
        </article>)}
      </div>
    </section>

    <section className="ip-story__evidence" aria-label="TOSS DIARY 原创角色设计证据">
      <div className="ip-story__section-head">
        <span className="ip-story__label">ORIGINAL EVIDENCE / 02</span>
        <ScrollFillText as="h3" text={'从结构、表情到\n真实应用。'} />
      </div>
      <div className="ip-story__source-grid">
        {project.originals.map((board, index) => <OriginalBoard key={board.src} board={board} index={index} />)}
      </div>
    </section>

    <section className="ip-story__service" aria-label="TOSS DIARY 烘焙服务延展">
      <div className="ip-story__system-head ip-story__service-head">
        <span className="ip-story__label">BAKERY SERVICE / 03</span>
        <ScrollFillText as="h3" text={'让角色进入\n每一次服务。'} />
        <p>从黄昏第一炉面包开始，把会员记录、取餐交付、员工工具与点单进度组织为一套连续、可识别的烘焙服务体验。</p>
      </div>
      <div className="ip-story__service-grid">
        {project.serviceExtensions.map((item) => <ServiceExtension key={item.src} item={item} />)}
      </div>
    </section>

    <section className="ip-story__summer-campaign">
      <SystemGlow><div className="ip-story__summer-head">
        <div>
          <span className="ip-story__label">SUMMER CAMPAIGN / 04</span>
          <ScrollFillText as="h3" text={'Summer,\nmade by hand.'} />
        </div>
        <p>以原始风格探索为起点，把角色拆进三套独立海报，并继续建立空间、包装与移动活动触点。每一种夏日情绪都有自己的色彩与场景，而不是停留在一张合集里。</p>
      </div></SystemGlow>
      <div className="ip-story__summer-track" aria-label="夏日活动视觉线索">
        {project.summerCampaign.keywords.map((keyword, index) => <BorderGlow
          className="ip-story__summer-track-glow"
          backgroundColor="#0d0d0d"
          borderRadius={0}
          glowRadius={12}
          glowIntensity={0.28}
          glowColor="4 58 38"
          colors={[project.summerCampaign.colors[index].value, '#fffef8', '#552d2a']}
          fillOpacity={0.05}
          key={keyword}
        ><article style={{ '--summer-color': project.summerCampaign.colors[index].value }}>
            <i aria-hidden="true" />
            <span>0{index + 1}</span>
            <b>{keyword}</b>
        </article></BorderGlow>)}
      </div>
      <div className="ip-story__summer-posters">
        {project.summerCampaign.posters.map((poster) => <SummerPoster key={poster.src} poster={poster} />)}
      </div>
      <div className="ip-story__summer-applications">
        {project.summerCampaign.applications.map((item) => <SummerApplication key={item.src} item={item} />)}
      </div>
    </section>

    <section className="ip-story__expression-system">
      <SystemGlow><div className="ip-story__system-head">
        <span className="ip-story__label">EXPRESSION SYSTEM / 05</span>
        <ScrollFillText as="h3" text={'不只会笑，\n还要会聊天。'} />
        <p>从原创九种表情继续扩展成十六种情绪，并验证它们在真实聊天界面与快捷表情栏中的识别效率。</p>
      </div></SystemGlow>
      <div className="ip-story__expression-grid">
        {project.expressionExtensions.map((item) => <SystemExtension
          key={item.src}
          item={item}
          className="ip-story__expression-extension"
          source="AI-ASSISTED EXPRESSION EXTENSION"
        />)}
      </div>
    </section>

    <div className="ip-story__extensions">
      {project.extensions.slice(1).map((extension, index) => <Extension key={extension.src} extension={extension} index={index + 1} />)}
    </div>

    <section className="ip-story__campaign-system">
      <SystemGlow><div className="ip-story__system-head">
        <span className="ip-story__label">SEASONAL &amp; MOTION / 06</span>
        <ScrollFillText as="h3" text={'让角色持续生长，\n而不是停在一张图里。'} />
        <p>四季内容提供长期运营节奏，六帧动作则把角色带入动画、短视频与动态广告。</p>
      </div></SystemGlow>
      <div className="ip-story__campaign-grid">
        {project.campaignExtensions.map((item) => <SystemExtension
          key={item.src}
          item={item}
          className="ip-story__campaign-extension"
          source="AI-ASSISTED CAMPAIGN EXTENSION"
        />)}
      </div>
    </section>

    <section className="ip-story__outro">
      <span>VISUAL CONCLUSION / 07</span>
      <h3>{project.closing}</h3>
      <p>一套可被画出来、捏出来，也能走进空间与屏幕的角色语言。</p>
    </section>
  </div>
}
import BorderGlow from './BorderGlow'
