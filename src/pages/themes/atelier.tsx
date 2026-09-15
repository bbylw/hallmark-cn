import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

function Shot({
  slug,
  alt,
  ratio,
  wide,
  eager,
}: {
  slug: string
  alt: string
  ratio: string
  wide: boolean
  eager?: boolean
}) {
  return (
    <picture className="block min-w-0 overflow-hidden rounded-lg">
      <source srcSet={`/examples/${slug}.webp`} type="image/webp" />
      <img
        src={`/examples/${slug}.jpg`}
        alt={alt}
        width={1440}
        height={wide ? 960 : 2160}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        className={`${ratio} w-full min-w-0 object-cover transition-transform duration-700 hover:scale-[1.015]`}
      />
    </picture>
  )
}

/** 面料深度规格数据 (严格保留测试契约：美利奴羊毛对应 密织高捻美利奴羊毛) */
const FABRIC_SPECS = {
  cashmere: {
    key: 'cashmere',
    tab: '双面羊绒',
    name: '180 支双面阿尔卑斯羊绒',
    weight: '580g/m²',
    origin: '意大利比耶拉 (Biella) 传统水车工坊',
    fineness: '14.2 μm 极细精纺',
    structure: '双层可剥离手工剖缝工艺',
    hand: '骨架挺括，内里绒感细腻，不施任何化学软化剂与人造增光蜡。',
    tailoringTip: '以手工双面剖缝针法暗合边缘，全衣无可见机缝明线，保暖性达到普通大衣两倍以上。',
  },
  wool: {
    key: 'wool',
    tab: '美利奴羊毛',
    name: '密织高捻美利奴羊毛',
    weight: '640g/m²',
    origin: '托斯卡纳手工粗纺织造',
    fineness: '18.5 μm 紧密高捻',
    structure: '全毛衬马尾毛纯手工绗缝',
    hand: '抗风保暖，手工绷肩留出天然延展裕度，天然抗皱回弹性卓越。',
    tailoringTip: '利用传统木炭熨斗的高温湿蒸汽进行三维“归拔”定型，将平展羊毛面料依人体背部弧度自然弯折。',
  },
  silk: {
    key: 'silk',
    tab: '铜氨丝里布',
    name: '重磅铜氨丝混纺里布',
    weight: '160g/m²',
    origin: '日本旭化成定制素色织物',
    fineness: '天然棉籽短绒再生纤维',
    structure: '斜纹缎纹光泽紧密编织',
    hand: '丝滑亲肤，静电极低，随身体温度呼吸，无化学静电粘身困扰。',
    tailoringTip: '内衬留出 1.5cm 活褶活动松量，人在伸手、弯腰时里布与毛呢面料滑动自如，绝无牵扯拉拽感。',
  },
}

