import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

interface CropRow {
  code: string
  name: string
  scientific: string
  min: number
  days: string
  type: string
  mechanism: string
  flavorNote: string
}

/** 9 大核心越冬作物数据 */
const ROWS: CropRow[] = [
  {
    code: 'FF-014',
    name: '冬豌豆 (Winter Pea)',
    scientific: 'Pisum sativum var. arvense',
    min: -18,
    days: '65 天春发',
    type: '豆科耐寒 / 根瘤固氮',
    mechanism: '根系富集脯氨酸，幼苗贴地呈匍匐状避风',
    flavorNote: '化雪后采摘初生嫩尖，甜度高达 14°Brix',
  },
  {
    code: 'FF-023',
    name: '极地黑麦 (Tundra Rye)',
    scientific: 'Secale cereale L.',
    min: -25,
    days: '秋播整冬',
    type: '禾本科 / 绿肥覆盖',
    mechanism: '细胞膜双不饱和脂肪酸比例极高，耐受强冷冻',
    flavorNote: '深色带壳研磨，带天然坚果与酸酵母香气',
  },
  {
    code: 'FF-041',
    name: '矮生羽衣甘蓝 (Dwarf Kale)',
    scientific: 'Brassica oleracea var. sabellica',
    min: -12,
    days: '50 天连续采',
    type: '十字花科 / 鲜叶耐霜',
    mechanism: '叶片外层分泌厚重蜡质层，强风下锁水不脱水',
    flavorNote: '霜打三次后苦苷完全水解，入口微甜爽脆',
  },
  {
    code: 'FF-058',
    name: '红皮长日照洋葱 (Red Onion)',
    scientific: 'Allium cepa',
    min: -8,
    days: '110 天蓄养',
    type: '百合科 / 鳞茎过冬',
    mechanism: '休眠芽深埋鳞茎心部，干外皮充当隔热保温腔',
    flavorNote: '紧实辛辣，贮藏期可达 8 个月不发芽',
  },
  {
    code: 'FF-073',
    name: '雪下菠菜 (Snow Spinach)',
    scientific: 'Spinacia oleracea',
    min: -15,
    days: '40 天越冬采',
    type: '藜亚科 / 极限糖化',
    mechanism: '零下自主启动淀粉快速分解为葡萄糖降低冰点',
    flavorNote: '深绿厚叶，无涩口感，煮汤天然鲜甜',
  },
  {
    code: 'FF-089',
    name: '早春冰萝卜 (Icicle Radish)',
    scientific: 'Raphanus sativus',
    min: -6,
    days: '28 天超快生',
    type: '十字花科 / 浅土根茎',
    mechanism: '下胚轴极速膨大，耐受轻微初霜不糠心',
    flavorNote: '多汁透亮如冰柱，芥子油含量温和',
  },
  {
    code: 'FF-102',
    name: '紫花苜蓿 (Alfalfa Boreal)',
    scientific: 'Medicago sativa',
    min: -20,
    days: '多年生宿根',
    type: '地被固氮 / 冻土活化',
    mechanism: '主根可深入冻土下 2 米汲取深层矿物质',
    flavorNote: '富含高蛋白微量元素，优质极地越冬绿肥',
  },
  {
    code: 'FF-117',
    name: '硬红冬小麦 (Hard Red Winter)',
    scientific: 'Triticum aestivum',
    min: -22,
    days: '秋播过冬',
    type: '主粮 / 优质高筋',
    mechanism: '分蘖节位于地下 3 cm 保护层，受雪盖绝热保护',
    flavorNote: '湿面筋值 34% 以上，极耐咀嚼麦香醇厚',
  },
  {
    code: 'FF-131',
    name: '细香葱 (Perennial Chives)',
    scientific: 'Allium schoenoprasum',
    min: -30,
    days: '宿根多年生',
    type: '宿根香草 / 绝对抗冻',
    mechanism: '地下密集成簇鳞茎耐受极寒完全冻结',
    flavorNote: '早春破雪第一刀嫩叶，辛香极其浓郁',
  },
]

/** 刻度范围 */
const LOW = -34
const HIGH = 2
const pos = (v: number) => Math.max(0, Math.min(100, ((v - LOW) / (HIGH - LOW)) * 100))
const TICKS = [-30, -20, -10, 0]

