import { useRef } from 'react'
import usePortfolioAtmosphere from '../motion/usePortfolioAtmosphere'

export default function PortfolioAtmosphere() {
  const rootRef = useRef(null)
  usePortfolioAtmosphere(rootRef)
  return <div className="portfolio-atmosphere" ref={rootRef} aria-hidden="true">
    <span className="portfolio-atmosphere__glow portfolio-atmosphere__glow--a" />
    <span className="portfolio-atmosphere__glow portfolio-atmosphere__glow--b" />
    <span className="portfolio-atmosphere__grid" />
    <svg className="portfolio-atmosphere__curve" viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M-80 370 C170 80 350 580 590 230 S920 120 1080 360" /></svg>
    {Array.from({ length: 4 }, (_, index) => <i className={`portfolio-atmosphere__particle portfolio-atmosphere__particle--${index + 1}`} key={index} />)}
    <span className="portfolio-atmosphere__noise" />
  </div>
}