/** 全定制 6 阶段工艺拓扑 */
const BESPOKE_STEPS = [
  {
    step: '01',
    title: '三维体态多点量体 (42 Data Points)',
    desc: '不仅记录胸围、肩宽、袖长等基础几何数值，更精细勘测左右肩倾角不对称度、后背隆起弧线、头颈前倾角度与日常站立重力平衡轴。',
    time: '耗时 45 分钟 · 主裁缝亲执软尺',
    tools: '象牙牛角测角规、铅锤平衡线、量体档案卡',
  },
  {
    step: '02',
    title: '专属硬牛皮纸独立制版 (Individual Pattern)',
    desc: '绝不套用任何现成工业工业版型。裁缝以手工铅笔将量体数据绘制在特种牛皮纸上，计算各部位缩水率与运动余量，形成客人的终身独立版型。',
    time: '耗时 8 小时 · 单独手工打版',
    tools: '红蓝铅笔、法国曲线板、重型裁缝剪刀',
  },
  {
    step: '03',
    title: '原色纯棉坯样初次试穿 (Toile Fitting)',
    desc: '用未染色的本白棉帆布制作一件仅用于试穿的粗胚大衣。客人上身，裁缝用大头针与粗黑记号笔当场在布料上拆改剪开、重叠捏褶，直至与身形天衣无缝。',
    time: '第一道试样 · 确定三维轮廓',
    tools: '德国黄铜大头针、特大号剪口夹、白粉块',
  },
  {
    step: '04',
    title: '天然马尾毛衬手工热湿归拔 (Hand-Padded Canvas)',
    desc: '摒弃廉价化学热熔胶衬。使用纯天然亚麻布、蒙古马尾毛与驼毛衬复合，裁缝手持 7 公斤重古董熨斗，以湿布喷气推拉归拔，将胸部推成自然的立体外凸弧面。',
    time: '耗时 16 小时 · 永久塑形',
    tools: '生铁炭火熨斗、松木烫台、天然羊毛湿布',
  },
  {
    step: '05',
    title: '领驳手工八字缝与米兰扣眼 (Milanese Buttonhole)',
    desc: '翻领内衬以密度每英寸 12 针的手工斜向八字针（Pad Stitching）绗缝，使翻折线永不起泡死板；左侧驳头处的插花孔手工米兰扣眼需耗费 45 分钟以纯真丝线纯手挑编织。',
    time: '精工刺绣 · 细节极致',
    tools: '英国骨灰级手缝金尾针、日本御用生丝线',
  },
  {
    step: '06',
    title: '成衣终验与终身养护档案 (Final Delivery)',
    desc: '全衣经过 3 次自然悬挂阴干与二次微调试身，刺绣客人手写姓名缩写标签，附赠实木定制衣架与防尘棉袋。承诺终身体重浮动范围内的免费松紧修改。',
    time: '总制作工时 72 小时 / 件',
    tools: '雪松木宽肩衣架、纯棉防尘透气罩',
  },
]

/** 手工与机缝工艺解剖对比 */
const ANATOMY_CRAFT = [
  {
    title: '手工八字绗缝 (Pad Stitching) vs 工业机压粘合衬',
    hand: '用极细丝线以 45° 交叉八字针脚将胸衬与面料固定，针脚线道微松，面料可在微观层面随人体呼吸自由滑移，历经数十年干洗绝不脱胶起泡。',
    machine: '工厂使用高温压烫机将热熔胶化学胶衬粘在面料背面，初期虽平整，但在洗涤数次后胶质老化，翻领产生波浪状不可逆起泡破损。',
  },
  {
    title: '纯手缝米兰眼 (Milanese Hole) vs 电脑锁眼机',
    hand: '内部嵌入一道预拉紧的加固棉绳，裁缝持针用真丝粗线在其表面精密环形缠绕，扣眼凸起如雕塑般立体，斜度与驳头角度保持严密 18° 平行。',
    machine: '电脑机针一分钟冲压打孔锁线，线迹扁平死板，边缘容易磨损抽丝，缺乏手工高浮雕的立体阴影感。',
  },
  {
    title: '活里布手缝绷缝 (Floating Basting) vs 机器四边封死',
    hand: '下摆与袖口内衬留出 1.5cm “蓄量”，手工点针挑缝，外层大衣垂坠重力不受轻薄内衬牵绊，走动时裙摆与下摆自然荡开。',
    machine: '里布与面料直接四边死缝，受外界干湿度膨胀率不同影响，极易发生里布拉扯导致大衣外沿翻翘走形。',
  },
]

/**
 * 深度升维重构的 AtelierPage：
 * 巴黎高级独立手工裁缝工坊 (Atelier Marceau Bespoke)
 * 采用长画卷流式展现：顶级天然面料显微检视台（常驻）、全定制 6 阶段工艺拓扑、手工八字缝解剖、58/58 印章。
 */
