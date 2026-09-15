import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const ROWS = [
  { code: 'FF-014', name: '冬豌豆', min: -18, days: '六十五天' },
  { code: 'FF-023', name: '黑麦（过冬）', min: -25, days: '秋播' },
  { code: 'FF-041', name: '矮生羽衣甘蓝', min: -12, days: '五十天' },
  { code: 'FF-058', name: '红皮洋葱', min: -8, days: '一百一十天' },
  { code: 'FF-073', name: '雪下菠菜', min: -15, days: '四十天' },
  { code: 'FF-089', name: '早春萝卜', min: -6, days: '二十八天' },
  { code: 'FF-102', name: '紫花苜蓿', min: -20, days: '绿肥' },
  { code: 'FF-117', name: '冬小麦（硬红）', min: -22, days: '秋播' },
  { code: 'FF-131', name: '细香葱', min: -30, days: '多年生' },
]

const LOW = -34
const HIGH = 2
const pos = (v: number) => ((v - LOW) / (HIGH - LOW)) * 100

const TICKS = [-30, -20, -10, 0]

/** 三个耐寒带，用竖线切开，行底就靠它读 */
const BANDS = [
  { from: LOW, to: -20, label: '极耐寒' },
  { from: -20, to: -10, label: '耐寒' },
  { from: -10, to: HIGH, label: '半耐寒' },
]

const NOTES = [
  ['播种', '九月下旬到十月上旬，土温降到十度以下再下种'],
  ['间距', '行距四十厘米，株距按品种，标注里都写了'],
  ['采收', '叶菜趁雪前，根菜可以留在地里过冬'],
]

/**
 * 种苗目录。装置：一条耐寒温度轴，九个品种按能扛到的低温落点。
 * 窄屏不是把四列压扁，而是变成两行 —— 名字一行，刻度轴另起一行满宽。
 */
export function AlmanacPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState<string | null>('FF-073')

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 刊头 */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1
              className="display text-ink"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)', lineHeight: 1.08 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-md text-ink-2"
              style={{ maxWidth: '38ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
          </div>
          <div className="meta shrink-0 text-right text-muted">
            <div>目录共 178 个品种</div>
            <div className="mt-1">本页 9 个 · 按耐寒下限排序</div>
          </div>
        </div>

        <div className="mt-12">
          {/* 刻度 + 耐寒带 */}
          <div className="relative h-6">
            {TICKS.map((t) => (
              <span
                key={t}
                className="absolute -translate-x-1/2 font-mono text-[11px] text-muted"
                style={{ left: `${pos(t)}%` }}
              >
                {t}°C
              </span>
            ))}
          </div>
          <div className="relative h-5">
            {BANDS.map((b) => (
              <span
                key={b.label}
                className="meta absolute hidden -translate-x-1/2 sm:block"
                style={{
                  left: `${(pos(b.from) + pos(b.to)) / 2}%`,
                  color:
                    b.label === '半耐寒'
                      ? 'var(--hm-muted)'
                      : 'var(--hm-ink-2)',
                }}
              >
                {b.label}
              </span>
            ))}
          </div>

          {/* 图与行 */}
          <div className="relative">
            {/* 耐寒带底色 */}
            {BANDS.map((b, i) => (
              <span
                key={b.label}
                aria-hidden
                className="absolute inset-y-0"
                style={{
                  left: `${pos(b.from)}%`,
                  width: `${pos(b.to) - pos(b.from)}%`,
                  backgroundColor:
                    i === 0 ? 'var(--hm-paper-2)' : 'transparent',
                  borderLeft: '1px solid var(--hm-rule)',
                  borderRight:
                    i === BANDS.length - 1 ? undefined : '1px solid var(--hm-rule)',
                }}
              />
            ))}

            <ul className="relative">
              {ROWS.map((r) => {
                const on = pick === r.code
                return (
                  <li key={r.code}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPick(on ? null : r.code)}
                      className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 py-3 text-left transition-colors duration-200"
                      style={{
                        borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                        backgroundColor: on ? 'var(--hm-paper-3)' : undefined,
                        paddingInline: '0.5rem',
                      }}
                    >
                      <span className="w-14 shrink-0 font-mono text-[11px] text-muted">
                        {r.code}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-ink">
                        {r.name}
                      </span>
                      <span className="w-14 shrink-0 text-right font-mono text-xs text-ink-2">
                        {r.min}°C
                      </span>
                      <span className="relative block h-4 basis-full sm:h-5 sm:basis-auto sm:flex-1">
                        <span
                          aria-hidden
                          className="absolute top-1/2 h-px -translate-y-1/2"
                          style={{
                            left: `${pos(r.min)}%`,
                            right: `${100 - pos(0)}%`,
                            backgroundColor: 'var(--hm-rule-2)',
                          }}
                        />
                        <span
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                          style={{
                            left: `${pos(r.min)}%`,
                            width: on ? '0.8rem' : '0.55rem',
                            height: on ? '0.8rem' : '0.55rem',
                            backgroundColor: on
                              ? 'var(--hm-accent)'
                              : 'var(--hm-ink-2)',
                            borderRadius: 'var(--hm-radius-pill)',
                          }}
                        />
                      </span>
                    </button>
                    {on ? (
                      <p
                        className="pb-4 text-sm text-muted sm:pl-16"
                        style={{
                          maxWidth: '38ch',
                          lineHeight: 'var(--lh-relaxed)',
                        }}
                      >
                        {r.name}：能扛到 {r.min}°C，{r.days}。低于这个温度要覆膜或移进棚里。
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <p
          className="mt-5 text-sm text-muted"
          style={{ maxWidth: '42ch', lineHeight: 'var(--lh-relaxed)' }}
        >
          九个里六个能在这里露天过冬，剩下三个要覆膜或移进棚里。
        </p>

        {/* 栽培要点 */}
        <div className="mt-16 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          {NOTES.map(([k, d]) => (
            <div
              key={k}
              className="pt-4"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <div className="meta text-muted">{k}</div>
              <p
                className="mt-2 text-sm text-ink-2"
                style={{ maxWidth: '34ch', lineHeight: 'var(--lh-relaxed)' }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Cta label={page.cta} done="目录寄出了" />
        </div>
      </div>
    </main>
  )
}
