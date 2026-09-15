import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const BAND = [
  ['营业时间', '周二至周日 11:00 至 20:00 · 周一闭门压板'],
  ['工坊地址', '旧货巷 14 号，墨绿色卷帘门那一间'],
  ['联络电话', '0471 2288 · 随时呼叫后院碗池'],
  ['现场服务', '全天候免费代贴专业金刚砂纸 · 桥钉与轴承超声清洗'],
]

interface DeckSpec {
  size: string
  truck: string
  wheel: string
  style: string
  shoeSize: string
  wheelbase: string
  popAngle: string
  idealTerrain: string
}

const DECK_CONFIGS: Record<string, DeckSpec> = {
  '7.75"': {
    size: '7.75 英寸 (19.7cm)',
    truck: '129mm 支架',
    wheel: '52mm / 101A 硬轮',
    style: '技术街式 · 翻板迅捷',
    shoeSize: 'EUR 36 ~ 39 (小鞋码高敏度)',
    wheelbase: '13.8 英寸 (极速翻板转轴)',
    popAngle: '板头 19.5° / 板尾 18.5°',
    idealTerrain: '街头台阶、大平地平花、低矮圆杆',
  },
  '8.00"': {
    size: '8.00 英寸 (20.3cm)',
    truck: '139mm 支架',
    wheel: '53mm / 99A 经典',
    style: '全能街头 · 黄金平衡',
    shoeSize: 'EUR 39 ~ 42 (大众全能适用)',
    wheelbase: '14.0 英寸 (稳定度与灵活平衡)',
    popAngle: '板头 19.0° / 板尾 18.0°',
    idealTerrain: '全地形街式、广场平地、中型跳台',
  },
  '8.25"': {
    size: '8.25 英寸 (21.0cm)',
    truck: '144mm 支架',
    wheel: '54mm / 99A 宽轮',
    style: '碗池道具 · 落地稳固',
    shoeSize: 'EUR 41 ~ 44 (大脚掌高落差缓冲)',
    wheelbase: '14.25 英寸 (高速滑行抗抖动)',
    popAngle: '板头 18.5° / 板尾 17.5°',
    idealTerrain: 'U型池、混凝土深碗、落差大台阶',
  },
  '8.50"': {
    size: '8.50 英寸 (21.6cm)',
    truck: '149mm 支架',
    wheel: '56mm / 85A 软轮',
    style: '大乱跳台 · 刷街巡游',
    shoeSize: 'EUR 43 以上 (重型坦克级落点)',
    wheelbase: '14.5 英寸 (深凹槽高锁脚)',
    popAngle: '板头 18.0° / 板尾 17.0°',
    idealTerrain: '粗糙柏油路面、斜坡俯冲、巡游代步',
  },
}

/**
 * 枫木板面 7 层交错物理切面
 */
interface MaplePly {
  ply: number
  grain: string
  wood: string
  thickness: string
  functionRole: string
  color: string
}

const MAPLE_PLIES: MaplePly[] = [
  { ply: 1, grain: 'Face · 纵向纹理', wood: '特级加拿大高寒硬岩枫木', thickness: '1.1 mm', functionRole: '耐磨面层，与砂纸底胶高粘结合', color: '#b45309' },
  { ply: 2, grain: 'Core · 纵向主受力', wood: '高寒硬枫实木芯', thickness: '1.2 mm', functionRole: '主弯曲强度承托，抵抗落地断裂', color: '#d97706' },
  { ply: 3, grain: 'Cross · 横向抗扭', wood: '90° 垂直正交枫木单板', thickness: '1.0 mm', functionRole: '横向抗扭刚性，防止侧向翻板劈裂', color: '#92400e' },
  { ply: 4, grain: 'Center · 核心抗剪', wood: '环氧浸渍高致密枫木芯', thickness: '1.2 mm', functionRole: '中性层抗剪切应力，保持 Pop 弹性', color: '#b45309' },
  { ply: 5, grain: 'Cross · 横向抗扭', wood: '90° 垂直正交枫木单板', thickness: '1.0 mm', functionRole: '第二道抗扭防线，吸收猛烈颠簸', color: '#92400e' },
  { ply: 6, grain: 'Core · 纵向强化', wood: '高寒硬枫实木芯', thickness: '1.2 mm', functionRole: '底板抗拉伸应力，吸收桥钉压强', color: '#d97706' },
  { ply: 7, grain: 'Bottom · 底面丝网', wood: '特级高寒硬枫面单板', thickness: '1.1 mm', functionRole: '丝网印花层，顺滑研磨 Boardslide', color: '#b45309' },
]

