export function scrollTargets(el) {
  const nodes = [window]
  if (!el) return nodes
  let node = el.parentElement
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node)
    if (/(auto|scroll)/.test(style.overflowY + style.overflow)) {
      nodes.push(node)
      break
    }
    node = node.parentElement
  }
  return nodes
}
