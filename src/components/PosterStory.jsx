import { useRef } from 'react'
import ResponsiveImage from './ResponsiveImage'
import useStoryAccents from '../hooks/useStoryAccents'

function PosterFigure({ poster, inStage = false, index = 0 }) {
  return <figure
    className={inStage ? 'poster-story__stage-frame' : undefined}
    {...(inStage ? {} : { 'data-reveal': 'clip', 'data-reveal-delay': index * 90 })}
  >
    <ResponsiveImage src={poster.src} alt={poster.alt} loading="lazy" decoding="async" />
    <figcaption><span>{poster.label} / {poster.index}</span><span>ORIGINAL POSTER</span></figcaption>
  </figure>
}

function SanfuLanguage({ language }) {
  return <section className="poster-story__language">
    <div className="poster-story__module-copy">
      <span className="poster-story__label">VISUAL LANGUAGE / 01</span>
      <h3>{language.title}</h3>
      <p>拼图结构连接三种生活状态，黑白物件线稿让高饱和人物成为视觉中心。</p>
    </div>
    <div className="poster-story__swatches">
      {language.colors.map((color) => <div key={color.name}>
        <i style={{ '--poster-color': color.value }} />
        <b>{color.name}</b><span>{color.value}</span>
      </div>)}
    </div>
  </section>
}

function HorshTimeline({ timeline }) {
  return <section className="poster-story__timeline" aria-label="成长时间轴">
    {timeline.map((item) => <article key={item.index}>
      <span>{item.index} / {item.en}</span>
      <i aria-hidden="true" />
      <b>{item.cn}</b>
      <p>{item.description}</p>
    </article>)}
  </section>
}

export default function PosterStory({ project }) {
  const rootRef = useRef(null)
  useStoryAccents(rootRef)
  return <div className={`poster-story poster-story--${project.theme}`} ref={rootRef}>
    <section className={`poster-story__originals poster-story__originals--${project.posters.length}`} aria-label={`${project.title}原始海报`}>
      {project.posters.map((poster, index) => <PosterFigure key={poster.src} poster={poster} index={index} />)}
    </section>

    {project.visualLanguage && <SanfuLanguage language={project.visualLanguage} />}
    {project.timeline && <HorshTimeline timeline={project.timeline} />}

    <section className="poster-story__stage" aria-label={`${project.title}AI辅助展示场景`}>
      <ResponsiveImage className="poster-story__stage-bg" src={project.presentation} alt="" loading="lazy" decoding="async" />
      <div className={`poster-story__stage-frames poster-story__stage-frames--${project.posters.length}`}>
        {project.posters.map((poster) => <PosterFigure key={poster.src} poster={poster} inStage />)}
      </div>
      <span className="poster-story__stage-source">AI-ASSISTED PRESENTATION</span>
    </section>
  </div>
}
