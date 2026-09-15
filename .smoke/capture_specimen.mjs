import { chromium } from 'playwright-core'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/specimen'
const ARTIFACTS_DIR = 'C:\\Users\\bbylw\\.gemini\\antigravity-ide\\brain\\61efa703-7feb-4aac-823b-4bb5a207180d'

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  // 1. Desktop capture
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  
  // 载入千字文展示排印张力
  const loadQianziBtn = page.locator('button:has-text("载入千字文")')
  if (await loadQianziBtn.count() > 0) {
    await loadQianziBtn.click()
    await page.waitForTimeout(200)
  }

  const desktopPath = path.join(ARTIFACTS_DIR, 'specimen_desktop.png')
  await page.screenshot({ path: desktopPath, fullPage: true })
  console.log('Saved desktop screenshot to:', desktopPath)

  // 2. Mobile capture
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const loadQianziBtnMobile = page.locator('button:has-text("载入千字文")')
  if (await loadQianziBtnMobile.count() > 0) {
    await loadQianziBtnMobile.click()
    await page.waitForTimeout(200)
  }

  const mobilePath = path.join(ARTIFACTS_DIR, 'specimen_mobile.png')
  await page.screenshot({ path: mobilePath, fullPage: true })
  console.log('Saved mobile screenshot to:', mobilePath)

  await browser.close()
}

capture().catch((e) => {
  console.error(e)
  process.exit(1)
})
