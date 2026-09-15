import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Stamp } from '../../components/archetypes'
import { Cta } from './cta'

interface LedgerRow {
  id: string
  date: string
  who: string
  category: string
  bank: number
  inv: number
  exp: number
  matchType: 'exact' | 'partial' | 'pending'
  invNumber?: string
}

interface InvoiceDetail {
  id: string
  title: string
  type: string
  invNumber: string
  seller: string
  buyer: string
  amountNoTax: string
  tax: string
  taxRate: string
  total: string
  status: 'verified' | 'pending_action'
  ruleCode: string
  ocrConfidence: string
  deductible: string
}

const ROWS: LedgerRow[] = [
  {
    id: 'row-1',
    date: '03-14',
    who: '阿里云计算服务代扣',
    category: '技术基础设施 · 服务器机房',
    bank: -2480,
    inv: -2480,
    exp: 0,
    matchType: 'exact',
    invNumber: '26312000000084719201',
  },
  {
    id: 'row-2',
    date: '03-15',
    who: '特种纸张包装材料行',
    category: '生产原材料 · 印刷包材耗材',
    bank: -860,
    inv: -860,
    exp: 0,
    matchType: 'exact',
    invNumber: '26312000000084719202',
  },
  {
    id: 'row-3',
    date: '03-17',
    who: '出差高铁客票与专车',
    category: '差旅交通费 · 客户现场交付',
    bank: -1240,
    inv: 0,
    exp: -1240,
    matchType: 'partial',
    invNumber: 'G1028-20260317-08A',
  },
  {
    id: 'row-4',
    date: '03-18',
    who: '大客户年度项目二期回款',
    category: '主营业务收入 · 软件授权年费',
    bank: 18000,
    inv: 18000,
    exp: 0,
    matchType: 'exact',
    invNumber: '26312000000084719204',
  },
  {
    id: 'row-5',
    date: '03-19',
    who: '未知银行扣费 (招商银行)',
    category: '金融机构未决借记流水',
    bank: -320,
    inv: 0,
    exp: 0,
    matchType: 'pending',
  },
]

const INVOICE_SAMPLES: InvoiceDetail[] = [
  {
    id: 'aliyun',
    title: '阿里云计算服务专票',
    type: '增值税电子专用发票 (全电发票)',
    invNumber: '2631 2000 0000 8471 9201',
    seller: '阿里云计算有限公司 (91330106673959654K)',
    buyer: '杭州莱杰网络科技有限公司 (91330108MA2H888888)',
    amountNoTax: '¥ 2,339.62',
    tax: '¥ 140.38',
    taxRate: '6%',
    total: '¥ 2,480.00',
    status: 'verified',
    ruleCode: 'CAS-22 财务凭证自动生成',
    ocrConfidence: '99.94%',
    deductible: '可全额抵扣进项税额 ¥ 140.38',
  },
  {
    id: 'paper',
    title: '特种纸业耗材采购发票',
    type: '增值税电子专用发票',
    invNumber: '2631 2000 0000 8471 9202',
    seller: '苏州雅致特种纸业有限公司 (91320500745582312X)',
    buyer: '杭州莱杰网络科技有限公司 (91330108MA2H888888)',
    amountNoTax: '¥ 761.06',
    tax: '¥ 98.94',
    taxRate: '13%',
    total: '¥ 860.00',
    status: 'verified',
    ruleCode: '原料库房自动冲销与入库核销',
    ocrConfidence: '99.82%',
    deductible: '可全额抵扣进项税额 ¥ 98.94',
  },
  {
    id: 'train',
    title: '京沪高铁电子客票行程单',
    type: '铁路电子客票 (增值税电子普通发票)',
    invNumber: 'G1028-20260317-08A (E-Ticket)',
    seller: '中国铁路上海局集团有限公司',
    buyer: '张明远 (乘车人身份证 330106********1920)',
    amountNoTax: '¥ 1,137.61',
    tax: '¥ 102.39',
    taxRate: '9% (旅客运输)',
    total: '¥ 1,240.00',
    status: 'verified',
    ruleCode: '差旅报销标准限额智能校验通过',
    ocrConfidence: '99.76%',
    deductible: '计算抵扣增值税进项税额 ¥ 102.39',
  },
  {
    id: 'bank-fee',
    title: '招商银行月度借记结单',
    type: '银企直连电子扣费凭单 (银行对账单回单)',
    invNumber: 'CMB-E-20260319-901238',
    seller: '招商银行股份有限公司杭州分行营业部',
    buyer: '基本存款账户 (6214 **** **** 8890)',
    amountNoTax: '¥ 320.00',
    tax: '¥ 0.00 (增值税免税项目)',
    taxRate: '免税',
    total: '¥ 320.00',
    status: 'pending_action',
    ruleCode: '科目：660201 财务费用-金融机构服务费',
    ocrConfidence: '100% (直连原始报文)',
    deductible: '免税项目，据实税前列支管理费',
  },
]

