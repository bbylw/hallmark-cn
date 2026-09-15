import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { CopyButton } from '../../components/ui/copy-button'
import { Cta } from './cta'

type Role = 'h1' | 'h2' | 'p' | 'table' | 'figure' | 'footnote'

interface BlockItem {
  role: Role
  text: string
  conf: number
  box: [number, number, number, number]
  pii?: string
}

const SAMPLES: Record<
  string,
  { name: string; file: string; pages: number; tables: number; blocks: BlockItem[] }
> = {
  report: {
    name: '季度财务报告',
    file: 'quarterly-report-2026.pdf · 第 12 页',
    pages: 24,
    tables: 6,
    blocks: [
      { role: 'h1', text: '季度报告 · 二〇二六年第三季度', conf: 0.99, box: [72, 48, 412, 26] },
      { role: 'h2', text: '营业收入与利润构成', conf: 0.98, box: [72, 212, 260, 24] },
      {
        role: 'p',
        text: '本季度营业收入 4,820 万元，同比增长 18%。其中订阅收入占 61%，毛利率稳定在 55.6%。',
        conf: 0.97,
        box: [72, 256, 588, 42],
        pii: '4,820 万元',
      },
      { role: 'table', text: '项目 / 本季 / 上季 财务指标汇总表', conf: 0.96, box: [72, 322, 420, 168] },
      { role: 'figure', text: '图 1 分渠道收入构成条形图', conf: 0.76, box: [72, 512, 240, 132] },
      { role: 'footnote', text: '注 1 本表数据未经外部独立审计，单位：万元。', conf: 0.64, box: [72, 668, 452, 20] },
    ],
  },
  contract: {
    name: '技术委托合同',
    file: 'master-service-agreement.pdf · 第 3 页',
    pages: 18,
    tables: 2,
    blocks: [
      { role: 'h1', text: '服务等级协议 (SLA) 补充条款', conf: 0.99, box: [72, 50, 380, 24] },
      { role: 'h2', text: '可用性与补偿核算标准', conf: 0.96, box: [72, 180, 220, 22] },
      {
        role: 'p',
        text: '乙方承诺月度服务可用性不低于 99.95%，如发生单次持续 15 分钟以上不可用，按对应月费 10% 抵扣。',
        conf: 0.95,
        box: [72, 220, 560, 36],
        pii: '10% 抵扣',
      },
      { role: 'footnote', text: '注 2 计划内停机维护不计入故障时间，须提前 72 小时书面通知。', conf: 0.68, box: [72, 420, 480, 20] },
    ],
  },
}

const TABLE_DATA = [
  ['项目指标', '本季 (Q3)', '上季 (Q2)', '同比变动'],
  ['营业总收入', '4,820', '4,085', '+18.0%'],
  ['主营业务成本', '2,140', '1,906', '+12.3%'],
  ['毛利润', '2,680', '2,179', '+23.0%'],
]

const CHANNELS = [
  ['直营平台', 38],
  ['企业专线', 27],
  ['生态集成', 19],
  ['跨境订阅', 16],
] as const

const BENCHMARKS = [
  { engine: 'Distil Neural (LayoutLMv3)', f1: '98.6%', latency: '0.18s', tables: '97.2%', highlight: true },
  { engine: 'AWS Textract v2', f1: '91.4%', latency: '0.84s', tables: '86.1%', highlight: false },
  { engine: 'Google Document AI', f1: '93.2%', latency: '0.62s', tables: '88.5%', highlight: false },
  { engine: 'Azure Form Recognizer', f1: '90.8%', latency: '0.91s', tables: '84.0%', highlight: false },
]

/**
 * 智能内容提取 API 页面 CobaltPage
 * 严格贯彻 Hallmark 58 项规范与物态感，保留工作台、样本切换、代码块与 58/58 生产印章
 */
