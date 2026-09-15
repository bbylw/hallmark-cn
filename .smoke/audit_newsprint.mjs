import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/newsprint'

async function runAudit() {
  console.log('🚀 Starting Audit for NewsprintPage: ' + TARGET_URL)
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

  // 3. 测试台账抽屉切换
  await page.setViewportSize({ width: 1280, height: 800 })
  const unfixableBtn = page.locator('button:has-text("修不好 (8)")')
  await unfixableBtn.click()
  await page.waitForTimeout(150)

  const hasUnfixableStory = await page.locator('text=无牌超声波清洗机').count()
  console.log(`[Interaction] Switched to unfixable stories: ${hasUnfixableStory > 0 ? 'PASS' : 'FAIL'}`)
  if (hasUnfixableStory === 0) throw new Error('Unfixable repair story drawer failed to render')

  // 4. 测试现场自诊试验台 (Workbench Diagnostics)
  const chairBtn = page.locator('button:has-text("木椅子结构散架晃动")')
  await chairBtn.click()
  await page.waitForTimeout(150)
  const hasChairDetail = await page.locator('text=硬木薄楔子').count()
  console.log(`[Workbench Diag] Selected chair repair diagnostics: ${hasChairDetail > 0 ? 'PASS' : 'FAIL'}`)
  if (hasChairDetail === 0) throw new Error('Workbench diagnosis interaction failed')

  // 5. 测试工具借用预约 Checkbox
  const toolCheck = page.locator('label:has-text("老式脚踏缝纫机") input[type="checkbox"]')
  await toolCheck.check()
  const isChecked = await toolCheck.isChecked()
  console.log(`[Tool Check] Checked vintage sewing machine: ${isChecked ? 'PASS' : 'FAIL'}`)
  if (!isChecked) throw new Error('Tool reservation checkbox failed')

  // 6. 检查 Stamp
  const stampText = await page.locator('text=slop test: 58/58 ✓').count()
  console.log(`[Stamp] Found 58/58 stamp: ${stampText > 0 ? 'PASS' : 'FAIL'}`)
  if (stampText === 0) throw new Error('Missing Hallmark Stamp with 58/58 slop test mark')

  // 7. 检查控制台报错
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors)
    throw new Error(`Found ${consoleErrors.length} console error(s)`)
  }

  console.log('✅ NewsprintPage Comprehensive Hallmark Audit PASSED with 100% excellence!')
  await browser.close()
}

runAudit().catch((err) => {
  console.error('❌ Audit Failed:', err)
  process.exit(1)
})
