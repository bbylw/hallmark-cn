import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGET_URL = 'https://hallmark-cn.localhost/themes/studio'
const ARTIFACT_DIR = 'C:\\Users\\bbylw\\.gemini\\antigravity-ide\\brain\\61efa703-7feb-4aac-823b-4bb5a207180d'

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  // 1. Desktop fullpage screenshot
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('figure')
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)
  const deskPath = path.resolve('.smoke/studio_desktop.png')
  await page.screenshot({ path: deskPath, fullPage: true })
  fs.copyFileSync(deskPath, path.join(ARTIFACT_DIR, 'studio_desktop.png'))
  console.log('Saved studio desktop screenshot')

  // 2. Mobile fullpage screenshot
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('figure')
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)
  const mobPath = path.resolve('.smoke/studio_mobile.png')
  await page.screenshot({ path: mobPath, fullPage: true })
  fs.copyFileSync(mobPath, path.join(ARTIFACT_DIR, 'studio_mobile.png'))
  console.log('Saved studio mobile screenshot')

  await browser.close()
}

capture().catch(err => {
  console.error(err)
  process.exit(1)
})