const BANK_CHANNELS = [
  { bank: '招商银行 (CMB)', protocol: 'CBS 直连专线', ping: '38 ms', status: '在线实时对账', txToday: '8,420 笔' },
  { bank: '工商银行 (ICBC)', protocol: 'NC 银企互联专网', ping: '42 ms', status: '在线实时对账', txToday: '12,940 笔' },
  { bank: '农业银行 (ABC)', protocol: '银企通安全隧道', ping: '55 ms', status: '在线实时对账', txToday: '4,150 笔' },
  { bank: '建设银行 (CCB)', protocol: 'E路捷直联专线', ping: '46 ms', status: '在线实时对账', txToday: '7,890 笔' },
  { bank: '中国银行 (BOC)', protocol: 'BOCNET 金融报文', ping: '62 ms', status: '在线实时对账', txToday: '3,210 笔' },
  { bank: '浦发银行 (SPDB)', protocol: 'API OpenBank 专线', ping: '49 ms', status: '在线实时对账', txToday: '2,980 笔' },
]

/**
 * 现代极简对账系统 Coral 独立页。
 * 遵循 Hallmark Skills (v1.1.0) 规范打造高可靠金融物态感：
 * 1. 顶部金融级可用性与 SLA 状态条
 * 2. 核心三边对账底稿（银行流水 vs 税务发票 vs 报销审批）
 * 3. 异常单据一键确权归因与记账凭证平衡校验（保持测试契约）
 * 4. 全国统一数电发票要素解析与查验防重报工作台
 * 5. 银企直连多通道链路健康拓扑监控
 * 6. 标准 CAS / GAAP 记账凭证借贷分录引擎
 * 7. 底部 Hallmark Stamp 58/58 生产印章
 */
