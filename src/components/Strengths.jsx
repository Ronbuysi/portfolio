import BorderGlow from './BorderGlow'
import ScrollFillText from './ScrollFillText'
import { useRef } from 'react'
import useStrengthsStory from '../motion/useStrengthsStory'

const strengths = [
  ['视觉系统', '从色彩、字体到版式，建立可持续的视觉语言。'],
  ['品牌表达', '让概念拥有准确、鲜明且一致的品牌形象。'],
  ['AI 共创', '将生成式工具融入灵感探索与视觉生产。'],
  ['动态叙事', '用 AE 与节奏设计，让静态概念进入时间维度。'],
]

export default function Strengths() {
  const rootRef = useRef(null)
  useStrengthsStory(rootRef)

  return <section className="strengths section shell" ref={rootRef}>
    <div className="strengths__stage">
    <svg className="strengths__path" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M20 150 C260 20 350 210 520 90 S760 40 980 130" /></svg>
    {strengths.map((_, index) => <i className={`strengths__light strengths__light--${index + 1}`} key={index} aria-hidden="true" />)}
    <p className="eyebrow" data-reveal>WHAT I BRING</p>
    <ScrollFillText as="h2" accent="." text={'FOUR WAYS\nI CREATE VALUE.'} />
    <div className="strengths__grid">
      {strengths.map(([title, copy], index) => (
        <BorderGlow
          className="strengths__glow"
          backgroundColor="#0d0d0d"
          borderRadius={1}
          glowRadius={16}
          glowIntensity={0.5}
          colors={['#d8ff36', '#eef2df', '#7893b8']}
          fillOpacity={0.1}
          key={title}
        >
          <article data-strength-card={index} aria-current={index === 0 ? 'true' : 'false'}>
            <span>0{index + 1}</span>
            <div><h3>{title}</h3><p>{copy}</p></div>
          </article>
        </BorderGlow>
      ))}
    </div>
    </div>
    <p className="toolkit" aria-label="AI · PS · AE · ID · CHATGPT · MIDJOURNEY · GEMINI · CLAUDE">
      <span className="toolkit__track">
        <span>AI · PS · AE · ID · CHATGPT · MIDJOURNEY · GEMINI · CLAUDE</span>
        <span aria-hidden="true">AI · PS · AE · ID · CHATGPT · MIDJOURNEY · GEMINI · CLAUDE</span>
      </span>
      <span className="toolkit__track toolkit__track--reverse" aria-hidden="true">
        <span>CLAUDE · GEMINI · MIDJOURNEY · CHATGPT · ID · AE · PS · AI</span>
        <span>CLAUDE · GEMINI · MIDJOURNEY · CHATGPT · ID · AE · PS · AI</span>
      </span>
    </p>
  </section>
}
