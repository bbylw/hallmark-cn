import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/specimen'

async function runAudit() {
  console.log('🚀 Starting Audit for SpecimenPage: ' + TARGET_URL)
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

  // 3. 测试试字台 Type Tester 交互
  await page.setViewportSize({ width: 1280, height: 800 })
  const testInput = page.locator('input[aria-label="自定义试字文本输入框"]')
  await testInput.fill('测试动态字符渲染 12345')
  await page.waitForTimeout(100)
  const val = await testInput.inputValue()
  console.log(`[Interaction] Type Tester value: "${val}"`)
  if (val !== '测试动态字符渲染 12345') throw new Error('Type tester input fill failed')

  // 点击载入千字文按钮
  const loadQianziBtn = page.locator('button:has-text("载入千字文")')
  await loadQianziBtn.click()
  await page.waitForTimeout(100)
  const newText = await testInput.inputValue()
  console.log(`[Interaction] Loaded Qianzi text: "${newText.slice(0, 10)}..."`)
  if (!newText.includes('天地玄黄')) throw new Error('Load preset text failed')

  // 4. 检查 Stamp
  const stampText = await page.locator('text=slop test: 58/58 ✓').count()
  console.log(`[Stamp] Found 58/58 stamp: ${stampText > 0 ? 'PASS' : 'FAIL'}`)
  if (stampText === 0) throw new Error('Missing Hallmark Stamp with 58/58 slop test mark')

  // 5. 检查控制台报错
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors)
    throw new Error(`Found ${consoleErrors.length} console error(s)`)
  }

  console.log('✅ SpecimenPage Audit PASSED perfectly with 0 issues!')
  await browser.close()
}

runAudit().catch((err) => {
  console.error('❌ Audit Failed:', err)
  process.exit(1)
})
