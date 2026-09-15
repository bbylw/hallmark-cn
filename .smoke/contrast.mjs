import fs from 'node:fs'

const theme = process.argv[2] ?? 'brutal'
const src = fs.readFileSync('src/styles/tokens.css', 'utf8')
const start = src.indexOf(`[data-theme="${theme}"]`)
const block = src.slice(start, src.indexOf('}', start) + 1)

const get = (k) => {
  const m = block.match(new RegExp(k.replace(/[-]/g, '\\-') + ':\\s*([^;]+);'))
  return m ? m[1].trim() : null
}

const accent = get('--hm-accent')
const ink = get('--hm-accent-ink')
const paper = get('--hm-paper')

const parse = (v) => {
  if (v.startsWith('#')) {
    const h = v.slice(1)
    const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    return [
      parseInt(f.slice(0, 2), 16) / 255,
      parseInt(f.slice(2, 4), 16) / 255,
      parseInt(f.slice(4, 6), 16) / 255,
    ]
  }
  const m = v.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)/)
  if (!m) return null
  const [l, c, h] = [+m[1] / 100, +m[2], +m[3]]
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const L = l_ ** 3
  const M = m_ ** 3
  const S = s_ ** 3
  let r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
  let g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
  let bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S
  const lin = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)
  return [lin(r), lin(g), lin(bl)]
}

function toRGB([l, c, h]) {
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const L = l_ ** 3
  const M = m_ ** 3
  const S = s_ ** 3
  let r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
  let g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
  let bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S
  const lin = (v) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return [lin(r), lin(g), lin(bl)].map((v) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255),
  )
}

const lum = (c) => {
  const f = (v) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
}
const cr = (a, b) => {
  const x = lum(a)
  const y = lum(b)
  return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2)
}

console.log(`${theme}`)
console.log(`  accent      ${accent}`)
console.log(`  accent-ink  ${ink}`)
console.log(`  红底上的字  对比度 ${cr(toRGB(parse(accent)), toRGB(parse(ink)))}`)
console.log(`  纸底上的强调 对比度 ${cr(toRGB(parse(accent)), toRGB(parse(paper)))}`)
