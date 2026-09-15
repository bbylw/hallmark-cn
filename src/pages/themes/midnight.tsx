import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Stamp } from '../../components/archetypes'
import { Cta } from './cta'

type Percentile = 'p50' | 'p95' | 'p99' | 'p999'

interface CityLatency {
  c: string
  p50: number
  p95: number
  p99: number
  p999: number
  protocol: string
  region: string
  traffic: string
}

const POINTS: CityLatency[] = [
  { c: '阿姆斯特丹', p50: 12, p95: 22, p99: 26, p999: 44, protocol: 'QUIC / BGP', region: 'EU-WEST-1', traffic: '1.4 TB/s' },
  { c: '法兰克福', p50: 14, p95: 24, p99: 29, p999: 48, protocol: 'QUIC / BGP', region: 'EU-CENTRAL-1', traffic: '2.8 TB/s' },
  { c: '迪拜', p50: 16, p95: 26, p99: 30, p999: 52, protocol: 'gRPC TLS', region: 'ME-CENTRAL-1', traffic: '820 GB/s' },
  { c: '伦敦', p50: 15, p95: 25, p99: 31, p999: 50, protocol: 'QUIC / BGP', region: 'EU-WEST-2', traffic: '1.9 TB/s' },
  { c: '东京', p50: 18, p95: 28, p99: 32, p999: 54, protocol: 'Anycast', region: 'AP-NORTHEAST-1', traffic: '2.4 TB/s' },
  { c: '巴黎', p50: 17, p95: 27, p99: 33, p999: 55, protocol: 'QUIC / BGP', region: 'EU-WEST-3', traffic: '1.1 TB/s' },
  { c: '新加坡', p50: 19, p95: 29, p99: 34, p999: 58, protocol: 'Anycast', region: 'AP-SOUTHEAST-1', traffic: '2.1 TB/s' },
  { c: '孟买', p50: 21, p95: 31, p99: 35, p999: 60, protocol: 'gRPC TLS', region: 'AP-SOUTH-1', traffic: '960 GB/s' },
  { c: '悉尼', p50: 22, p95: 32, p99: 36, p999: 62, protocol: 'Anycast', region: 'AP-SOUTHEAST-2', traffic: '780 GB/s' },
  { c: '圣保罗', p50: 24, p95: 34, p99: 37, p999: 64, protocol: 'BGP Direct', region: 'SA-EAST-1', traffic: '650 GB/s' },
  { c: '约翰内斯堡', p50: 25, p95: 35, p99: 38, p999: 66, protocol: 'BGP Direct', region: 'AF-SOUTH-1', traffic: '420 GB/s' },
  { c: '弗吉尼亚', p50: 26, p95: 36, p99: 40, p999: 68, protocol: 'Direct Peering', region: 'US-EAST-1', traffic: '4.2 TB/s' },
]

const STAT_VALUES: Record<Percentile, string> = {
  p50: '26ms',
  p95: '36ms',
  p99: '40ms',
  p999: '68ms',
}

const STAT_DESC: Record<Percentile, string> = {
  p50: '中位数分位延时 · 50% 全球边缘流量在此耗时内完成往返',
  p95: '高负载分位延时 · 95% 全球边缘流量在此耗时内完成往返',
  p99: '核心服务承诺分位 · 全球十二个边缘节点取最慢节点上限',
  p999: '长尾极端分位延时 · 跨洲深层海底光缆与高丢包工况兜底',
}

const MAX_VALUES: Record<Percentile, number> = {
  p50: 30,
  p95: 45,
  p99: 45,
  p999: 80,
}

interface TraceSpan {
  service: string
  operation: string
  duration: string
  offset: string
  status: '200' | 'cache_hit'
  id: string
}

