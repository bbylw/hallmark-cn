import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

interface MonthDetail {
  crop: string
  action: string
  detail: string
  nectarFlow: string
}

// 一年里真正动手的月份：三月、六月、八月。
const WORK_DETAILS: Record<number, MonthDetail> = {
  2: {
    crop: '油菜花蜜',
    action: '春初首摇',
    detail: '江南早春油菜盛放，蜜色浅亮透明，天然葡萄糖极易形成乳酪状细晶。',
    nectarFlow: '盛流期 · 80kg/日',
  },
  5: {
    crop: '夏初荆条',
    action: '盛夏初摇',
    detail: '深山野生荆条初开，芳香清冽，口感回甘绵长，富含天然抗氧化活性酶。',
    nectarFlow: '丰沛期 · 110kg/日',
  },
  7: {
    crop: '秋前荆条末茬',
    action: '封盖老蜜',
    detail: '伏天收尾，自然成熟封盖超过七天方可开箱，波美度稳定在 42 度以上。',
    nectarFlow: '成熟期 · 65kg/日',
  },
}

/**
 * 蜂蜜农场。装置：一年的取蜜日历，
 * 十二格里只有三格是满的 —— 这就是这门生意全部的样子。
 */
export function GardenPage({ page }: { page: ThemePage }) {
  const [selectedMonth, setSelectedMonth] = useState<number>(2) // 默认三月
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)

  const activeIdx = hoveredMonth !== null ? hoveredMonth : selectedMonth
  const currentWork = WORK_DETAILS[activeIdx]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12 sm:pt-16">
      <div
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        className="grid gap-x-12 gap-y-14 lg:grid-cols-12"
      >
        {/* 正文，长文占主栏，不居中 */}
        <article className="lg:col-span-7 lg:col-start-2">
          <div className="meta text-accent-line">自然封盖熟蜜 · 独立林场编号 #G-108</div>
          <h1
            className="display mt-3 text-ink"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.08 }}
          >
            {page.title}
          </h1>
          <p
            className="display mt-6 text-ink font-normal"
            style={{ fontSize: '1.375rem', lineHeight: 1.55 }}
          >
            {page.standfirst}
          </p>

          <div className="mt-10">
            {(page.body ?? []).map((p) => (
              <p
                key={p}
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {p}
              </p>
            ))}
          </div>

          <blockquote
            className="mt-10 border-l-2 border-accent-line pl-4 text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)', fontStyle: 'normal' }}
          >
            蜂不喂糖，花不打药。十二个箱子放在半山背阴处，让蜜蜂自己决定什么时候采够。
          </blockquote>
        </article>

        {/* 侧栏：这一季的账 */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <span className="meta font-mono font-bold text-ink">这一季 · HARVEST LOG</span>
              <span className="font-mono text-[10px] text-muted">2026 茬口</span>
            </div>
            <div className="mt-4">
              {(page.items ?? []).map((it) => (
                <div
                  key={it.k + it.v}
                  className="py-3.5"
                  style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
                >
                  <div className="meta text-muted">{it.k}</div>
                  <div className="display mt-1 text-xl text-ink">{it.v}</div>
                  <div className="mt-1 text-xs text-muted">{it.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Cta label={page.cta} done="会给你留一瓶封盖蜜" />
            </div>
          </div>
        </aside>
      </div>

      {/* 核心互动装置：一年的自然日历 */}
      <div
        className="mt-20 rounded-lg border border-rule bg-paper/60 p-6 sm:p-8"
        style={{ maxWidth: 'var(--page-max)', margin: '5rem auto 0' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="meta text-accent-line">装置 · 自然物候日历</span>
            <h2 className="display text-xl text-ink" style={{ lineHeight: 1.2 }}>
              十二个月份，三次摇蜜
            </h2>
          </div>
          <span className="meta text-muted">
            点击或悬停查看当月蜂场纪事
          </span>
        </div>

        {/* 12 个月份格子按键 */}
        <div className="mt-6 flex gap-1 sm:gap-2">
          {MONTHS.map((m, i) => {
            const hasWork = i in WORK_DETAILS
            const isSelected = selectedMonth === i
            const isHovered = hoveredMonth === i
            return (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(i)}
                onMouseEnter={() => setHoveredMonth(i)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="group flex-1 cursor-pointer focus:outline-none"
                aria-label={`${m}：${hasWork ? '摇蜜月份' : '自然休养'}`}
                aria-pressed={isSelected}
              >
                <div
                  className="h-16 rounded transition-all duration-200"
                  style={{
                    backgroundColor: hasWork
                      ? 'var(--hm-accent)'
                      : isSelected
                        ? 'var(--hm-paper-3)'
                        : 'var(--hm-paper-2)',
                    border: isSelected
                      ? '2px solid var(--hm-ink)'
                      : 'var(--hm-rule-card) solid var(--hm-rule)',
                    transform:
                      isHovered || isSelected ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow:
                      isSelected ? '0 3px 8px oklch(0% 0 0 / 0.12)' : 'none',
                  }}
                />
                <div
                  className="mt-2 text-center font-mono text-[11px]"
                  style={{
                    color: hasWork
                      ? 'var(--hm-accent-line)'
                      : isSelected
                        ? 'var(--hm-ink)'
                        : 'var(--hm-muted)',
                    fontWeight: isSelected || hasWork ? 'bold' : 'normal',
                  }}
                >
                  {i + 1}
                </div>
              </button>
            )
          })}
        </div>

        {/* 当前月份详情面板 */}
        <div className="mt-6 min-h-[5rem] rounded border border-rule/70 bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-ink">
                {MONTHS[activeIdx]} (第 {activeIdx + 1} 月)
              </span>
              {currentWork ? (
                <span className="rounded bg-accent-line/10 px-2 py-0.5 font-mono text-xs font-semibold text-accent-line">
                  {currentWork.crop} · {currentWork.action}
                </span>
              ) : (
                <span className="rounded bg-black/5 px-2 py-0.5 font-mono text-xs text-muted">
                  静息养蜂 · 不动箱
                </span>
              )}
            </div>
            {currentWork ? (
              <span className="font-mono text-xs text-muted">
                {currentWork.nectarFlow}
              </span>
            ) : null}
          </div>

          <p
            className="mt-2.5 text-sm text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {currentWork
              ? currentWork.detail
              : `${MONTHS[activeIdx]}：山林暂无主蜜源，全蜂群守箱培育幼蜂。严禁人工催熟或额外喂养糖浆，蜜源尽数留归蜜蜂度荒。`}
          </p>
        </div>
      </div>
    </main>
  )
}
