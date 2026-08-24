import { projects } from '../data/projects'

export default function ProjectRail({ onOpen }) {
  return <nav className="project-rail" aria-label="项目快速索引">
    <div className="project-rail__items">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          className="project-rail__item"
          onClick={(event) => onOpen(project.id, event.currentTarget)}
        >
          <span className="project-rail__num">{project.index}</span>
          <span className="project-rail__name">{project.title}</span>
        </button>
      ))}
    </div>
  </nav>
}
