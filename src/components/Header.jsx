import { profile } from '../data/profile'

export default function Header() {
  return <header className="header shell">
    <a className="wordmark" href="#home" aria-label="王程程作品集首页">WANG CC™</a>
    <nav aria-label="Primary navigation">
      <a href="#work">WORK</a>
      <a href="#about">ABOUT</a>
      <a href="#contact">CONTACT</a>
    </nav>
    <a className="header__contact" href={`mailto:${profile.email}`}>LET&apos;S TALK ↗</a>
  </header>
}
