import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/** 字符集抽样：拉丁扩展 + 越南语变音 + 数字标点。整表三千五百，这里列一部分。 */
const GLYPHS =
  'AÀÁÂÃÄÅĀĂĄÆÇĆČĐĎÈÉÊËĒĖĘĚĞÎÏĨĪĮİŁÑŃŇŌÕÖŐŒØÙÚÛÜŮŰŲÝŸŹŻŽ' +
  'àáâãäåāăąæçćčđďèéêëēėęěğĩīįłñńňōõöőøůűųÿýžżš' +
  'ƠƯẠẦẬẮẰẴẸẾỒỐỘỠỪỨỮỴơưạầậắằẵẹếềểễệỉịọỏốồộớờủứừửữựỳỵỷỹđ' +
  'Đ0123456789.,;:!?¡¿\'"«»()[]{}-–—_…&@§'

const STOPS = [100, 300, 500, 700, 900]

const LADDER = [
  { px: 64, name: '展示', long: 'Pudding 布丁体 64pt', short: '布丁体' },
  { px: 40, name: '标题', long: 'Pudding 布丁体 40pt', short: '布丁体 40' },
  { px: 28, name: '小标题', long: 'Alefbefonstiv 布丁体 28pt', short: '布丁体 28' },
  {
    px: 20,
    name: '正文',
    long: 'Alefbefonstiv 布丁体 · 0123456789',
    short: '布丁体 0123',
  },
]

/**
 * 可变字体 Hum 主题。
 * 装置：字重与圆头半径联动轴、实时试字胶囊台。
 */
