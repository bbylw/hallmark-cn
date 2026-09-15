import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/custom'

async function runAudit() {
  console.log('🚀 Starting Audit for CustomPage: ' + TARGET_URL)
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
  const h1Text = await page.locator('h1').first().innerText()
  console.log(`[Gate 40] h1 count: ${h1Count}, text: "${h1Text}"`)
  if (h1Count !== 1) throw new Error(`Expected exactly 1 <h1>, got ${h1Count}`)

  // 2. 检查文案中的 58 道关卡
  const pageContent = await page.content()
  if (!pageContent.includes('58')) {
    throw new Error('58 gates text missing from page')
  }
  console.log('[Gate 58] Verified 58 gates text is present')

  // 3. 检查多视口横向溢出 (320px, 375px, 768px, 1280px)
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

  // 4. 测试情绪预设按钮点击与 CSS 变量联动
  await page.setViewportSize({ width: 1280, height: 800 })
  const deepSeaBtn = page.locator('button:has-text("深海荧光")')
  await deepSeaBtn.click()
  await page.waitForTimeout(200)

  const liveAccent = await page.evaluate(() => {
    return document.querySelector('#main')?.closest('div')?.style.getPropertyValue('--hm-accent')
  })
  console.log(`[Interaction] Live --hm-accent after preset click: ${liveAccent}`)
  if (!liveAccent || !liveAccent.includes('215')) {
    throw new Error(`Preset click failed to update --hm-accent with hue 215, got: ${liveAccent}`)
  }

  // 5. 测试复制按钮
  const copyButtons = page.locator('button[aria-label*="复制"]')
  const copyBtnCount = await copyButtons.count()
  console.log(`[Accessibility & Utility] Found ${copyBtnCount} copy buttons`)
  if (copyBtnCount < 5) throw new Error('Expected at least 5 copy buttons on custom page')

  // 6. 检查控制台报错
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors)
    throw new Error(`Found ${consoleErrors.length} console error(s)`)
  }

  console.log('✅ CustomPage Audit PASSED perfectly with 0 issues!')
  await browser.close()
}

runAudit().catch((err) => {
  console.error('❌ Audit Failed:', err)
  process.exit(1)
})
