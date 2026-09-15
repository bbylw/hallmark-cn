import { chromium } from 'playwright-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE ?? 'https://hallmark-cn.localhost'

const THEMES = [
  'grid', 'specimen', 'midnight', 'brutal', 'garden', 'atelier', 'newsprint',
  'terminal', 'manifesto', 'almanac', 'sport', 'studio', 'riso', 'bloom',
  'coral', 'cobalt', 'aurora', 'editorial', 'carnival', 'lumen', 'hum',
]

const ROUTES = [
  { path: '/', type: 'index' },
  { path: '/about', type: 'about' },
  { path: '/custom', type: 'custom' },
  ...THEMES.map((t) => ({ path: `/themes/${t}`, type: 'theme', theme: t })),
]

const VIEWPORTS = [
  { name: 'Mobile XS', width: 320, height: 640 },
  { name: 'Mobile Standard', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop Standard', width: 1280, height: 800 },
]

async function runFullSiteAudit() {
  console.log(`🌐 Initiating Full Site Comprehensive Audit on ${BASE}`)
  console.log(`📋 Total routes to verify: ${ROUTES.length}`)

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox'],
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  const summary = []
  let totalFailures = 0

  for (let i = 0; i < ROUTES.length; i++) {
    const route = ROUTES[i]
    const url = BASE + route.path
    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${ROUTES.length}] Testing ${route.path.padEnd(20)} `)

    const consoleErrors = []
    const handleConsole = (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    }
    const handlePageError = (err) => consoleErrors.push(err.message)

    page.on('console', handleConsole)
    page.on('pageerror', handlePageError)

    const routeIssues = []

    try {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForSelector('h1', { timeout: 8000 })

      // 1. 检查语义唯一 <h1>
      const h1Count = await page.locator('h1').count()
      if (h1Count !== 1) {
        routeIssues.push(`h1 count is ${h1Count} (must be exactly 1)`)
      }

      // 2. 检查多视口溢出
      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.waitForTimeout(50)
        const overflow = await page.evaluate(() => {
          const el = document.documentElement
          return el.scrollWidth - el.clientWidth
        })
        if (overflow > 1) {
          routeIssues.push(`overflow ${overflow}px at ${vp.name} (${vp.width}px)`)
        }
      }

      // 3. 检查主题页 58/58 Hallmark 戳记
      if (route.type === 'theme') {
        const stampCount = await page.locator('text=slop test: 58/58 ✓').count()
        if (stampCount === 0) {
          routeIssues.push('missing "slop test: 58/58 ✓" stamp')
        }
      }

      // 4. 检查控制台报错
      if (consoleErrors.length > 0) {
        routeIssues.push(`console errors: ${consoleErrors[0].slice(0, 80)}`)
      }

    } catch (e) {
      routeIssues.push(`exception: ${e.message}`)
    } finally {
      page.off('console', handleConsole)
      page.off('pageerror', handlePageError)
    }

    if (routeIssues.length === 0) {
      console.log('✅ PASS')
      summary.push({ route: route.path, status: 'PASS' })
    } else {
      console.log(`❌ FAIL: ${routeIssues.join('; ')}`)
      summary.push({ route: route.path, status: 'FAIL', issues: routeIssues })
      totalFailures++
    }
  }

  await browser.close()

  console.log('\n═════════════════════════════════════════════')
  console.log(`Audit Finished. Results: ${ROUTES.length - totalFailures}/${ROUTES.length} routes passed.`)
  if (totalFailures > 0) {
    console.log(`❌ Total Failures: ${totalFailures}`)
    process.exit(1)
  } else {
    console.log('🎉 100% OF ALL 24 ROUTES PASSED AUDIT PERFECTLY!')
  }
}

runFullSiteAudit().catch((err) => {
  console.error('Fatal audit error:', err)
  process.exit(1)
})
