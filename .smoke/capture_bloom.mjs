import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/bloom'

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  
  // Desktop
  const pageDesk = await context.newPage()
  await pageDesk.setViewportSize({ width: 1280, height: 900 })
  await pageDesk.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await pageDesk.waitForSelector('h1')
  await pageDesk.waitForTimeout(300)
  await pageDesk.screenshot({ path: '.smoke/bloom_desktop.png', fullPage: true })
  console.log('Saved .smoke/bloom_desktop.png')

  // Mobile
  const pageMob = await context.newPage()
  await pageMob.setViewportSize({ width: 375, height: 812 })
  await pageMob.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await pageMob.waitForSelector('h1')
  await pageMob.waitForTimeout(300)
  await pageMob.screenshot({ path: '.smoke/bloom_mobile.png', fullPage: true })
  console.log('Saved .smoke/bloom_mobile.png')

  await browser.close()
}

capture().catch(console.error)
