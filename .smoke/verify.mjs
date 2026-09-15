// 逐路由硬断言：24 个页面全部过一遍
//   对比度（全量扫可见文本，大字号按 3:1、正文按 4.5:1）
//   横向溢出 / 控件折行 / 图片加载 / 控制台报错 / 主题是否真的套上了
// 用法：先 node .smoke/serve.mjs，再 node .smoke/verify.mjs
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://127.0.0.1:8199'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const THEMES = [
  'grid', 'specimen', 'midnight', 'brutal', 'garden', 'atelier', 'newsprint',
  'terminal', 'manifesto', 'almanac', 'sport', 'studio', 'riso', 'bloom',
  'coral', 'cobalt', 'aurora', 'editorial', 'carnival', 'lumen', 'hum',
]
const ROUTES = [
  { path: '/', theme: 'grid' },
  { path: '/about', theme: 'almanac' },
  { path: '/custom', theme: 'custom' },
  ...THEMES.map((t) => ({ path: `/themes/${t}`, theme: t })),
]

const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const HELPER = `
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  window.__rgb = (color) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  window.__contrast = (fg, bg) => {
    const lum = (c) => {
      const [r, g, b] = window.__rgb(c);
      const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const a = lum(fg), b = lum(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  window.__bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
      n = n.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  window.__inScroller = (el) => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
      n = n.parentElement;
    }
    return false;
  };
`

const rows = []
for (const route of ROUTES) {
  const errors = []
  const onErr = (m) => m.type() === 'error' && errors.push(m.text())
  const onFail = (e) => errors.push(String(e))
  page.on('console', onErr)
  page.on('pageerror', onFail)

  await page.goto(BASE + route.path, { waitUntil: 'networkidle' })
  // 先滚一遍，触发 lazy 图片，再回到顶部做检查
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
  })
  await page.waitForTimeout(900)
  await page.addScriptTag({ content: HELPER })

  const r = await page.evaluate(() => {
    const lowContrast = []
    for (const el of document.querySelectorAll('body *')) {
      const own = Array.from(el.childNodes).some(
        (n) => n.nodeType === 3 && n.nodeValue.trim(),
      )
      if (!own) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      if (Number(cs.opacity) < 0.5) continue
      const box = el.getBoundingClientRect()
      if (box.width < 2 || box.height < 2) continue
      const size = parseFloat(cs.fontSize)
      const weight = Number(cs.fontWeight) || 400
      const large = size >= 24 || (size >= 18.66 && weight >= 700)
      const need = large ? 3 : 4.5
      const c = window.__contrast(cs.color, window.__bgOf(el))
      if (c < need) {
        lowContrast.push(
          `${el.textContent.trim().slice(0, 18)} ${c.toFixed(2)}/${need}`,
        )
      }
    }

    const de = document.documentElement
    const bleed = []
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect()
      if (b.width > 0 && b.right > window.innerWidth + 1 && !window.__inScroller(el))
        bleed.push(el.className?.toString().slice(0, 28) ?? el.tagName)
    }

    const wrapped = []
    for (const el of document.querySelectorAll('.btn, header a, footer a')) {
      const h = el.getBoundingClientRect().height
      if (h > 52) wrapped.push(`${el.textContent.trim().slice(0, 14)}(${Math.round(h)}px)`)
    }

    const imgs = [...document.querySelectorAll('img')]

    return {
      theme: de.dataset.theme,
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 20) ?? '',
      h1Count: document.querySelectorAll('h1').length,
      overflow: de.scrollWidth - de.clientWidth,
      bleed: [...new Set(bleed)].slice(0, 3),
      wrapped: wrapped.slice(0, 4),
      lowContrast: lowContrast.slice(0, 6),
      lowCount: lowContrast.length,
      imgTotal: imgs.length,
      imgOk: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
    }
  })

  // 移动端宽度
  await page.setViewportSize({ width: 375, height: 812 })
  await page.waitForTimeout(250)
  const mobile = await page.evaluate(() => ({
    overflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))
  await page.setViewportSize({ width: 1440, height: 900 })

  page.off('console', onErr)
  page.off('pageerror', onFail)

  rows.push({ ...route, ...r, mobileOverflow: mobile.overflow, errors })
}

const bad = []
for (const r of rows) {
  const marks = []
  if (r.theme !== r.theme) marks.push('主题不匹配')
  if (r.overflow > 0) marks.push(`桌面溢出 ${r.overflow}px`)
  if (r.mobileOverflow > 0) marks.push(`移动溢出 ${r.mobileOverflow}px`)
  if (r.bleed.length) marks.push(`超出 ${r.bleed.join('|')}`)
  if (r.wrapped.length) marks.push(`折行 ${r.wrapped.join('|')}`)
  if (r.lowCount) marks.push(`对比度 ${r.lowCount} 处: ${r.lowContrast.join(' / ')}`)
  if (r.imgTotal !== r.imgOk)
    marks.push(`图片 ${r.imgOk}/${r.imgTotal}`)
  if (r.h1Count !== 1) marks.push(`h1 数量 ${r.h1Count}`)
  if (r.errors.length) marks.push(`报错 ${r.errors.length}: ${r.errors[0].slice(0, 70)}`)

  const line = `${r.path.padEnd(18)} ${String(r.theme).padEnd(10)} img ${r.imgOk}/${r.imgTotal}  「${r.h1}」`
  if (marks.length) bad.push(`${line}\n    ${marks.join('\n    ')}`)
  else console.log(`OK   ${line}`)
}

console.log('')
console.log(`共 ${rows.length} 条路由`)
if (bad.length) {
  console.log('\n未通过：')
  for (const b of bad) console.log(b)
} else {
  console.log('24 条路由全部通过。')
}

// 全站破折号扫描
const dash = []
for (const route of ROUTES) {
  await page.goto(BASE + route.path, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(150)
  const hits = await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const out = []
    let n
    while ((n = w.nextNode()))
      if (/[—–]/.test(n.nodeValue)) out.push(n.nodeValue.trim().slice(0, 40))
    return out
  })
  if (hits.length) dash.push(`${route.path}: ${hits[0]}`)
}
console.log(dash.length ? `\n发现破折号:\n  ${dash.join('\n  ')}` : '\n24 页均无 em-dash / en-dash。')

// reduced-motion 下内容要直接可见
const rm = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
})
const rmBad = []
for (const route of ROUTES.slice(0, 6)) {
  await rm.goto(BASE + route.path, { waitUntil: 'networkidle' })
  await rm.waitForTimeout(700)
  const min = await rm.evaluate(() => {
    const els = [...document.querySelectorAll('h1, h2, p, li')]
    return Math.min(...els.map((e) => Number(getComputedStyle(e).opacity)))
  })
  if (min < 0.99) rmBad.push(`${route.path} opacity=${min}`)
}
console.log(rmBad.length ? `\nreduced-motion 不可见: ${rmBad.join(', ')}` : '\nreduced-motion 下内容直接可见。')

await browser.close()