export function HumPage({ page }: { page: ThemePage }) {
  const [w, setW] = useState(600)
  const [userText, setUserText] = useState('Pudding Jelly 布丁体')
  const round = 2 + ((w - 100) / 800) * 28

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 首屏 */}
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="meta font-mono font-bold text-accent-line">
              {page.discipline} · VARIABLE TYPE FOUNDRY
            </div>
            <h1
              className="display mt-3 text-ink font-bold"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                lineHeight: 1.05,
                fontVariationSettings: `"wght" ${w}`,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              Pudding
            </h1>
            <p
              className="display mt-3 text-ink font-semibold"
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                lineHeight: 1.25,
                fontVariationSettings: `"wght" ${w}`,
              }}
            >
              布丁体，一轴到底
            </p>
            <p
              className="mt-5 max-w-[46ch] text-md text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
          </div>

          <div className="lg:col-span-5 rounded-lg border border-rule bg-paper/60 p-6">
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="meta font-mono font-bold text-ink">WEIGHT AXIS</span>
                <span className="font-mono text-sm font-bold text-accent-line">{w}</span>
              </div>
              <input
                type="range"
                min={100}
                max={900}
                step={10}
                value={w}
                onChange={(e) => setW(Number(e.target.value))}
                className="mt-3 w-full cursor-pointer min-h-[44px]"
                aria-label="调整字重"
              />
            </label>
            <div className="mt-3 flex gap-2">
              {STOPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setW(s)}
                  aria-pressed={w === s}
                  className="btn flex-1 min-h-[36px] px-2 py-1 font-mono text-xs font-bold transition-all"
                  style={{
                    backgroundColor:
                      w === s ? 'var(--hm-cta-bg)' : 'transparent',
                    color: w === s ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
                    borderColor: w === s ? 'var(--hm-cta-bg)' : 'var(--hm-rule)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-rule pt-4">
              <div className="flex items-center justify-between font-mono text-xs text-muted">
                <span>动态圆角半径</span>
                <span className="font-bold text-ink">{round.toFixed(1)}px</span>
              </div>
              <div className="mt-3 flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="block h-10 flex-1 transition-all duration-150"
                    style={{
                      borderRadius: `${round}px`,
                      backgroundColor: 'var(--hm-accent)',
                      border: 'var(--hm-rule-card) solid var(--hm-accent-line)',
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-muted font-mono" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                笔画端点随字重同步圆化：极轻时接近直角，900 极重时形似饱满胶囊。
              </p>
            </div>
          </div>
        </div>

        {/* 核心互动装置：自由试字台 */}
        <div className="mt-14 rounded-lg border border-rule bg-paper/50 p-6">
          <div className="flex items-center justify-between border-b border-rule pb-3">
            <span className="meta font-mono font-bold text-accent-line">LIVE TYPE TESTER</span>
            <span className="font-mono text-xs text-muted">可自由输入编辑试字</span>
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="w-full border-none bg-transparent p-0 text-ink focus:outline-none"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                lineHeight: 1.15,
                fontVariationSettings: `"wght" ${w}`,
              }}
              aria-label="输入试字文本"
            />
          </div>
        </div>

        {/* 字号阶梯 */}
        <div className="mt-16">
          <div className="border-b-2 border-ink pb-2">
            <span className="meta font-mono font-bold text-ink">TYPE SIZE LADDER · 阶梯对照</span>
          </div>
          {LADDER.map((s) => (
            <div
              key={s.px}
              className="py-4"
              style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
            >
              <span className="meta block font-mono text-muted">
                <span className="sm:hidden">{s.name} ({s.px}px)</span>
                <span className="hidden sm:inline">{s.px}px / 轴位 {w}</span>
              </span>
              <span
                className="display mt-1 block text-ink"
                style={{
                  fontSize: `${s.px / 16}rem`,
                  lineHeight: 'var(--lh-tight)',
                  fontVariationSettings: `"wght" ${w}`,
                  letterSpacing: 'var(--hm-tracking-display)',
                  overflowWrap: 'break-word',
                }}
              >
                <span className="sm:hidden">{s.short}</span>
                <span className="hidden sm:inline">{s.long}</span>
              </span>
            </div>
          ))}
        </div>

        {/* 字符集 */}
        <div className="mt-16">
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
            style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
          >
            <span className="meta font-mono font-bold text-ink">CHARACTER GLYPHS · 字符集</span>
            <span className="meta font-mono text-muted">
              3,500 字符 · 全拉丁扩展 · 完整覆盖越南语
            </span>
          </div>
          <div
            className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1"
          >
            {GLYPHS.split('').map((g, i) => (
              <span
                key={`${g}-${i}`}
                className="flex aspect-square items-center justify-center font-mono text-xs text-ink-2 rounded hover:bg-ink/5"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* 样张 */}
        <div className="mt-16">
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
            style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
          >
            <span className="meta font-mono font-bold text-ink">EDITORIAL SPECIMEN · 样张</span>
            <span className="meta font-mono text-muted">实时联动当前字重轴</span>
          </div>
          <p
            className="display mt-6 text-ink"
            style={{
              fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
              lineHeight: 1.7,
              maxWidth: '38em',
              fontVariationSettings: `"wght" ${w}`,
            }}
          >
            布丁体是为屏幕排版量身定制的无衬线可变字体。笔画端点具备自适应圆润张力，半径跟着字重紧密联动：细排轻巧透气，粗排软糯饱满。置于长文阅读场景，字腔开度宽舒，标点呼吸感从容。
          </p>
        </div>

        {/* 规格 */}
        <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {(page.items ?? []).map((it) => (
            <div
              key={it.v}
              className="p-5 transition-all duration-200"
              style={{
                backgroundColor: 'var(--hm-paper-2)',
                borderRadius: `${round}px`,
                border: 'var(--hm-rule-card) solid var(--hm-rule)',
              }}
            >
              <div className="meta font-mono text-muted">{it.k}</div>
              <div
                className="display mt-1.5 text-lg font-bold text-ink"
                style={{ fontVariationSettings: `"wght" ${w}` }}
              >
                {it.v}
              </div>
              <div className="mt-1.5 text-xs text-muted">{it.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-rule pt-8">
          <Cta label={page.cta} done="已打包 WOFF2 / TTF 授权" />
          <span className="text-sm text-muted">
            个人与开源项目商用完全免费，团队授权永久买断，不限制网页月访问量。
          </span>
        </div>
      </div>
    </main>
  )
}