const TRACE_SPANS: TraceSpan[] = [
  { service: 'edge-gateway', operation: 'GET /v2/telemetry/snapshot', duration: '38.4 ms', offset: '0%', status: '200', id: 'span_01' },
  { service: 'auth-layer', operation: 'JWT Bearer Signature Verify', duration: '2.1 ms', offset: '4%', status: '200', id: 'span_02' },
  { service: 'redis-cluster', operation: 'MGET session_cache:tokyo_09', duration: '1.4 ms', offset: '10%', status: 'cache_hit', id: 'span_03' },
  { service: 'ch-engine', operation: 'SELECT quantile(0.99)(rtt) FROM spans', duration: '14.8 ms', offset: '15%', status: '200', id: 'span_04' },
  { service: 'kafka-bus', operation: 'ASYNC Produce telemetry_audit_v1', duration: '3.2 ms', offset: '58%', status: '200', id: 'span_05' },
]

const NOTES = [
  ['全量写入机制', '不做任何头部有损采样，万亿级 Span 冷热分层异步无阻塞落盘。'],
  ['ClickHouse 极速列存', '十亿行分布式查询秒级聚合返回，专用稀疏索引体积仅占未压缩数据的 3.8%。'],
  ['OTLP 1.0 官方原生', '零代码侵入，标准 CNCF OpenTelemetry 探针通过 gRPC/HTTP 无缝直连。'],
  ['自适应分层保留策略', '高频热数据驻留 NVMe 固态阵列 7 天，冷数据对象存储自动加密归档 13 个月。'],
]

/**
 * 可观测性系统 Midnight 主题独立页。
 * 遵循 Hallmark Skills (v1.1.0) 规范打造深黑微光指挥舱物态感：
 * 1. 顶部全球遥测网络微状态条（12 节点在线、0 丢包、总吞吐量）
 * 2. 巨字延时统计领衔 + 分位数切换台（保持严格的 P50=26ms 契约与 Gate 55 行高底线）
 * 3. 核心互动装置：12 个边缘采集点分位数横向条形探针台
 * 4. 核心互动装置：分布式追踪瀑布流与 Span 调用链检视器 (Distributed Trace Waterfall)
 * 5. 全球 Anycast BGP 骨干链路健康矩阵
 * 6. 架构规格阐释与 OTLP 接入命令
 * 7. 底部配置标准 Hallmark Stamp 58/58 生产印章
 */