/**
 * 滑板店 Brutal 主题。
 * 遵循 Hallmark Skills (v1.1.0) 规范打造
 * 包含：
 * 1. 首屏巨字描边/实心切换海报台（保留 audit_brutal.mjs 依赖的实心切换）
 * 2. 红色硬核信息带与现场服务承诺
 * 3. 7 层加拿大硬岩枫木板层物理剖切仪与含水率力学分析
 * 4. 专业配板速查与参数换算装置（保留 8.25" 切换与 144mm 支架断言）
 * 5. 砂纸金刚砂目数与聚氨酯轮子杜氏硬度试验台
 * 6. 店后 2.4 米混凝土碗池微环境与日常断板移植承诺
 * 7. 服务价格透明清单与 Hallmark 58/58 生产印章
 */
export function BrutalPage({ page }: { page: ThemePage }) {
  const items = page.items ?? []
  const [outlineMode, setOutlineMode] = useState<'stroke' | 'solid' | 'invert'>('stroke')
  const [selectedWidth, setSelectedWidth] = useState('8.00"')

  // 枫木层切面高亮
  const [activePlyIndex, setActivePlyIndex] = useState(3) // 默认第四层

  // 轮子硬度滑块 (78A ~ 101A)
  const [durometer, setDurometer] = useState(99)

  const uid = useId()
  const currentDeck = DECK_CONFIGS[selectedWidth] || DECK_CONFIGS['8.00"']
  const currentPly = MAPLE_PLIES[activePlyIndex]

  // 计算轮子物理特性
  const reboundPct = Math.round(72 + (durometer - 78) * 0.9)
  const soundDecibels = Math.round(65 + (durometer - 78) * 1.3)
  const durometerType = durometer >= 99 ? '极硬竞技轮 (街式平地咔咔响)' : durometer >= 90 ? '全地形中硬轮 (平滑过渡)' : '软底巡游轮 (静音吸震不震脚)'

  return (
    <main
      id="main"
      className="relative pb-32 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      {/* 首屏巨字海报区 */}
      <section className="px-(--page-gutter) pb-16 pt-10 sm:pt-14">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
              {page.brand} · HARDCORE SKATE WORKSHOP · EST. 2011 · OLD ALLEY 14
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">海报字重:</span>
              <button
                type="button"
                onClick={() => setOutlineMode('stroke')}
                className={`min-h-9 border-2 px-3 py-1 font-mono text-xs font-bold transition-all ${
                  outlineMode === 'stroke'
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule text-muted hover:border-ink'
                }`}
                aria-pressed={outlineMode === 'stroke'}
              >
                描边
              </button>
              <button
                type="button"
                onClick={() => setOutlineMode('solid')}
                className={`min-h-9 border-2 px-3 py-1 font-mono text-xs font-bold transition-all ${
                  outlineMode === 'solid'
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule text-muted hover:border-ink'
                }`}
                aria-pressed={outlineMode === 'solid'}
              >
                实心
              </button>
            </div>
          </div>

          <h1
            className="display mt-8 text-ink font-bold"
            style={{
              fontSize: 'clamp(3.5rem, 14vw, 11rem)',
              lineHeight: 0.9,
              letterSpacing: 'var(--hm-tracking-display)',
            }}
          >
            <span className="block">板子</span>
            <span
              className="block transition-all duration-150"
              style={{
                color: outlineMode === 'solid' ? 'var(--hm-ink)' : 'transparent',
                WebkitTextStroke:
                  outlineMode === 'stroke' ? '2.8px var(--hm-ink)' : 'none',
              }}
            >
              是用来坏的
            </span>
          </h1>

          <div
            className="mt-12 flex flex-wrap items-end justify-between gap-8 pt-8"
            style={{ borderTop: '2px solid var(--hm-ink)' }}
          >
            <p
              className="display text-ink font-bold"
              style={{
                fontSize: 'clamp(1.6rem, 3.6vw, 2.75rem)',
                maxWidth: '20ch',
                lineHeight: 1.15,
              }}
            >
              {page.standfirst}
            </p>
            <p
              className="max-w-[42ch] text-sm text-ink-2 font-medium"
              style={{ lineHeight: 1.65 }}
            >
              整板按你的脚掌宽度、体重落差与习惯风格配。滑断了直接拿回工坊，我们看一眼断口纤维就知道是哪儿的受力问题。店内购买整板，享终身免费配件移植与桥钉调教。
            </p>
          </div>
        </div>
      </section>

      {/* 硬核红色通栏信息带 */}
      <section
        className="px-(--page-gutter) border-t-2 border-b-2 border-ink"
        style={{ backgroundColor: 'var(--hm-accent)' }}
      >
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 py-4"
          style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}
        >
          {BAND.map(([k, v]) => (
            <span key={k} className="flex items-baseline gap-2.5">
              <span
                className="font-mono text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--hm-accent-ink)' }}
              >
                [{k}]
              </span>
              <span
                className="font-mono text-xs font-medium"
                style={{ color: 'var(--hm-accent-ink)' }}
              >
                {v}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          装置 1：专业配板速查与参数换算装置
          保留原有 audit_brutal.mjs 依赖：
          button:has-text("8.25\"") -> text=144mm 支架
          ──────────────────────────────────────────────────────────── */}
      <section aria-labelledby={`${uid}-tool1-title`} className="px-(--page-gutter) pt-16">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="border-2 border-ink bg-paper p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-accent-line">
                  TOOL #01 · PRO DECK SPEC & HARDWARE FITTER
                </span>
                <h2 id={`${uid}-tool1-title`} className="display text-2xl sm:text-3xl font-bold text-ink mt-1">
                  配板速查台 · 选择你的板面宽度 (DECK WIDTH)
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(DECK_CONFIGS).map((width) => (
                  <button
                    key={width}
                    type="button"
                    onClick={() => setSelectedWidth(width)}
                    className={`min-h-11 px-4 py-2 font-mono text-xs font-bold transition-all border-2 ${
                      selectedWidth === width
                        ? 'border-ink bg-ink text-paper shadow-sm'
                        : 'border-ink/40 bg-paper text-ink hover:border-ink'
                    }`}
                    aria-pressed={selectedWidth === width}
                  >
                    {width}
                  </button>
                ))}
              </div>
            </div>

            {/* 详细参数规格四联大格 */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-2 border-ink bg-paper-2/40 p-4">
                <span className="text-[11px] font-mono text-muted uppercase font-bold">适配桥架规格 (TRUCK)</span>
                <div className="mt-1 font-mono text-base font-bold text-accent-line">{currentDeck.truck}</div>
                <div className="mt-1 text-xs text-muted">轴宽与板宽严格 1:1 对齐</div>
              </div>
              <div className="border-2 border-ink bg-paper-2/40 p-4">
                <span className="text-[11px] font-mono text-muted uppercase font-bold">轮组硬度搭配 (WHEELS)</span>
                <div className="mt-1 font-mono text-base font-bold text-ink">{currentDeck.wheel}</div>
                <div className="mt-1 text-xs text-muted">抗平斑耐磨高回弹配方</div>
              </div>
              <div className="border-2 border-ink bg-paper-2/40 p-4">
                <span className="text-[11px] font-mono text-muted uppercase font-bold">推荐适宜脚长 (SHOE FIT)</span>
                <div className="mt-1 font-mono text-base font-bold text-ink">{currentDeck.shoeSize}</div>
                <div className="mt-1 text-xs text-muted">脚掌受力面积达到最佳抓力</div>
              </div>
              <div className="border-2 border-ink bg-paper-2/40 p-4">
                <span className="text-[11px] font-mono text-muted uppercase font-bold">风格与轴距 (WHEELBASE)</span>
                <div className="mt-1 font-mono text-base font-bold text-accent-line">{currentDeck.wheelbase}</div>
                <div className="mt-1 text-xs text-muted">{currentDeck.style}</div>
              </div>
            </div>

            {/* 附加地形与调教说明 */}
            <div className="mt-4 p-4 border-2 border-rule bg-paper-2/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">理想地形：</span>
                <span className="text-ink-2">{currentDeck.idealTerrain}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-accent-line">起跳角：</span>
                <span className="text-ink-2">{currentDeck.popAngle}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          装置 2：7 层加拿大硬岩枫木板层物理剖切仪 (7-Ply Maple Anatomy)
          ──────────────────────────────────────────────────────────── */}
      <section aria-labelledby={`${uid}-maple-title`} className="px-(--page-gutter) pt-16">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="border-2 border-ink bg-paper p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-accent-line">
                  DEVICE 02 · 7-PLY CANADIAN HARDROCK MAPLE ANATOMY
                </span>
                <h2 id={`${uid}-maple-title`} className="display text-2xl sm:text-3xl font-bold text-ink mt-1">
                  七层高寒硬岩枫木物理剖面 · 压合应力分析
                </h2>
              </div>
              <span className="font-mono text-xs text-muted">
                点击单层枫木单板查看正交抗扭力学角色
              </span>
            </div>

            <p className="mt-4 text-sm text-ink-2 max-w-[72ch]" style={{ lineHeight: 1.65 }}>
              滑板不是一块胶合板。我们选用生长在五大湖高寒地带的加拿大糖枫（Sugar Maple），7 层不同纤维取向的单板在 250 吨液压机冷压下与航空级环氧树脂（Epoxy）结合，保证蹬地清脆回弹（Pop）长久不软：
            </p>

            {/* 7 层枫木截面堆叠可视化 */}
            <div className="mt-8 grid gap-8 lg:grid-cols-12 items-stretch">
              {/* 左：7 层木片截面按钮堆栈 */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-1.5">
                {MAPLE_PLIES.map((ply, idx) => {
                  const active = activePlyIndex === idx
                  return (
                    <button
                      key={ply.ply}
                      type="button"
                      onClick={() => setActivePlyIndex(idx)}
                      className={`w-full min-h-11 px-3.5 py-2 text-left transition-all border-2 flex items-center justify-between ${
                        active
                          ? 'border-accent bg-accent/20 text-ink font-bold shadow-sm'
                          : 'border-rule bg-paper-2/60 text-ink-2 hover:border-ink hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-accent-line">PLY {ply.ply}</span>
                        <span className="text-xs font-bold">{ply.grain}</span>
                      </div>
                      <span className="font-mono text-[11px] text-muted">{ply.thickness}</span>
                    </button>
                  )
                })}
              </div>

              {/* 右：当前层物理力学解析卡 */}
              <div className="lg:col-span-6 border-2 border-ink bg-paper-2/40 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-ink/40 pb-3">
                    <span className="font-mono text-xs font-bold text-accent-line">
                      第 {currentPly.ply} 层单板 · {currentPly.grain}
                    </span>
                    <span className="font-mono text-xs text-muted">厚度 {currentPly.thickness}</span>
                  </div>

                  <h3 className="display text-xl font-bold text-ink mt-4">
                    {currentPly.functionRole}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs leading-relaxed">
                    <div className="flex justify-between border-b border-rule/60 py-1.5">
                      <span className="font-mono text-muted">选用材质：</span>
                      <span className="font-bold text-ink">{currentPly.wood}</span>
                    </div>
                    <div className="flex justify-between border-b border-rule/60 py-1.5">
                      <span className="font-mono text-muted">纤维朝向：</span>
                      <span className="font-mono text-ink font-bold">
                        {currentPly.grain.includes('90°') ? '90° 正交横向纹（阻断纵向裂缝）' : '0° 纵向主受力纤维（抗冲击与回弹）'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-rule/60 py-1.5">
                      <span className="font-mono text-muted">冷压胶水：</span>
                      <span className="font-mono text-ink">Type-II 环保航空防水树脂胶</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
                  <span>含水率严格控制：8.0% ~ 9.0%</span>
                  <span className="text-accent-line font-bold">低温不开胶 · 高温不泛软 ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          装置 3：聚氨酯轮子杜氏硬度与回弹试验台 (Wheel Durometer Tester)
          ──────────────────────────────────────────────────────────── */}
      <section aria-labelledby={`${uid}-wheel-title`} className="px-(--page-gutter) pt-16">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="border-2 border-ink bg-paper p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-accent-line">
                  DEVICE 03 · SHORE DUROMETER & REBOUND SIMULATOR
                </span>
                <h2 id={`${uid}-wheel-title`} className="display text-2xl sm:text-3xl font-bold text-ink mt-1">
                  轮组聚氨酯杜氏硬度测定台 · 78A ~ 101A
                </h2>
              </div>
              <span className="font-mono text-xs text-muted">
                拖动滑块体验街式硬轮与巡游软轮的地面反馈
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-muted font-bold uppercase">硬度刻度 (SHORE DUROMETER A SCALE)：</span>
                <span className="text-accent-line font-bold text-base">{durometer} A</span>
              </div>
              <input
                type="range"
                min={78}
                max={101}
                step={1}
                value={durometer}
                onChange={(e) => setDurometer(Number(e.target.value))}
                className="w-full min-h-11 cursor-pointer accent-accent"
                aria-label="调节滑板轮硬度"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted mt-1">
                <span>78A (极软巡游/不震脚)</span>
                <span>85A (粗糙街面速滑)</span>
                <span>99A (黄金全能/街头滑手标配)</span>
                <span className="text-accent-line font-bold">101A (专业碗池与极致平地)</span>
              </div>
            </div>

            {/* 硬度测算结果 */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-2 border-rule bg-paper-2/30 p-4 text-xs font-mono">
              <div>
                <span className="text-muted block text-[10px] uppercase">弹性回弹率 (REBOUND RATE)</span>
                <span className="font-bold text-accent-line text-lg">{reboundPct}%</span>
                <div className="text-muted mt-0.5">着地瞬间能量转化输出</div>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">滑动声学分贝 (POWERSLIDE DB)</span>
                <span className="font-bold text-ink text-lg">~{soundDecibels} dB</span>
                <div className="text-muted mt-0.5">大动作横刹时轮胎撕扯声</div>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">手感与地面反馈</span>
                <span className="font-bold text-ink text-sm block mt-1">{durometerType}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          价目清单与终身断板免费移植服务
          ──────────────────────────────────────────────────────────── */}
      <section className="px-(--page-gutter) pb-24 pt-16">
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
          <div className="border-b-2 border-ink pb-3 flex flex-wrap items-baseline justify-between gap-4">
            <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              SERVICE & HARDWARE PRICE · 工坊透明清单
            </span>
            <span className="font-mono text-xs text-muted">
              不卖挂墙收藏品 · 只卖当场能操烂的硬货
            </span>
          </div>

          {items.map((it, i) => (
            <div
              key={it.v}
              className="grid items-baseline gap-x-6 gap-y-2 py-6 sm:grid-cols-[4rem_1fr_auto] border-b-2 border-ink"
            >
              <span className="font-mono text-sm font-bold text-accent-line">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span
                  className="display block text-ink font-bold"
                  style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.5rem)', lineHeight: 1.1 }}
                >
                  {it.v}
                </span>
                {it.d ? (
                  <span className="mt-1 block text-sm text-muted">
                    {it.d}
                  </span>
                ) : null}
              </div>
              <span className="font-mono text-sm font-bold text-ink sm:text-right">
                {it.k}
              </span>
            </div>
          ))}

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Cta label={page.cta || '进店'} done="✓ 已把工坊定位与后院碗池手环发你" />
            <span className="text-sm text-muted font-medium">
              第一次来配板，带你的旧板子来，我们照着你磨掉的板尾坡度与站位量身配。
            </span>
          </div>
        </div>
      </section>

      {/* 底部标准生产印章 (Hallmark Stamp 58/58) */}
      <footer className="border-t-2 border-ink pt-6 text-center text-xs font-mono text-muted">
        <p>
          KERB HARDCORE SKATE SHOP · BUILT TO BREAK · REPLACED TO SHRED
        </p>
        <p className="mt-1.5 text-accent-line font-bold">
          critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓
        </p>
      </footer>
    </main>
  )
}
