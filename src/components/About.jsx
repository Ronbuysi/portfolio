import { useRef } from 'react'
import { profile } from '../data/profile'
import BorderGlow from './BorderGlow'
import { assetUrl } from '../utils/assetUrl'
import ResponsiveImage from './ResponsiveImage'
import ScrollFillText from './ScrollFillText'
import CountUp from './bits/CountUp'
import useAboutStory from '../motion/useAboutStory'

export default function About() {
  const rootRef = useRef(null)
  useAboutStory(rootRef)

  return <section id="about" ref={rootRef} className="about section shell">
    <span className="about__ghost" aria-hidden="true">ABOUT</span>
    <div className="about__lead about__pin-stage" data-about-pin>
      <figure className="about__portrait">
        <BorderGlow
          className="about__portrait-glow"
          backgroundColor="#0b1d3c"
          borderRadius={0}
          glowRadius={18}
          glowIntensity={0.45}
          colors={['#5b8cff', '#d8ff36', '#f2f0eb']}
          fillOpacity={0.08}
        >
          <div className="about__portrait-frame">
            <ResponsiveImage
              src={assetUrl('/images/profile/wang-chengcheng-2026.jpg')}
              alt="王程程，视觉设计师与 AI 设计师个人肖像"
              width="828"
              height="1060"
              loading="lazy"
              decoding="async"
            />
            <span className="about__portrait-grid" aria-hidden="true" />
            <div className="about__portrait-roles" aria-hidden="true">
              <span>VISUAL DESIGN</span>
              <span>AI DESIGN</span>
              <span>BRAND DESIGN</span>
            </div>
          </div>
        </BorderGlow>
        <figcaption>
          <strong>王程程 / WANG CHENGCHENG</strong>
          <span>DESIGNER PROFILE · 01</span>
        </figcaption>
      </figure>
      <div className="about__lead-copy">
        <p className="eyebrow">PROFILE / 2026</p>
        <ScrollFillText as="h2" text={'把视觉直觉，变成\n清晰有力的设计语言。'} />
        <ScrollFillText className="about__intro" text={profile.introduction} />
      </div>
    </div>
    <div className="about__details">
      <div className="stats">
        {profile.stats.map((stat, index) => <div className="about__stat" key={stat.label} data-reveal-delay={index * 90}><i /><strong><CountUp value={stat.value} /></strong><span>{stat.label}</span></div>)}
      </div>
      <div className="about__timeline-wrap">
        <svg className="about__path" viewBox="0 0 100 420" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M8 0 C22 80 2 130 28 205 S70 290 92 420" /></svg>
        <ol className="timeline">
        {profile.timeline.map((item, index) => <li key={item.period} data-about-node data-reveal-delay={index * 80}>
          <time>{item.period}</time>
          <div><strong>{item.title}</strong><span>{item.detail}</span></div>
        </li>)}
        </ol>
      </div>
      <div className="honors-block">
        <p className="mini-label">SELECTED HONORS</p>
        <ul className="honors" aria-label="设计赛事荣誉">
          {profile.honors.map((honor) => <li className="honors__card" key={honor}>{honor}</li>)}
        </ul>
      </div>
      <a className="text-link" href={`mailto:${profile.email}`}>{profile.email} ↗</a>
    </div>
  </section>
}
