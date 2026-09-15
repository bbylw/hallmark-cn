// 首页对开式布局的几何自检：
//   左栏是否真的固定、首屏能看到多少、窄屏怎么堆叠、
//   以及打样台卡片里的样字有没有被预览区裁掉。
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://127.0.0.1:8199'
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})

for (const [w, h] of [
  [1440, 900],
  [1280, 800],
  [1024, 800],
  [375, 812],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  const first = await page.evaluate(() => {
    const h1 = document.querySelector('h1').getBoundingClientRect()
    const code = document.querySelector('code').getBoundingClientRect()
    return {
      h1Bottom: Math.round(h1.bottom),
      codeBottom: Math.round(code.bottom),
      vh: window.innerHeight,
    }
  })

  await page.evaluate(() => window.scrollTo(0, 1200))
  await page.waitForTimeout(400)
  const after = await page.evaluate(() => {
    const h1 = document.querySelector('#main')
    const rail = document.querySelector('h1').closest('.lg\\:sticky')
    return {
      mainTop: Math.round(h1.getBoundingClientRect().top),
      sticky: rail ? getComputedStyle(rail).position : 'n/a',
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    }
  })

  // 卡片里的样字是否被预览区裁掉
  const clipped = await page.evaluate(() => {
    const out = []
    for (const card of document.querySelectorAll('#main a[data-theme]')) {
      const box = card.firstElementChild
      const text = box?.querySelector('.display')
      if (!box || !text) continue
      const b = box.getBoundingClientRect()
      const t = text.getBoundingClientRect()
      if (t.top < b.top - 0.5 || t.bottom > b.bottom + 0.5) {
        out.push(
          `${text.textContent.trim()} (${Math.round(t.top - b.top)}px 越界)`,
        )
      }
    }
    return out
  })

  console.log(
    `${w}x${h}: 首屏 h1 底 ${first.h1Bottom}/${first.vh} · 命令块底 ${first.codeBottom} · 滚后 #main top ${after.mainTop} (${after.sticky}) · 溢出 ${after.overflow}px · 卡片样字越界 ${clipped.length ? clipped.join(' | ') : '无'}`,
  )
  await page.close()
}

await browser.close()
