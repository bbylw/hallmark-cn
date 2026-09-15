import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 五档配速。pace 是每公里秒数，是唯一的事实；
 * 条长和各时长能跑多远都由它算出来，不是另外编的数。
 */
const PACES = [
  { lane: '01', pace: 420, label: '7:00 /km', zone: 'Zone 1-2 · 舒适慢摇', pacer: '老刘（关门兔）', d: '走跑结合，中途随时可折返' },
  { lane: '02', pace: 360, label: '6:00 /km', zone: 'Zone 2 · 有氧燃脂', pacer: '林夕（稳速兔）', d: '全程能说完整的句子，不喘' },
  { lane: '03', pace: 300, label: '5:00 /km', zone: 'Zone 3 · 节奏提升', pacer: '小陈（进阶兔）', d: '微喘，说半句就要换气' },
  { lane: '04', pace: 270, label: '4:30 /km', zone: 'Zone 4 · 乳酸阈值', pacer: '阿杰（破风兔）', d: '专注呼吸与步频，基本不说话' },
  { lane: '05', pace: 240, label: '4:00 /km', zone: 'Zone 5 · 极限竞速', pacer: '队长阿飞', d: '队里最快的那几个，专攻 PB' },
]

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/**
 * 跑团。宏观结构是「引言领衔」，所以那句带出处的引用就是 h1 本身——
 * 标题借的是周叙的信誉，不是品牌自己的嗓门。
 * 下面是配速分道表与动态配速测算台。
 */
export function SportPage({ page }: { page: ThemePage }) {
  const [durationMinutes, setDurationMinutes] = useState<number>(30)
  const [selectedLane, setSelectedLane] = useState<string>('02')

  const totalSeconds = durationMinutes * 60
  const maxKm = (totalSeconds / 240) // 以最快配速满格作为尺度基准

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-20 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="font-bold text-accent-line">{page.brand}</span>
          <span className="text-muted">·</span>
          <span className="text-muted">{page.discipline}</span>
          <span className="text-muted">·</span>
          <span className="text-muted">周二/周四夜跑 19:30</span>
        </div>

        {/* 首屏：引言 + 出处 */}
        <blockquote className="mt-8 border-l-4 border-accent-line pl-6 sm:pl-8">
          <h1
            className="display text-balance text-ink font-semibold"
            style={{
              fontSize: 'clamp(1.8rem, 4.4vw, 3.25rem)',
              lineHeight: 'var(--lh-snug)',
              maxWidth: '22em',
            }}
          >
            「{page.quote?.text}」
          </h1>
          <footer className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="display text-lg font-bold text-ink">{page.quote?.name}</span>
            <span className="meta text-muted">{page.quote?.role} · 连续领跑 420 场</span>
          </footer>
        </blockquote>

        {/* 引言之后才是事实 */}
        <div
          className="mt-14 pt-6"
          style={{ borderTop: '2px solid var(--hm-ink)' }}
        >
          <h2
            className="display text-ink"
            style={{
              fontSize: 'clamp(1.35rem, 2.6vw, 2rem)',
              lineHeight: 'var(--lh-tight)',
            }}
          >
            {page.title}
          </h2>
          <p className="mt-3 text-md text-ink-2" style={{ maxWidth: '38ch', lineHeight: 'var(--lh-relaxed)' }}>
            {page.standfirst}
          </p>
        </div>

        {/* 核心互动装置：配速计算台 */}
        <div className="mt-12 rounded-lg border border-rule bg-paper/60 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
            <div>
              <span className="meta text-accent-line">装置 · 配速与距离计算台</span>
              <h3 className="display text-xl text-ink">测算不同时长下的跑动距离</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="meta text-xs text-muted">跑步时长:</span>
              {[20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`min-h-[32px] rounded px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                    durationMinutes === mins
                      ? 'bg-ink text-paper ring-2 ring-accent-line'
                      : 'border border-rule bg-paper text-ink-2 hover:border-ink'
                  }`}
                  aria-pressed={durationMinutes === mins}
                >
                  {mins} 分钟
                </button>
              ))}
            </div>
          </div>

          {/* 配速分道 */}
          <div className="mt-6">
            <div
              className="flex flex-wrap items-center gap-x-4 py-2 font-mono text-xs text-muted"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="w-8 shrink-0 font-bold">道次</span>
              <span className="w-20 shrink-0 font-bold">配速</span>
              <span className="min-w-[8rem] flex-1 font-bold">
                {durationMinutes} 分钟能跑距离
              </span>
              <span className="hidden w-28 shrink-0 font-bold sm:block">领跑员</span>
              <span className="shrink-0 sm:ml-auto font-bold">体感状态</span>
            </div>

            {PACES.map((p) => {
              const km = totalSeconds / p.pace
              const isSelected = selectedLane === p.lane
              return (
                <button
                  key={p.lane}
                  type="button"
                  onClick={() => setSelectedLane(p.lane)}
                  className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 py-3.5 text-left transition-colors ${
                    isSelected ? 'bg-ink/5' : 'hover:bg-ink/[0.02]'
                  }`}
                  style={{ borderBottom: '1px solid var(--hm-rule)' }}
                  aria-label={`道次 ${p.lane}：${p.label}`}
                  aria-pressed={isSelected}
                >
                  <span className="w-8 shrink-0 font-mono text-xs font-bold text-muted">
                    {p.lane}
                  </span>
                  <span
                    className="display w-20 shrink-0 text-lg font-bold text-ink"
                    style={{ letterSpacing: 'var(--hm-tracking-display)' }}
                  >
                    {mmss(p.pace)}
                  </span>
                  <span
                    aria-hidden
                    className="flex min-w-[8rem] flex-1 items-center gap-3"
                  >
                    <span
                      className="block h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (km / maxKm) * 100)}%`,
                        backgroundColor: isSelected ? 'var(--hm-accent-line)' : 'var(--hm-accent)',
                      }}
                    />
                    <span className="ml-auto shrink-0 font-mono text-xs font-bold text-ink">
                      {km.toFixed(1)} km
                    </span>
                  </span>
                  <span className="hidden w-28 shrink-0 font-mono text-xs text-muted sm:block">
                    {p.pacer}
                  </span>
                  <span className="w-full shrink-0 text-sm text-muted sm:ml-auto sm:w-auto">
                    {p.d}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted font-mono">
            <span>配速单位：分:秒/公里 · 领跑兔子每组双人轮流破风</span>
            <span>当前选中道次：{PACES.find((p) => p.lane === selectedLane)?.zone}</span>
          </div>
        </div>

        {/* 信息板 */}
        <div className="mt-14 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {(page.items ?? []).map((it) => (
            <div
              key={it.v}
              className="pt-3"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <span className="meta font-mono font-bold text-muted">{it.k}</span>
              <div className="display mt-1 text-lg font-semibold text-ink">{it.v}</div>
              <div className="mt-1 text-sm text-muted">{it.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Cta label={page.cta} done="名额已留，现场见" />
          <span className="text-sm text-muted">
            无需报名费。存包与免费饮水在滨江步道 0 号哨所。
          </span>
        </div>
      </div>
    </main>
  )
}
