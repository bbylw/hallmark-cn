import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

type Percentile = 'p50' | 'p95' | 'p99' | 'p999'

interface CityLatency {
  c: string
  p50: number
  p95: number
  p99: number
  p999: number
  protocol: string
}

const POINTS: CityLatency[] = [
  { c: '阿姆斯特丹', p50: 12, p95: 22, p99: 26, p999: 44, protocol: 'QUIC / BGP' },
  { c: '法兰克福', p50: 14, p95: 24, p99: 29, p999: 48, protocol: 'QUIC / BGP' },
  { c: '迪拜', p50: 16, p95: 26, p99: 30, p999: 52, protocol: 'gRPC TLS' },
  { c: '伦敦', p50: 15, p95: 25, p99: 31, p999: 50, protocol: 'QUIC / BGP' },
  { c: '东京', p50: 18, p95: 28, p99: 32, p999: 54, protocol: 'Anycast' },
  { c: '巴黎', p50: 17, p95: 27, p99: 33, p999: 55, protocol: 'QUIC / BGP' },
  { c: '新加坡', p50: 19, p95: 29, p99: 34, p999: 58, protocol: 'Anycast' },
  { c: '孟买', p50: 21, p95: 31, p99: 35, p999: 60, protocol: 'gRPC TLS' },
  { c: '悉尼', p50: 22, p95: 32, p99: 36, p999: 62, protocol: 'Anycast' },
  { c: '圣保罗', p50: 24, p95: 34, p99: 37, p999: 64, protocol: 'BGP Direct' },
  { c: '约翰内斯堡', p50: 25, p95: 35, p99: 38, p999: 66, protocol: 'BGP Direct' },
  { c: '弗吉尼亚', p50: 26, p95: 36, p99: 40, p999: 68, protocol: 'Direct Peering' },
]

const STAT_VALUES: Record<Percentile, string> = {
  p50: '26ms',
  p95: '36ms',
  p99: '40ms',
  p999: '68ms',
}

const MAX_VALUES: Record<Percentile, number> = {
  p50: 30,
  p95: 45,
  p99: 45,
  p999: 80,
}

const NOTES = [
  ['全量写入机制', '不做任何头部采样，万亿级 Span 冷热分层异步落盘。'],
  ['ClickHouse 列存', '十亿行分布式查询秒级聚合返回，索引体积仅占 4%。'],
  ['OTLP 1.0 原生', '零代码改动，标准 OpenTelemetry 探针无缝直连。'],
  ['自适应保留策略', '高频热数据驻留 NVMe 7 天，冷数据对象存储保留 13 个月。'],
]

/**
 * 可观测性系统 Midnight 主题。
 * 宏观结构：统计领衔。装置：十二个边缘采集点分位数实时探针台。
 * Gate 55 修复：行高底线规范保证 >= 1.02。
 */
