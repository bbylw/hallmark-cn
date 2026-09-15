import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const route = process.argv[2] ?? '/'
const name = route.replace(/[^\w]+/g, '_').replace(/^_|_$/g, '') || 'home'
const out = '.smoke/shots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  executablePath:
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})

for (const [label, w, h] of [
  ['desk', 1440, 900],
  ['mob', 375, 812],
]) {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  })
  await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' })
  // 触发懒加载与进场
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(800)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)

  await page.screenshot({ path: `${out}/${name}-${label}-fold.png` })
  const full = await page.evaluate(() => document.body.scrollHeight)
  await page.setViewportSize({ width: w, height: Math.min(full, 5200) })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/${name}-${label}-full.png` })
  console.log(`${name}-${label}  页面高 ${full}`)
  await page.close()
}

await browser.close()
