// Perf probe: FPS + longtasks + layer stats on an already-running headless Chrome :9223.
// Usage: node scripts/perf-probe.mjs <baseUrl> <label>
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
    ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
    const send = (method, params = {}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })) })
    const evalJs = async expression => {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      if (r.result?.exceptionDetails) return JSON.stringify({ error: r.result.exceptionDetails.exception?.description?.slice(0, 200) })
      return r.result?.result?.value
    }

    await send('Page.enable')
    await send('Runtime.enable')
    // 让动画真实运行（无头 Chrome 默认 prefers-reduced-motion: reduce 会关掉动效）
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
    await send('Page.navigate', { url })
    await sleep(6000)

    const script = `(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const DURATION = 5000;
      const out = {};
      // 静置 3 秒：只挂 rAF 计帧，不滚动（衡量"纯打开页面"的持续开销）
      let frames = 0, longTasks = 0, longTotalMs = 0, worst = 0;
      const obs = new PerformanceObserver(list => { for (const e of list.getEntries()) { longTasks++; longTotalMs += e.duration; worst = Math.max(worst, e.duration); } });
      try { obs.observe({ entryTypes: ['longtask'] }); } catch {}
      const tickIdle = () => { frames++; requestAnimationFrame(tickIdle); };
      const rafId = requestAnimationFrame(tickIdle);
      const t0 = performance.now();
      await sleep(3000);
      const idleSecs = (performance.now() - t0) / 1000;
      out.idleFps = Math.round(frames / idleSecs);
      // 滚动 5 秒
      const el = ${JSON.stringify(scrollerKind)} === 'overlay' ? document.querySelector('.pdetail') : document.scrollingElement;
      if (!el) return JSON.stringify({ error: 'no scroller' });
      frames = 0; const ltBefore = longTasks, ltMsBefore = longTotalMs;
      const max = el.scrollHeight - el.clientHeight;
      const t1 = performance.now();
      const tickScroll = () => { frames++; if (performance.now() - t1 < DURATION + 300) requestAnimationFrame(tickScroll); };
      requestAnimationFrame(tickScroll);
      while (performance.now() - t1 < DURATION) {
        const p = Math.min(1, (performance.now() - t1) / DURATION);
        el.scrollTop = max * p;
        await new Promise(r => requestAnimationFrame(r));
      }
      await sleep(200);
      obs.disconnect();
      cancelAnimationFrame(rafId);
      const secs = (performance.now() - t1) / 1000;
      out.scrollFps = Math.round(frames / secs);
      out.longTasks = longTasks - ltBefore;
      out.longTotalMs = Math.round(longTotalMs - ltMsBefore);
      out.worstLongMs = Math.round(worst);
      out.scrolledPx = Math.round(max);
      // 渲染负担统计
      const imgs = [...document.querySelectorAll('img')];
      out.imgCount = imgs.length;
      out.imgLoadedBytes = Math.round(imgs.reduce((s, i) => {
        const e = performance.getEntriesByName(i.currentSrc)[0];
        return s + (e ? e.transferSize : 0);
      }, 0) / 1024);
      out.backdropFilters = [...document.querySelectorAll('*')].filter(el => {
        const s = getComputedStyle(el);
        return (s.backdropFilter && s.backdropFilter !== 'none') || (s.webkitBackdropFilter && s.webkitBackdropFilter !== 'none');
      }).length;
      out.blurFilters = [...document.querySelectorAll('*')].filter(el => (getComputedStyle(el).filter || '').includes('blur')).length;
      out.animElements = document.getAnimations ? document.getAnimations().length : -1;
      return JSON.stringify(out);
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
