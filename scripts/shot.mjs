// Screenshot a URL at laptop viewport, optionally scrolled to a selector.
// Usage: node scripts/shot.mjs <url> <out.png> [selector|scrollY]
const [, , url, out, target] = process.argv
const DEBUG_PORT = 9223
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const tabRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?url=about:blank`, { method: 'PUT' })
  const tab = await tabRes.json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  let id = 0
  const pending = new Map()
  ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
  const send = (method, params = {}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })) })

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url })
  await sleep(6000)

  if (target) {
    await send('Runtime.evaluate', { expression: /^\d+$/.test(target)
      ? `window.scrollTo(0, ${target})`
      : `document.querySelector(${JSON.stringify(target)})?.scrollIntoView({ block: 'center' })` })
    await sleep(2500)
  }
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  const fs = await import('node:fs')
  fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
  console.log('saved', out)
  ws.close()
  await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/close/${tab.id}`).catch(() => {})
}

main().catch(e => { console.error(e.message); process.exit(1) })