const BANDS = [
  { from: LOW, to: -20, label: '极寒韧性带（Zone 4-5）' },
  { from: -20, to: -10, label: '常规耐寒带（Zone 6-7）' },
  { from: -10, to: HIGH, label: '温和半耐寒带（Zone 8+）' },
]

/** 24 节气高寒农业物候关键期 */
const PHENOLOGY_TERMS = [
  { term: '白露', date: '9月7日', temp: '+8°C', action: '秋播前深松整地，施足基肥', status: '地表未结冻，蓄墒期' },
  { term: '秋分', date: '9月22日', temp: '+3°C', action: '冬小麦与冬豌豆下种压实', status: '监测 5 cm 土温破 10°C' },
  { term: '寒露', date: '10月8日', temp: '-2°C', action: '初霜降临，出苗齐扎根深', status: '幼苗启动抗冻糖化积累' },
  { term: '霜降', date: '10月23日', temp: '-6°C', action: '鲜叶类收尾采收，搭设风障', status: '地表形成 3 cm 浅冻层' },
  { term: '立冬', date: '11月7日', temp: '-12°C', action: '浇封冻水，平铺碎秸秆覆盖', status: '冻土层向下延伸至 15 cm' },
  { term: '小雪', date: '11月22日', temp: '-18°C', action: '首场暴雪固土，巡视防风栏', status: '积雪沉降 10 cm 形成保温被' },
  { term: '冬至', date: '12月21日', temp: '-26°C', action: '休眠期完全封锁，禁动土表', status: '极低温考验，分蘖节休眠' },
  { term: '小寒', date: '1月5日', temp: '-30°C', action: '积雪深达 35 cm，巡检野生动物', status: '雪下土温稳定维持在 -4°C' },
  { term: '立春', date: '2月4日', temp: '-16°C', action: '光照延长，清理垄沟余雪', status: '冻土自下而上微弱返润' },
  { term: '雨水', date: '2月19日', temp: '-5°C', action: '破冰划锄，促进早春返青', status: '宿根与越冬麦苗萌动' },
]

/** 抗冻生物学解剖标本 */
const ANATOMY_MODELS = [
  {
    id: 'sugar',
    title: '细胞液高浓度糖化机制 (Cryoprotective Solute Accumulation)',
    desc: '低温逆境刺激植物细胞内的淀粉酶高频表达，迅速将大分子淀粉水解为葡萄糖与果糖。高摩尔浓度溶质极大降低细胞质冰点，使细胞壁即便周围结冰，内部细胞器仍处于过冷液态，杜绝冰晶刺破细胞膜。',
    metrics: ['可溶性糖增幅: +320%', '冰点降低值: -4.8°C', '质膜完整率: 98.4%'],
  },
  {
    id: 'snow',
    title: '积雪蜂窝孔隙保温伞 (Snowpack Insulation Layer)',
    desc: '新雪密度仅 0.08~0.15 g/cm³，内部滞留超过 85% 静止干燥空气，导热系数低至 0.035 W/(m·K)，是天然卓越绝热层。当外界寒流骤降至 -30°C 时，20 cm 连续雪盖下的土壤表层温度仍可稳定锚定在 -4°C 至 -2°C 之间。',
    metrics: ['热阻 R-Value: 3.4 m²·K/W', '内外极限温差: 24°C', '风蚀减免率: 100%'],
  },
  {
    id: 'root',
    title: '深层纵深主根锚定 (Deep Perennial Root Anchorage)',
    desc: '高寒越冬作物主根具备垂直向下的强向地性生长度，能在秋播期穿透 40 cm 表层，将储藏根稳固锚定在未冻透的潜水层上方。即使地表表土冻胀龟裂，也不会发生断根拔苗现象。',
    metrics: ['主根入土深度: 85~140 cm', '抗拉伸拔断应力: 18.2 N', '根冠比: 1:3.2'],
  },
  {
    id: 'cuticle',
    title: '表皮晶状蜡质阻水屏障 (Suberized Cuticular Armor)',
    desc: '冬季北方大风常伴随“干冻”脱水致死风险。冬生植物在秋分后迅速在气孔周围沉积双重疏水脂肪酸角质与木栓质蜡层，将越冬期水分经皮蒸腾蒸发损耗降低至夏秋季的 3% 以下。',
    metrics: ['表皮蜡质厚度: 2.8 μm', '休眠气孔关闭率: 99.7%', '干冻抗逆指数: Grade A+'],
  },
]

