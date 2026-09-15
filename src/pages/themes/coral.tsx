import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface LedgerRow {
  date: string
  who: string
  bank: number
  inv: number
  exp: number
}

const ROWS: LedgerRow[] = [
  { date: '03-14', who: '云服务商代扣', bank: -2480, inv: -2480, exp: 0 },
  { date: '03-15', who: '特种纸张供应商', bank: -860, inv: -860, exp: 0 },
  { date: '03-17', who: '出差动车与打车', bank: -1240, inv: 0, exp: -1240 },
  { date: '03-18', who: '大客户二期回款', bank: 18000, inv: 18000, exp: 0 },
  { date: '03-19', who: '未知银行扣费', bank: -320, inv: 0, exp: 0 },
]

/**
 * 对账 SaaS Coral 主题。
 * 装置：三边对账底稿 + 异常单据一键归因核销。
 */
export function CoralPage({ page }: { page: ThemePage }) {
  const [step, setStep] = useState(2)
  const [resolvedFee, setResolvedFee] = useState(false)
  const planes = page.planes ?? []
  const money = (n: number) => (n === 0 ? '' : n.toLocaleString('zh-CN'))

  const caption = [
    '尚未接入账户，三方底稿保持静息状态。',
    '接入后，银行流水率先毫秒级汇入，发票与报销切片正在途中。',
    '三方数据齐备，95% 笔数自动合拢对齐，仅余一笔待人工确权。',
    '异常单据已精准归因为银行账户管理年费，凭证一键生成并准备导出。',
  ][step]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 刊头 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <span className="meta font-mono font-bold text-accent-line">
            {page.discipline} · AUTOMATED RECONCILIATION
          </span>
          <span className="font-mono text-xs text-muted">
            财务系统直连 · 自动凭证化率 98.2%
          </span>
        </div>

        <div className="mt-8 grid gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* 左：粘住的步骤 */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h1
                className="display text-ink font-bold"
                style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', lineHeight: 1.1 }}
              >
                {page.title}
              </h1>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {page.standfirst}
              </p>

              <ol className="mt-8 divide-y divide-rule border-b border-rule">
                {planes.map((p, i) => {
                  const on = step === i
                  return (
                    <li key={p.t}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setStep(i)}
                        className={`flex w-full gap-4 py-4 text-left transition-all ${
                          on
                            ? 'border-l-4 border-accent-line bg-paper/70 pl-3 font-semibold'
                            : 'border-l-4 border-transparent pl-3 text-ink-2 hover:bg-paper/40'
                        }`}
                      >
                        <span
                          className="meta font-mono mt-0.5 w-6 shrink-0 font-bold"
                          style={{
                            color: on
                              ? 'var(--hm-accent-line)'
                              : 'var(--hm-muted)',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span className="display block text-lg font-bold text-ink">
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

              <div className="mt-8">
                <Cta label={page.cta} done="已接入首套账套沙盒" />
              </div>
            </div>
          </div>

          {/* 右：底稿与操作台 */}
          <div className="lg:col-span-7">
            <div
              className="overflow-hidden rounded-lg shadow-sm"
              style={{
                border: 'var(--hm-rule-card) solid var(--hm-rule)',
              }}
            >
              <div className="overflow-x-auto">
                <div className="min-w-[28rem]">
                  <div
                    className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3 border-b border-rule"
                    style={{ backgroundColor: 'var(--hm-paper-2)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="meta font-mono font-bold text-ink">三月三方实时对账底稿</span>
                      <span className="font-mono text-[10px] text-muted">LIVE LEDGER</span>
                    </div>
                    <span
                      className="meta font-mono font-bold"
                      style={{ color: 'var(--hm-accent-line)' }}
                      aria-live="polite"
                    >
                      步骤 {step + 1} / 4
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-2 px-5 py-3 font-mono text-[11px] font-bold text-muted border-b border-rule"
                  >
                    <span>记账日期 / 对手方</span>
                    <span className="text-right">银行流水</span>
                    <span className="text-right">税务发票</span>
                    <span className="text-right">报销审批</span>
                  </div>

                  {ROWS.map((r) => {
                    const bad = r.inv === 0 && r.exp === 0
                    const isConfirmed = resolvedFee || step >= 3
                    return (
                      <div
                        key={r.date}
                        className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] items-center gap-2 px-5 py-3.5 font-mono text-xs transition-colors duration-200"
                        style={{
                          borderTop: '1px solid var(--hm-rule)',
                          backgroundColor:
                            bad && step >= 2 ? 'var(--hm-paper-3)' : undefined,
                          borderLeft:
                            bad && step >= 2
                              ? '4px solid var(--hm-accent)'
                              : '4px solid transparent',
                          opacity: step === 0 ? 0.3 : 1,
                        }}
                      >
                        <span className="truncate font-medium text-ink">
                          {r.date} {r.who}
                        </span>
                        {[
                          { show: step >= 1, v: money(r.bank) },
                          { show: step >= 2, v: money(r.inv) },
                          {
                            show: step >= 2,
                            v: bad
                              ? isConfirmed
                                ? '✓ 手续费归因'
                                : '待确认 ⚠️'
                              : money(r.exp),
                          },
                        ].map((c, ci) => (
                          <span
                            key={ci}
                            className={`text-right ${
                              c.show && c.v
                                ? ci === 3 && bad
                                  ? isConfirmed
                                    ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                                    : 'text-amber-700 dark:text-amber-300 font-bold'
                                  : 'text-ink'
                                : 'text-muted'
                            }`}
                          >
                            {c.show && c.v ? c.v : '—'}
                          </span>
                        ))}
                      </div>
                    )
                  })}

                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-rule"
                    style={{ backgroundColor: 'var(--hm-paper-2)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-ink-2">
                        {step === 0
                          ? '等待连接账套中...'
                          : step === 1
                            ? '银行流水已就绪，进项发票与报销凭证导入中'
                            : step === 2
                              ? resolvedFee
                                ? '全单据完成确权归因，准备生成凭证'
                                : '四笔流水完全对齐，一笔银行扣费待确权'
                              : '账目零差额，已生成标准会计凭证包'}
                      </span>
                      {step === 2 && !resolvedFee && (
                        <button
                          type="button"
                          onClick={() => setResolvedFee(true)}
                          className="rounded bg-accent-line text-paper px-2 py-0.5 font-mono text-xs font-bold shadow-sm"
                        >
                          一键确认为账户管理费
                        </button>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-ink">
                      未决差额：¥ {step === 2 && !resolvedFee ? '320.00' : '0.00'}
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

            {/* 发票适配规格 */}
            <div className="mt-10 pt-4 border-t-2 border-ink">
              <div className="meta font-mono font-bold text-ink">票据智能解析适配</div>
              <div className="mt-2 text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                全面兼容增值税数电发票 (XML / PDF)、全国统一样式发票、火车票与打车行程单截图，自动提取发票代码与价税合计。
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
