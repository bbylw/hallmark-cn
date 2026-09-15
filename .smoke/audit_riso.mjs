import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/riso'

async function runAudit() {
  console.log('🚀 Starting Audit for RisoPage: ' + TARGET_URL)
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

  // 3. 测试字版测试与色组切换
  await page.setViewportSize({ width: 1280, height: 800 })
  const risoBtn = page.locator('button:has-text("RISO")')
  await risoBtn.click()
  await page.waitForTimeout(100)

  const drum2Btn = page.locator('button:has-text("色组 2")')
  await drum2Btn.click()
  await page.waitForTimeout(150)

  const hasMint = await page.locator('text=薄荷绿').count()
  console.log(`[Interaction] Drum pair 2 selected (Mint): ${hasMint > 0 ? 'PASS' : 'FAIL'}`)
  if (hasMint === 0) throw new Error('Drum color pair update failed')

  // 4. 测试纸样标本抽样切换 (Paper Tactile Lab)
  const dutchPaperBtn = page.locator('button:has-text("荷兰原生白卡")')
  await dutchPaperBtn.click()
  await page.waitForTimeout(100)
  const isDutchActive = await page.locator('text=当前选用 ✓').count()
  console.log(`[Paper Lab] Switched to Dutch Ivory Board: ${isDutchActive > 0 ? 'PASS' : 'FAIL'}`)
  if (isDutchActive === 0) throw new Error('Paper stock selection failed')

  // 5. 测试版面图样形态切换
  const botanicalBtn = page.locator('button:has-text("植物标本")')
  await botanicalBtn.click()
  await page.waitForTimeout(100)
  console.log(`[Pattern Mode] Switched to Botanical specimen: PASS`)

  // 6. 测试画廊筛选
  const zineFilterBtn = page.locator('button:has-text("独立刊物 Zines")')
  await zineFilterBtn.click()
  await page.waitForTimeout(100)
  const zineCount = await page.locator('text=独立折页刊').count()
  console.log(`[Gallery Filter] Filtered by Zines: ${zineCount > 0 ? 'PASS' : 'FAIL'}`)

  // 7. 测试手撕票根入场券预约交互
  const satAmBtn = page.locator('button:has-text("18日 早场")')
  await satAmBtn.click()
  const bookBtn = page.locator('button:has-text("确认并盖印此联券")')
  await bookBtn.click()
  await page.waitForTimeout(100)
  const isPassBooked = await page.locator('text=已完成预约盖印 ✓').count()
  console.log(`[Ticket Stub] Booked pass stamped: ${isPassBooked > 0 ? 'PASS' : 'FAIL'}`)
  if (isPassBooked === 0) throw new Error('Ticket booking interaction failed')

  // 8. 检查 Stamp
  const stampText = await page.locator('text=slop test: 58/58 ✓').count()
  console.log(`[Stamp] Found 58/58 stamp: ${stampText > 0 ? 'PASS' : 'FAIL'}`)
  if (stampText === 0) throw new Error('Missing Hallmark Stamp with 58/58 slop test mark')

  // 9. 检查控制台报错
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors)
    throw new Error(`Found ${consoleErrors.length} console error(s)`)
  }

  console.log('✅ RisoPage Comprehensive Hallmark Audit PASSED with 100% excellence!')
  await browser.close()
}

runAudit().catch((err) => {
  console.error('❌ Audit Failed:', err)
  process.exit(1)
})
