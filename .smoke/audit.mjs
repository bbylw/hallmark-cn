// 逐页视觉体检。verify.mjs 查的是「合规」（对比度、溢出、图片加载），
// 这里查的是「看起来不对」：欠采样、裁切失真、塌陷、截断、网格挤爆、
// 触控目标过小、行长过长、字号过小、SVG 拉伸、区块重叠。
//
// 用法：node .smoke/audit.mjs [路由...]   默认全部 24 条
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://127.0.0.1:8199'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const THEMES = [
  'grid', 'specimen', 'midnight', 'brutal', 'garden', 'atelier', 'newsprint',
  'terminal', 'manifesto', 'almanac', 'sport', 'studio', 'riso', 'bloom',
  'coral', 'cobalt', 'aurora', 'editorial', 'carnival', 'lumen', 'hum',
]
const ROUTES =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ['/', '/about', '/custom', ...THEMES.map((t) => `/themes/${t}`)]

const browser = await chromium.launch({ executablePath: CHROME })
let total = 0

/* 中间断点必须测。之前只测 1440 和 375，而 640–1023 是另一套列数，
   缺格、挤爆都只在这个区间出现。可用 WIDTHS=900x900 单跑。 */
const PAIRS = (process.env.WIDTHS ?? '1440x900,1000x900,375x812')
  .split(',')
  .map((s) => s.split('x').map(Number))

