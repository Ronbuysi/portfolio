import { useCallback, useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import SelectedWork from './components/SelectedWork'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import FloatingNav from './components/FloatingNav'
import TickerTape from './components/TickerTape'
import Lightbox from './components/Lightbox'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import ErrorBoundary from './components/ErrorBoundary'
import ProjectDetail from './components/ProjectDetail'
import PortfolioAtmosphere from './components/PortfolioAtmosphere'
import ProjectTransitionLayer from './components/ProjectTransitionLayer'
import useAssetMotion from './hooks/useAssetMotion'
import useAutoRail from './hooks/useAutoRail'
import useRevealOnScroll from './hooks/useRevealOnScroll'
import useParallax from './hooks/useParallax'
import useMotionPreference from './motion/useMotionPreference'
import { setThemeAccent } from './motion/themeAccent'
import { projects } from './data/projects'
import { heroPreloadSources } from './data/heroScene'

function readHashProject() {
  const match = window.location.hash.match(/^#work\/([\w-]+)$/)
  if (match && projects.some((item) => item.id === match[1])) return match[1]
  return null
}

export default function App() {
  const { forced, motionAllowed } = useMotionPreference()
  const [activeId, setActiveId] = useState(readHashProject)
  const transitionOriginRef = useRef(null)
  const [ready, setReady] = useState(() => {
    try {
      if (sessionStorage.getItem('wcc-pl') === '1') return true
    } catch { /* ignore */ }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('motion-forced', forced)
  }, [forced])

  useEffect(() => {
    document.documentElement.classList.toggle('is-ready', ready)
  }, [ready])

  const handleReady = useCallback(() => {
    try { sessionStorage.setItem('wcc-pl', '1') } catch { /* ignore */ }
    setReady(true)
  }, [])

  useEffect(() => {
    const onPop = () => {
      setActiveId(readHashProject())
      if (window.location.hash === '#home') {
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
      }
    }
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    onPop()
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  useEffect(() => {
    setThemeAccent(projects.find((item) => item.id === activeId)?.accent)
  }, [activeId])

  useRevealOnScroll(motionAllowed, activeId)
  useParallax(motionAllowed, activeId)
  useAssetMotion(motionAllowed, activeId)
  useAutoRail(motionAllowed, activeId)

  const openProject = (id, origin = null) => {
    transitionOriginRef.current = origin
    setActiveId(id)
    window.history.pushState(null, '', `#work/${id}`)
  }
  const closeProject = () => {
    setActiveId(null)
    window.history.pushState(null, '', '#work')
    requestAnimationFrame(() => transitionOriginRef.current?.focus?.())
  }
  const stepProject = (direction) => {
    if (!activeId) return
    const index = projects.findIndex((item) => item.id === activeId)
    const next = projects[(index + direction + projects.length) % projects.length]
    setActiveId(next.id)
    window.history.replaceState(null, '', `#work/${next.id}`)
  }

  return <ErrorBoundary>
    {!ready && <Preloader assets={heroPreloadSources} onReady={handleReady} />}
    <ScrollProgress />
    <FloatingNav />
    <Lightbox />
    <Cursor />
    {forced && import.meta.env.DEV && <div className="motion-badge">MOTION: FORCED</div>}
    <Hero ready={ready} />
    <PortfolioAtmosphere />
    <main>
      <About />
      <TickerTape />
      <SelectedWork onOpen={openProject} />
      <Strengths />
      <Contact />
    </main>
    {activeId && <ProjectDetail projectId={activeId} onClose={closeProject} onStep={stepProject} />}
    <ProjectTransitionLayer origin={transitionOriginRef.current} active={activeId} />
  </ErrorBoundary>
}
