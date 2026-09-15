import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

// 十二个采集点。最慢的正好是 p99 那个数，和上面的 40ms 对得上。
const POINTS = [
  { c: '阿姆斯特丹', v: 26 },
  { c: '法兰克福', v: 29 },
  { c: '迪拜', v: 30 },
  { c: '伦敦', v: 31 },
  { c: '东京', v: 32 },
  { c: '巴黎', v: 33 },
  { c: '新加坡', v: 34 },
  { c: '孟买', v: 35 },
  { c: '悉尼', v: 36 },
  { c: '圣保罗', v: 37 },
  { c: '约翰内斯堡', v: 38 },
  { c: '弗吉尼亚', v: 40 },
]

const MAX = 40
const NOTES = [
  ['全量写入', '不做头部采样，冷热分层落盘'],
  ['列式存储', '十亿行内秒级返回'],
  ['OTLP 原生', '不用换 SDK，不用加代理'],
  ['保留策略', '热七天，冷十三个月'],
]

/**
 * 可观测性。装置：十二个有名字的采集点，横向排开。
 * 横向是因为它们有名字 —— 竖着排中文名字一定会被切。
 * 条形不垫背景轨道，长度本身就是值。
 */
export function MidnightPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(POINTS.length - 1)
  const cur = POINTS[pick]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <span className="meta text-muted">{page.brand}</span>
          <span className="meta text-muted">十二个采集点 · 取最慢的那个</span>
        </div>

        <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-4">
          <h1
            className="display text-ink"
            style={{
              fontSize: 'clamp(3.5rem, 12vw, 8.5rem)',
              lineHeight: 0.88,
              fontWeight: 300,
            }}
          >
            {page.stat?.value}
          </h1>
          <div className="pb-2">
            <div className="text-md text-ink-2">{page.stat?.k}</div>
            <div className="meta mt-1 text-accent-line" aria-live="polite">
              {cur.c} {cur.v}ms
            </div>
          </div>
        </div>

        {/* 横向条形表 */}
        <div className="mt-12">
          {/* 刻度：左右占位必须和下面每一行一致，否则刻度不在条形上方 */}
          <div className="flex items-baseline gap-3">
            <span className="w-20 shrink-0 sm:w-28" />
            <span className="relative h-4 flex-1">
              {[0, 20, 40].map((t, i) => (
                <span
                  key={t}
                  className="absolute -translate-x-1/2 font-mono text-[11px] text-muted"
                  style={{
                    left: `${(t / MAX) * 100}%`,
                    transform:
                      i === 0
                        ? 'translateX(0)'
                        : i === 2
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)',
                  }}
                >
                  {t}
                </span>
              ))}
            </span>
            <span className="w-10 shrink-0 sm:w-12" />
          </div>

          <ul className="mt-1">
            {POINTS.map((p, i) => {
              const on = pick === i
              return (
                <li key={p.c}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => setPick(i)}
                    onFocus={() => setPick(i)}
                    onClick={() => setPick(i)}
                    className="flex w-full items-center gap-3 py-3 text-left transition-colors duration-200 sm:py-2"
                    style={{
                      backgroundColor: on ? 'var(--hm-paper-2)' : undefined,
                      borderRadius: 'var(--hm-radius-input)',
                    }}
                  >
                    <span
                      className="w-20 shrink-0 truncate text-[13px] sm:w-28 sm:text-sm"
                      style={{
                        color: on ? 'var(--hm-ink)' : 'var(--hm-ink-2)',
                      }}
                    >
                      {p.c}
                    </span>
                    <span className="flex h-3 min-w-0 flex-1 items-center">
                      <span
                        className="block h-1.5 transition-all duration-300 ease-out"
                        style={{
                          width: `${(p.v / MAX) * 100}%`,
                          backgroundColor: on
                            ? 'var(--hm-accent)'
                            : 'var(--hm-rule-2)',
                          minWidth: '2px',
                        }}
                      />
                    </span>
                    <span
                      className="w-10 shrink-0 text-right font-mono text-xs transition-colors duration-200 sm:w-12"
                      style={{
                        color: on ? 'var(--hm-ink)' : 'var(--hm-muted)',
                      }}
                    >
                      {p.v}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p
            className="mt-4 text-sm text-muted"
            style={{ maxWidth: '42ch', lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.stat?.note}
          </p>
        </div>

        {/* 标题 / 说明 / 规格 */}
        <div className="mt-24 grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              className="display text-ink"
              style={{
                fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
                lineHeight: 1.1,
              }}
            >
              {page.title}
            </h2>
            <p
              className="mt-5 text-md text-ink-2"
              style={{ maxWidth: '38ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
          </div>

          <div className="lg:col-span-7">
            {NOTES.map(([k, d]) => (
              <div
                key={k}
                className="grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[10rem_1fr]"
                style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
              >
                <span className="text-sm text-ink">{k}</span>
                <span className="text-sm text-muted">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Cta label={page.cta} done="追踪已打开" />
          <span className="text-sm text-muted">
            接一个服务，五分钟内就能看到第一条追踪。
          </span>
        </div>
      </div>
    </main>
  )
}
