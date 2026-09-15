import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface CropRow {
  code: string
  name: string
  min: number
  days: string
  type: string
}

const ROWS: CropRow[] = [
  { code: 'FF-014', name: '冬豌豆', min: -18, days: '65 天', type: '豆科耐寒' },
  { code: 'FF-023', name: '黑麦（过冬）', min: -25, days: '秋播整冬', type: '禾本科' },
  { code: 'FF-041', name: '矮生羽衣甘蓝', min: -12, days: '50 天', type: '十字花科' },
  { code: 'FF-058', name: '红皮洋葱', min: -8, days: '110 天', type: '百合科' },
  { code: 'FF-073', name: '雪下菠菜', min: -15, days: '40 天', type: '藜亚科' },
  { code: 'FF-089', name: '早春萝卜', min: -6, days: '28 天', type: '十字花科' },
  { code: 'FF-102', name: '紫花苜蓿', min: -20, days: '绿肥多年生', type: '地被固氮' },
  { code: 'FF-117', name: '冬小麦（硬红）', min: -22, days: '秋播过冬', type: '主粮' },
  { code: 'FF-131', name: '细香葱', min: -30, days: '多年生宿根', type: '宿根香草' },
]

const LOW = -34
const HIGH = 2
const pos = (v: number) => ((v - LOW) / (HIGH - LOW)) * 100

const TICKS = [-30, -20, -10, 0]

const BANDS = [
  { from: LOW, to: -20, label: '极耐寒区 (Zone 4-5)' },
  { from: -20, to: -10, label: '耐寒区 (Zone 6-7)' },
  { from: -10, to: HIGH, label: '半耐寒区 (Zone 8+)' },
]

const NOTES = [
  ['播种适期', '九月下旬到十月上旬，监测土表 5cm 温度稳定降至 10°C 以下方可下种。'],
  ['间距与行道', '行距 40 厘米留出保温积雪凹槽，株距按各品种根系深度差异标定。'],
  ['采收与越冬', '鲜叶类趁第一场大雪前采摘完毕，块根类在冻土层下自然糖化越冬。'],
]

/**
 * 种苗目录。装置：耐寒温度轴 + 当地冬温自测滑轨模拟器。
 * 窄屏不是把四列压扁，而是变成两行 —— 名字一行，刻度轴另起一行满宽。
 */
export function AlmanacPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState<string | null>('FF-073')
  const [localTemp, setLocalTemp] = useState<number>(-15)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12 sm:pt-16">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 刊头 */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <div className="meta font-mono font-bold text-accent-line">
              FARM & FORAGE SEEDSMEN · 2026 CATALOG
            </div>
            <h1
              className="display mt-2 text-ink"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)', lineHeight: 1.1 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-md text-ink-2"
              style={{ maxWidth: '42ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
          </div>
          <div className="meta shrink-0 text-right text-muted">
            <div className="font-mono font-bold text-ink">全册 178 个在地驯化品种</div>
            <div className="mt-1">本页 9 个关键越冬作物 · 绝对耐寒下限实测</div>
          </div>
        </div>

        {/* 核心互动装置：冬温预测与露地安全越冬模拟 */}
        <div className="mt-10 rounded-lg border border-rule bg-paper/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="meta text-accent-line">装置 · 冬温模拟仪</span>
              <h2 className="display text-lg text-ink">设定你所在地区的冬季预期最低温</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-accent-line">{localTemp}°C</span>
              <span className="meta text-muted">实测极限</span>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min={-30}
              max={0}
              step={1}
              value={localTemp}
              onChange={(e) => setLocalTemp(Number(e.target.value))}
              className="min-h-[44px] w-full cursor-pointer"
              aria-label="拖动设定你所在地区的冬季预期最低温"
            />
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
            <span>-30°C (严寒北方)</span>
            <span>-15°C (华北/中原)</span>
            <span>0°C (沿江江南)</span>
          </div>
        </div>

        {/* 作物耐寒图表 */}
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
                    b.label.includes('半耐寒')
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

            {/* 用户设置的参考温度竖线 */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 w-0.5 border-r-2 border-dashed border-accent-line transition-all duration-150"
              style={{ left: `${pos(localTemp)}%` }}
            />

            <ul className="relative">
              {ROWS.map((r) => {
                const on = pick === r.code
                const isSafe = r.min <= localTemp
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
                      <span className="w-16 shrink-0 font-mono text-[11px] text-muted">
                        {r.code}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                        {r.name}
                      </span>
                      <span className="hidden w-20 shrink-0 font-mono text-xs text-muted sm:block">
                        {r.days}
                      </span>
                      
                      {/* 安全越冬指示 */}
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          isSafe
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/10 text-amber-800 dark:text-amber-200'
                        }`}
                      >
                        {isSafe ? '可露天过冬' : '需覆膜保苗'}
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
                            width: on ? '0.85rem' : '0.55rem',
                            height: on ? '0.85rem' : '0.55rem',
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
                          maxWidth: '46ch',
                          lineHeight: 'var(--lh-relaxed)',
                        }}
                      >
                        {r.name}：极限耐寒 {r.min}°C，生育周期 {r.days}。{isSafe ? `在当前设定温度 (${localTemp}°C) 下可安全露地越冬，地温越低根系甜度转化越高。` : `当前预期冬温 (${localTemp}°C) 低于其耐受极限，必须覆草帘、搭小拱棚或移进冷棚。`}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <p
          className="mt-6 text-sm text-muted"
          style={{ maxWidth: '44ch', lineHeight: 'var(--lh-relaxed)' }}
        >
          拖动上方冬温滑轨，实时判定各品种在你的地块能否不加人工加温自然过冬。
        </p>

        {/* 栽培要点 */}
        <div className="mt-16 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          {NOTES.map(([k, d]) => (
            <div
              key={k}
              className="pt-4"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <div className="meta font-mono font-bold text-ink">{k}</div>
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
          <Cta label={page.cta} done="纸质目录与种子袋已寄出" />
        </div>
      </div>
    </main>
  )
}
