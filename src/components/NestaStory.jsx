import { useRef } from 'react'
import {
  NestaApplications,
  NestaBrief,
  NestaColdOpen,
  NestaIdentity,
  NestaResearch,
  NestaStrategy,
  NestaTakeaway,
} from './nesta/NestaSections'
import useNestaMotion from './nesta/useNestaMotion'

export default function NestaStory({ project }) {
  const rootRef = useRef(null)
  useNestaMotion(rootRef)
  const story = project.caseStudy

  return <div className="nesta-story" ref={rootRef}>
    <NestaColdOpen data={story.coldOpen} />
    <NestaBrief data={story.brief} />
    <NestaResearch data={story.research} />
    <NestaStrategy data={story.strategy} />
    <NestaIdentity data={story.identity} />
    <NestaApplications data={story.applications} />
    <NestaTakeaway data={story.takeaway} />
  </div>
}
