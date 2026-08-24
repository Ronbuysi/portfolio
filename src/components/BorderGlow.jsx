export default function BorderGlow({
  className = '',
  backgroundColor = 'transparent',
  borderRadius = 0,
  glowRadius,
  glowIntensity,
  glowColor,
  colors,
  fillOpacity,
  children,
  ...rest
}) {
  return <div
    className={`border-glow-card${className ? ` ${className}` : ''}`}
    style={{ '--card-bg': backgroundColor, '--border-radius': `${borderRadius}px` }}
    {...rest}
  >{children}</div>
}
