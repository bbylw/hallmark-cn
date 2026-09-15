import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const ROUTES = [
  ['/', '首页'],
  ['/about', '关于'],
  ['/custom', 'Custom'],
  ['/themes/almanac', 'almanac'],
  ['/themes/atelier', 'atelier'],
  ['/themes/aurora', 'aurora'],
  ['/themes/bloom', 'bloom'],
  ['/themes/brutal', 'brutal'],
  ['/themes/carnival', 'carnival'],
  ['/themes/cobalt', 'cobalt'],
  ['/themes/coral', 'coral'],
  ['/themes/editorial', 'editorial'],
  ['/themes/garden', 'garden'],
  ['/themes/grid', 'grid'],
  ['/themes/hum', 'hum'],
  ['/themes/lumen', 'lumen'],
  ['/themes/manifesto', 'manifesto'],
  ['/themes/midnight', 'midnight'],
  ['/themes/newsprint', 'newsprint'],
  ['/themes/riso', 'riso'],
  ['/themes/specimen', 'specimen'],
  ['/themes/sport', 'sport'],
  ['/themes/studio', 'studio'],
  ['/themes/terminal', 'terminal'],
]

const TW = 600
const TH = 375
const COLS = 3
const PER_SHEET = 6
const PAD = 16
const LABEL = 28

mkdirSync('.smoke/shots', { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})

const tiles = []
for (const [route, name] of ROUTES) {
  await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  const buf = await page.screenshot()
  const canvas = sharp({
    create: {
      width: TW + PAD * 2,
      height: TH + LABEL + PAD * 2,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
  const shot = await sharp(buf).resize(TW, TH, { fit: 'cover', position: 'top' }).toBuffer()
  const label = Buffer.from(
    `<svg width="${TW}" height="${LABEL}"><text x="0" y="19" font-family="monospace" font-size="17" fill="#111">${name}  <tspan fill="#888">${route}</tspan></text></svg>`,
  )
  tiles.push(
    await canvas
      .composite([
        { input: shot, left: PAD, top: PAD + LABEL },
        { input: label, left: PAD, top: PAD },
      ])
      .png()
      .toBuffer(),
  )
  console.log(`拍完 ${name}`)
}
await browser.close()

const TW2 = TW + PAD * 2
const TH2 = TH + LABEL + PAD * 2
for (let s = 0; s < Math.ceil(tiles.length / PER_SHEET); s++) {
  const group = tiles.slice(s * PER_SHEET, (s + 1) * PER_SHEET)
  const rows = Math.ceil(group.length / COLS)
  const sheet = sharp({
    create: {
      width: TW2 * COLS,
      height: TH2 * rows,
      channels: 3,
      background: { r: 246, g: 246, b: 244 },
    },
  })
  await sheet
    .composite(
      group.map((t, i) => ({
        input: t,
        left: (i % COLS) * TW2,
        top: Math.floor(i / COLS) * TH2,
      })),
    )
    .png()
    .toFile(`.smoke/shots/sheet-${s + 1}.png`)
  console.log(`输出 sheet-${s + 1}.png`)
}
