import { projects } from '../data/projects'
import ProjectRail from './ProjectRail'
import WorkRing from './WorkRing'
import ScrollFillText from './ScrollFillText'

export default function SelectedWork({ onOpen }) {
  const projectCount = String(projects.length).padStart(3, '0')

  return <section id="work" className="work section shell" data-chapter="work">
    <span className="work__blueprint-grid" aria-hidden="true" />
    <span className="work__orbit" aria-hidden="true" />
    <div className="work-intro">
      <p className="eyebrow" data-reveal>SELECTED WORK</p>
      <ScrollFillText as="h2" className="work-intro__title" accent="." text={'SELECTED\nWORK.'} />
      <dl className="work-intro__meta" data-reveal data-reveal-delay={220}>
        <div><dt>Period</dt><dd>2024—2026</dd></div>
        <div><dt>Projects</dt><dd>{projectCount} CASES</dd></div>
        <div><dt>Scope</dt><dd>VISUAL / AI / BRAND</dd></div>
        <div><dt>Action</dt><dd>点击卡片查看项目</dd></div>
      </dl>
      <ProjectRail onOpen={onOpen} />
      <WorkRing projects={projects} onOpen={onOpen} />
    </div>
  </section>
}