for (const [w, h] of PAIRS) {
  console.log(`\n══════ ${w}×${h} ══════`)
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  let errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 90))
  })
  page.on('pageerror', (e) => errors.push('JS: ' + String(e).slice(0, 90)))
  for (const route of ROUTES) {
    errors = []
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      const H = document.body.scrollHeight
      for (let y = 0; y < H; y += 500) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 40))
      }
      window.scrollTo(0, 0)
    })
    // 等懒加载的图真的下完，否则会把「还没轮到加载」误判成「加载失败」
    await page
      .evaluate(
        () =>
          Promise.all(
            [...document.querySelectorAll('img')].map((i) =>
              i.complete
                ? null
                : new Promise((r) => {
                    i.addEventListener('load', r, { once: true })
                    i.addEventListener('error', r, { once: true })
                  }),
            ),
          ),
      )
      .catch(() => {})
    await page.waitForTimeout(600)

    const issues = await page.evaluate(() => {
      const out = []
      const label = (el) => {
        const cls =
          typeof el.className === 'string'
            ? el.className.split(/\s+/).slice(0, 2).join('.')
            : ''
        return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`
      }
      const hidden = (el) => {
        const cls = el.className?.toString() ?? ''
        if (cls.includes('sr-only') || cls.includes('skip-link')) return true
        // 全站纸纹叠加层，纯装饰
        if (cls.includes('paper-grain') || cls.includes('scroll-rail')) return true
        // 作者标了 aria-hidden 且没有文字 = 自己声明的装饰
        if (el.getAttribute('aria-hidden') === 'true' && !el.textContent.trim())
          return true
        const cs = getComputedStyle(el)
        return (
          cs.display === 'none' ||
          cs.visibility === 'hidden' ||
          cs.clipPath === 'inset(50%)'
        )
      }
      const ownText = (el) =>
        Array.from(el.childNodes)
          .filter((n) => n.nodeType === 3 && n.nodeValue.trim())
          .map((n) => n.nodeValue.trim())
          .join('')

      for (const el of document.querySelectorAll('body *')) {
        if (hidden(el)) continue
        const cs = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue

        // 图片：被拉大 / 被极端裁切 / 没有尺寸属性
        if (el.tagName === 'IMG' && el.naturalWidth > 0) {
          const scale = r.width / el.naturalWidth
          if (scale > 1.15)
            out.push(
              `欠采样 ${label(el)} 显示 ${Math.round(r.width)}px / 原图 ${el.naturalWidth}px (×${scale.toFixed(2)})`,
            )
          const srcAR = el.naturalWidth / el.naturalHeight
          const boxAR = r.width / r.height
          const crop = Math.max(srcAR / boxAR, boxAR / srcAR)
          if (crop > 1.7)
            out.push(
              `裁切失真 ${label(el)} 源 ${srcAR.toFixed(2)}:1 → 框 ${boxAR.toFixed(2)}:1 (×${crop.toFixed(2)})`,
            )
          if (!el.getAttribute('width') || !el.getAttribute('height'))
            out.push(`缺尺寸属性（会跳版） ${label(el)}`)
        }

        // 塌陷
        const t = ownText(el)
        if (t && r.height < 6)
          out.push(`塌陷 ${label(el)} ${Math.round(r.width)}×${Math.round(r.height)} 「${t.slice(0, 14)}」`)

        // 内容被截断：包括带 truncate 类的（那是最容易悄悄丢字的地方）
        // 可以横向滚动的容器（代码块）没有丢内容，不算截断
        const scrollable = ['auto', 'scroll'].includes(cs.overflowX)
        if (
          t.length >= 4 &&
          !scrollable &&
          el.scrollWidth > el.clientWidth + 2 &&
          r.width > 0
        ) {
          const cut = el.scrollWidth - el.clientWidth
          out.push(
            `截断 ${label(el)} 少 ${cut}px 「${t.slice(0, 16)}」`,
          )
        }

        // 行长：中文按 1em 计
        if (el.tagName === 'P' && t.length > 24 && r.width > 0) {
          const chars = r.width / parseFloat(cs.fontSize)
          if (chars > 46)
            out.push(`行长过长 ${label(el)} 约 ${Math.round(chars)} 字/行`)
        }

        // 字号过小
        if (t.length >= 2 && parseFloat(cs.fontSize) < 11)
          out.push(
            `字号 ${parseFloat(cs.fontSize).toFixed(1)}px ${label(el)} 「${t.slice(0, 12)}」`,
          )

        // 触控目标
        if (
          ['A', 'BUTTON', 'INPUT'].includes(el.tagName) &&
          r.height > 0 &&
          r.height < 36 &&
          window.innerWidth < 500
        ) {
          // 有伪元素把命中区往外撑开的，按实际命中区算
          let extra = 0
          try {
            const af = getComputedStyle(el, '::after')
            if (af.content && af.content !== 'none' && af.position === 'absolute') {
              const top = parseFloat(af.top)
              const bottom = parseFloat(af.bottom)
              if (top < 0) extra += -top
              if (bottom < 0) extra += -bottom
            }
          } catch {
            /* 伪元素读不到就不算外扩 */
          }
          if (r.height + extra < 36)
            out.push(
              `触控目标 ${Math.round(r.height + extra)}px ${label(el)} 「${(el.textContent || '').trim().slice(0, 12)}」`,
            )
        }

        // SVG 被非等比拉伸（圆会变椭圆）
        if (
          el.tagName === 'SVG' &&
          el.getAttribute('preserveAspectRatio') === 'none' &&
          el.querySelector('circle')
        )
          out.push(`SVG 非等比拉伸，圆会变椭圆 ${label(el)}`)
      }

      // 网格缺格：最后一行没排满，右下角空出一格。
      // 空容器也是「内容」，缺格会让整块看起来像漏了东西。
      for (const g of document.querySelectorAll('*')) {
        const cs = getComputedStyle(g)
        if (cs.display !== 'grid' || hidden(g)) continue
        const cols = cs.gridTemplateColumns.trim().split(/\s+/).length
        if (cols < 2) continue
        // 字形表、标签云这类，末行短是刻意的，页面自己声明
        if (g.hasAttribute('data-ragged')) continue
        const kids = [...g.children].filter((c) => {
          const r = c.getBoundingClientRect()
          return r.width > 0 && r.height > 0
        })
        if (kids.length < 2) continue
        // 有跨列的就不判，算不准
        if (kids.some((c) => getComputedStyle(c).gridColumnEnd.includes('span')))
          continue
        const miss = (cols - (kids.length % cols)) % cols
        if (miss > 0)
          out.push(
            `网格缺格 ${label(g)} ${kids.length} 项 / ${cols} 列，末行空 ${miss} 格`,
          )
      }

      // 网格轨道挤爆：子元素右边界超出网格内容盒
      for (const g of document.querySelectorAll('*')) {
        const cs = getComputedStyle(g)
        if (cs.display !== 'grid' || hidden(g)) continue
        const gr = g.getBoundingClientRect()
        if (gr.width < 40) continue
        for (const c of g.children) {
          const cr = c.getBoundingClientRect()
          if (cr.width === 0) continue
          if (cr.right > gr.right + 2 || cr.left < gr.left - 2)
            out.push(
              `网格挤爆 ${label(g)} 子项 ${label(c)} 超出 ${Math.round(Math.max(cr.right - gr.right, gr.left - cr.left))}px`,
            )
        }
      }

      // 区块重叠
      const blocks = [
        ...document.querySelectorAll('main > *, main section, main figure'),
      ]
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          if (
            blocks[i].contains(blocks[j]) ||
            blocks[j].contains(blocks[i])
          )
            continue
          const a = blocks[i].getBoundingClientRect()
          const b = blocks[j].getBoundingClientRect()
          if (a.width < 40 || b.width < 40) continue
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
          if (ox > 4 && oy > 4)
            out.push(
              `区块重叠 ${label(blocks[i])} × ${label(blocks[j])} ${Math.round(ox)}×${Math.round(oy)}px`,
            )
        }
      }

      // 文字压文字：只比最内层的文字盒，排除祖先与固定定位（导航会压住内容）
      const leaves = []
      for (const el of document.querySelectorAll('body *')) {
        if (hidden(el)) continue
        // aria-hidden 的文字是作者声明的图形（例如套印错位的两层 OFF），
        // 叠在一起是设计，不是压字
        if (el.closest('[aria-hidden="true"]')) continue
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed' || cs.position === 'sticky') continue
        const t = ownText(el)
        if (!t) continue
        // 行内元素换行时，getBoundingClientRect 给的是跨行并集矩形，
        // 不能用来判重叠；getClientRects 才是逐行盒，按行盒两两求交。
        const rects = [...el.getClientRects()].filter(
          (r) => r.width >= 8 && r.height >= 8,
        )
        if (!rects.length) continue
        leaves.push({ el, rects, t })
      }
      for (let i = 0; i < leaves.length; i++) {
        for (let j = i + 1; j < leaves.length; j++) {
          const A = leaves[i]
          const B = leaves[j]
          if (A.el.contains(B.el) || B.el.contains(A.el)) continue
          let worst = null
          for (const a of A.rects) {
            for (const b of B.rects) {
              const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
              const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
              if (ox < 6 || oy < 6) continue
              const ratio =
                (ox * oy) / Math.min(a.width * a.height, b.width * b.height)
              if (ratio >= 0.22 && (!worst || ratio > worst.ratio))
                worst = { ox, oy, ratio }
            }
          }
          if (worst)
            out.push(
              `文字压文字 ${Math.round(worst.ox)}×${Math.round(worst.oy)}px 「${A.t.slice(0, 10)}」×「${B.t.slice(0, 10)}」`,
            )
        }
      }

      // 行压行：行高比字号还小，且真的排到了两行以上时，中文字形会互相压住。
      // 单行用紧行高是合法的，所以必须要求客户端矩形 >= 2 才报。
      for (const el of document.querySelectorAll('body *')) {
        if (hidden(el)) continue
        const t = el.textContent.trim()
        if (t.length < 2) continue
        const cs = getComputedStyle(el)
        const fs = parseFloat(cs.fontSize)
        const lh = parseFloat(cs.lineHeight)
        if (isNaN(fs) || isNaN(lh) || fs < 12) continue
        // 按 top 去重数「真的排了几行」，块级元素的 getClientRects 数不出行数
        const range = document.createRange()
        range.selectNodeContents(el)
        const tops = new Set(
          [...range.getClientRects()]
            .filter((r) => r.height > 4 && r.width > 2)
            .map((r) => Math.round(r.top / 4)),
        )
        if (tops.size < 2) continue
        if (lh < fs * 0.95)
          out.push(
            `行高压字形 行高 ${(lh / fs).toFixed(2)}em · ${tops.size}行 ${label(el)} 「${t.slice(0, 14)}」`,
          )
      }

      // 大块空白：面积不小、没文字、也没有图，通常是漏图或塌了的卡片
      const empties = []
      for (const el of document.querySelectorAll('body *')) {
        if (hidden(el)) continue
        if (/^(IMG|SVG|CANVAS|VIDEO|PICTURE|IFRAME|INPUT)$/.test(el.tagName))
          continue
        const r = el.getBoundingClientRect()
        if (r.width < 90 || r.height < 90) continue
        const area = r.width * r.height
        if (area < 24000) continue
        if (el.textContent.trim()) continue
        // 有可访问名的不算空白
        if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'))
          continue
        if (el.querySelector('img,svg,canvas,video,picture,iframe')) continue
        // 用渐变画出来的图形也算有内容（唱片那种）
        const bg = getComputedStyle(el).backgroundImage
        if (bg && bg !== 'none') continue
        if (
          [...el.querySelectorAll('*')].some((x) => {
            const b = getComputedStyle(x).backgroundImage
            return b && b !== 'none'
          })
        )
          continue
        empties.push({ el, area, r })
      }
      for (const e of empties.sort((a, b) => b.area - a.area).slice(0, 3))
        out.push(
          `大块无内容 ${label(e.el)} ${Math.round(e.r.width)}×${Math.round(e.r.height)}（确认是装饰还是漏了内容）`,
        )

      // 图片没加载出来
      for (const el of document.querySelectorAll('img')) {
        if (hidden(el)) continue
        const r = el.getBoundingClientRect()
        if (r.width < 8) continue
        if (!el.complete || el.naturalWidth === 0)
          out.push(`图片未加载 ${label(el)} ${(el.currentSrc || el.src).slice(-48)}`)
      }

      return [...new Set(out)].slice(0, 24)
    })

    for (const e of new Set(errors)) issues.unshift('控制台报错 ' + e)

    total += issues.length
    if (issues.length) {
      console.log(`\n${route}`)
      for (const i of issues) console.log('  · ' + i)
    }
  }
  await page.close()
}

await browser.close()
console.log(`\n合计 ${total} 条。`)
