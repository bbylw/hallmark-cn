import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 真实集体调解案卷数据
 */
interface CaseDossier {
  id: string
  title: string
  location: string
  dispute: string
  outcome: string
  days: number
  savedAmount: string
  legalArticle: string
  summary: string
}

const CASE_DOSSIERS: CaseDossier[] = [
  {
    id: 'CASE-01',
    title: '老棉纺厂筒子楼 #402 恶意加租案',
    location: '第六街区红砖四巷 12 号',
    dispute: '二房东以“翻新公共楼道”为由单方加租 38%（月增 ¥1,300），并扬言逾期停水换锁。',
    outcome: '裁定加租无效，依照老旧管网自然折旧标准锁定年涨幅 3.5%，补签 3 年租住安定契约。',
    days: 11,
    savedAmount: '¥15,600/年',
    legalArticle: '《第六街区租住安定备忘》第四条 · 不得利用基础修缮变相暴利加租',
    summary: '联盟派出两名志愿核算员进场审计，调取该栋楼 1988 年原始图纸，证明所谓“管道改造”属于市政免费雨污分流工程，二房东无权向租客摊派改造成本。',
  },
  {
    id: 'CASE-02',
    title: '南街街角手作豆腐坊逼迁平抑案',
    location: '第六街区商业街 48 号',
    dispute: '物业管理方引进连锁餐饮，勒令已租住 12 年的社区豆腐坊十日内清退并加租 60%。',
    outcome: '启动街区便民微业态保护条例，全街区 182 名街坊连署请愿，维持原租金续签。',
    days: 18,
    savedAmount: '¥38,000/年',
    legalArticle: '《社区生活微业态地役权保护协定》第十二条 · 历史商户优先续租权',
    summary: '豆腐坊承载了整条街早起长辈的日常口粮。联盟通过召开公共听证会，证明引入外来连锁将破坏街区人行道烟火气，最终街道居委会与房东达成租金补贴共识。',
  },
  {
    id: 'CASE-03',
    title: '青年合租套房断水断电强制解约案',
    location: '向阳新村 3 幢 601 室',
    dispute: '房东因私人物业出售，在租期尚有 8 个月的情况下擅自切断电表并扣留全额押金。',
    outcome: '向住建与治安部门调取执法见证，房东全额退还押金并依据合同法支付双倍解约违约金。',
    days: 4,
    savedAmount: '¥7,600',
    legalArticle: '民法典第七百二十五条 · 买卖不破租赁原则',
    summary: '房产所有权转让绝不影响原有效租约履行。联盟法律小组半小时内到达现场拍摄电箱封条证据，出具正式律师催告函，迫使违约房东当场低头道歉。',
  },
  {
    id: 'CASE-04',
    title: '退租押金所谓“墙皮自然折旧”扣款案',
    location: '东风路 22 号单身公寓',
    dispute: '租期满两年退租时，中介以“踢脚线微磨损、白墙光照色差”为由克扣全部押金 ¥4,500。',
    outcome: '经对照联盟《自然物理损耗鉴定白皮书》，全额无损追回押金。',
    days: 6,
    savedAmount: '¥4,500',
    legalArticle: '《民法典》第七百一十条 · 承租人按照约定的方法使用致使租赁物受到损耗的不承担赔偿责任',
    summary: '阳光自然照晒引起的墙面白漆泛黄属于不可避免的自然物理折旧，中介试图以新房交付标准苛求退租客属于典型敲诈。出示入住前照片对照表后全额追讨成功。',
  },
]

/**
 * 6 条常见租房霸王条款自检指南
 */
interface UnfairClause {
  id: string
  badText: string
  lawFlaw: string
  fixProposal: string
}

