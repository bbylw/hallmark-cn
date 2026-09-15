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

/**
 * 字号阶梯。字号越大样张越短，这是字体样张的常规做法：
 * 大字号下再排满一整行就会被容器切掉，而样张被切掉就等于没排。
 * 长度按最窄的 280px 内容宽算过：中文 1em、拉丁 0.55em。
 */
const LADDER = [
  { px: 64, name: '显示', long: 'Alefbefonstiv 布丁体', short: '布丁体' },
  { px: 40, name: '标题', long: 'Alefbefonstiv 布丁体', short: '布丁体 Pud' },
  { px: 28, name: '小标题', long: 'Alefbefonstiv 布丁体', short: '布丁体 Pudding' },
  {
    px: 20,
    name: '正文',
    long: 'Alefbefonstiv 布丁体 · 0123456789',
    short: '布丁体 Pudding 012',
  },
]

/**
 * 可变字体。装置：一根轴，字重与圆头半径一起走。
 * 下面那排胶囊是同一根轴在形状上的样子，不是装饰。
 */
export function HumPage({ page }: { page: ThemePage }) {
  const [w, setW] = useState(600)
  const round = 2 + ((w - 100) / 800) * 30

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 首屏 */}
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="meta text-muted">{page.discipline}</span>
            <h1
              className="display mt-3 text-ink"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                lineHeight: 1,
                fontVariationSettings: `"wght" ${w}`,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              Pudding
            </h1>
            <p
              className="display mt-4 text-ink"
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                lineHeight: 1.3,
                fontVariationSettings: `"wght" ${w}`,
              }}
            >
              布丁体，一轴到底
            </p>
            <p
              className="mt-6 max-w-[46ch] text-md text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
          </div>

          <div className="lg:col-span-5">
            <label className="block">
              <span className="meta text-muted">weight {w}</span>
              <input
                type="range"
                min={100}
                max={900}
                step={10}
                value={w}
                onChange={(e) => setW(Number(e.target.value))}
                className="mt-3 w-full"
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
                  className="btn flex-1 px-2 py-1.5 text-xs"
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

            <div className="mt-8">
              <div className="meta text-muted">
                圆头半径 {round.toFixed(1)}px
              </div>
              <div className="mt-3 flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="block h-10 flex-1"
                    style={{
                      borderRadius: `${round}px`,
                      backgroundColor: 'var(--hm-accent)',
                      border: 'var(--hm-rule-card) solid var(--hm-accent-line)',
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">
                笔画端点是圆的，半径跟着字重走：轻的时候几乎方，重的时候像胶囊。
              </p>
            </div>
          </div>
        </div>

        {/* 字号阶梯 */}
        <div className="mt-20">
          {LADDER.map((s) => (
            <div
              key={s.px}
              className="py-5"
              style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
            >
              <span className="meta block text-muted">
                <span className="sm:hidden">{s.name}</span>
                <span className="hidden sm:inline">{s.px}px / {w}</span>
              </span>
              <span
                className="display mt-2 block text-ink"
                style={{
                  fontSize: `${s.px / 16}rem`,
                  lineHeight: 'var(--lh-tight)',
                  fontVariationSettings: `"wght" ${w}`,
                  letterSpacing: 'var(--hm-tracking-display)', whiteSpace: 'nowrap',
                }}
              >
                <span className="sm:hidden">{s.short}</span>
                <span className="hidden sm:inline">{s.long}</span>
              </span>
            </div>
          ))}
        </div>

        {/* 字符集：字体样本不看字形，等于鞋店不摆鞋 */}
        <div className="mt-16">
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
            style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
          >
            <span className="meta text-ink">字符集</span>
            <span className="meta text-muted">
              三千五百 · 拉丁扩展 · 含越南语
            </span>
          </div>
          {/* 无框：带边框的字形格在 auto-fill 下末行会空出一大片，
              看起来像坏了。去掉格线，字形自己排。 */}
          <div
            data-ragged=""
            className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-x-1 gap-y-2"
          >
            {GLYPHS.split('').map((g, i) => (
              <span
                key={`${g}-${i}`}
                className="flex aspect-square items-center justify-center font-mono text-sm text-ink-2"
              >
                {g}
              </span>
            ))}
          </div>
          <div
            className="mt-4"
            style={{ borderBottom: '1px solid var(--hm-rule)' }}
          />
          <p className="mt-3 text-xs text-muted">
            只列了一部分。带变音符号的都画得出来，越南语整套在。
          </p>
        </div>

        {/* 样张：跟着上面那根轴，整页才是一轴到底 */}
        <div className="mt-16">
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
            style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
          >
            <span className="meta text-ink">样张</span>
            <span className="meta text-muted">跟着上面那根轴</span>
          </div>
          <p
            className="display mt-6 text-ink"
            style={{
              fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)',
              lineHeight: 1.7,
              maxWidth: '34em',
              fontVariationSettings: `"wght" ${w}`,
            }}
          >
            布丁体是为屏幕排版做的字体。笔画端点是圆的，半径跟着字重走：轻的时候几乎方，重的时候像胶囊。放在长文里读，字腔开得够大，标点也不挤。
          </p>
        </div>

        {/* 规格 */}
        <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {(page.items ?? []).map((it) => (
            <div
              key={it.v}
              className="p-5"
              style={{
                backgroundColor: 'var(--hm-paper-2)',
                borderRadius: `${round}px`,
                border: 'var(--hm-rule-card) solid var(--hm-rule)',
              }}
            >
              <div className="meta text-muted">{it.k}</div>
              <div
                className="display mt-1.5 text-lg text-ink"
                style={{ fontVariationSettings: `"wght" ${w}` }}
              >
                {it.v}
              </div>
              <div className="mt-1.5 text-xs text-muted">{it.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Cta label={page.cta} done="下载开始了" />
          <span className="text-sm text-muted">
            个人商用免费，团队授权另算，不改字形。
          </span>
        </div>
      </div>
    </main>
  )
}
