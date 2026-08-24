import { useRef } from 'react'
import Header from './Header'
import DecryptedText from './bits/DecryptedText'
import { heroBackground, heroProps } from '../data/heroScene'
import useHeroSceneMotion from '../motion/useHeroSceneMotion'

const TITLE_LINES = ['VISUAL', 'DESIGNER.']

export default function Hero({ ready = true }) {
  const rootRef = useRef(null)
  useHeroSceneMotion(rootRef, ready)

  return <section id="home" className="hero" ref={rootRef}>
    <picture className="hero__scene-bg" aria-hidden="true">
      <source media="(max-width: 720px)" srcSet={heroBackground.mobile} type="image/webp" />
      <img src={heroBackground.desktop} alt="" />
    </picture>
    <div className="hero__props" aria-hidden="true">
      {heroProps.map((item) => <picture
        className={`hero-prop ${item.className}`}
        data-hero-prop={item.id}
        data-depth={item.depth}
        key={item.id}
      >
        <source media="(max-width: 720px)" srcSet={item.mobile} type="image/webp" />
        <img src={item.desktop} alt="" />
      </picture>)}
    </div>
    <div className="hero__scrim" aria-hidden="true" />
    <Header />
    <div className="hero__content shell">
      <span className="hero__chip hero__chip--a" aria-hidden="true"><i />@wangcc · 沈阳</span>
      <span className="hero__chip hero__chip--b" aria-hidden="true"><i />AI VISUAL PRODUCTION</span>
      <div className="hero__meta-row">
        <DecryptedText text="PORTFOLIO" delay={200} />
        <DecryptedText text="VISUAL × AI × BRAND" delay={420} />
        <DecryptedText text="©2026" delay={640} />
      </div>
      <h1 className="hero__title" aria-label="Visual Designer.">
        {TITLE_LINES.map((line, lineIndex) => <span className="hero__line" key={line} aria-hidden="true">
          <span className={`hero__line-inner${lineIndex === 1 ? ' hero__line-inner--stroke' : ''}`}>
            {line}<span className="hero__dot">{lineIndex === 1 ? '.' : ''}</span>
          </span>
        </span>)}
      </h1>
      <div className="hero__baseline">
        <p className="hero__disciplines">
          Brand Identity / AI Visual Production<br />
          Operational Design / Art Direction
        </p>
        <a className="round-link" href="#work"><span>VIEW SELECTED WORK ↓</span></a>
      </div>
    </div>
    <div className="hero__edge-label" aria-hidden="true">SHENYANG / CHINA</div>
    <div className="hero__scroll-cue" aria-hidden="true"><i /><span>SCROLL TO EXPLORE</span></div>
  </section>
}
