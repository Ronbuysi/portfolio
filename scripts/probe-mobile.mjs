// Evaluate JS on a URL at phone viewport. Usage: node scripts/probe-mobile.mjs <url> <exprFile|->
const [, , url, exprFile] = process.argv
const DEBUG_PORT = 9223
const sleep = ms => new Promise(r => setTimeout(r, ms))
const fs = await import('node:fs')
const expression = exprFile === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(exprFile, 'utf8')

async function main() {
  const tabRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?url=about:blank`, { method: 'PUT' })
  const tab = await tabRes.json()
  const ws = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  let id = 0
  const pending = new Map()
  ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
  const send = (method, params = {}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })) })
  const evalJs = async expression => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval error')
    return r.result?.result?.value
  }

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
  await send('Page.navigate', { url })
  await sleep(6000)
  const out = await evalJs(`(async () => { ${expression} })()`)
  console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 1))
  ws.close()
  await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/close/${tab.id}`).catch(() => {})
}

main().catch(e => { console.error(e.message); process.exit(1) })
