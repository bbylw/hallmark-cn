import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173/themes/terminal', {
  waitUntil: 'networkidle',
})
await page.waitForTimeout(500)

// ── 键盘交互 ──────────────────────────────────────────────
const input = page.locator('#main input')
const marker = () => page.$$eval('#main [aria-hidden]', () => 0)

const rows = () =>
  page.$$eval('#main div', (els) =>
    els
      .filter((e) => /^▸/.test(e.textContent.trim()))
      .map((e) => e.textContent.trim().slice(1, 40)),
  )

await input.click()
console.log('初始选中  ', (await rows())[0] ?? '（无）')

await page.keyboard.press('ArrowDown')
await page.keyboard.press('ArrowDown')
console.log('↓ ↓ 之后 ', (await rows())[0] ?? '（无）')

await page.keyboard.press('Enter')
const opened = await page.evaluate(() =>
  (document.body.innerText.match(/\.(tsx|ts|css)-\d+-/g) ?? []).length,
)
console.log('回车展开  ', opened > 0 ? `上下文出现 ${opened} 行` : '没有反应 ✗')
await page.keyboard.press('Enter')
console.log('再按回车  ', (await page.evaluate(() =>
  (document.body.innerText.match(/\.(tsx|ts|css)-\d+-/g) ?? []).length,
)) > 0 ? '没收回 ✗' : '收回了 ✓')

await page.keyboard.press('Escape')
console.log('esc 之后 输入框值 =', JSON.stringify(await input.inputValue()))

// ── 对比度（canvas 取真实像素） ────────────────────────────
const ratios = await page.evaluate(() => {
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
    const f = (v) => {
      v /= 255
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const cr = (a, b) => {
    const x = lum(a)
    const y = lum(b)
    return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2)
  }
  const bg = getComputedStyle(document.body).backgroundColor
  const one = (sel, name) => {
    const el = document.querySelector(sel)
    if (!el) return `${name}: 找不到`
    const own = getComputedStyle(el)
    const parentBg = getComputedStyle(el.parentElement).backgroundColor
    const box = own.backgroundColor
    return `${name}: ${cr(own.color, box !== 'rgba(0, 0, 0, 0)' ? box : bg)} (父底 ${cr(own.color, parentBg !== 'rgba(0, 0, 0, 0)' ? parentBg : bg)})`
  }
  return [
    one('#main h1', '标题'),
    one('#main p', '导语'),
    one('#main input', '提示符输入'),
    one('#main .text-muted', '弱化文字'),
  ]
})
console.log('--- 对比度（WCAG AA 正文需 ≥4.5）---')
ratios.forEach((r) => console.log('  ' + r))

await browser.close()
