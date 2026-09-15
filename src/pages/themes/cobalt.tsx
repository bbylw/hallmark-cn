import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

type Role = 'h1' | 'h2' | 'p' | 'table' | 'figure' | 'footnote'

/**
 * 一块内容 = 左边文档里的一段真实正文 + 右边 JSON 里的一行。
 * 两边都从这一个数组渲染，所以永远对得上，不会各说各的。
 */
const BLOCKS: {
  role: Role
  text: string
  conf: number
  box: [number, number, number, number]
}[] = [
  {
    role: 'h1',
    text: '季度报告 · 二〇二六年第三季度',
    conf: 0.99,
    box: [72, 48, 412, 26],
  },
  { role: 'h2', text: '营业收入', conf: 0.98, box: [72, 212, 260, 24] },
  {
    role: 'p',
    text: '本季度营业收入 4,820 万元，同比增长 18%。',
    conf: 0.97,
    box: [72, 256, 588, 42],
  },
  {
    role: 'table',
    text: '项目 / 本季 / 上季',
    conf: 0.96,
    box: [72, 322, 420, 168],
  },
  {
    role: 'figure',
    text: '图 1 分渠道收入构成',
    conf: 0.71,
    box: [72, 512, 240, 132],
  },
  {
    role: 'footnote',
    text: '注 1 本表数据未经审计，单位万元。',
    conf: 0.62,
    box: [72, 668, 452, 20],
  },
]

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
  const [pick, setPick] = useState(3)
  const cur = BLOCKS[pick]
  const lowCount = BLOCKS.filter((b) => b.conf < LOW).length

  const [req, res] = (page.code?.src ?? '').split('\n\n')
  const pane = (raw: string) => {
    const [head, ...body] = (raw ?? '').split('\n')
    return { head, body: body.join('\n') }
  }
  const reqPane = pane(req)
  const resPane = pane(res)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 抬头 */}
        <span className="meta text-accent-line">{page.discipline}</span>
        <h1
          className="display mt-3 text-ink"
          style={{ fontSize: 'clamp(1.85rem, 3.9vw, 3rem)', lineHeight: 1.08 }}
        >
          {page.title}
        </h1>
        <p
          className="mt-5 text-md text-ink-2"
          style={{ maxWidth: '40ch', lineHeight: 'var(--lh-relaxed)' }}
        >
          {page.standfirst}
        </p>

        {/* ── 工作台 ─────────────────────────────────────── */}
        <div
          className="mt-12 overflow-hidden"
          style={{
            border: '1px solid var(--hm-rule-2)',
            borderRadius: 'var(--hm-radius-card)',
            backgroundColor: 'var(--hm-paper-2)',
          }}
        >
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3"
            style={{ borderBottom: '1px solid var(--hm-rule-2)' }}
          >
            <span className="meta text-ink">
              quarterly-report.pdf · 第 12 页
            </span>
            <span className="meta text-muted">
              24 页 · 6 个表格 · {lowCount} 处待复核
            </span>
          </div>

          <div className="grid lg:grid-cols-2">
            {/* 左：原页 */}
            <div
              className="px-5 py-8 lg:border-r"
              style={{ borderColor: 'var(--hm-rule-2)' }}
            >
              <div
                className="relative mx-auto w-full"
                style={{
                  maxWidth: '30rem',
                  backgroundColor: 'var(--hm-paper)',
                  border: '1px solid var(--hm-rule-2)',
                  borderRadius: 'var(--hm-radius-card)',
                  padding: '2rem 1.5rem 2rem 4.5rem',
                }}
              >
                {BLOCKS.map((b, i) => {
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
                          ? 'color-mix(in oklab, var(--hm-accent) 6%, transparent)'
                          : undefined,
                        transition: 'background-color 200ms ease-out',
                      }}
                    >
                      {/* 角色标在左侧批注栏里：永远不会和相邻区域撞在一起 */}
                      <span
                        aria-hidden
                        className="absolute top-1 font-mono text-[11px] tracking-wide"
                        style={{
                          left: '-3.5rem',
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

                      <span className="block py-3">
                        {b.role === 'h1' ? (
                          <>
                            <span
                              className="display block text-ink"
                              style={{ fontSize: '1.3rem', lineHeight: 1.2 }}
                            >
                              季度报告
                            </span>
                            <span className="mt-1 block text-xs text-muted">
                              二〇二六年第三季度
                            </span>
                          </>
                        ) : b.role === 'h2' ? (
                          <span
                            className="display block text-ink"
                            style={{ fontSize: '1rem' }}
                          >
                            营业收入
                          </span>
                        ) : b.role === 'p' ? (
                          <span className="block text-sm text-ink-2">
                            本季度营业收入 4,820 万元，同比增长 18%。其中订阅收入占 61%。
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
                                      opacity: 0.55,
                                    }}
                                  />
                                  <span className="font-mono text-[11px] text-muted">
                                    {v}%
                                  </span>
                                </span>
                              ))}
                            </span>
                            <span className="mt-2 block text-[11px] text-muted">
                              图 1　分渠道收入构成
                            </span>
                          </>
                        ) : (
                          <span className="block text-[11px] text-muted">
                            注 1　本表数据未经审计，单位：万元。
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
              <div className="meta text-muted">POST /v1/extract</div>
              <div className="mt-4 font-mono text-[11px] leading-relaxed">
                <div className="text-ink-2">{'{'}</div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>"pages"</span>
                  {': 24,'}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>
                    "tables"
                  </span>
                  {': 6,'}
                </div>
                <div className="pl-4 text-ink-2">
                  <span style={{ color: 'var(--hm-accent-line)' }}>
                    "blocks"
                  </span>
                  {': ['}
                </div>

                {BLOCKS.map((b, i) => {
                  const on = i === pick
                  const low = b.conf < LOW
                  return (
                    <button
                      key={b.role + b.text}
                      type="button"
                      onClick={() => setPick(i)}
                      aria-pressed={on}
                      className="block w-full pr-2 text-left transition-colors duration-200"
                      style={{
                        backgroundColor: on
                          ? 'color-mix(in oklab, var(--hm-accent) 10%, transparent)'
                          : undefined,
                        boxShadow: on
                          ? 'inset 2px 0 0 var(--hm-accent-line)'
                          : undefined,
                      }}
                    >
                      <span className="block pl-8 text-ink-2" style={{ textIndent: '-1.6rem' }}>
                        {`    { `}
                        <span style={{ color: 'var(--hm-accent-line)' }}>
                          "role"
                        </span>
                        {': '}
                        <span className={on ? 'text-ink' : 'text-ink-2'}>
                          "{b.role}"
                        </span>
                        {', '}
                        <span style={{ color: 'var(--hm-accent-line)' }}>
                          "text"
                        </span>
                        {': "'}
                        <span className="text-ink">{b.text}</span>
                        {'", '}
                        <span style={{ color: 'var(--hm-accent-line)' }}>
                          "box"
                        </span>
                        {`: [${b.box.join(', ')}], `}
                        <span style={{ color: 'var(--hm-accent-line)' }}>
                          "confidence"
                        </span>
                        {': '}
                        <span
                          style={{
                            color: low ? 'var(--hm-muted)' : 'var(--hm-ink)',
                            borderBottom: low
                              ? '1px dotted var(--hm-muted)'
                              : undefined,
                          }}
                        >
                          {b.conf.toFixed(2)}
                        </span>
                        {low ? '  ← 待复核' : ''}
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

          {/* 读数条：两个面板共用一条，说明此刻选中的是哪一块 */}
          <div
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1 px-5 py-3 font-mono text-xs"
            style={{ borderTop: '1px solid var(--hm-rule-2)' }}
          >
            <span className="text-accent-line">{cur.role}</span>
            <span className="text-ink">{cur.text}</span>
            <span className="text-muted">
              box [{cur.box.join(', ')}]
            </span>
            <span className="ml-auto text-muted">
              置信度 {cur.conf.toFixed(2)}
              {cur.conf < LOW ? ' · 待复核' : ''}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">
          点左边的任意一块，或右边任意一行，两边会一起亮。
        </p>

        {/* ── 四个阶段 ───────────────────────────────────── */}
        <div className="mt-16 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {(page.planes ?? []).map((pl, i) => (
            <div
              key={pl.t}
              className="pt-3"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <span className="font-mono text-xs text-accent-line">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="display mt-1 text-md text-ink">{pl.t}</div>
              <p className="mt-1 text-sm text-muted">{pl.d}</p>
            </div>
          ))}
        </div>

        {/* ── 官方示例：这是 Hallmark 自己生成的页，不是本站的界面，
               图注必须说清楚，不能拿它冒充本页的产品截图 ───────── */}
        {page.images?.length ? (
          <figure className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-[18rem_1fr]">
            <figcaption>
              <span className="meta text-muted">官方示例</span>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用同一套主题给 Distil 生成的示例页。同一个接口换了个用法：传一个网址，拿回干净的
                Markdown。
              </p>
            </figcaption>
            <div
              className="overflow-hidden"
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
          className="mt-16 grid gap-px lg:grid-cols-2"
          style={{ backgroundColor: 'var(--hm-rule-2)' }}
        >
          {[
            { t: '请求', p: reqPane },
            { t: '响应', p: resPane },
          ].map((b) => (
            <div
              key={b.t}
              className="p-6"
              style={{ backgroundColor: 'var(--hm-paper)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="meta text-muted">{b.t}</span>
                <span
                  className="font-mono text-xs"
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
        <p className="mt-4 text-sm text-muted" style={{ maxWidth: '52ch' }}>
          {page.code?.out}
        </p>

        <div className="mt-12">
          <Cta label={page.cta} done="key 已发邮箱" />
        </div>
      </div>
    </main>
  )
}
