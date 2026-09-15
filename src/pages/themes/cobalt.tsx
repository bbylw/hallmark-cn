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
}

const SAMPLES: Record<string, { name: string; file: string; pages: number; tables: number; blocks: BlockItem[] }> = {
  report: {
    name: '季度财务报告',
    file: 'quarterly-report-2026.pdf · 第 12 页',
    pages: 24,
    tables: 6,
    blocks: [
      { role: 'h1', text: '季度报告 · 二〇二六年第三季度', conf: 0.99, box: [72, 48, 412, 26] },
      { role: 'h2', text: '营业收入', conf: 0.98, box: [72, 212, 260, 24] },
      { role: 'p', text: '本季度营业收入 4,820 万元，同比增长 18%。其中订阅收入占 61%。', conf: 0.97, box: [72, 256, 588, 42] },
      { role: 'table', text: '项目 / 本季 / 上季 财务指标汇总', conf: 0.96, box: [72, 322, 420, 168] },
      { role: 'figure', text: '图 1 分渠道收入构成条形图', conf: 0.71, box: [72, 512, 240, 132] },
      { role: 'footnote', text: '注 1 本表数据未经审计，单位：万元。', conf: 0.62, box: [72, 668, 452, 20] },
    ],
  },
  contract: {
    name: '技术委托合同',
    file: 'master-service-agreement.pdf · 第 3 页',
    pages: 18,
    tables: 2,
    blocks: [
      { role: 'h1', text: '服务等级协议 (SLA) 补充条款', conf: 0.99, box: [72, 50, 380, 24] },
      { role: 'h2', text: '可用性与补偿标准', conf: 0.96, box: [72, 180, 220, 22] },
      { role: 'p', text: '乙方承诺月度服务可用性不低于 99.95%，如发生单次持续 15 分钟以上不可用，按对应月费 10% 抵扣。', conf: 0.95, box: [72, 220, 560, 36] },
      { role: 'footnote', text: '注 2 计划内停机维护不计入故障时间，须提前 72 小时书面通知。', conf: 0.68, box: [72, 420, 480, 20] },
    ],
  },
}

/** 低于这个置信度的块，页面上要看得出来「需要人工复核」 */
const LOW = 0.8

const TABLE = [
  ['项目', '本季', '上季'],
  ['营业收入', '4,820', '4,085'],
  ['营业成本', '2,140', '1,906'],
  ['毛利', '2,680', '2,179'],
]

const CHANNELS = [
  ['直营', 38],
  ['分销', 27],
  ['线上', 19],
  ['海外', 16],
] as const

/**
 * 内容提取 API。装置是一张工作台：
 * 左边是原页（真实正文，不是占位框），右边是提取出来的 JSON，
 * 点任何一边的任意一块，另一边对应的那一行跟着亮。
 */