export function MidnightPage({ page }: { page: ThemePage }) {
  const [percentile, setPercentile] = useState<Percentile>('p99')
  const [pick, setPick] = useState(POINTS.length - 1)

  const cur = POINTS[pick]
  const currentVal = cur[percentile]
  const maxVal = MAX_VALUES[percentile]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 顶部状态栏与网络心跳 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="meta font-mono font-bold text-ink">
              {page.brand} · GLOBAL TELEMETRY FABRIC
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span>12 EDGES ACTIVE</span>
            <span>·</span>
            <span>PACKET LOSS 0.00%</span>
          </div>
        </div>

        {/* 巨字统计与分位数切换台 */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <h1
              className="display text-ink font-light tracking-tighter"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 8.5rem)',
                lineHeight: 1.02, // Gate 55 守门，避免截断
              }}
            >
              {STAT_VALUES[percentile]}
            </h1>
            <div className="pb-2">
              <div className="text-md font-semibold text-ink-2">全球端到端边缘中继延时</div>
              <div className="meta mt-1 text-accent-line font-mono font-bold" aria-live="polite">
                当前焦点：{cur.c} · {currentVal}ms ({cur.protocol})
              </div>
            </div>
          </div>

          {/* 分位数选择器 */}
          <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper/60 p-1 font-mono text-xs">
            {(['p50', 'p95', 'p99', 'p999'] as Percentile[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPercentile(p)}
                className={`min-h-[32px] rounded px-3 py-1 font-bold transition-all ${
                  percentile === p
                    ? 'bg-ink text-paper ring-1 ring-accent-line'
                    : 'text-muted hover:text-ink'
                }`}
                aria-pressed={percentile === p}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 核心互动装置：横向条形探针图 */}
        <div className="mt-12 rounded-lg border border-rule bg-paper/50 p-5 sm:p-6">
          <div className="flex items-baseline gap-3 pb-2 border-b border-rule">
            <span className="w-24 shrink-0 font-mono text-xs font-bold text-muted sm:w-32">
              NODE
            </span>
            <span className="relative h-4 flex-1">
              {[0, Math.round(maxVal / 2), maxVal].map((t, i) => (
                <span
                  key={t}
                  className="absolute font-mono text-[11px] text-muted"
                  style={{
                    left: `${(t / maxVal) * 100}%`,
                    transform:
                      i === 0
                        ? 'translateX(0)'
                        : i === 2
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)',
                  }}
                >
                  {t}ms
                </span>
              ))}
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-xs font-bold text-muted sm:w-16">
              RTT
            </span>
          </div>

          <ul className="mt-3 divide-y divide-rule/40">
            {POINTS.map((p, i) => {
              const on = pick === i
              const val = p[percentile]
              return (
                <li key={p.c}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => setPick(i)}
                    onFocus={() => setPick(i)}
                    onClick={() => setPick(i)}
                    className="flex w-full items-center gap-3 py-2.5 text-left transition-colors sm:py-2"
                    style={{
                      backgroundColor: on ? 'var(--hm-paper-2)' : undefined,
                      borderRadius: 'var(--hm-radius-input)',
                      paddingInline: '0.5rem',
                    }}
                  >
                    <span
                      className="w-24 shrink-0 truncate font-medium text-[13px] sm:w-32 sm:text-sm"
                      style={{
                        color: on ? 'var(--hm-ink)' : 'var(--hm-ink-2)',
                      }}
                    >
                      {p.c}
                    </span>
                    <span className="flex h-3 min-w-0 flex-1 items-center">
                      <span
                        className="block h-2 rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${(val / maxVal) * 100}%`,
                          backgroundColor: on
                            ? 'var(--hm-accent)'
                            : 'var(--hm-rule-2)',
                          minWidth: '3px',
                        }}
                      />
                    </span>
                    <span
                      className="w-12 shrink-0 text-right font-mono text-xs font-bold transition-colors sm:w-16"
                      style={{
                        color: on ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                      }}
                    >
                      {val}ms
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3 text-xs text-muted font-mono">
            <span>十二个骨干中继探针按实际拓扑探测 · 瞬时抖动过滤</span>
            <span>当前分位数上限比例尺：0 ~ {maxVal}ms</span>
          </div>
        </div>

        {/* 标题 / 说明 / 架构规格 */}
        <div className="mt-24 grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="meta font-mono font-bold text-accent-line">ARCHITECTURE SPEC</span>
            <h2
              className="display mt-2 text-ink font-bold"
              style={{
                fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
                lineHeight: 1.12,
              }}
            >
              {page.title}
            </h2>
            <p
              className="mt-4 text-md text-ink-2"
              style={{ maxWidth: '40ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
          </div>

          <div className="lg:col-span-7">
            {NOTES.map(([k, d]) => (
              <div
                key={k}
                className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[12rem_1fr]"
                style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
              >
                <span className="font-mono text-sm font-bold text-ink">{k}</span>
                <span className="text-sm text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8">
          <div className="flex flex-wrap items-center gap-6">
            <Cta label={page.cta} done="已建立首个 OTLP 会话" />
            <span className="text-sm text-muted">
              接一个服务，五分钟内就能在控制台看到第一条拓扑追踪链。
            </span>
          </div>
          <div className="font-mono text-xs text-muted">
            CLI: npx @cold-snap/observe init
          </div>
        </div>
      </div>
    </main>
  )
}