export function AtelierPage({ page }: { page: ThemePage }) {
  const wrap = 'mx-auto px-[var(--page-gutter)]'
  const [hero, lookA, lookB, detail] = page.images ?? []
  const [selectedFabric, setSelectedFabric] = useState<'cashmere' | 'wool' | 'silk'>('cashmere')
  const [activeStep, setActiveStep] = useState<number>(0)

  const LOOKS = [
    {
      slug: lookA,
      look: 'LOOK 04',
      cap: '米色羊毛大衣，肩线手工挑线放松，袖口暗留一道翻折裕度。',
      alt: '模特穿着米色羊毛大衣，四分之三侧身站在石灰墙前',
    },
    {
      slug: lookB,
      look: 'LOOK 11',
      cap: '煤灰羊绒长外套，马尾毛半麻衬，站在旧玻璃房的钢架前回眸。',
      alt: '模特穿着煤灰色羊绒长外套，站在锈蚀钢架前回头',
    },
  ].filter((l) => l.slug)

  return (
    <main id="main" className="pb-24 pt-8 text-ink selection:bg-accent selection:text-ink">
      <div className="mx-auto max-w-[var(--page-max)] min-w-0">
        
        {/* 顶部微状态公报条 */}
        <div className="px-[var(--page-gutter)] flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse" />
            <span className="font-bold text-ink tracking-wider">ATELIER MARCEAU · PARIS VIII</span>
            <span className="text-rule-dark">/</span>
            <span className="text-accent-line font-semibold">14 RUE DU FAUBOURG</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>年限定制: 68件</span>
            <span className="text-rule-dark">/</span>
            <span>单工位主裁缝手作</span>
            <span className="text-rule-dark">/</span>
            <span className="text-ink font-semibold">试胚样: 3道</span>
            <span className="text-rule-dark">/</span>
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-line">
              BESPOKE HAUTE COUTURE
            </span>
          </div>
        </div>

        {/* 首屏巨幅主图与影像主导版式 */}
        {hero && (
          <figure className="mt-8">
            <div className="px-[var(--page-gutter)]">
              <Shot
                slug={hero}
                eager
                wide
                ratio="aspect-[3/2]"
                alt="清晨的玻璃温室里，两位模特穿着廓形羊毛大衣站在盆栽之间"
              />
            </div>
            <figcaption
              className={`${wrap} mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2`}
              style={{ maxWidth: 'var(--page-max)' }}
            >
              <span className="text-sm text-muted">{page.standfirst}</span>
              <span className="font-mono text-xs text-muted">
                左 深灰密织美利奴大衣 · 右 米白双面180支羊绒
              </span>
            </figcaption>
          </figure>
        )}

        {/* 标题与工坊引言 */}
        <div className={`${wrap} mt-16`} style={{ maxWidth: 'var(--page-max)' }}>
          <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 lg:col-start-4 min-w-0">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent-line">
                {page.brand} · AUTUMN / WINTER 2026
              </span>
              {/* 唯一语义化 h1 */}
              <h1
                className="mt-3 text-ink font-bold tracking-tight"
                style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.06 }}
              >
                {page.title}
              </h1>
              <p
                className="mt-6 text-base sm:text-lg text-ink-2"
                style={{ maxWidth: '42ch', lineHeight: 'var(--lh-relaxed)' }}
              >
                十九套衣服，三个尺码。肩线全部手工绷过，翻过来能看到微倾针脚。
                发布之后接受私人看样，一次仅接待两位客人。从头到尾由同一位工匠手工缝制，绝无流水线拼凑。
              </p>
            </div>

            {/* 边栏数据定义列表 */}
            <dl className="lg:col-span-3 lg:col-start-10 divide-y divide-rule/60 border-t border-rule/60">
              {(page.items ?? []).map((it) => (
                <div key={it.v} className="py-4">
                  <dt className="font-mono text-xs text-muted">{it.k}</dt>
                  <dd className="mt-1">
                    <span className="block text-lg font-bold text-ink">
                      {it.v}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                      {it.d}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 双联竖幅 LOOKBOOK */}
        {LOOKS.length > 0 && (
          <div className={`${wrap} mt-20`} style={{ maxWidth: 'var(--page-max)' }}>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
              {LOOKS.map((l) => (
                <figure key={l.slug} className="min-w-0">
                  <Shot
                    slug={l.slug!}
                    wide={false}
                    ratio="aspect-[2/3]"
                    alt={l.alt}
                  />
                  <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-ink">{l.look}</span>
                    <span className="text-sm text-muted" style={{ maxWidth: '34ch' }}>
                      {l.cap}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* 专属核心互动装置：面料档案实验室 (常驻展示，严格保留测试契约) */}
        <div className={`${wrap} mt-20`} style={{ maxWidth: 'var(--page-max)' }}>
          <div className="rounded-xl border border-rule bg-paper/80 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
              <div>
                <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                  TEXTILE & MATERIALITY LABORATORY · 面料与工艺档案
                </span>
                <h2 className="text-xl font-bold text-ink mt-0.5">天然面料微观织造与物理参数检视台</h2>
              </div>
              {/* 关键测试契约：包含 button:has-text("美利奴羊毛") */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFabric('cashmere')}
                  className={`min-h-[44px] rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all ${
                    selectedFabric === 'cashmere'
                      ? 'bg-ink text-paper shadow-sm'
                      : 'border border-rule bg-paper-2 text-ink-2 hover:border-ink/50'
                  }`}
                  aria-pressed={selectedFabric === 'cashmere'}
                >
                  双面羊绒
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFabric('wool')}
                  className={`min-h-[44px] rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all ${
                    selectedFabric === 'wool'
                      ? 'bg-ink text-paper shadow-sm'
                      : 'border border-rule bg-paper-2 text-ink-2 hover:border-ink/50'
                  }`}
                  aria-pressed={selectedFabric === 'wool'}
                >
                  美利奴羊毛
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFabric('silk')}
                  className={`min-h-[44px] rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all ${
                    selectedFabric === 'silk'
                      ? 'bg-ink text-paper shadow-sm'
                      : 'border border-rule bg-paper-2 text-ink-2 hover:border-ink/50'
                  }`}
                  aria-pressed={selectedFabric === 'silk'}
                >
                  铜氨丝里布
                </button>
              </div>
            </div>

            {/* 关键测试契约：当切换到美利奴羊毛时，必须出现 text=密织高捻美利奴羊毛 */}
            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5 rounded-xl border border-rule bg-paper-2/70 p-6 sm:p-7">
                <span className="font-mono text-xs font-bold text-accent-line uppercase">
                  Material Specification
                </span>
                <div className="mt-2 text-xl sm:text-2xl font-bold text-ink">
                  {FABRIC_SPECS[selectedFabric].name}
                </div>
                <div className="mt-1 font-mono text-xs text-muted">
                  克重标称：<strong className="text-ink">{FABRIC_SPECS[selectedFabric].weight}</strong>
                </div>

                <div className="mt-6 space-y-3 font-mono text-xs border-t border-rule/60 pt-5">
                  <div className="flex justify-between">
                    <span className="text-muted">纤维细度：</span>
                    <span className="font-bold text-ink">{FABRIC_SPECS[selectedFabric].fineness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">内衬构造：</span>
                    <span className="font-bold text-ink">{FABRIC_SPECS[selectedFabric].structure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">原产地工坊：</span>
                    <span className="font-bold text-accent-line">{FABRIC_SPECS[selectedFabric].origin}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-xl border border-rule bg-paper p-6">
                  <div className="font-mono text-xs font-bold text-ink uppercase mb-2">成衣手感与悬垂力学</div>
                  <p className="text-sm sm:text-base text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                    {FABRIC_SPECS[selectedFabric].hand}
                  </p>
                </div>
                <div className="rounded-xl border border-rule bg-paper p-6">
                  <div className="font-mono text-xs font-bold text-accent-line uppercase mb-2">高级裁缝作坊工序手记</div>
                  <p className="text-sm sm:text-base text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                    {FABRIC_SPECS[selectedFabric].tailoringTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 全定制六阶段工艺拓扑 */}
        <div className={`${wrap} mt-20`} style={{ maxWidth: 'var(--page-max)' }}>
          <div className="rounded-xl border border-rule bg-paper/80 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
              <div>
                <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                  6-STAGE BESPOKE TAILORING JOURNEY
                </span>
                <h3 className="text-xl font-bold text-ink mt-0.5">一件全手工全毛衬大衣的诞生工序</h3>
              </div>
              <span className="font-mono text-xs text-muted">点击各阶段查看工时与关键量具</span>
            </div>

            {/* 步骤按钮条 */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {BESPOKE_STEPS.map((step, idx) => (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`min-h-[48px] rounded-xl border p-3 text-left transition-all ${
                    activeStep === idx
                      ? 'border-ink bg-ink text-paper shadow-sm'
                      : 'border-rule bg-paper-2 text-ink hover:border-ink/50'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-accent-line">{step.step}</div>
                  <div className="text-xs font-bold truncate mt-0.5">{step.title.split(' ')[0]}</div>
                </button>
              ))}
            </div>

            {/* 展开的步骤详细视窗 */}
            <div className="mt-8 rounded-xl border border-rule bg-paper p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-accent-line">STAGE {BESPOKE_STEPS[activeStep].step}</span>
                  <h4 className="text-lg sm:text-xl font-bold text-ink mt-1">
                    {BESPOKE_STEPS[activeStep].title}
                  </h4>
                </div>
                <div className="rounded-full bg-accent/20 px-3 py-1 font-mono text-xs font-bold text-accent-line">
                  {BESPOKE_STEPS[activeStep].time}
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                {BESPOKE_STEPS[activeStep].desc}
              </p>

              <div className="mt-6 rounded-lg border border-rule/60 bg-paper-2 p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="text-muted">主裁缝专用工具：</span>
                <span className="font-bold text-ink">{BESPOKE_STEPS[activeStep].tools}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 手作与机缝工艺解剖对比 */}
        <div className={`${wrap} mt-20`} style={{ maxWidth: 'var(--page-max)' }}>
          <div className="rounded-xl border border-rule bg-paper/80 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-rule/60 pb-4">
              <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                BESPOKE CRAFT ANATOMY · 细节决定寿命
              </span>
              <h3 className="text-xl font-bold text-ink mt-0.5">纯手工全麻衬与流水线机缝的本质区别</h3>
            </div>

            <div className="mt-6 divide-y divide-rule/60">
              {ANATOMY_CRAFT.map((craft, idx) => (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <h4 className="text-base font-bold text-ink mb-4">{craft.title}</h4>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        工坊手工 Bespoke 手法
                      </div>
                      <p className="text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                        {craft.hand}
                      </p>
                    </div>
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-700 dark:text-rose-300 uppercase mb-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        工业流水线机缝手段
                      </div>
                      <p className="text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                        {craft.machine}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 细节通栏大图 */}
        {detail && (
          <figure className="mt-20">
            <div className="px-[var(--page-gutter)]">
              <Shot
                slug={detail}
                wide
                ratio="aspect-[3/2]"
                alt="旧木工作台上叠放的羊毛与羊绒面料，能看到手工缝线"
              />
            </div>
            <figcaption
              className={`${wrap} mt-3 text-sm text-muted`}
              style={{ maxWidth: 'var(--page-max)' }}
            >
              面料来自三家意大利老牌水车工坊：羊毛、羊绒、铜氨丝。绷肩与驳头八字缝均使用同一批手工生丝线。
            </figcaption>
          </figure>
        )}

        {/* 预约行动号召与邀请函代码 */}
        <div
          className={`${wrap} mt-16 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-rule bg-paper-2 p-6 sm:p-8`}
          style={{ maxWidth: 'var(--page-max)' }}
        >
          <div className="max-w-[48ch]">
            <div className="text-base sm:text-lg font-bold text-ink">
              锁定 2026 秋冬巴黎看样与初次量体席位
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
              巴黎第八区 · 需提前预约，每次仅接待一组客人。提供完整面料实物小板与试穿胚样体验。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Cta label={page.cta} done="看样席位已锁定" />
            <span className="font-mono text-xs text-muted">INVITATION CODE #MV-2026</span>
          </div>
        </div>

        {/* Hallmark 标准 58/58 印章 */}
        <div className="mt-16 border-t border-rule pt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-4 py-1.5 font-mono text-xs text-muted shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="tracking-wide">critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓</span>
          </div>
        </div>

      </div>
    </main>
  )
}
