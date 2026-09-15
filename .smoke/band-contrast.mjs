import { chromium } from 'playwright-core'

/** 实测「色带」上文字的对比度。canvas 取真实像素，不自己换算色彩空间。 */
const b = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})

for (const theme of ['brutal', 'manifesto', 'sport']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(`http://127.0.0.1:5173/themes/${theme}`, {
    waitUntil: 'networkidle',
  })
  await p.waitForTimeout(400)
  const r = await p.evaluate(() => {
    const cv = document.createElement('canvas')
    cv.width = cv.height = 1
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    const loc = (c) => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = '#000'
      ctx.fillStyle = c
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      return [d[0], d[1], d[2]]
    }
    const lum = (c) => {
      const [r, g, b] = loc(c)
      const f = (v) =>
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const cr = (a, c) => {
      const m = lum(a)
      const n = lum(c)
      return +((Math.max(m, n) + 0.05) / (Math.min(m, n) + 0.05)).toFixed(2)
    }
    const paper = getComputedStyle(document.body).backgroundColor
    const band = [...document.querySelectorAll('section')].find((s) => {
      const bg = getComputedStyle(s).backgroundColor
      return bg !== 'rgba(0, 0, 0, 0)' && bg !== paper
    })
    if (!band) return ['找不到色带']
    const bg = getComputedStyle(band).backgroundColor
    return [...band.querySelectorAll('*')]
      .filter((e) => e.textContent.trim() && e.children.length === 0)
      .slice(0, 4)
      .map((e) => {
        const cs = getComputedStyle(e)
        return `${e.textContent.trim().slice(0, 8)} ${cs.fontSize} → ${cr(cs.color, bg)}`
      })
  })
  console.log(`${theme}: ${Array.isArray(r) ? r.join(' · ') : r}`)
  await p.close()
}

await b.close()
