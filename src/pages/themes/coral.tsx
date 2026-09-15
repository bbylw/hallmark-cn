import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const ROWS = [
  { date: '03-14', who: '云服务商', bank: -2480, inv: -2480, exp: 0 },
  { date: '03-15', who: '纸张供应商', bank: -860, inv: -860, exp: 0 },
  { date: '03-17', who: '差旅', bank: -1240, inv: 0, exp: -1240 },
  { date: '03-18', who: '客户回款', bank: 18000, inv: 18000, exp: 0 },
  { date: '03-19', who: '未知入账', bank: -320, inv: 0, exp: 0 },
]

/**
 * 对账 SaaS。装置：右边是一份真的三边对账底稿，
 * 左边点第几步，底稿上被强调的东西就跟着换。
 */
export function CoralPage({ page }: { page: ThemePage }) {
  const [step, setStep] = useState(2)
  const planes = page.planes ?? []
  const money = (n: number) => (n === 0 ? '' : n.toLocaleString('zh-CN'))

  const caption = [
    '还没有接账户，底稿是空的。',
    '接上之后，银行流水先落进来，发票和报销还在路上。',
    '三边都到齐了，四笔自动合上，只有一笔对不上。',
    '把这一笔处理掉，剩下的按会计要的格式导出。',
  ][step]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* 左：粘住的流程 */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h1
                className="display text-ink"
                style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', lineHeight: 1.08 }}
              >
                {page.title}
              </h1>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {page.standfirst}
              </p>

              <ol className="mt-9">
                {planes.map((p, i) => {
                  const on = step === i
                  return (
                    <li key={p.t}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setStep(i)}
                        className="flex w-full gap-4 py-4 text-left"
                        style={{
                          borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                          borderLeft: on
                            ? '2px solid var(--hm-accent)'
                            : '2px solid transparent',
                          paddingLeft: '0.75rem',
                        }}
                      >
                        <span
                          className="meta mt-1 w-6 shrink-0"
                          style={{
                            color: on
                              ? 'var(--hm-accent-line)'
                              : 'var(--hm-muted)',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span className="display block text-lg text-ink">
                            {p.t}
                          </span>
                          <span className="mt-1 block text-sm text-muted">
                            {p.d}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              <div className="mt-7">
                <Cta label={page.cta} done="开通了" />
              </div>
            </div>
          </div>

          {/* 右：底稿 */}
          <div className="lg:col-span-7">
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 'var(--hm-radius-card)',
                border: 'var(--hm-rule-card) solid var(--hm-rule)',
              }}
            >
              <div className="overflow-x-auto">
                <div className="min-w-[26rem]">
              <div
                className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3"
                style={{ backgroundColor: 'var(--hm-paper-2)' }}
              >
                <span className="meta text-muted">三月 · 对账底稿</span>
                <span
                  className="meta"
                  style={{ color: 'var(--hm-accent-line)' }}
                  aria-live="polite"
                >
                  {step + 1} / 4
                </span>
              </div>

              <div
                className="grid grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] gap-2 px-5 py-3 font-mono text-[11px] text-muted"
                style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
              >
                <span>日期 / 对手方</span>
                <span className="text-right">银行</span>
                <span className="text-right">发票</span>
                <span className="text-right">报销</span>
              </div>

              {ROWS.map((r) => {
                const bad = r.inv === 0 && r.exp === 0
                return (
                  <div
                    key={r.date}
                    className="grid grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] items-center gap-2 px-5 py-3 font-mono text-xs transition-colors duration-300"
                    style={{
                      borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                      backgroundColor:
                        bad && step >= 3 ? 'var(--hm-paper-3)' : undefined,
                      borderLeft:
                        bad && step >= 2
                          ? '3px solid var(--hm-accent)'
                          : '3px solid transparent',
                      opacity: step === 0 ? 0.25 : 1,
                    }}
                  >
                    <span className="truncate text-ink-2">
                      {r.date} {r.who}
                    </span>
                    {[
                      { show: step >= 1, v: money(r.bank) },
                      { show: step >= 2, v: money(r.inv) },
                      {
                        show: step >= 2,
                        v: bad && step === 3 ? '已确认' : money(r.exp),
                      },
                    ].map((c, ci) => (
                      <span
                        key={ci}
                        className={`text-right ${c.show && c.v ? 'text-ink' : 'text-muted'}`}
                      >
                        {/* 账目底稿的空格用「—」占位，不真空着 */}
                        {c.show && c.v ? c.v : '—'}
                      </span>
                    ))}
                  </div>
                )
              })}

              <div
                className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3"
                style={{
                  borderTop: '1px solid var(--hm-rule)',
                  backgroundColor: 'var(--hm-paper-2)',
                }}
              >
                <span className="text-sm text-muted">
                  {step === 0
                    ? '等待数据'
                    : step === 1
                      ? '银行先到，发票和报销在路上'
                      : step === 2
                        ? '四笔自动合上，一笔待确认'
                        : '确认完那一笔，已导出'}
                </span>
                <span className="font-mono text-xs text-muted">
                  差额 {step === 2 ? '320' : '0'}
                </span>
              </div>
                </div>
              </div>
            </div>

            <p
              className="mt-4 text-sm text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {caption}
            </p>

            {/* FACTS 里另外两条（对接银行 / 导出）和步骤 01、04 重复，只留发票解析 */}
            <div className="mt-10 pt-3" style={{ borderTop: '2px solid var(--hm-ink)' }}>
              <div className="meta text-muted">发票</div>
              <div className="mt-1.5 text-sm text-ink-2">PDF、OFD、截图，都认。</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
