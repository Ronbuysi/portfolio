import { NestaFigure, NestaMediaGrid, NestaSectionHead } from './NestaMedia'

export function NestaColdOpen({ data }) {
  return <section className="nesta-cold-open" data-nesta-act="cold-open">
    <NestaFigure media={data.media} className="nesta-cold-open__media" />
    <div className="nesta-cold-open__copy" data-nesta-intro>
      <span>{data.eyebrow}</span><h3>{data.title}</h3><p>{data.role}</p>
    </div>
  </section>
}

export function NestaBrief({ data }) {
  return <section className="nesta-brief" data-nesta-act="brief">
    <NestaSectionHead index="01" label="THE BRIEF" title={data.title} copy={data.summary} />
    <dl>{data.facts.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
    <NestaMediaGrid media={data.media} />
  </section>
}

export function NestaResearch({ data }) {
  return <section className="nesta-research" data-nesta-act="research">
    <NestaSectionHead index="02" label="RESEARCH TO INSIGHT" title={data.title} />
    <div className="nesta-research__insights">
      {data.insights.map(([label, copy]) => <article key={label}><span>{label}</span><h4>{copy}</h4></article>)}
    </div>
    <details className="nesta-evidence">
      <summary className="nesta-evidence__trigger">
        <span className="nesta-evidence__kicker">02.1 / RESEARCH ARCHIVE</span>
        <strong className="nesta-evidence__title">
          <span className="nesta-evidence__closed">展开完整调研与竞品档案</span>
          <span className="nesta-evidence__open">收起完整调研与竞品档案</span>
        </strong>
        <span className="nesta-evidence__count">20 BOARDS</span>
        <i className="nesta-evidence__icon" aria-hidden="true">+</i>
      </summary>
      <div className="nesta-evidence__content">
        <NestaMediaGrid media={data.evidence} className="nesta-evidence__base" />
        <div className="nesta-competitor-stage">
          <div className="nesta-competitors">
            {data.competitors.map((item) => <article key={item.name}><h4>{item.name}</h4><NestaMediaGrid media={item.media} /></article>)}
          </div>
        </div>
      </div>
    </details>
  </section>
}

export function NestaStrategy({ data }) {
  return <section className="nesta-strategy" data-nesta-act="strategy">
    <NestaSectionHead index="03" label="STRATEGIC LEAP" title={data.title} copy={data.summary} />
    <div className="nesta-strategy__decisions">
      {data.decisions.map(([label, title]) => <article key={label}><span>{label}</span><h4>{title}</h4></article>)}
    </div>
    <NestaMediaGrid media={data.media} />
  </section>
}

export function NestaIdentity({ data }) {
  return <section className="nesta-identity" data-nesta-act="identity">
    <NestaSectionHead index="04" label="IDENTITY SYSTEM" title="从承载概念，生长出一套视觉语法。" />
    <div className="nesta-identity__grid">
      {data.map((item) => <article key={item.key} data-identity={item.key}>
        <div><span>{item.key}</span><h4>{item.title}</h4><p>{item.copy}</p></div>
        <NestaMediaGrid media={item.media} />
      </article>)}
    </div>
  </section>
}

export function NestaApplications({ data }) {
  return <section className="nesta-applications" data-nesta-act="applications">
    <NestaSectionHead index="05" label="BRAND IN USE" title="系统在真实触点中持续呼吸。" />
    <div className="nesta-applications__groups">
      {data.map((item) => <article key={item.key} data-application={item.key}>
        <h4>{item.title}</h4><NestaMediaGrid media={item.media} />
      </article>)}
    </div>
  </section>
}

export function NestaTakeaway({ data }) {
  return <section className="nesta-takeaway" data-nesta-act="takeaway">
    <span>06 / TAKEAWAY</span><h3>{data.title}</h3>
    <ul>{data.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
  </section>
}
