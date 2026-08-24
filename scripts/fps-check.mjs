// CDP FPS/longtask measurement against an ALREADY-RUNNING headless Chrome on :9223.
// Usage: node scripts-fps.mjs <baseUrl> <label>
import { execSync } from 'node:child_process'

const [, , baseUrl, label] = process.argv
const DEBUG_PORT = 9223
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const version = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json()
  console.log(`connected: ${version.Browser}`)

  const measure = async (url, scrollerKind) => {
    const tabRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?url=${encodeURIComponent('about:blank')}`, { method: 'PUT' })
    const tab = await tabRes.json()
    const ws = new WebSocket(tab.webSocketDebuggerUrl)
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
    let id = 0
    const pending = new Map()
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
    }
    const send = (method, params = {}) => new Promise(res => {
      const mid = ++id
      pending.set(mid, res)
      ws.send(JSON.stringify({ id: mid, method, params }))
    })
    const evalJs = async expression => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
        if (r.result?.result?.value !== undefined || !r.result?.exceptionDetails) {
          if (r.result?.exceptionDetails) return JSON.stringify({ error: r.result.exceptionDetails.text })
          return r.result?.result?.value
        }
        await sleep(300)
      }
      return JSON.stringify({ error: 'evaluate failed' })
    }

    await send('Page.enable')
    await send('Runtime.enable')
    await send('Page.navigate', { url })
    await sleep(5000)

    const script = `(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const DURATION = 5000;
      let frames = 0, longTasks = 0, longTotalMs = 0;
      const obs = new PerformanceObserver(list => { for (const e of list.getEntries()) { longTasks++; longTotalMs += e.duration; } });
      try { obs.observe({ entryTypes: ['longtask'] }); } catch {}
      const el = ${JSON.stringify(scrollerKind)} === 'overlay'
        ? document.querySelector('.pdetail')
        : document.scrollingElement;
      if (!el) return JSON.stringify({ error: 'no scroller found' });
      await sleep(800);
      const max = el.scrollHeight - el.clientHeight;
      const t0 = performance.now();
      const tick = () => { frames++; if (performance.now() - t0 < DURATION + 300) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      const t1 = performance.now();
      while (performance.now() - t1 < DURATION) {
        const p = Math.min(1, (performance.now() - t1) / DURATION);
        el.scrollTop = max * p;
        await new Promise(r => requestAnimationFrame(r));
      }
      await sleep(200);
      obs.disconnect();
      const secs = (performance.now() - t0) / 1000;
      return JSON.stringify({
        fps: Math.round(frames / secs),
        longTasks,
        longTotalMs: Math.round(longTotalMs),
        scrolledPx: Math.round(max),
      });
    })()`

    const result = await evalJs(script)
    try { ws.close() } catch {}
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/close/${tab.id}`).catch(() => {})
    return result
  }

  console.log(`${label} HOME -> ${await measure(`${baseUrl}/#/`, 'window')}`)
  await sleep(1000)
  console.log(`${label} #007 -> ${await measure(`${baseUrl}/#work/nesta-furniture`, 'overlay')}`)
}

main().catch(err => { console.error('FAILED:', err.message ?? err); process.exit(1) })