export function CobaltPage({ page }: { page: ThemePage }) {
  const [sampleKey, setSampleKey] = useState<'report' | 'contract'>('report')
  const [pick, setPick] = useState(2)

  const activeDoc = SAMPLES[sampleKey]
  const blocks = activeDoc.blocks
  const cur = blocks[pick] ?? blocks[0]
  const lowCount = blocks.filter((b) => b.conf < LOW).length

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
      blocks: blocks.map((b) => ({
        role: b.role,
        text: b.text,
        box: b.box,
        confidence: b.conf,
        needs_review: b.conf < LOW,
      })),
    },
    null,
    2,
  )

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 抬头 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <span className="meta font-mono font-bold text-accent-line">
            {page.discipline} · COBALT DOCUMENT PARSER
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-muted text-[11px]">测试样本:</span>
            <button
              type="button"
              onClick={() => {
                setSampleKey('report')
                setPick(2)
              }}
              className={`rounded border px-2.5 py-0.5 text-xs ${
                sampleKey === 'report'
                  ? 'border-ink bg-ink text-paper font-bold'
                  : 'border-rule text-muted hover:border-ink'
              }`}
            >
              季度财报
            </button>
            <button
              type="button"
              onClick={() => {
                setSampleKey('contract')
                setPick(1)
              }}
              className={`rounded border px-2.5 py-0.5 text-xs ${
                sampleKey === 'contract'
                  ? 'border-ink bg-ink text-paper font-bold'
                  : 'border-rule text-muted hover:border-ink'
              }`}
            >
              SLA 合同
            </button>
          </div>
        </div>

        <h1
          className="display mt-6 text-ink font-bold"
          style={{ fontSize: 'clamp(1.85rem, 3.9vw, 3rem)', lineHeight: 1.1 }}
        >
          {page.title}
        </h1>
        <p
          className="mt-4 text-md text-ink-2"
          style={{ maxWidth: '44ch', lineHeight: 'var(--lh-relaxed)' }}
        >
          {page.standfirst}
        </p>

        {/* ── 工作台 ─────────────────────────────────────── */}
        <div
          className="mt-12 overflow-hidden rounded-lg"
          style={{
            border: '1px solid var(--hm-rule-2)',
            backgroundColor: 'var(--hm-paper-2)',
          }}
        >
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3 border-b border-rule-2"
          >
            <span className="meta font-mono font-bold text-ink">
              {activeDoc.file}
            </span>
            <span className="meta font-mono text-xs text-muted">
              {activeDoc.pages} 页 · {activeDoc.tables} 表格 · {lowCount} 处待人工复核
            </span>
          </div>

          <div className="grid lg:grid-cols-2">
            {/* 左：原页 */}
            <div
              className="px-5 py-8 lg:border-r border-rule-2"
            >
              <div
                className="relative mx-auto w-full"
                style={{
                  maxWidth: '32rem',
                  backgroundColor: 'var(--hm-paper)',
                  border: '1px solid var(--hm-rule-2)',
                  borderRadius: 'var(--hm-radius-card)',
                  padding: '2rem 1.5rem 2rem 4.5rem',
                }}
              >
                {blocks.map((b, i) => {
                  const on = i === pick
                  const low = b.conf < LOW
                  return (
                    <button
                      key={b.role + b.text}
                      type="button"
                      onClick={() => setPick(i)}
                      aria-pressed={on}
                      aria-label={`${b.text}，识别为 ${b.role}`}
                      className="relative block w-full text-left"
                      style={{
                        outline: `${on ? 2 : 1}px ${low ? 'dashed' : 'solid'} ${
                          on ? 'var(--hm-accent-line)' : 'var(--hm-rule-2)'
                        }`,
                        outlineOffset: '6px',
                        borderRadius: '3px',
                        backgroundColor: on
                          ? 'color-mix(in oklab, var(--hm-accent) 8%, transparent)'
                          : undefined,
                        transition: 'background-color 150ms ease-out',
                      }}
                    >
                      {/* 角色标在左侧批注栏里 */}
                      <span
                        aria-hidden
                        className="absolute top-1 font-mono text-[11px] font-bold tracking-wide"
                        style={{
                          left: '-3.75rem',
                          color: on
                            ? 'var(--hm-accent-line)'
                            : low
                              ? 'var(--hm-muted)'
                              : 'var(--hm-neutral)',
                          borderBottom: low ? '1px dotted currentColor' : undefined,
                        }}
                      >
                        {b.role}
                      </span>

                      <span className="block py-2.5">
                        {b.role === 'h1' ? (
                          <span
                            className="display block text-ink font-bold"
                            style={{ fontSize: '1.25rem', lineHeight: 1.2 }}
                          >
                            {b.text}
                          </span>
                        ) : b.role === 'h2' ? (
                          <span
                            className="display block text-ink font-semibold"
                            style={{ fontSize: '1.05rem' }}
                          >
                            {b.text}
                          </span>
                        ) : b.role === 'p' ? (
                          <span className="block text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                            {b.text}
                          </span>
                        ) : b.role === 'table' ? (
                          <span className="block font-mono text-xs">
                            {TABLE.map((row, r) => (
                              <span
                                key={row[0]}
                                className="grid grid-cols-[1fr_auto_auto] gap-x-5 py-1"
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
                            <span className="block space-y-1.5">
                              {CHANNELS.map(([name, v]) => (
                                <span
                                  key={name}
                                  className="flex items-center gap-2"
                                >
                                  <span className="w-8 shrink-0 text-[11px] text-muted">
                                    {name}
                                  </span>
                                  <span
                                    className="h-2 rounded-sm"
                                    style={{
                                      width: `${v}%`,
                                      backgroundColor: 'var(--hm-accent)',
                                      opacity: 0.65,
                                    }}
                                  />
                                  <span className="font-mono text-[11px] text-muted">
                                    {v}%
                                  </span>
                                </span>
                              ))}
                            </span>
                            <span className="mt-2 block text-[11px] text-muted">
                              {b.text}
                            </span>
                          </>
                        ) : (
                          <span className="block text-[11px] text-muted">
                            {b.text}
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 右：提取结果 */}
            <div className="px-5 py-8">
              <div className="flex items-center justify-between">
                <span className="meta font-mono font-bold text-muted">POST /v1/extract · RESP</span>
                <CopyButton
                  value={jsonString}
                  ariaLabel="复制提取的完整 JSON"
                  className="btn-ghost px-2.5 py-1 text-xs font-mono"
                />
              </div>

              <div className="mt-4 font-mono text-[11px] leading-relaxed">
                <div className="text-ink-2">{'{'}</div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>"pages"</span>
                  {`: ${activeDoc.pages},`}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>"tables"</span>
                  {`: ${activeDoc.tables},`}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>"blocks"</span>
                  {': ['}
                </div>

                {blocks.map((b, i) => {
                  const on = i === pick
                  const low = b.conf < LOW
                  return (
                    <button
                      key={b.role + b.text}
                      type="button"
                      onClick={() => setPick(i)}
                      aria-pressed={on}
                      className="block w-full pr-2 text-left transition-colors duration-150"
                      style={{
                        backgroundColor: on
                          ? 'color-mix(in oklab, var(--hm-accent) 12%, transparent)'
                          : undefined,
                        boxShadow: on
                          ? 'inset 3px 0 0 var(--hm-accent-line)'
                          : undefined,
                      }}
                    >
                      <span className="block pl-8 text-ink-2" style={{ textIndent: '-1.6rem' }}>
                        {`    { `}
                        <span style={{ color: 'var(--hm-accent-line)' }}>"role"</span>
                        {': '}
                        <span className={on ? 'text-ink font-bold' : 'text-ink-2'}>
                          "{b.role}"
                        </span>
                        {', '}
                        <span style={{ color: 'var(--hm-accent-line)' }}>"confidence"</span>
                        {': '}
                        <span
                          style={{
                            color: low ? 'var(--hm-muted)' : 'var(--hm-ink)',
                            fontWeight: on ? 'bold' : 'normal',
                          }}
                        >
                          {b.conf.toFixed(2)}
                        </span>
                        {low ? ' ⚠️' : ''}
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
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1 px-5 py-3 font-mono text-xs border-t border-rule-2 bg-paper/40"
          >
            <span className="font-bold text-accent-line">{cur.role.toUpperCase()}</span>
            <span className="truncate text-ink font-medium max-w-[20rem]">{cur.text}</span>
            <span className="text-muted">
              box [{cur.box.join(', ')}]
            </span>
            <span className="ml-auto font-bold text-muted">
              置信度 {cur.conf.toFixed(2)}
              {cur.conf < LOW ? ' · 需人工复核' : ' · 确定性解析'}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted font-mono">
          双向互联：点击左侧任一视觉切片，或点击右侧任一 JSON 字段，两端将同步锁定对应锚点。
        </p>

        {/* ── 四个阶段 ───────────────────────────────────── */}
        <div className="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {(page.planes ?? []).map((pl, i) => (
            <div
              key={pl.t}
              className="pt-3"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs font-bold text-accent-line">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="display mt-1 text-md font-bold text-ink">{pl.t}</div>
              <p className="mt-1 text-sm text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>{pl.d}</p>
            </div>
          ))}
        </div>

        {page.images?.length ? (
          <figure className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-[18rem_1fr]">
            <figcaption>
              <span className="meta text-accent-line">官方用例打样</span>
              <h3 className="display mt-1 text-lg font-bold text-ink">Distil Web 提取器示例</h3>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用同一套主题给 Distil 生成的示例页。同一个接口换了个用法：传一个网址，拿回干净的
                Markdown。
              </p>
            </figcaption>
            <div
              className="overflow-hidden min-w-0"
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
        <div
          className="mt-16 grid gap-px overflow-hidden rounded-lg lg:grid-cols-2"
          style={{ backgroundColor: 'var(--hm-rule-2)' }}
        >
          {[
            { t: '请求端示例', p: reqPane },
            { t: '解析响应体', p: resPane },
          ].map((b) => (
            <div
              key={b.t}
              className="p-6"
              style={{ backgroundColor: 'var(--hm-paper)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-2">
                <span className="meta font-mono font-bold text-muted">{b.t}</span>
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: 'var(--hm-accent-line)' }}
                >
                  {b.p.head}
                </span>
              </div>
              <pre className="mt-4 overflow-x-auto font-mono text-xs text-ink-2">
                {b.p.body}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Cta label={page.cta} done="API Key 已发送至预留邮箱" />
        </div>
      </div>
    </main>
  )
}
