import { chromium } from 'playwright-core'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/grid'
const ARTIFACTS_DIR = 'C:\\Users\\bbylw\\.gemini\\antigravity-ide\\brain\\61efa703-7feb-4aac-823b-4bb5a207180d'

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  })

  // 1. Desktop Fullpage
  const contextDesktop = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true
  })
  const pageDesktop = await contextDesktop.newPage()
  await pageDesktop.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await pageDesktop.waitForSelector('h1')

  // 开启 1mm 套准微错位展示工业质感
  const misregBtn = pageDesktop.locator('button:has-text("模拟 1mm 套准微错位")')
  if (await misregBtn.count() > 0) {
    await misregBtn.click()
    await pageDesktop.waitForTimeout(200)
  }

  // 慢速滚动确保图片与内容完全渲染
  await pageDesktop.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 400) {
      window.scrollTo(0, i)
      await new Promise(r => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await pageDesktop.waitForTimeout(500)

  const desktopPath = path.join(ARTIFACTS_DIR, 'grid_desktop.png')
  await pageDesktop.screenshot({ path: desktopPath, fullPage: true })
  console.log('Saved desktop screenshot:', desktopPath)
  await contextDesktop.close()

  // 2. Mobile Fullpage
  const contextMobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    ignoreHTTPSErrors: true
  })
  const pageMobile = await contextMobile.newPage()
  await pageMobile.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await pageMobile.waitForSelector('h1')

  await pageMobile.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 400) {
      window.scrollTo(0, i)
      await new Promise(r => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await pageMobile.waitForTimeout(500)

  const mobilePath = path.join(ARTIFACTS_DIR, 'grid_mobile.png')
  await pageMobile.screenshot({ path: mobilePath, fullPage: true })
  console.log('Saved mobile screenshot:', mobilePath)
  await contextMobile.close()

  await browser.close()
}

capture().catch(err => {
  console.error(err)
  process.exit(1)
})
