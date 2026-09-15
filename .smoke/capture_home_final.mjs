import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'https://hallmark-cn.localhost'
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--ignore-certificate-errors', '--no-sandbox'],
})

const artifactDir = 'C:\\Users\\bbylw\\.gemini\\antigravity-ide\\brain\\3994b09e-c326-44f7-823e-11e8fba8eb26'

// 1. Desktop (1440x900) top
const desktopContext = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width: 1440, height: 900 },
})
const desktopPage = await desktopContext.newPage()
await desktopPage.goto(BASE, { waitUntil: 'networkidle' })
await desktopPage.waitForTimeout(500)
await desktopPage.screenshot({
  path: `${artifactDir}/homepage_desktop_restored.png`,
  fullPage: false,
})

// 2. Mobile (375x812)
const mobileContext = await browser.newContext({
  ignoreHTTPSErrors: true,
  viewport: { width: 375, height: 812 },
})
const mobilePage = await mobileContext.newPage()
await mobilePage.goto(BASE, { waitUntil: 'networkidle' })
await mobilePage.waitForTimeout(500)
await mobilePage.screenshot({
  path: `${artifactDir}/homepage_mobile_restored.png`,
  fullPage: false,
})

await browser.close()
console.log('Screenshots captured successfully.')