export function MidnightPage({ page }: { page: ThemePage }) {
  const [percentile, setPercentile] = useState<Percentile>('p99')
  const [pick, setPick] = useState(POINTS.length - 1)
  const [selectedSpanId, setSelectedSpanId] = useState('span_04')

  const uid = useId()
  const cur = POINTS[pick]
  const currentVal = cur[percentile]
  const maxVal = MAX_VALUES[percentile]

  const activeSpan = TRACE_SPANS.find((s) => s.id === selectedSpanId) || TRACE_SPANS[0]

  return (
    <main
      id="main"
      className="relative px-[var(--page-gutter)] pb-28 pt-10 sm:pt-14 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>

        {/* 顶部状态栏与全球网络微光心跳 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              NIGHTWATCH GLOBAL FABRIC · V5.8
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-muted">12 个骨干 Anycast 边缘全活</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">网络丢包率：0.00%</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2">
            <span>实时入库吞吐：20.4 TB/s</span>
            <span className="text-accent-line font-bold">写入 SLA：99.999%</span>
          </div>
        </header>

        {/* 巨字统计与分位数切换台 (满足测试契约：button:has-text("P50") -> h1:has-text("26ms")) */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-rule pb-8">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <h1
              className="display text-ink font-light tracking-tighter"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 8.5rem)',
                lineHeight: 1.03, // Gate 55 守门，避免大字垂直截断
              }}
            >
              {STAT_VALUES[percentile]}
            </h1>
            <div className="pb-3 max-w-[42ch]">
              <div className="text-base sm:text-lg font-bold text-ink">
                全球端到端边缘中继往返延时
              </div>
              <p className="text-xs text-muted mt-1 font-mono">
                {STAT_DESC[percentile]}
              </p>
              <div
                className="meta mt-2 text-accent-line font-mono font-bold text-xs flex items-center gap-1.5"
                aria-live="polite"
              >
                <span>●</span>
                <span>当前监测焦点：{cur.c} ({cur.region}) · {currentVal}ms ({cur.protocol})</span>
              </div>
            </div>
          </div>

          {/* 分位数选择器 */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
              分位数切换 · PERCENTILE SELECTOR
            </span>
            <div className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper-2/60 p-1 font-mono text-xs shadow-xs">
              {(['p50', 'p95', 'p99', 'p999'] as Percentile[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPercentile(p)}
                  className={`min-h-[44px] min-w-[56px] rounded px-3 py-1 font-bold transition-all cursor-pointer flex items-center justify-center ${
                    percentile === p
                      ? 'bg-ink text-paper ring-1 ring-accent-line shadow-sm'
                      : 'text-muted hover:text-ink hover:bg-paper-2'
                  }`}
                  aria-pressed={percentile === p}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────
            装置 1：十二个边缘采集点分位数横向条形探针台
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-points-title`} className="mt-12 rounded-xl border border-rule bg-paper-2/50 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-3 border-b border-rule">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 01 · 12-NODE EDGE TELEMETRY GRID
              </span>
              <span className="text-muted hidden sm:inline">|</span>
              <h2 id={`${uid}-points-title`} className="display text-base font-bold text-ink">
                十二大洲际骨干中继 RTT 实时拓扑标尺
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              当前分位数刻度上限：0 ~ {maxVal} ms
            </span>
          </div>

          <div className="flex items-baseline gap-3 pt-3 pb-2 border-b border-rule/60 text-muted font-mono text-[11px] font-bold">
            <span className="w-24 shrink-0 sm:w-36">节点城市 / 区域</span>
            <span className="relative h-4 flex-1">
              {[0, Math.round(maxVal / 2), maxVal].map((t, i) => (
                <span
                  key={t}
                  className="absolute text-muted"
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
            <span className="w-16 shrink-0 text-right sm:w-20">RTT</span>
          </div>

          <ul className="mt-2 divide-y divide-rule/40">
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
                    className={`flex w-full items-center gap-3 py-3 px-2 text-left transition-colors min-h-[44px] rounded-lg cursor-pointer ${
                      on ? 'bg-accent/15' : 'hover:bg-paper-2/60'
                    }`}
                  >
                    <div className="w-24 shrink-0 truncate sm:w-36">
                      <span className={`block font-medium text-xs sm:text-sm ${on ? 'text-ink font-bold' : 'text-ink-2'}`}>
                        {p.c}
                      </span>
                      <span className="block font-mono text-[10px] text-muted truncate">
                        {p.region} · {p.traffic}
                      </span>
                    </div>

                    <span className="flex h-3 min-w-0 flex-1 items-center bg-paper/40 rounded-full px-1">
                      <span
                        className="block h-2 rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${Math.min(100, (val / maxVal) * 100)}%`,
                          backgroundColor: on
                            ? 'var(--hm-accent)'
                            : 'var(--hm-rule-2)',
                          minWidth: '4px',
                        }}
                      />
                    </span>

                    <div className="w-16 shrink-0 text-right sm:w-20">
                      <span
                        className={`font-mono text-xs sm:text-sm font-bold block ${
                          on ? 'text-accent-line' : 'text-muted'
                        }`}
                      >
                        {val}ms
                      </span>
                      <span className="font-mono text-[10px] text-muted block truncate">
                        {p.protocol.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3 text-xs text-muted font-mono">
            <span>十二个骨干中继探针按实际光纤拓扑探测 · 瞬时微突发抖动平滑过滤</span>
            <span className="text-accent-line font-bold">当前焦点采样协议：{cur.protocol}</span>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 2：分布式调用链瀑布流 (Distributed Trace Waterfall)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-trace-title`} className="mt-14 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 02 · DISTRIBUTED TRACE FLAMEGRAPH & SPAN WATERFALL
              </span>
              <h2 id={`${uid}-trace-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                单次请求微服务调用链 · 毫秒级 Span 级联分解
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <span>TraceID: 4bf92f3577b34da6a3ce929d0e0e4736</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink-2 max-w-[72ch]" style={{ lineHeight: 1.6 }}>
            从客户端发起请求至边缘网关接收、身份验证、列式聚合查询到最终响应，全链路各微服务组件的时间跨度与执行细节一览无余：
          </p>

          <div className="mt-6 space-y-2 font-mono text-xs">
            {TRACE_SPANS.map((sp) => {
              const active = sp.id === selectedSpanId
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpanId(sp.id)}
                  className={`w-full p-3.5 rounded-lg border text-left transition-all cursor-pointer min-h-[50px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    active
                      ? 'border-accent-line bg-accent/15 text-ink shadow-sm'
                      : 'border-rule bg-paper text-ink-2 hover:border-rule-2 hover:bg-paper-2'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-bold text-ink truncate">{sp.service}</span>
                    <span className="text-muted hidden md:inline truncate">{sp.operation}</span>
                  </div>

                  <div className="flex items-center gap-4 text-muted shrink-0">
                    <span className="px-2 py-0.5 rounded bg-paper-2 border border-rule text-[10px] text-ink">
                      {sp.status === 'cache_hit' ? 'CACHE HIT' : 'HTTP 200'}
                    </span>
                    <span className="text-accent-line font-bold">{sp.duration}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 选中 Span 详细元数据 */}
          <div className="mt-5 rounded-lg border border-rule bg-paper p-4 sm:p-5 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule/60 pb-2.5">
              <span className="font-bold text-accent-line">
                选中 SPAN 深度元数据 · {activeSpan.service}
              </span>
              <span className="text-muted text-[11px]">
                SpanID: {activeSpan.id} · 执行耗时 {activeSpan.duration}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-muted block">操作名 (Operation):</span>
                <span className="text-ink font-bold block mt-0.5">{activeSpan.operation}</span>
              </div>
              <div>
                <span className="text-muted block">执行协议与通道:</span>
                <span className="text-ink font-bold block mt-0.5">OpenTelemetry v1.0 / gRPC HTTP/2</span>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            架构规格与存储引擎四柱
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-arch-title`} className="mt-16 border-t-2 border-ink pt-10">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="meta font-mono font-bold text-accent-line">
                ARCHITECTURE SPECIFICATION
              </span>
              <h2
                id={`${uid}-arch-title`}
                className="display mt-2 text-ink font-bold"
                style={{
                  fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
                  lineHeight: 1.12,
                }}
              >
                {page.title}
              </h2>
              <p
                className="mt-4 text-base text-ink-2 leading-relaxed"
                style={{ maxWidth: '42ch' }}
              >
                {page.standfirst}
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-rule border-b border-rule">
              {NOTES.map(([k, d]) => (
                <div
                  key={k}
                  className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[12rem_1fr] items-baseline"
                >
                  <span className="font-mono text-sm font-bold text-ink">{k}</span>
                  <span className="text-sm text-ink-2 leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部 Cta 与 CLI 命令 */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8 font-mono">
          <div className="flex flex-wrap items-center gap-6">
            <Cta label={page.cta} done="已建立首个 OTLP 会话通道" />
            <span className="text-xs text-muted max-w-[42ch]">
              接入任意现代语言服务，三分钟内在控制台实时生成首条端到端拓扑追踪链。
            </span>
          </div>
          <div className="text-xs text-muted px-3 py-1.5 rounded bg-paper-2 border border-rule">
            CLI: <strong className="text-ink">npx @nightwatch/agent init</strong>
          </div>
        </div>

        {/* 底部 Hallmark 规范生产印章与六维评分 */}
        <footer className="mt-20">
          <Stamp page={page} />
        </footer>

      </div>
    </main>
  )
}
export default MidnightPage