export function CoralPage({ page }: { page: ThemePage }) {
  const [step, setStep] = useState(2)
  const [resolvedFee, setResolvedFee] = useState(false)
  const [activeInvoiceId, setActiveInvoiceId] = useState('aliyun')

  const uid = useId()
  const planes = page.planes ?? []
  const money = (n: number) => (n === 0 ? '' : n.toLocaleString('zh-CN'))

  const activeInvoice = INVOICE_SAMPLES.find((inv) => inv.id === activeInvoiceId) || INVOICE_SAMPLES[0]

  const caption = [
    '尚未接入账套账户，三方底稿保持静息待命状态。',
    '直连接入后，银行流水毫秒级汇入，发票与报销切片正在批量核验。',
    '三方数据全部齐备，95% 笔数自动合拢对齐，仅余一笔未知扣费待财务确权。',
    '异常单据已精准归因为银行账户管理年费，双向会计分录平衡，可一键归档。',
  ][step]

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-28 pt-10 sm:pt-14 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>

        {/* 顶部微状态条：金融合规、SLA 与对账引擎指标 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 text-accent-line font-bold border border-accent/30">
              <span className="size-2 rounded-full bg-accent-line animate-pulse" />
              LEDGERLINE RECON ENGINE · V4.2
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-muted">等保三级金融认证</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">SM4 国密端到端加密</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2">
            <span>自动平账率：99.7%</span>
            <span className="text-accent-line font-bold">对账时差：&lt; 180 ms</span>
          </div>
        </header>

        {/* 刊头与核心主张 */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-b border-rule pb-8">
          <div className="max-w-[55ch]">
            <span className="meta font-mono font-bold text-accent-line tracking-wider">
              {page.discipline} · AUTOMATED THREE-WAY RECONCILIATION
            </span>
            <h1
              className="display mt-3 text-ink font-bold"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                lineHeight: 1.05,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed"
            >
              {page.standfirst}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-paper-2 border border-rule text-ink-2">
              今日已自动平账：<strong className="text-ink">39,590 笔</strong>
            </span>
            <span className="text-muted">
              直连全国商业银行、全电发票系统与 ERP
            </span>
          </div>
        </div>

        {/* 主体两栏布局：左侧交互流程步骤 + 右侧三方对账底稿工作台 */}
        <div className="mt-10 grid gap-x-12 gap-y-12 lg:grid-cols-12 items-start">
          
          {/* 左侧：粘住的自动化步骤管线 */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line block">
                PIPELINE STAGES · 核心作业四阶段
              </span>
              <p className="mt-1 text-xs text-muted">
                点击步骤可动态回溯对账状态演进
              </p>

              <ol className="mt-5 divide-y divide-rule border-b border-t border-rule">
                {planes.map((p, i) => {
                  const on = step === i
                  return (
                    <li key={p.t}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setStep(i)}
                        className={`flex w-full gap-4 py-4 text-left transition-all min-h-14 ${
                          on
                            ? 'border-l-4 border-accent-line bg-paper-2/80 pl-3 font-semibold'
                            : 'border-l-4 border-transparent pl-3 text-ink-2 hover:bg-paper-2/40'
                        }`}
                      >
                        <span
                          className="meta font-mono mt-0.5 w-7 shrink-0 font-bold text-sm"
                          style={{
                            color: on
                              ? 'var(--hm-accent-line)'
                              : 'var(--hm-muted)',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span className="display block text-base sm:text-lg font-bold text-ink">
                            {p.t}
                          </span>
                          <span className="mt-1 block text-xs sm:text-sm text-muted leading-normal">
                            {p.d}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              {/* 步骤解说卡片 */}
              <div className="mt-5 rounded-lg border border-rule bg-paper-2/60 p-4 text-xs font-mono text-ink-2 leading-relaxed">
                <span className="text-accent-line font-bold block mb-1">
                  当前阶段诊断 · STAGE NOTE:
                </span>
                {caption}
              </div>

              <div className="mt-6">
                <Cta label={page.cta} done="已接入首套企业账套沙盒环境" />
              </div>
            </div>
          </div>

          {/* 右侧：三方底稿与异常归因操作台 */}
          <div className="lg:col-span-7">
            <div
              className="overflow-hidden rounded-xl shadow-sm border border-rule bg-paper"
            >
              <div className="overflow-x-auto">
                <div className="min-w-136">
                  {/* 表头控制条 */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-rule bg-paper-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span className="font-mono text-xs font-bold text-ink">三月三方实时对账底稿</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-paper border border-rule text-muted">LIVE LEDGER</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">账套：杭州总仓人民币基本户</span>
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent/15 text-accent-line border border-accent/30"
                        aria-live="polite"
                      >
                        阶段 {step + 1} / 4
                      </span>
                    </div>
                  </div>

                  {/* 字段列名 */}
                  <div
                    className="grid grid-cols-[1.6fr_repeat(3,minmax(0,1fr))] gap-2 px-5 py-3 font-mono text-[11px] font-bold text-muted border-b border-rule bg-paper/50"
                  >
                    <span>记账日期 / 对手方 / 业务科目</span>
                    <span className="text-right">银行流水 (CNY)</span>
                    <span className="text-right">税务发票 (CNY)</span>
                    <span className="text-right">报销与审批</span>
                  </div>

                  {/* 数据行渲染 */}
                  {ROWS.map((r) => {
                    const bad = r.inv === 0 && r.exp === 0
                    const isConfirmed = resolvedFee || step >= 3
                    return (
                      <div
                        key={r.id}
                        className="grid grid-cols-[1.6fr_repeat(3,minmax(0,1fr))] items-center gap-2 px-5 py-3.5 font-mono text-xs transition-colors duration-200 border-b border-rule/60 last:border-b-0"
                        style={{
                          backgroundColor:
                            bad && step >= 2 ? 'var(--hm-paper-3)' : undefined,
                          borderLeft:
                            bad && step >= 2
                              ? '4px solid var(--hm-accent)'
                              : '4px solid transparent',
                          opacity: step === 0 ? 0.35 : 1,
                        }}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-bold text-ink flex items-center gap-1.5">
                            <span>{r.date}</span>
                            <span>{r.who}</span>
                          </div>
                          <div className="truncate text-[10px] text-muted mt-0.5">
                            {r.category}
                          </div>
                        </div>

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
                                ? ci === 2 && bad
                                  ? isConfirmed
                                    ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                                    : 'text-amber-700 dark:text-amber-300 font-bold'
                                  : 'text-ink font-mono'
                                : 'text-muted'
                            }`}
                          >
                            {c.show && c.v ? c.v : '—'}
                          </span>
                        ))}
                      </div>
                    )
                  })}

                  {/* 底部平账汇总与交互操作栏 (保持测试契约) */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-rule bg-paper-2"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium text-ink-2">
                        {step === 0
                          ? '等待连接账套中...'
                          : step === 1
                            ? '银行流水已就绪，进项发票与报销凭证导入中'
                            : step === 2
                              ? resolvedFee
                                ? '全单据完成确权归因，准备生成标准凭证包'
                                : '四笔流水完全对齐，一笔银行扣费待确权'
                              : '账目零差额，已生成标准会计记账凭证包'}
                      </span>
                      {step === 2 && !resolvedFee && (
                        <button
                          type="button"
                          onClick={() => setResolvedFee(true)}
                          className="min-h-11 rounded-md bg-accent-line text-paper px-3 py-1.5 font-mono text-xs font-bold shadow hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
                        >
                          <span>⚡</span>
                          <span>一键确认为账户管理费</span>
                        </button>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-ink px-3 py-1 rounded bg-paper border border-rule">
                      未决差额：¥ {step === 2 && !resolvedFee ? '320.00' : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 联动装置：会计记账凭证实时分录预览 (Journal Entry Preview) */}
            <div className="mt-6 rounded-lg border border-rule bg-paper-2/40 p-5 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2.5">
                <span className="font-bold text-accent-line">
                  记账凭证预览 · JOURNAL VOUCHER (自动生成)
                </span>
                <span className="text-muted">
                  凭证字号：记字第 2026-03-088 号
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-paper border border-rule">
                  <span className="text-muted block">借方科目 (DEBIT):</span>
                  <span className="text-ink font-bold block mt-0.5">
                    {resolvedFee || step >= 3
                      ? '660201 财务费用 - 金融机构手续费'
                      : '待确权挂账科目 (未入账)'}
                  </span>
                  <span className="text-accent-line font-mono block mt-1">
                    金额：¥ {resolvedFee || step >= 3 ? '320.00' : '0.00'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-paper border border-rule">
                  <span className="text-muted block">贷方科目 (CREDIT):</span>
                  <span className="text-ink font-bold block mt-0.5">
                    100201 银行存款 - 招商银行杭州分行基本户
                  </span>
                  <span className="text-ink-2 font-mono block mt-1">
                    金额：¥ {resolvedFee || step >= 3 ? '320.00' : '0.00'}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-muted border-t border-rule/60 pt-2">
                <span>借贷试算平衡校验：{resolvedFee || step >= 3 ? '借贷相等 (¥320.00 = ¥320.00) ✓' : '待处理'}</span>
                <span>制单人：AI Recon Daemon · 复核：系统已验</span>
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────
            装置 2：全国统一样式发票要素解析与查验工作台 (Digital Invoice Inspector)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-inv-title`} className="mt-16 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 02 · DIGITAL INVOICE INSPECTOR & ANTI-FRAUD
              </span>
              <h2 id={`${uid}-inv-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                数电发票全要素验真 · 光学特征与防重报台账
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              直连全国增值税发票查验平台 · 结构化字段秒级提取
            </span>
          </div>

          <p className="mt-3 text-sm text-ink-2 max-w-[72ch]" style={{ lineHeight: 1.6 }}>
            全面原生兼容数电专票、数电普票、OFD/XML 电子底账、火车行程单与打车电子凭单。进项发票一键碰撞防重复报销黑名单，自动核算进项税抵扣额：
          </p>

          {/* 4 种样本票据切换按钮 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INVOICE_SAMPLES.map((inv) => {
              const active = inv.id === activeInvoiceId
              return (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => setActiveInvoiceId(inv.id)}
                  className={`min-h-13 p-3 rounded-lg text-left transition-all border flex flex-col justify-between ${
                    active
                      ? 'border-accent-line bg-accent/15 text-ink font-bold shadow-sm'
                      : 'border-rule bg-paper/60 text-ink-2 hover:border-rule-2 hover:text-ink'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{inv.title}</span>
                  <span className="text-[10px] font-mono text-muted mt-1 truncate">{inv.total}</span>
                </button>
              )
            })}
          </div>

          {/* 选中发票深度要素解剖 */}
          <div className="mt-6 rounded-lg border border-rule bg-paper p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink text-sm">{activeInvoice.title}</span>
                <span className="text-muted hidden sm:inline">|</span>
                <span className="text-muted">{activeInvoice.type}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                税局官方校验真伪：查验一致 ✓
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2 p-3.5 rounded bg-paper-2/40 border border-rule/70">
                <div>
                  <span className="text-muted block text-[10px] uppercase">发票号码 (全电 20 位)</span>
                  <span className="text-ink font-bold text-sm tracking-wide">{activeInvoice.invNumber}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">销售方名称及税号</span>
                  <span className="text-ink-2 truncate block">{activeInvoice.seller}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">购买方名称及税号</span>
                  <span className="text-ink-2 truncate block">{activeInvoice.buyer}</span>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded bg-paper-2/40 border border-rule/70">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">不含税金额</span>
                    <span className="text-ink font-bold">{activeInvoice.amountNoTax}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">税率</span>
                    <span className="text-ink font-bold">{activeInvoice.taxRate}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">税额</span>
                    <span className="text-accent-line font-bold">{activeInvoice.tax}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-rule/60 flex items-baseline justify-between">
                  <span className="text-muted text-[10px] uppercase">价税合计</span>
                  <span className="text-ink font-bold text-base">{activeInvoice.total}</span>
                </div>

                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold pt-1">
                  ★ {activeInvoice.deductible}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rule/60 text-xs font-mono text-muted">
              <span>光学字符识别置信度：{activeInvoice.ocrConfidence}</span>
              <span>对账规程：{activeInvoice.ruleCode}</span>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 3：银企直连通道与专线拓扑监控 (Bank Direct-Link Cluster)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-bank-title`} className="mt-14 rounded-xl border border-rule bg-paper-2/40 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 03 · DIRECT BANK LINK TELEMETRY & CLUSTERING
              </span>
              <h2 id={`${uid}-bank-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                银企直连专线链路状态与今日流水通道
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              ISO 20022 / MT940 格式即时解析 · 零掉单保障
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BANK_CHANNELS.map((b) => (
              <div
                key={b.bank}
                className="p-4 rounded-lg border border-rule bg-paper flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-ink">{b.bank}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {b.ping}
                    </span>
                  </div>
                  <span className="text-xs text-muted font-mono block mt-1">
                    协议：{b.protocol}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-rule/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-2">{b.status}</span>
                  <span className="text-accent-line font-bold">{b.txToday}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 4：企业财务合规、数据审计追踪与安全背书
            ──────────────────────────────────────────────────────────── */}
        <section className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg border border-rule bg-paper">
            <span className="text-accent-line font-bold block mb-1">01 · 凭证不可篡改链</span>
            <p className="text-ink-2 leading-relaxed">
              每一笔对账匹配与确权记录均写入基于 SHA-256 签名的审计哈希追踪日志，满足外部四大会计师事务所审计穿透要求。
            </p>
          </div>
          <div className="p-4 rounded-lg border border-rule bg-paper">
            <span className="text-accent-line font-bold block mb-1">02 · 多币种汇率锁定</span>
            <p className="text-ink-2 leading-relaxed">
              支持美元、欧元、港币、日元等 14 种币种，直连中国外汇交易中心中行折算价，自动计算结售汇汇兑损益并自动分录。
            </p>
          </div>
          <div className="p-4 rounded-lg border border-rule bg-paper">
            <span className="text-accent-line font-bold block mb-1">03 · ERP 主流账套对接</span>
            <p className="text-ink-2 leading-relaxed">
              支持用友 NC/U8、金蝶云星空、SAP S/4HANA、Oracle NetSuite 一键双向凭证同步，无需任何二次手工导表导入。
            </p>
          </div>
        </section>

        {/* 底部 Hallmark 规范生产印章与六维评分 */}
        <footer className="mt-20">
          <Stamp page={page} />
        </footer>

      </div>
    </main>
  )
}
export default CoralPage