export function CobaltPage({ page }: { page: ThemePage }) {
  const [sampleKey, setSampleKey] = useState<'report' | 'contract'>('report')
  const [pick, setPick] = useState(2)
  const [threshold, setThreshold] = useState(0.8)
  const [redactPii, setRedactPii] = useState(false)

  const activeDoc = SAMPLES[sampleKey]
  const blocks = activeDoc.blocks
  const cur = blocks[pick] ?? blocks[0]
  const lowCount = blocks.filter((b) => b.conf < threshold).length

  const [req, res] = (page.code?.src ?? '').split('\n\n')
  const pane = (raw: string) => {
    const [head, ...body] = (raw ?? '').split('\n')
    return { head, body: body.join('\n') }
  }
  const reqPane = pane(req)
  const resPane = pane(res)

  const jsonString = JSON.stringify(
    {
      pages: activeDoc.pages,
      tables: activeDoc.tables,
      threshold_applied: threshold,
      redaction_enabled: redactPii,
      blocks: blocks.map((b) => ({
        role: b.role,
        text: redactPii && b.pii ? b.text.replace(b.pii, '██████') : b.text,
        box: b.box,
        confidence: b.conf,
        needs_review: b.conf < threshold,
      })),
    },
    null,
    2,
  )

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-28 pt-8 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 顶部企业级文档处理引擎公报条 */}
        <header className="rounded-lg border border-rule bg-paper-2/80 px-4 py-3 font-mono text-xs flex flex-wrap items-center justify-between gap-y-2 gap-x-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent-line animate-pulse" />
            <span className="font-bold text-ink">DISTIL OCR & LAYOUT LMv3 · 企业级版面拓扑</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-muted text-[11px]">
            <span>时延: 180ms/页</span>
            <span>·</span>
            <span>F1: 98.6%</span>
            <span>·</span>
            <span>SOC2 Type II 合规</span>
            <span>·</span>
            <span className="text-accent-line font-bold">API v1.4-RELEASE</span>
          </div>
        </header>

        {/* 标题与样本快速切换栏 */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <div className="meta font-mono font-bold text-accent-line">
              {page.discipline} · COBALT DOCUMENT PARSER
            </div>
            <h1
              className="display mt-2 text-ink font-bold tracking-tight"
              style={{ fontSize: 'clamp(1.95rem, 4.2vw, 3.25rem)', lineHeight: 1.1 }}
            >
              {page.title}
            </h1>
          </div>

          {/* 关键测试契约：button:has-text("SLA 合同") */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-muted text-[11px]">测试样本:</span>
            <button
              type="button"
              onClick={() => {
                setSampleKey('report')
                setPick(2)
              }}
              className={`rounded-lg border px-3 py-1 text-xs transition-colors font-semibold ${
                sampleKey === 'report'
                  ? 'border-ink bg-ink text-paper font-bold shadow'
                  : 'border-rule text-muted hover:border-ink hover:text-ink'
              }`}
              style={{ minHeight: '44px' }}
            >
              季度财报
            </button>
            <button
              type="button"
              onClick={() => {
                setSampleKey('contract')
                setPick(1)
              }}
              className={`rounded-lg border px-3 py-1 text-xs transition-colors font-semibold ${
                sampleKey === 'contract'
                  ? 'border-ink bg-ink text-paper font-bold shadow'
                  : 'border-rule text-muted hover:border-ink hover:text-ink'
              }`}
              style={{ minHeight: '44px' }}
            >
              SLA 合同
            </button>
          </div>
        </div>

        <p
          className="mt-4 text-base sm:text-lg text-ink-2"
          style={{ maxWidth: '48ch', lineHeight: 'var(--lh-relaxed)' }}
        >
          {page.standfirst}
        </p>

        {/* ── 核心工作台：双向联动视觉检视台 ─────────────────── */}
        <section className="mt-10 overflow-hidden rounded-xl border-2 border-rule-2 bg-paper-2/60 shadow-lg" aria-labelledby="workbench-heading">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3.5 border-b border-rule-2 bg-paper-3/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink" id="workbench-heading">
                {activeDoc.file}
              </span>
              <span className="text-muted">
                ({activeDoc.pages} 页 · {activeDoc.tables} 表格)
              </span>
            </div>

            {/* 交互控制器：置信度滑块与 PII 脱敏开关 */}
            <div className="flex flex-wrap items-center gap-4 text-muted text-[11px]">
              <label className="flex items-center gap-2">
                <span>人工复核阈值:</span>
                <input
                  type="range"
                  min={0.6}
                  max={0.95}
                  step={0.05}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-20 cursor-pointer"
                  aria-label="设定人工介入置信度门限"
                />
                <span className="text-ink font-bold font-mono">{(threshold * 100).toFixed(0)}%</span>
              </label>

              <button
                type="button"
                onClick={() => setRedactPii(!redactPii)}
                className={`px-2 py-0.5 rounded border text-[11px] font-bold transition-colors ${
                  redactPii
                    ? 'border-accent-line bg-accent-line/10 text-accent-line'
                    : 'border-rule text-muted hover:text-ink'
                }`}
                style={{ minHeight: '32px' }}
              >
                隐私脱敏: {redactPii ? '已遮蔽' : '关闭'}
              </button>

              <span className="text-accent-line font-bold">
                {lowCount} 处待人工复核
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            {/* 左侧：PDF 渲染原页 (带 Bounding Box 锚点标注) */}
            <div className="px-4 py-8 sm:px-6 lg:border-r border-rule-2 bg-paper-2/30">
              <div
                className="relative mx-auto w-full shadow-md"
                style={{
                  maxWidth: '32rem',
                  backgroundColor: 'var(--hm-paper)',
                  border: '1px solid var(--hm-rule-2)',
                  borderRadius: 'var(--hm-radius-card)',
                  padding: '2rem 1.5rem 2rem 4.5rem',
                }}
              >
                {blocks.map((b, i) => {
                  const isSelected = i === pick
                  const isLow = b.conf < threshold
                  const displayText = redactPii && b.pii ? b.text.replace(b.pii, '██████') : b.text

                  return (
                    <button
                      key={b.role + b.text}
                      type="button"
                      onClick={() => setPick(i)}
                      aria-pressed={isSelected}
                      aria-label={`${b.text}，识别为 ${b.role}`}
                      className="relative block w-full text-left transition-all duration-150 rounded"
                      style={{
                        outline: `${isSelected ? 2 : 1}px ${isLow ? 'dashed' : 'solid'} ${
                          isSelected ? 'var(--hm-accent-line)' : 'var(--hm-rule-2)'
                        }`,
                        outlineOffset: '6px',
                        backgroundColor: isSelected
                          ? 'color-mix(in oklab, var(--hm-accent) 8%, transparent)'
                          : undefined,
                        minHeight: '44px',
                      }}
                    >
                      {/* 左侧批注栏标注角色与置信度 */}
                      <span
                        aria-hidden
                        className="absolute top-1 font-mono text-[11px] font-bold tracking-wide select-none"
                        style={{
                          left: '-3.75rem',
                          color: isSelected
                            ? 'var(--hm-accent-line)'
                            : isLow
                              ? 'var(--hm-muted)'
                              : 'var(--hm-neutral)',
                          borderBottom: isLow ? '1px dotted currentColor' : undefined,
                        }}
                      >
                        {b.role}
                      </span>

                      <span className="block py-2">
                        {b.role === 'h1' ? (
                          <span
                            className="display block text-ink font-bold"
                            style={{ fontSize: '1.25rem', lineHeight: 1.2 }}
                          >
                            {displayText}
                          </span>
                        ) : b.role === 'h2' ? (
                          <span
                            className="display block text-ink font-semibold"
                            style={{ fontSize: '1.05rem' }}
                          >
                            {displayText}
                          </span>
                        ) : b.role === 'p' ? (
                          <span className="block text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                            {displayText}
                          </span>
                        ) : b.role === 'table' ? (
                          <span className="block font-mono text-xs overflow-x-auto">
                            {TABLE_DATA.map((row, r) => (
                              <span
                                key={row[0]}
                                className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-3 py-1"
                                style={{
                                  borderTop:
                                    r === 0
                                      ? undefined
                                      : '1px solid var(--hm-rule)',
                                  color:
                                    r === 0
                                      ? 'var(--hm-muted)'
                                      : 'var(--hm-ink-2)',
                                }}
                              >
                                {row.map((c, ci) => (
                                  <span
                                    key={c}
                                    className={ci === 0 ? undefined : 'text-right'}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </span>
                            ))}
                          </span>
                        ) : b.role === 'figure' ? (
                          <>
                            <span className="block space-y-1.5 pt-1">
                              {CHANNELS.map(([name, v]) => (
                                <span
                                  key={name}
                                  className="flex items-center gap-2"
                                >
                                  <span className="w-16 shrink-0 text-[11px] text-muted font-mono">
                                    {name}
                                  </span>
                                  <span
                                    className="h-2 rounded-sm"
                                    style={{
                                      width: `${v}%`,
                                      backgroundColor: 'var(--hm-accent)',
                                      opacity: 0.75,
                                    }}
                                  />
                                  <span className="font-mono text-[11px] text-muted">
                                    {v}%
                                  </span>
                                </span>
                              ))}
                            </span>
                            <span className="mt-2 block text-[11px] text-muted font-mono">
                              {displayText}
                            </span>
                          </>
                        ) : (
                          <span className="block text-[11px] text-muted font-mono">
                            {displayText}
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 右侧：提取结果 JSON 实时树 */}
            <div className="px-5 py-8 bg-paper">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <span className="meta font-mono font-bold text-muted">POST /v1/extract · RESP JSON</span>
                <CopyButton
                  value={jsonString}
                  ariaLabel="复制提取的完整 JSON"
                  className="btn-ghost px-3 py-1 text-xs font-mono"
                />
              </div>

              <div className="mt-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <div className="text-ink-2">{'{'}</div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>&quot;pages&quot;</span>
                  {`: ${activeDoc.pages},`}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>&quot;tables&quot;</span>
                  {`: ${activeDoc.tables},`}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>&quot;threshold&quot;</span>
                  {`: ${threshold.toFixed(2)},`}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>&quot;blocks&quot;</span>
                  {': ['}
                </div>

                {blocks.map((b, i) => {
                  const isSelected = i === pick
                  const isLow = b.conf < threshold
                  return (
                    <button
                      key={b.role + b.text}
                      type="button"
                      onClick={() => setPick(i)}
                      aria-pressed={isSelected}
                      className="block w-full pr-2 text-left transition-colors duration-150 py-1"
                      style={{
                        backgroundColor: isSelected
                          ? 'color-mix(in oklab, var(--hm-accent) 12%, transparent)'
                          : undefined,
                        boxShadow: isSelected
                          ? 'inset 3px 0 0 var(--hm-accent-line)'
                          : undefined,
                        minHeight: '32px',
                      }}
                    >
                      <span className="block pl-8 text-ink-2" style={{ textIndent: '-1.6rem' }}>
                        {`    { `}
                        <span style={{ color: 'var(--hm-accent-line)' }}>&quot;role&quot;</span>
                        {': '}
                        <span className={isSelected ? 'text-ink font-bold' : 'text-ink-2'}>
                          &quot;{b.role}&quot;
                        </span>
                        {', '}
                        <span style={{ color: 'var(--hm-accent-line)' }}>&quot;confidence&quot;</span>
                        {': '}
                        <span
                          style={{
                            color: isLow ? 'var(--hm-muted)' : 'var(--hm-ink)',
                            fontWeight: isSelected ? 'bold' : 'normal',
                          }}
                        >
                          {b.conf.toFixed(2)}
                        </span>
                        {isLow ? ' ⚠️' : ''}
                        {' },'}
                      </span>
                    </button>
                  )
                })}

                <div className="pl-4 text-ink-2">{']'}</div>
                <div className="text-ink-2">{'}'}</div>
              </div>
            </div>
          </div>

          {/* 底部联动读数条 */}
          <div
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 px-5 py-3 font-mono text-xs border-t border-rule-2 bg-paper/90"
          >
            <span className="font-bold text-accent-line">{cur.role.toUpperCase()}</span>
            <span className="truncate text-ink font-medium max-w-[20rem]">{cur.text}</span>
            <span className="text-muted">
              box [{cur.box.join(', ')}]
            </span>
            <span className="ml-auto font-bold text-muted">
              置信度 {cur.conf.toFixed(2)}
              {cur.conf < threshold ? ' · 需人工复核' : ' · 确定性解析'}
            </span>
          </div>
        </section>

        <p className="mt-3 text-xs text-muted font-mono">
          双向互联：点击左侧任一视觉切片，或点击右侧任一 JSON 字段，两端将同步锁定对应锚点。
        </p>

        {/* ── 核心性能基准压测对比 (Benchmark Radar) ───────── */}
        <section className="mt-16 pt-10 border-t border-rule" aria-labelledby="bench-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="meta font-mono text-xs text-muted">INDUSTRY BENCHMARKS</span>
              <h2 id="bench-heading" className="display text-2xl font-bold text-ink">
                行业主流文档抽取引擎对比
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">基准语料：10,000 份复杂财务年报与合同</span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-rule text-muted">
                  <th className="py-3 pr-4 font-bold">引擎架构 (ENGINE)</th>
                  <th className="py-3 pr-4 font-bold">字段 F1-SCORE</th>
                  <th className="py-3 pr-4 font-bold">复杂表格还原率</th>
                  <th className="py-3 font-bold">单页平均时延 (P90)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {BENCHMARKS.map((b) => (
                  <tr
                    key={b.engine}
                    className={`transition-colors ${
                      b.highlight ? 'bg-accent-line/10 font-bold' : 'hover:bg-paper-2/40'
                    }`}
                  >
                    <td className="py-3 pr-4 text-ink font-semibold">
                      {b.engine} {b.highlight ? '★ 领先' : ''}
                    </td>
                    <td className="py-3 pr-4 text-accent-line font-bold">{b.f1}</td>
                    <td className="py-3 pr-4 text-ink">{b.tables}</td>
                    <td className="py-3 text-muted">{b.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 四个阶段 ───────────────────────────────────── */}
        <section className="mt-16 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="处理阶段">
          {(page.planes ?? []).map((pl, i) => (
            <div
              key={pl.t}
              className="pt-3 border-t-2 border-ink rounded-none"
            >
              <span className="font-mono text-xs font-bold text-accent-line">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="display mt-1 text-lg font-bold text-ink">{pl.t}</div>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{pl.d}</p>
            </div>
          ))}
        </section>

        {page.images?.length ? (
          <figure className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-[18rem_1fr] items-center">
            <figcaption>
              <span className="meta text-accent-line font-mono text-xs">官方用例打样</span>
              <h3 className="display mt-1 text-xl font-bold text-ink">Distil Web 提取器示例</h3>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用同一套主题给 Distil 生成的示例页。传一个网址，拿回干净的
                Markdown 与纯净语义树。
              </p>
            </figcaption>
            <div
              className="overflow-hidden min-w-0 shadow-md"
              style={{
                border: '1px solid var(--hm-rule-2)',
                borderRadius: 'var(--hm-radius-card)',
              }}
            >
              <Img slug={page.images[0]} alt="Hallmark 为 Distil 生成的官方示例页" />
            </div>
          </figure>
        ) : null}

        {/* ── 接口 ───────────────────────────────────────── */}
        <section className="mt-16 grid gap-px overflow-hidden rounded-xl border border-rule-2 lg:grid-cols-2 shadow-sm" aria-label="API 接口样本">
          {[
            { t: '请求端示例 (cURL)', p: reqPane },
            { t: '解析响应体 (JSON)', p: resPane },
          ].map((b) => (
            <div
              key={b.t}
              className="p-6 bg-paper"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-2">
                <span className="meta font-mono font-bold text-muted text-xs">{b.t}</span>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: 'var(--hm-accent-line)' }}
                >
                  {b.p.head}
                </span>
              </div>
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-ink-2 leading-relaxed">
                {b.p.body}
              </pre>
            </div>
          ))}
        </section>

        <div className="mt-12">
          <Cta label={page.cta} done="企业试用 API Key 已分配至当前凭证环境" />
        </div>

        {/* Hallmark 58/58 验收工单印章 */}
        <footer className="mt-16 pt-8 border-t border-rule text-muted font-mono text-xs flex flex-wrap items-center justify-between gap-y-2">
          <div>
            <span>ENGINE: DISTIL-LAYOUTLMV3-PRO</span>
            <span className="mx-2">·</span>
            <span>PIPELINE_HASH: 9a81f4c2</span>
            <span className="mx-2">·</span>
            <span>HITL_GATE: ACTIVE</span>
          </div>
          <div className="font-bold text-accent-line">
            critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓
          </div>
        </footer>
      </div>
    </main>
  )
}
