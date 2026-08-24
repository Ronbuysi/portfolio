import ResponsiveImage from '../ResponsiveImage'

export function NestaFigure({ media, className = '' }) {
  return <figure
    className={`nesta-media ${className}`.trim()}
    data-media-shape={media.shape || 'auto'}
    data-media-label={media.label}
    aria-label={media.label}
  >
    <ResponsiveImage src={media.src} alt={media.alt} loading="lazy" decoding="async" />
  </figure>
}

export function NestaMediaGrid({ media, className = '' }) {
  return <div className={`nesta-media-grid ${className}`.trim()}>
    {media.map((item) => <NestaFigure key={item.src} media={item} />)}
  </div>
}

export function NestaSectionHead({ index, label, title, copy }) {
  return <header className="nesta-section-head">
    <div><span>{index} / {label}</span><h3>{title}</h3></div>
    {copy && <p>{copy}</p>}
  </header>
}