const UNFAIR_CLAUSES: UnfairClause[] = [
  {
    id: 'CLAUSE-01',
    badText: '“甲方有权根据市场行情随时调整租金，乙方不同意则视为自动解除合同。”',
    lawFlaw: '违背合同法意思自治原则，剥夺租客在租期内的合理信赖保护，属典型不可生效格式条款。',
    fixProposal: '改为：“在约定租赁期内，租金保持不变。租期届满若续约，涨跌幅以本市居民消费价格指数（CPI）为准，且不得超过 5%。”',
  },
  {
    id: 'CLAUSE-02',
    badText: '“租赁期间房屋及所有附属设施（包括老旧空调、老化电线）损坏一律由乙方自费修缮。”',
    lawFlaw: '房东依法负有保障房屋及既有大件家电安全可用的法定义务。',
    fixProposal: '改为：“基础管线、防水层及房屋自带固定电器的自然老化由甲方负责在报修 48 小时内出资维修；逾期乙方垫付费用直接冲抵次月租金。”',
  },
  {
    id: 'CLAUSE-03',
    badText: '“若房东需售房，提前七天通知乙方即可解约，且不支付任何赔偿金。”',
    lawFlaw: '直接违反《民法典》“买卖不破租赁”强制性规定。',
    fixProposal: '改为：“租赁期内甲方出售房产，原租赁合同对新买家继续具有完全约束力；若双方协议解约，甲方应至少提前 60 天书面通知并赔偿双倍月租。”',
  },
  {
    id: 'CLAUSE-04',
    badText: '“退租时若房屋有任何使用痕迹，甲方有权全额扣除押金作为翻新费。”',
    lawFlaw: '混淆“自然损耗”与“恶意破坏”，变相非法剥夺租房押金。',
    fixProposal: '改为：“正常生活使用造成的墙皮自然变色、地面细微划痕属于合理折旧，甲方不得以此为由扣除押金；押金应于交房验收当日如数退还。”',
  },
  {
    id: 'CLAUSE-05',
    badText: '“甲方持有备用钥匙，有权随时进入房屋巡查室内卫生与用电安全。”',
    lawFlaw: '严重侵犯承租人的宪法级住宅安宁权与隐私权，涉嫌非法侵入住宅。',
    fixProposal: '改为：“未经乙方书面同意，甲方不得擅自进入租赁房屋。因安全紧急排查需提前 24 小时预约，并由乙方在场陪同。”',
  },
  {
    id: 'CLAUSE-06',
    badText: '“发生任何租房纠纷，双方只能提交甲方所在地指定的商业仲裁委员会处理。”',
    lawFlaw: '利用高昂异地仲裁费设置维权门槛，阻碍普通百姓诉讼权利。',
    fixProposal: '改为：“发生争议优先由第六街区调解委员会组织听证协商；协商不成，由房屋所在地人民法院管辖起诉，维权成本极低。”',
  },
]

/**
 * 租户联盟 Manifesto 宣言主题。
 * 遵循 Hallmark Skills (v1.1.0) 规范打造
 * 包含：
 * 1. 顶部街区红线状态条与维权基金池实时遥测
 * 2. 街区首屏大字宣言与全宽红色态度带
 * 3. 街坊租金合规自查与三维成本天平（保留 audit_manifesto.mjs 断言）
 * 4. 4 大真实集体调解结案案卷展陈
 * 5. 租约 6 大霸王条款避坑自检指南
 * 6. 连署名册与户数计数器（保留 button:has-text("在线连署支持宣言") 与 67->68 递增）
 * 7. 实体听证会入场凭单与 Hallmark 58/58 印章
 */
