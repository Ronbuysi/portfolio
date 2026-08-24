// Capture the composed 003 poster stage from the live render and emit
// horsh-ring-cover.png + w1800/w960 webp variants.
import fs from 'node:fs'
const DEBUG_PORT = 9223
const sleep = ms => new Promise(r => setTimeout(r, ms))

const tabRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?url=about:blank`, { method: 'PUT' })
const tab = await tabRes.json()
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let id = 0
const pending = new Map()
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } }
const send = (method, params = {}) => new Promise(res => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })) })
const evalJs = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'http://localhost:4173/#work/horsh-growth' })
await sleep(6000)

// freeze decorative layers for a clean capture
await evalJs(`(() => {
  const st = document.createElement('style');
  st.textContent = \`
    .poster-story__stage-source, .poster-story__stage-frame figcaption { display: none !important; }
    .poster-story__stage img, .poster-story__stage-frame img { transform: none !important; }
    .project figure { clip-path: none !important; opacity: 1 !important; }
  \`;
  document.head.appendChild(st);
  const stage = document.querySelector('.poster-story__stage');
  stage.scrollIntoView({ block: 'center' });
  return 'ok';
})()`)
await sleep(3000)

const rect = await evalJs(`(() => {
  const r = document.querySelector('.poster-story__stage').getBoundingClientRect();
  return JSON.stringify({ x: r.x, y: r.y, width: r.width, height: r.height });
})()`)
const clip = JSON.parse(rect)
console.log('stage rect:', JSON.stringify(clip))

const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 2 } })
const pngB64 = shot.result.data

// build variants in-page via canvas (chrome encodes webp natively)
const variants = await evalJs(`(async () => {
  const img = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = 'data:image/png;base64,${pngB64}';
  });
  const make = (w) => {
    const h = Math.round(w * img.naturalHeight / img.naturalWidth);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return { h, data: c.toDataURL('image/webp', 0.92).split(',')[1] };
  };
  const full = make(1800);
  const small = make(960);
  return JSON.stringify({ fullH: full.h, full: full.data, smallH: small.h, small: small.data, natW: img.naturalWidth, natH: img.naturalHeight });
})()`)
const v = JSON.parse(variants)
console.log('source px:', v.natW, 'x', v.natH)

// original png (downscale 2x shot to 1800 wide via canvas too, keep as png)
const orig = await evalJs(`(async () => {
  const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'data:image/png;base64,${pngB64}'; });
  const c = document.createElement('canvas');
  c.width = 1800; c.height = Math.round(1800 * img.naturalHeight / img.naturalWidth);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/png').split(',')[1];
})()`)
const dir = 'public/images/poster-projects'
fs.writeFileSync(`${dir}/horsh-ring-cover.png`, Buffer.from(orig, 'base64'))
fs.writeFileSync(`${dir}/horsh-ring-cover-w1800.webp`, Buffer.from(v.full, 'base64'))
fs.writeFileSync(`${dir}/horsh-ring-cover-w960.webp`, Buffer.from(v.small, 'base64'))
console.log('saved horsh-ring-cover.png + w1800 + w960')
ws.close()
await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/close/${tab.id}`).catch(() => {})