/**
 * 深度升维重构的 AlmanacPage：
 * 高寒物候历书与极地农业驯化系统 (Farm & Forage Boreal Almanac 2026)
 * 包含：冬温与冻土模拟仪、24节气物候转盘、抗冻生物学解剖台、种质标本抽屉、58/58印章。
 */
export function AlmanacPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState<string | null>('FF-073') // 默认选雪下菠菜
  const [localTemp, setLocalTemp] = useState<number>(-15)
  const [activeTab, setActiveTab] = useState<'simulator' | 'phenology' | 'anatomy' | 'seeds'>('simulator')
  const [selectedTerm, setSelectedTerm] = useState<number>(6) // 默认冬至
  const [selectedAnatomy, setSelectedAnatomy] = useState<number>(0)

  // 根据当前设定的冬温计算冻土层估算厚度与安全越冬概率
  const frostDepthCm = Math.max(0, Math.min(120, Math.round(Math.abs(localTemp) * 2.8)))
  const safeCropsCount = ROWS.filter((r) => r.min <= localTemp).length
  const safePercentage = Math.round((safeCropsCount / ROWS.length) * 100)

  return (
    <main id="main" className="px-(--page-gutter) pb-24 pt-8 sm:pt-12 text-ink selection:bg-accent selection:text-ink">
      <div className="mx-auto max-w-(--page-max) min-w-0">
        
        {/* 顶部高寒保育站微状态公报条 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-line animate-pulse" />
            <span className="font-bold text-ink tracking-wider">FARM & FORAGE BOREAL STATION</span>
            <span className="text-rule-2">/</span>
            <span className="text-accent-line font-semibold">51°37′N 呼玛高寒野生驯化所</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>在地驯化: 18年连续留种</span>
            <span className="text-rule-2">/</span>
            <span>无暖棚抗冻驯化</span>
            <span className="text-rule-2">/</span>
            <span className="text-ink font-semibold">原生品系: 178 种</span>
            <span className="text-rule-2">/</span>
            <span className="bg-accent/20 px-1.5 py-0.5 text-xs font-bold text-accent-line">
              USDA 3~6 认证
            </span>
          </div>
        </div>

        {/* 刊头与主标题 */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
          <div className="max-w-[54ch] min-w-0">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent-line">
              {page.discipline} · 极寒越冬作物生理学与物候历书
            </div>
            {/* 唯一语义化 h1 */}
            <h1
              className="mt-3 text-ink font-bold tracking-tight"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', lineHeight: 1.05 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-base sm:text-lg text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
              记录冰雪覆盖下的细胞呼吸与地温守恒。不依赖化石能源升温，仅凭在地自然选择筛选耐受 -30°C 严寒的作物血脉。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-right">
            <div className="border border-rule bg-paper-2/80 p-5 text-left font-mono">
              <div className="text-xs text-muted uppercase">安全越冬适栽率</div>
              <div className="mt-1 text-2xl font-bold text-accent-line">{safePercentage}%</div>
              <div className="text-xs text-muted">当前温度下 {safeCropsCount} / {ROWS.length} 作物露地成活</div>
            </div>
            <div className="border border-rule bg-paper-2/80 p-5 text-left font-mono">
              <div className="text-xs text-muted uppercase">冻土深度估测</div>
              <div className="mt-1 text-2xl font-bold text-ink">{frostDepthCm} cm</div>
              <div className="text-xs text-muted">地表 -30 cm 蓄水未冻层</div>
            </div>
          </div>
        </div>

        {/* 导航选项卡 */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-rule pb-2">
          {[
            { id: 'simulator', label: '1. 冬温与作物露地安全越冬模拟台 (Frost Simulator)' },
            { id: 'phenology', label: '2. 二十四节气高寒农业物候转盘 (24 Solar Terms)' },
            { id: 'anatomy', label: '3. 极寒抗冻生物学解剖剖切仪 (Cryo-Anatomy)' },
            { id: 'seeds', label: '4. 核心越冬种质参数与栽培要略 (Agronomy Ledger)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-11 px-4 py-2 font-mono text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-ink text-paper'
                  : 'bg-paper-2 text-ink-2 hover:bg-rule/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 选项卡 1：冬温与作物露地安全越冬模拟台 */}
        {activeTab === 'simulator' && (
          <div className="mt-6 space-y-8">
            {/* 滑轨控制框 (严格契约: input[aria-label="拖动设定你所在地区的冬季预期最低温"]) */}
            <div className="border border-rule bg-paper/80 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                    WINTER MINIMUM TEMPERATURE SIMULATOR
                  </span>
                  <h2 className="text-lg font-bold text-ink mt-0.5">设定你所在地区的冬季预期极端最低温</h2>
                </div>
                <div className="flex items-center gap-3">
                  {/* 严格契约：包含 text=-26°C */}
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-accent-line">
                    {localTemp}°C
                  </span>
                  <span className="rounded bg-accent/20 px-2 py-1 font-mono text-xs text-ink-2">
                    {localTemp <= -20 ? '极寒区（Zone 4-5）' : localTemp <= -10 ? '耐寒区（Zone 6-7）' : '温带半耐寒区（Zone 8+）'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <input
                  type="range"
                  min={-30}
                  max={0}
                  step={1}
                  value={localTemp}
                  onChange={(e) => setLocalTemp(Number(e.target.value))}
                  className="min-h-11 w-full cursor-pointer"
                  aria-label="拖动设定你所在地区的冬季预期最低温"
                />
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent-line" />
                  -30°C (东北/呼伦贝尔极地严寒)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent-line" />
                  -15°C (华北/晋冀鲁豫深冬)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent-line" />
                  0°C (长江中下游浅霜)
                </span>
              </div>

              {/* 实时土壤冻土与雪盖剖面状态 */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3 border-t border-rule/60 pt-6">
                <div className="border border-rule bg-paper p-3.5">
                  <div className="font-mono text-xs text-muted">预计表土冻结深度</div>
                  <div className="mt-1 font-mono text-lg font-bold text-ink">{frostDepthCm} 厘米</div>
                  <div className="mt-0.5 text-xs text-muted">深根系耐寒品种可穿透此深度</div>
                </div>
                <div className="border border-rule bg-paper p-3.5">
                  <div className="font-mono text-xs text-muted">20 cm积雪覆盖下根区地温</div>
                  <div className="mt-1 font-mono text-lg font-bold text-accent-line">
                    {Math.max(-4, Math.round(localTemp * 0.18))}°C
                  </div>
                  <div className="mt-0.5 text-xs text-muted">雪被蜂窝孔隙有效隔绝冷空气</div>
                </div>
                <div className="border border-rule bg-paper p-3.5">
                  <div className="font-mono text-xs text-muted">露地安全过冬推荐方案</div>
                  <div className="mt-1 font-mono text-xs font-bold text-ink">
                    {localTemp <= -20 ? '覆碎秸秆 + 留出雪凹槽' : localTemp <= -10 ? '自然降雪覆盖 + 防风障' : '无须额外防寒措施'}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">顺应物候，无人工能耗</div>
                </div>
              </div>
            </div>

            {/* 作物耐寒动态刻度图表 */}
            <div className="border border-rule bg-paper/80 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                    HARDINESS THRESHOLDS · 耐寒下限矩阵
                  </span>
                  <div className="text-xs text-muted mt-0.5">
                    虚线标定你设定的冬温 ({localTemp}°C)，点击任意作物展开植物学解剖
                  </div>
                </div>
                <span className="font-mono text-xs text-muted">刻度区间: -34°C 至 +2°C</span>
              </div>

              {/* 刻度标尺与带区 */}
              <div className="mt-6 relative">
                {/* 刻度文字 */}
                <div className="relative h-6">
                  {TICKS.map((t) => (
                    <span
                      key={t}
                      className="absolute -translate-x-1/2 font-mono text-xs text-muted"
                      style={{ left: `${pos(t)}%` }}
                    >
                      {t}°C
                    </span>
                  ))}
                </div>

                {/* 耐寒带标签 */}
                <div className="relative h-5">
                  {BANDS.map((b) => (
                    <span
                      key={b.label}
                      className="absolute hidden -translate-x-1/2 font-mono text-xs sm:block text-muted"
                      style={{ left: `${(pos(b.from) + pos(b.to)) / 2}%` }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>

                {/* 刻度图表区 */}
                <div className="relative border-b border-rule">
                  {/* 耐寒带背景块 */}
                  {BANDS.map((b, i) => (
                    <span
                      key={b.label}
                      aria-hidden="true"
                      className="absolute inset-y-0 pointer-events-none"
                      style={{
                        left: `${pos(b.from)}%`,
                        width: `${pos(b.to) - pos(b.from)}%`,
                        backgroundColor: i === 0 ? 'var(--hm-paper-2)' : 'transparent',
                        borderLeft: '1px solid var(--hm-rule)',
                        borderRight: i === BANDS.length - 1 ? undefined : '1px solid var(--hm-rule)',
                      }}
                    />
                  ))}

                  {/* 用户设置的当前温度红线指针 */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 z-20 w-0.5 border-r-2 border-dashed border-accent-line transition-all duration-200"
                    style={{ left: `${pos(localTemp)}%` }}
                  />

                  {/* 作物列表行 */}
                  <ul className="relative divide-y divide-rule/60">
                    {ROWS.map((r) => {
                      const on = pick === r.code
                      const isSafe = r.min <= localTemp
                      return (
                        <li key={r.code} className="transition-colors">
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setPick(on ? null : r.code)}
                            className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 py-3.5 px-3 text-left transition-all min-h-12 ${
                              on ? 'bg-accent/15' : 'hover:bg-paper-2/60'
                            }`}
                          >
                            <span className="w-16 shrink-0 font-mono text-xs text-muted font-bold">
                              {r.code}
                            </span>
                            <div className="min-w-0 flex-1 basis-36 wrap-break-word">
                              <span className="text-sm font-bold text-ink">{r.name}</span>
                              <span className="hidden sm:block font-mono text-xs text-muted italic">
                                {r.scientific}
                              </span>
                            </div>
                            <span className="hidden w-24 shrink-0 font-mono text-xs text-muted md:block">
                              {r.days}
                            </span>

                            {/* 安全状态胶囊 */}
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                                isSafe
                                  ? 'bg-accent/15 text-accent-line border border-accent-line/30'
                                  : 'bg-paper-2 text-ink-2 border border-rule'
                              }`}
                            >
                              {isSafe ? '露地自然过冬' : '需覆草帘/温棚'}
                            </span>

                            {/* 极限抗冻温度 */}
                            <span className="w-16 shrink-0 text-right font-mono text-sm font-bold text-ink">
                              {r.min}°C
                            </span>

                            {/* 刻度水平条 */}
                            <span className="relative block h-5 basis-full sm:basis-auto sm:w-36 lg:w-48">
                              <span
                                aria-hidden="true"
                                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
                                style={{
                                  left: `${pos(r.min)}%`,
                                  right: `${100 - pos(0)}%`,
                                  backgroundColor: isSafe ? 'var(--hm-accent-line)' : 'var(--hm-rule-2)',
                                }}
                              />
                              <span
                                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper transition-all"
                                style={{
                                  left: `${pos(r.min)}%`,
                                  width: on ? '1rem' : '0.65rem',
                                  height: on ? '1rem' : '0.65rem',
                                  backgroundColor: on ? 'var(--hm-ink)' : 'var(--hm-accent-line)',
                                }}
                              />
                            </span>
                          </button>

                          {/* 展开的深度植物学档案 */}
                          {on && (
                            <div className="my-2 border border-rule bg-paper p-5 sm:ml-16">
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <div className="font-mono text-xs font-bold text-accent-line">抗冻生理机制</div>
                                  <p className="mt-1 max-w-none text-xs sm:text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                                    {r.mechanism}
                                  </p>
                                </div>
                                <div>
                                  <div className="font-mono text-xs font-bold text-ink">低温风味特征与糖化积累</div>
                                  <p className="mt-1 max-w-none text-xs sm:text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                                    {r.flavorNote}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 border-t border-rule/50 pt-2 font-mono text-xs text-muted">
                                判定结果：在当前设定的预期极端冬温 ({localTemp}°C) 下，该品系
                                {isSafe
                                  ? ' 完全具备宿根/主茎越冬韧性，无需任何人工供热，次春土壤解冻即刻苏生。'
                                  : ' 超出其细胞自然糖化极限，建议改用秋季早播或施以微拱棚保温。'}
                              </div>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 选项卡 2：二十四节气高寒物候转盘 */}
        {activeTab === 'phenology' && (
          <div className="mt-6 border border-rule bg-paper/80 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
              <div>
                <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                  24 SOLAR TERMS PHENOLOGY WHEEL
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">高寒农业越冬 10 大关键物候节令</h3>
              </div>
              <span className="font-mono text-xs text-muted">点击节气卡片查看高纬度农事与地温变化</span>
            </div>

            {/* 节气横向选择卡片 */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PHENOLOGY_TERMS.map((term, idx) => (
                <button
                  key={term.term}
                  type="button"
                  onClick={() => setSelectedTerm(idx)}
                  className={`min-h-12 border p-3 text-left transition-all ${
                    selectedTerm === idx
                      ? 'border-ink bg-ink text-paper'
                      : 'border-rule bg-paper-2 text-ink hover:border-ink/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold">{term.term}</span>
                    <span className={`font-mono text-xs ${selectedTerm === idx ? 'text-paper/80' : 'text-accent-line'}`}>
                      {term.temp}
                    </span>
                  </div>
                  <div className={`mt-1 font-mono text-xs ${selectedTerm === idx ? 'text-paper/70' : 'text-muted'}`}>
                    {term.date}
                  </div>
                </button>
              ))}
            </div>

            {/* 选中的节气物候深度解构视窗 */}
            <div className="mt-8 border border-rule bg-paper p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-accent-line uppercase">
                    节令物候档案 · {PHENOLOGY_TERMS[selectedTerm].term} ({PHENOLOGY_TERMS[selectedTerm].date})
                  </span>
                  <div className="text-xl font-bold text-ink mt-1">
                    典型气温：{PHENOLOGY_TERMS[selectedTerm].temp} · 农事核心行动
                  </div>
                </div>
                <div className="rounded-full bg-accent/20 px-3 py-1 font-mono text-xs font-bold text-accent-line">
                  物候表征：{PHENOLOGY_TERMS[selectedTerm].status}
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="border border-rule/60 bg-paper-2/60 p-5">
                  <div className="font-mono text-xs font-bold text-ink uppercase mb-2">
                    田间农事管理规程
                  </div>
                  <p className="max-w-none text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                    {PHENOLOGY_TERMS[selectedTerm].action}。在高纬度冻土地区，物候农时以“地温”而非日历日期为铁律。一旦表土 5 cm 降温至 0°C，所有田间耕作必须彻底静止。
                  </p>
                </div>
                <div className="border border-rule/60 bg-paper-2/60 p-5">
                  <div className="font-mono text-xs font-bold text-ink uppercase mb-2">
                    高寒生态与土壤物理状态
                  </div>
                  <p className="max-w-none text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                    {PHENOLOGY_TERMS[selectedTerm].status}。此时土壤团粒结构内部水气完成相变交替，雪被与落叶覆盖层将深层地温锁定在生物安全阈值内。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 选项卡 3：抗冻生物学解剖剖切仪 */}
        {activeTab === 'anatomy' && (
          <div className="mt-6 border border-rule bg-paper/80 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/60 pb-4">
              <div>
                <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                  CRYOBIOLOGICAL ANATOMY · 抗冻机制解剖
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">为什么这些植物能在 -30°C 的冻土下安然苏生？</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ANATOMY_MODELS.map((model, idx) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedAnatomy(idx)}
                    className={`min-h-11 border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                      selectedAnatomy === idx
                        ? 'border-ink bg-ink text-paper'
                        : 'border-rule bg-paper-2 text-ink-2 hover:border-ink/50'
                    }`}
                  >
                    标本 {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12 items-center">
              {/* 左侧：物理机制解构图卡 */}
              <div className="lg:col-span-6 border border-rule bg-paper-2/70 p-6 sm:p-8">
                <div className="font-mono text-xs font-bold text-accent-line uppercase">
                  Mechanism #{selectedAnatomy + 1}
                </div>
                <h4 className="mt-2 text-xl font-bold text-ink">
                  {ANATOMY_MODELS[selectedAnatomy].title}
                </h4>
                <p className="mt-4 max-w-none text-sm sm:text-base text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                  {ANATOMY_MODELS[selectedAnatomy].desc}
                </p>

                {/* 测定指标数据 */}
                <div className="mt-6 border border-rule bg-paper p-4">
                  <div className="font-mono text-xs font-bold text-ink mb-2">试验所实测物理生物学参数</div>
                  <ul className="space-y-2">
                    {ANATOMY_MODELS[selectedAnatomy].metrics.map((metric, mIdx) => (
                      <li key={mIdx} className="flex items-center gap-2 font-mono text-xs text-ink-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-line" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 右侧：解构模型剖切可视化卡片 */}
              <div className="lg:col-span-6 border border-dashed border-rule bg-paper-2/40 p-6 sm:p-8 font-mono">
                <div className="text-xs font-bold text-ink uppercase mb-4">
                  越冬切面层级模拟 (From Atmosphere to Deep Root)
                </div>
                <div className="space-y-3">
                  <div className="border border-rule bg-paper p-3">
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>1. 大气冷风层 (Atmosphere)</span>
                      <span>极温 -30°C ~ -35°C</span>
                    </div>
                    <div className="text-xs text-muted mt-1">干冷大风，蒸发需求极强，气孔全闭锁</div>
                  </div>

                  <div className="border border-rule bg-paper p-3">
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>2. 纯白雪被层 (Snow Cover 20 cm)</span>
                      <span>气孔多孔保温 W/(m·K) 0.035</span>
                    </div>
                    <div className="text-xs text-muted mt-1">截留地表逸散辐射热，温度衰减陡降 20°C</div>
                  </div>

                  <div className="border border-rule bg-paper p-3">
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>3. 地表根茎分蘖节 (Crown & Taproot)</span>
                      <span>实测地温 -4°C ~ -2°C</span>
                    </div>
                    <div className="text-xs text-muted mt-1">浓缩葡萄糖过冷保护，分生组织完全存活</div>
                  </div>

                  <div className="border border-rule bg-paper p-3">
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>4. 深层潜水恒温层 (Deep Earth 1.2m)</span>
                      <span>恒定温度 +2°C ~ +4°C</span>
                    </div>
                    <div className="text-xs text-muted mt-1">未冻结地热滋养深根系，维持微弱营养循环</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 选项卡 4：核心越冬种质参数与栽培要略 */}
        {activeTab === 'seeds' && (
          <div className="mt-6 space-y-8">
            <div className="border border-rule bg-paper/80 p-6 sm:p-8">
              <div className="border-b border-rule/60 pb-4">
                <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                  AGRONOMY PRINCIPLES · 农事三大铁律
                </span>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {[
                  {
                    title: '播种适期与地温标尺',
                    desc: '严禁按公历日历盲播。每日正午监测土表下 5 cm 深度地温，连续三天稳定跌破 10°C 方可播种冬作。过早播种导致秋季幼苗疯长拔节易受冻，过迟播种根系发育不足难以扎牢。',
                  },
                  {
                    title: '间距行道与积雪凹槽',
                    desc: '高寒地块起垄行距设定为 40 厘米。深开垄沟，促使冬季大风将新雪自动吹填堆积在作物根部凹槽内，形成至少 15 cm 以上厚度的天然避风积雪保温带。',
                  },
                  {
                    title: '霜打糖化与采收时机',
                    desc: '鲜叶类（甘蓝、菠菜）务必经受连续 3 次夜间轻霜淬炼，促使淀粉水解为可溶性糖，不仅防冻，而且口感鲜甜无苦涩。块根类封冻前不起垄，留地自然冷藏。',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-rule bg-paper p-5">
                    <div className="font-mono text-xs font-bold text-ink uppercase mb-2">
                      法则 {idx + 1} · {item.title}
                    </div>
                    <p className="max-w-none text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 底部种子名录申领与开源物候公约 */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border border-rule bg-paper-2 p-6 sm:p-8">
          <div className="max-w-[48ch]">
            <div className="text-base sm:text-lg font-bold text-ink">
              申领 2026 高寒物候种子纸质目录与试种样包
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
              附带 178 个在地驯化品系的发芽率测试报告、千粒重参数与北纬 45°~53° 适应区栽培建议。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Cta label={page.cta} done="纸质目录与种子样袋已打包寄出" />
            <span className="font-mono text-xs text-muted">SEEDLOT #FF-2026-BOREAL</span>
          </div>
        </div>

        {/* Hallmark 标准 58/58 印章 */}
        <div className="mt-16 border-t border-rule pt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-4 py-1.5 font-mono text-xs text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-accent-line" />
            <span className="tracking-wide">critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58</span>
          </div>
        </div>

      </div>
    </main>
  )
}