export function ManifestoPage({ page }: { page: ThemePage }) {
  const body = page.body ?? []

  const [signed, setSigned] = useState(false)
  const [rent, setRent] = useState(3800)
  const [hike, setHike] = useState(25)

  // 当前激活案卷
  const [activeCaseId, setActiveCaseId] = useState('CASE-01')

  // 展开条款
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>('CLAUSE-01')

  const uid = useId()
  const hikeAmount = Math.round(rent * (hike / 100))
  const newRent = rent + hikeAmount
  const isExcessive = hike > 5
  const isSevere = hike > 15

  const activeCase = CASE_DOSSIERS.find((c) => c.id === activeCaseId) || CASE_DOSSIERS[0]

  const STATS = [
    ['124', '去年收到加租通知的户数', '平均涨三成二，没有一户拿到书面理由'],
    [signed ? '68' : '67', '现在在联盟里的户数', signed ? '感谢你的签署，你已加入街区连署名册（编号 #D06-068）' : '我们不提供法律意见，我们提供彼此的名字和电话号码'],
    ['¥184k', '街坊互助诉讼兜底基金', '全部来自社区义卖与随喜捐助，专款专用支持穷租客'],
  ]

  return (
    <main
      id="main"
      className="relative pb-20 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      {/* 顶部街区红线状态条 */}
      <div className="border-b-2 border-rule bg-paper-2/90 px-(--page-gutter) py-2 text-xs font-mono">
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent text-accent-ink font-bold">
              <span className="size-2 rounded-full bg-accent-ink animate-pulse" />
              SOLIDARITY WATCH · ACTIVE
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-ink font-bold">第六街区租户联盟 · 2026 维权支部</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">调解胜诉率：96.4%</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2 tabular-nums">
            <span>指导红线：年涨幅 ≤ 5%</span>
            <span className="text-accent-line font-bold">已连署：{signed ? 68 : 67} 户</span>
          </div>
        </div>
      </div>

      {/* 首屏：极具张力的海报版式，字压在左下 */}
      <section
        className="flex min-h-[52dvh] flex-col px-(--page-gutter) pt-12 sm:pt-16 pb-10"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-rule pb-4">
          <span className="meta font-mono font-bold text-accent-line tracking-wider">
            {page.discipline} · DISTRICT 06 TENANTS SOLIDARITY
          </span>
          <span className="meta font-mono text-muted">
            二〇二六 · 第六街区支部公报
          </span>
        </div>

        <h1
          className="display mt-auto pt-10 text-ink text-balance"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 10.5rem)',
            lineHeight: 0.98,
            letterSpacing: 'var(--hm-tracking-display)',
            overflowWrap: 'break-word',
          }}
        >
          房租
          <br />
          不是天气
        </h1>
      </section>

      {/* 红条：全页唯一一句巨幅导语 */}
      <section
        className="px-(--page-gutter)"
        style={{ backgroundColor: 'var(--hm-accent)' }}
      >
        <div
          className="py-12 sm:py-16"
          style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        >
          <div className="text-xs font-mono font-bold text-accent-ink/80 uppercase tracking-widest mb-3">
            THE SOLIDARITY MANIFESTO · 核心信条
          </div>
          <p
            className="display"
            style={{
              color: 'var(--hm-accent-ink)',
              fontSize: 'clamp(1.75rem, 4.6vw, 3.25rem)',
              lineHeight: 1.14,
              maxWidth: '32ch',
            }}
          >
            {page.standfirst}
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          装置 1：街坊租金合规自查与三维成本天平
          保留原有 audit_manifesto.mjs 全部选择器与逻辑
          ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby={`${uid}-calc-title`}
        className="px-(--page-gutter) pt-16"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="border-2 border-ink bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <div>
              <span className="meta font-mono font-bold text-accent-line">
                DEVICE 01 · RENT HIKE LEGALITY AUDIT
              </span>
              <h2 id={`${uid}-calc-title`} className="display text-2xl sm:text-3xl text-ink mt-1">
                装置 · 街坊租金合规自查台
              </h2>
            </div>
            <div className="font-mono text-xs text-muted flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent-line" />
              <span>依据《第六街区租住安定指导备忘》第四条</span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-stretch">
            {/* 左侧：双输入滑块控制区 */}
            <div className="lg:col-span-6 space-y-6">
              <label className="block bg-paper-2/60 p-4 sm:p-5 border border-rule">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-ink text-sm">当前每月合同租金</span>
                  <span className="font-mono text-base font-bold text-ink tabular-nums">¥{rent.toLocaleString('en-US')} /月</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={12000}
                  step={100}
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="mt-3 min-h-11 w-full cursor-pointer accent-accent"
                  aria-label="输入当前月租金"
                  aria-valuetext={`每月租金 ¥${rent.toLocaleString('en-US')}`}
                />
                <div className="mt-1.5 flex justify-between gap-2 text-[11px] font-mono text-muted">
                  <span>¥1,500（合租单间）</span>
                  <span className="hidden sm:inline">¥5,000（标准套房）</span>
                  <span>¥12,000（商住临街）</span>
                </div>
              </label>

              <label className="block bg-paper-2/60 p-4 sm:p-5 border border-rule">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-ink text-sm">房东要求的加租幅度</span>
                  <span className="font-mono text-base font-bold text-accent-line tabular-nums">+{hike}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={hike}
                  onChange={(e) => setHike(Number(e.target.value))}
                  className="mt-3 min-h-11 w-full cursor-pointer accent-accent"
                  aria-label="输入房东要求的加租幅度百分比"
                  aria-valuetext={`加租幅度 ${hike}%`}
                />
                <div className="mt-1.5 flex justify-between gap-2 text-[11px] font-mono text-muted">
                  <span>0%（平盘）</span>
                  <span className="text-ink font-bold">5%（法定保护线）</span>
                  <span className="text-accent-line font-bold">25%（严重违规）</span>
                  <span>50%（恶意逼迁）</span>
                </div>
              </label>
            </div>

            {/* 右侧：法务审计计算结果与证据天平 */}
            <div className="lg:col-span-6 flex flex-col justify-between border-2 border-rule bg-paper-2/40 p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-rule/70 pb-3 tabular-nums">
                  <span className="text-xs font-mono uppercase text-muted font-bold">月度收支差额</span>
                  <span className="font-mono text-xl font-bold text-accent-line">+¥{hikeAmount.toLocaleString('en-US')} /月</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 tabular-nums">
                  <span className="text-xs font-mono uppercase text-muted font-bold">新租金总额</span>
                  <span className="font-mono text-lg font-bold text-ink">¥{newRent.toLocaleString('en-US')} /月</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted font-mono tabular-nums">
                  <span>全年将额外向房东多付：</span>
                  <span className="text-accent-line font-bold">¥{(hikeAmount * 12).toLocaleString('en-US')} /年</span>
                </div>
              </div>

              {/* 法律指导红线警告面板 */}
              <div className="mt-6 border-t-2 border-rule pt-4">
                {isSevere ? (
                  <div className="border-2 border-accent bg-accent/15 p-4 text-xs text-ink text-pretty" style={{ lineHeight: 1.8 }}>
                    <span className="font-bold text-accent-line text-sm block mb-1 tabular-nums">
                      <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 bg-accent" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
                      涨幅达 +{hike}%，已触碰恶意逼迁红线！
                    </span>
                    《第六街区租住安定指导备忘》第四条明确规定：年涨幅超过 15% 属于推定逼迁行为。房东无权单方毁约换锁，联盟将为你提供免费全程陪同协商与民法典抗辩证据包。
                  </div>
                ) : isExcessive ? (
                  <div className="border-2 border-accent/60 bg-accent/10 p-4 text-xs text-ink text-pretty" style={{ lineHeight: 1.8 }}>
                    <span className="font-bold text-accent-line text-sm block mb-1">
                      <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rotate-45 bg-accent-line" />
                      涨幅超过法定指导线 5%
                    </span>
                    房东依法必须提前 60 天出具由注册造价师签字的修缮通胀核算审计明细，并经租户书面同意方可调整，否则租客有权继续按原租金标准通过银行转账支付。
                  </div>
                ) : (
                  <div className="border border-rule bg-paper p-4 text-xs text-muted text-pretty" style={{ lineHeight: 1.8 }}>
                    <span className="font-bold text-ink text-sm block mb-1">
                      ✓ 处于常规通胀指导区间
                    </span>
                    涨幅在 5% 以内符合常规生活成本微调。建议在续约时核实合同是否包含了公共照明、门禁维护等公摊费用明细，谨防二次隐藏收费。
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          装置 2：集体抗辩真实案卷展陈 (Arbitration Case Dossiers)
          ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby={`${uid}-case-title`}
        className="px-(--page-gutter) pt-16"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-rule pb-3">
          <div>
            <span className="meta font-mono font-bold text-accent-line">
              DEVICE 02 · COLLECTIVE ARBITRATION DOSSIERS
            </span>
            <h2 id={`${uid}-case-title`} className="display text-2xl sm:text-3xl text-ink mt-1">
              街坊集体抗辩结案案卷 · 实录档案
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            真实胜利判例 · 证明团结比任何霸王条款更有效
          </span>
        </div>

        {/* 4 大案卷标签卡 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CASE_DOSSIERS.map((c) => {
            const active = c.id === activeCaseId
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCaseId(c.id)}
                className={`min-h-18 p-4 text-left transition-all border-2 flex flex-col justify-between ${
                  active
                    ? 'border-accent bg-accent/20 text-ink font-bold'
                    : 'border-rule bg-paper-2/60 text-ink-2 hover:border-rule-2 hover:text-ink'
                }`}
              >
                <div className="flex items-center justify-between w-full tabular-nums">
                  <span className="font-mono text-xs text-accent-line font-bold">{c.id}</span>
                  <span className="text-[11px] font-mono text-muted">{c.days} 天调解结案</span>
                </div>
                <div className="text-xs font-bold mt-1.5 leading-snug line-clamp-2">{c.title}</div>
              </button>
            )
          })}
        </div>

        {/* 选中案卷深度解剖 */}
        <div className="mt-6 border-2 border-rule bg-paper-2/50 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs text-accent-line font-bold">{activeCase.id} · {activeCase.location}</span>
              <h3 className="display text-xl sm:text-2xl text-ink mt-1">
                {activeCase.title}
              </h3>
            </div>
            <div className="bg-accent/15 px-3 py-1.5 border border-accent/40 font-mono text-xs text-accent-line font-bold">
              为街坊挽回直接损失：{activeCase.savedAmount}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 text-[13px]">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] text-muted font-bold block mb-1.5 uppercase tracking-wider">争议原发事实</span>
                <p className="text-ink-2 bg-paper p-3.5 border border-rule text-pretty" style={{ lineHeight: 1.8 }}>{activeCase.dispute}</p>
              </div>
              <div>
                <span className="font-mono text-[11px] text-accent-line font-bold block mb-1.5 uppercase tracking-wider">最终调解协议</span>
                <p className="text-ink bg-paper p-3.5 border border-accent/40 font-medium text-pretty" style={{ lineHeight: 1.8 }}>{activeCase.outcome}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] text-muted font-bold block mb-1.5 uppercase tracking-wider">抗辩法定依据</span>
                <p className="text-ink-2 bg-paper p-3.5 border border-rule font-mono text-pretty" style={{ lineHeight: 1.8 }}>{activeCase.legalArticle}</p>
              </div>
              <div>
                <span className="font-mono text-[11px] text-muted font-bold block mb-1.5 uppercase tracking-wider">调解纪要手记</span>
                <p className="text-ink-2 bg-paper p-3.5 border border-rule text-pretty" style={{ lineHeight: 1.8 }}>{activeCase.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          装置 3：租约 6 大霸王条款自检指南 (Unfair Terms Guide)
          ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby={`${uid}-terms-title`}
        className="px-(--page-gutter) pt-16"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-rule pb-3">
          <div>
            <span className="meta font-mono font-bold text-accent-line">
              DEVICE 03 · LEASE AGREEMENT DEFENSE MANUAL
            </span>
            <h2 id={`${uid}-terms-title`} className="display text-2xl sm:text-3xl text-ink mt-1">
              租约六大霸王条款自检指南 · 避坑对照
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            签字前对照核验 · 绝不签不平等条约
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {UNFAIR_CLAUSES.map((term) => {
            const isExpanded = expandedClauseId === term.id
            return (
              <div
                key={term.id}
                className="border-2 border-rule bg-paper-2/40 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedClauseId(isExpanded ? null : term.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-4 text-left flex flex-wrap items-center justify-between gap-3 min-h-13"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-accent-line">{term.id}</span>
                    <span className="text-sm font-bold text-ink">{term.badText}</span>
                  </div>
                  <span className="font-mono text-xs text-muted">
                    {isExpanded ? '收起剖析 ↑' : '展开法律对策 ↓'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-rule/60 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="p-3.5 bg-accent/15 border border-accent/40 text-ink text-pretty" style={{ lineHeight: 1.8 }}>
                      <span className="font-bold text-accent-line block mb-1.5">【法律瑕疵剖析】</span>
                      {term.lawFlaw}
                    </div>
                    <div className="p-3.5 bg-paper border border-rule text-ink-2 text-pretty" style={{ lineHeight: 1.8 }}>
                      <span className="font-bold text-ink block mb-1.5">【联盟推荐修改示范条款】</span>
                      {term.fixProposal}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          核心宣言条目 + 右侧钉住的大字数字与连署动作栏
          保留原有 audit_manifesto.mjs 全部测试契约：
          button:has-text("在线连署支持宣言") -> text=68
          ──────────────────────────────────────────────────────────── */}
      <section
        className="px-(--page-gutter) pt-16"
        style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
      >
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12 items-start">
          {/* 左侧：逐行压下的宣言条款 */}
          <ol className="lg:col-span-7">
            <div className="text-xs font-mono font-bold text-accent-line uppercase tracking-wider mb-2">
              THE FOUR ARTICLES · 纲领四条
            </div>
            {body.map((p, i) => (
              <li
                key={p}
                className="flex gap-6 py-8"
                style={{ borderTop: '2px solid var(--hm-rule)' }}
              >
                <span className="meta w-8 shrink-0 font-mono font-bold text-accent-line text-lg">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  className="display text-ink"
                  style={{
                    fontSize: 'clamp(1.35rem, 2.8vw, 2.15rem)',
                    lineHeight: 1.22,
                    maxWidth: '32ch',
                  }}
                >
                  {p}
                </p>
              </li>
            ))}
            <li style={{ borderTop: '2px solid var(--hm-rule)' }} />
          </ol>

          {/* 右侧：钉住的硬核数据与在线连署卡 */}
          <aside className="lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-16 border-2 border-rule bg-paper-2/70 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between border-b-2 border-rule pb-3">
                <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  SOLIDARITY ROSTER · 街坊连署台账
                </span>
                <span className="font-mono text-[11px] text-accent-line font-bold">
                  {signed ? '名册已更新 ✓' : '等待你的加入'}
                </span>
              </div>

              {/* 关键指标大字 */}
              <div className="mt-4 divide-y-2 divide-rule">
                {STATS.map(([n, k, d]) => (
                  <div key={k} className="py-4 first:pt-0">
                    <div
                      className="display text-accent-line"
                      style={{
                        fontSize: 'clamp(2.8rem, 6.5vw, 4.5rem)',
                        lineHeight: 0.9,
                      }}
                    >
                      {n}
                    </div>
                    <div className="mt-2 text-sm font-bold text-ink">{k}</div>
                    <div
                      className="mt-1 text-xs text-muted"
                      style={{ lineHeight: 'var(--lh-relaxed)' }}
                    >
                      {d}
                    </div>
                  </div>
                ))}
              </div>

              {/* 连署按键与行动号召 (保留测试所需按钮文本) */}
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={() => setSigned(true)}
                  disabled={signed}
                  className={`min-h-12 w-full px-4 py-3 font-mono text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                    signed
                      ? 'border-accent bg-accent/20 text-accent-line'
                      : 'border-accent bg-accent text-accent-ink hover:opacity-90'
                  }`}
                  aria-pressed={signed}
                >
                  {signed ? '✓ 已连署名册 (户数 +1)' : '在线连署支持宣言'}
                </button>

                <div className="pt-2 [&_.btn]:w-full">
                  <Cta label={page.cta || '进店'} done="✓ 已为你预留听证席位" />
                </div>

                <div className="border border-rule bg-paper p-3.5 text-xs text-muted font-mono" style={{ lineHeight: 1.8 }}>
                  下周三晚七点，社区中心二楼会议室，请带好纸质租约与房东历次微信催租记录，有备而来。
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

    </main>
  )
}
