import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/lumen'

async function runAudit() {
  console.log('🚀 Starting Audit for LumenPage: ' + TARGET_URL)
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(err.message))

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('h1')

  // 1. 唯一 h1 检查
  const h1Count = await page.locator('h1').count()
  const h1Text = await page.locator('h1').innerText()
  console.log(`[Gate 40] h1 count: ${h1Count}, text: "${h1Text.replace(/\n/g, ' ')}"`)
  if (h1Count !== 1) throw new Error(`Expected exactly 1 <h1>, got ${h1Count}`)

  // 2. 检查多视口横向溢出 (320px, 375px, 768px, 1280px)
  const viewports = [
    { w: 320, h: 640 },
    { w: 375, h: 667 },
    { w: 768, h: 1024 },
    { w: 1280, h: 800 },
  ]
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h })
    await page.waitForTimeout(100)
    const hasOverflow = await page.evaluate(() => {
      const el = document.documentElement
      return el.scrollWidth > el.clientWidth
    })
    console.log(`[Viewport ${vp.w}px] Horizontal overflow: ${hasOverflow ? 'FAIL' : 'PASS'}`)
    if (hasOverflow) throw new Error(`Horizontal overflow detected at ${vp.w}px`)
  }

  // 3. 测试思维链推演模拟按钮
  await page.setViewportSize({ width: 1280, height: 800 })
  const simBtn = page.locator('button:has-text("模拟完整思维链推演")')
  await simBtn.click()
  await page.waitForTimeout(600)

  const isRunning = await page.locator('button:has-text("推理推演进行中...")').count()
  console.log(`[Interaction] Pipeline simulation started: ${isRunning > 0 ? 'PASS' : 'FAIL'}`)
  if (isRunning === 0) throw new Error('Pipeline trace simulation failed to trigger')

  // 4. 检查 Stamp
  const stampText = await page.locator('text=slop test: 58/58 ✓').count()
  console.log(`[Stamp] Found 58/58 stamp: ${stampText > 0 ? 'PASS' : 'FAIL'}`)
  if (stampText === 0) throw new Error('Missing Hallmark Stamp with 58/58 slop test mark')

  // 5. 检查控制台报错
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors)
    throw new Error(`Found ${consoleErrors.length} console error(s)`)
  }

  console.log('✅ LumenPage Audit PASSED perfectly with 0 issues!')
  await browser.close()
}

runAudit().catch((err) => {
  console.error('❌ Audit Failed:', err)
  process.exit(1)
})
