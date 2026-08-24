import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import ScrollFillText from './ScrollFillText'
import OperationStory from './OperationStory'
import IpStory from './IpStory'
import SanfuCampaignStory from './SanfuCampaignStory'
import DaodaoBarStory from './DaodaoBarStory'
import PosterStory from './PosterStory'
import BrandStory from './BrandStory'
import NestaStory from './NestaStory'
import ResponsiveImage from './ResponsiveImage'

const STORIES = {
  operation: OperationStory,
  ip: IpStory,
  campaign: SanfuCampaignStory,
  'bar-brand': DaodaoBarStory,
  poster: PosterStory,
  brand: BrandStory,
  nesta: NestaStory,
}

function StandardStory({ project }) {
  return <>
    <figure className="project__cover">
      <ResponsiveImage src={project.cover} alt={`${project.title}展陈视觉`} loading="eager" />
    </figure>
    <div className="project__gallery">
      {project.gallery?.map((image, index) => <figure key={image.src}>
        <ResponsiveImage src={image.src} alt={image.alt} loading="lazy" />
      </figure>)}
    </div>
  </>
}

export default function ProjectDetail({ projectId, onClose, onStep }) {
  const rootRef = useRef(null)

  // 切换作品时回到详情顶部，而不是停留在上一个作品的阅读位置
  useEffect(() => {
    if (rootRef.current) rootRef.current.scrollTop = 0
  }, [projectId])

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const onKey = (event) => {
      // 大图查看器打开时，方向键 / ESC 归它管，不再切换作品
      if (document.querySelector('.lightbox.is-open')) return
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') onStep(1)
      else if (event.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose, onStep])

  const index = projects.findIndex((item) => item.id === projectId)
  const project = projects[index]
  if (!project) return null
  const projectCount = String(projects.length).padStart(3, '0')

  const Story = STORIES[project.story] || StandardStory

  return <div className="pdetail" ref={rootRef} role="dialog" aria-modal="true" aria-label={`${project.title}项目详情`}>
    <header className="pdetail__bar">
      <button type="button" className="pdetail__back" onClick={onClose}>← 返回作品列表</button>
      <span className="pdetail__count">{project.index} / {projectCount}</span>
      <div className="pdetail__step">
        <button type="button" onClick={() => onStep(-1)} aria-label="上一个项目">←</button>
        <button type="button" onClick={() => onStep(1)} aria-label="下一个项目">→</button>
      </div>
    </header>
    <div className="pdetail__inner shell">
      <article className={`project${project.theme ? ` project--${project.theme}` : ''}${project.story ? ` project--${project.story}` : ''}`}>
        <span className="project__ghost" aria-hidden="true">{project.index}</span>
        <div className="project__heading pdetail__transition-target">
          <div>
            <span className="project__index">{project.index}</span>
            <ScrollFillText as="h2" text={project.title} />
            <p>{project.englishTitle}</p>
          </div>
          <dl>
            <div><dt>Category</dt><dd>{project.category}</dd></div>
            {project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}
            {project.tools && <div><dt>Tools</dt><dd>{project.tools}</dd></div>}
            {project.scope && <div><dt>Scope</dt><dd>{project.scope}</dd></div>}
          </dl>
        </div>
        <ScrollFillText className="project__description" text={project.description} />
        <Story project={project} />
      </article>

      <nav className="pdetail__next">
        <button type="button" onClick={() => onStep(1)}>
          <small>NEXT PROJECT →</small>
          <strong>{projects[(index + 1) % projects.length].title}</strong>
        </button>
      </nav>
    </div>
  </div>
}
