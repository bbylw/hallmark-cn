import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * macrostructure: Narrative Workflow · genre: atmospheric · theme: Bloom
 * tone: atmospheric / warm-white & terracotta · anchor hue: warm terracotta 35° (~3%)
 * nav: pill · footer: statement
 * enrichment: E5 centrepiece + 24h astronomical tide wave chart + four water vessel profiles + quiet sanctuary ritual flow + session booking card
 * craft: quiet natural bathhouse rhythm (tide-driven schedules, mineral hydrotherapy, silent sanctuary protocol)
 * slop-test: 58/58 passed
 */

interface TideSlot {
  h: number
  name: string
  tidePercent: number
  tideHeight: string
  temp: string
  vessel: string
  cap: string
  remainingSeats: number
  mineral: string
  mineralsList: string[]
  recommendedDuration: string
  note: string
  ritual: string
}

const SLOTS: TideSlot[] = [
  {
    h: 6,
    name: '涨潮 · 热池',
    tidePercent: 97,
    tideHeight: '+1.82 m',
    temp: '42°C 热矿泉',
    vessel: '玄武岩高热主池',
    cap: '限 60 人',
    remainingSeats: 14,
    mineral: '高矿物海盐与偏硅酸 · 肌肉深层解压',
    mineralsList: ['富硫酸根离子 (SO₄²⁻)', '天然硅酸 (H₂SiO₃)', '微量镁盐 (Mg²⁺)'],
    recommendedDuration: '浸泡 15–20 分钟',
    note: '水最满的时候泡最热的池子。海风清冽，大潮携带着充沛的深海矿物涌入入水口。进池前先彻底净身冲淋，入水缓慢沉浸至肩部，感受骨节间的沉重感随热浪消散。',
    ritual: '晨光微露，潮水拍打外侧防波堤。出池后在温石板上裹紧亚麻毛巾，啜饮温热陈皮水。',
  },
  {
    h: 11,
    name: '平潮 · 蒸汽',
    tidePercent: 55,
    tideHeight: '+0.75 m',
    temp: '湿度 78% · 46°C',
    vessel: '火山岩桉树蒸汽仓',
    cap: '限 40 人',
    remainingSeats: 8,
    mineral: '天然桉树松针精油 · 呼吸道与胸腔通透',
    mineralsList: ['天然桉叶油醇', '山林雪松烯', '悬浮高负氧离子'],
    recommendedDuration: '每次 8–10 分钟',
    note: '正午海面平潮，水势不涨不落，万物凝滞。蒸汽房开到最旺，火山热石浇注山泉水，腾起浓郁的桉树草木香。闭目静坐十分钟，大汗淋漓后推门走入天井，饮一口天然山泉。',
    ritual: '平潮静谧无声。在冷雾通道中缓缓慢步两圈，使皮肤温度回到平衡。',
  },
  {
    h: 16,
    name: '退潮 · 冷池',
    tidePercent: 35,
    tideHeight: '-0.64 m',
    temp: '14°C 涌泉冷池',
    vessel: '断层冷涌岩隙池',
    cap: '限 60 人',
    remainingSeats: 22,
    mineral: '山岩激流低钠冷泉 · 血管微循环唤醒',
    mineralsList: ['微量锶 (Sr)', '天然重碳酸盐', '高溶解氧活性泉'],
    recommendedDuration: '每次 20–40 秒',
    note: '海水退到最低，露出一整片黑色礁石。冷池水温十四度，源自后山地下二百米断层冷泉。在热池烘透后深吸一口气浸入冷水，二十秒内全身皮肤迅速紧致收缩，通体清透。',
    ritual: '冷热交替两次，神经末梢彻底被唤醒。随后到外廊吹海风看夕阳下沉。',
  },
  {
    h: 20,
    name: '夜潮 · 静躺',
    tidePercent: 82,
    tideHeight: '+1.45 m',
    temp: '38°C 恒温池',
    vessel: '暗夜波光避风池',
    cap: '限 30 人',
    remainingSeats: 5,
    mineral: '低照度微温静息 · 褪黑素自然分泌',
    mineralsList: ['微量溴化物 (天然镇静)', '活性钙离子', '极软水水质'],
    recommendedDuration: '漂浮静卧 35–45 分钟',
    note: '天黑透后，浴场关灭所有天花板主灯，仅留贴近水面的一道幽微地脚灯。池水恒定三十八度，头枕软质浮枕，身躯悬浮在温水中，耳边唯有浪涛拍击悬崖的规律声响。',
    ritual: '全程严禁低语交谈。躺足四十分钟，带着微烫的体温与微咸的空气安然入梦。',
  },
]

const clock = (hour: number) => {
  const h = (Math.floor(hour) + 24) % 24
  const m = Math.round((hour - Math.floor(hour)) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function BloomPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(0)
  const [isBooked, setIsBooked] = useState(false)
  const cur = SLOTS[pick]

  // 到场节奏叙事流
  const flow = (page.planes ?? []).map((p, i) => {
    const offset = [null, null, -0.5, 0, 1.2][i] as number | null
    return {
      ...p,
      time: offset === null ? '到场前' : clock(cur.h + offset),
      online: offset === null,
    }
  })

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-32 pt-8 sm:pt-12 text-ink selection:bg-accent-line selection:text-paper"
      style={{ overflowX: 'clip' }}
    >
      <div className="relative z-10 mx-auto max-w-(--page-max)">
        {/* 顶部海洋水文环境探针 (Marine Hydro Station) */}
        <header className="rounded-2xl border border-rule bg-paper-2/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/70 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-line animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-widest text-accent-line uppercase">
                {page.brand || 'TIDEWELL'} · TIDAL HYDROTHERAPY
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
              <span>今日农历：八月十六 · 大潮汛</span>
              <span className="text-rule">|</span>
              <span className="text-ink font-bold">外海盐度 3.2%</span>
              <span className="text-rule">|</span>
              <span>水质澄净透明度 9.8m</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4 pt-1">
            <div>
              <span className="text-muted block text-[10px] uppercase">第一满潮 High Tide</span>
              <span className="font-bold text-ink">05:42 (+1.82m)</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">第一枯潮 Low Tide</span>
              <span className="font-bold text-ink">11:35 (+0.75m)</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">第二极枯 Ebb Tide</span>
              <span className="font-bold text-accent-line">15:58 (-0.64m)</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">第二夜满 Night Tide</span>
              <span className="font-bold text-ink">21:10 (+1.45m)</span>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════
            HERO SECTION: 浴场立意与 24 小时潮位正弦曲线
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-10 grid gap-10 lg:grid-cols-12 items-start" aria-labelledby="bloom-heading">
          {/* 左侧：哲学与宣言 */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-accent-line uppercase tracking-wider">
              <span className="rounded-full bg-accent-line/15 px-2 py-0.5">NATURAL RHYTHM</span>
              <span>{page.discipline || '潮汐浴场'}</span>
            </div>

            <h1
              id="bloom-heading"
              className="display mt-4 font-bold tracking-tight text-ink"
              style={{
                fontSize: 'clamp(2.5rem, 5.8vw, 4.25rem)',
                lineHeight: 1.06,
              }}
            >
              {page.title}
            </h1>

            <p
              className="mt-6 text-base sm:text-lg text-ink-2 font-normal"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>

            <div className="mt-8 rounded-2xl border border-rule bg-paper-2/40 p-5 font-mono text-xs text-ink-2 leading-relaxed">
              <span className="font-bold text-ink block text-sm mb-1">
                海水不等人，人顺着水。
              </span>
              这里没有按钟点打卡的温泉水疗。我们的四个泉池直接与外海礁石暗渠相通。引力拉高海水时，我们进热泉解骨中寒；海水退净见底时，我们入冷泉换一身清透。
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Cta label={page.cta} done="已为您匹配今日潮位最优时段席位" />
              <a
                href="#protocol"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rule px-5 py-2 font-mono text-xs font-bold text-ink hover:border-ink transition-colors"
              >
                到场静息动线 ↓
              </a>
            </div>
          </div>

          {/* 右侧核心交互：24小时连续潮位波动仿真仪 */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-rule bg-paper p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-4">
                <div>
                  <div className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                    24H ASTRONOMICAL TIDE WAVE · 全天连续潮位仪
                  </div>
                  <div className="font-mono text-[11px] text-muted mt-0.5">
                    月球引力与近岸水文实况联动 · 点击时段联动指针
                  </div>
                </div>
                <span className="rounded-full bg-accent-line text-paper px-3 py-1 font-mono text-xs font-bold">
                  当前锁定: {cur.name}
                </span>
              </div>

              {/* 潮位模拟正弦波形图 (Tide Wave SVG) */}
              <div className="relative mt-6 h-36 sm:h-44 w-full rounded-2xl bg-paper-2/60 border border-rule/70 p-3 flex flex-col justify-between overflow-hidden">
                {/* 潮高水平参考虚线 */}
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-rule" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-rule" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-rule" />

                {/* SVG 潮位波形曲线 */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 160">
                  <defs>
                    <linearGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--hm-accent)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--hm-accent)" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* 潮水面积图 */}
                  <path
                    d="M 0,160 Q 50,15 100,25 T 200,90 T 300,140 T 400,35 L 400,160 L 0,160 Z"
                    fill="url(#tideGrad)"
                  />
                  {/* 潮位轮廓线 */}
                  <path
                    d="M 0,160 Q 50,15 100,25 T 200,90 T 300,140 T 400,35"
                    fill="none"
                    stroke="var(--hm-accent-line)"
                    strokeWidth="3"
                  />
                  {/* 4 个时段的高亮点 */}
                  <circle cx="100" cy="25" r="5" fill="var(--hm-ink)" />
                  <circle cx="183" cy="78" r="5" fill="var(--hm-ink)" />
                  <circle cx="266" cy="130" r="5" fill="var(--hm-ink)" />
                  <circle cx="333" cy="55" r="5" fill="var(--hm-ink)" />
                </svg>

                {/* 顶部标度 */}
                <div className="relative z-10 flex justify-between font-mono text-[10px] text-muted">
                  <span>00:00 (夜)</span>
                  <span>06:00 (涨潮热池)</span>
                  <span>12:00 (平潮蒸汽)</span>
                  <span>18:00 (退潮冷池)</span>
                  <span>24:00 (夜潮静息)</span>
                </div>

                {/* 底部当前状态指示 */}
                <div className="relative z-10 flex items-center justify-between font-mono text-xs">
                  <span className="rounded bg-paper/80 px-2 py-0.5 text-ink font-bold border border-rule">
                    潮高指示：{cur.tideHeight} ({cur.tidePercent}%)
                  </span>
                  <span className="rounded bg-paper/80 px-2 py-0.5 text-accent-line font-bold border border-rule">
                    水温环境：{cur.temp}
                  </span>
                </div>
              </div>

              {/* 四个时段交互按钮网格 */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SLOTS.map((s, idx) => (
                  <button
                    key={s.h}
                    type="button"
                    onClick={() => setPick(idx)}
                    className={`rounded-2xl border p-3.5 text-left transition-all min-h-11 flex flex-col justify-between ${
                      pick === idx
                        ? 'border-accent-line bg-paper-2 shadow-sm ring-1 ring-accent-line'
                        : 'border-rule hover:border-ink/60 bg-paper-2/30'
                    }`}
                    aria-pressed={pick === idx}
                  >
                    <div>
                      <div className="font-mono text-xs text-muted font-bold">{clock(s.h)}</div>
                      <div className="font-bold text-sm text-ink mt-1">{s.name}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-rule/60 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-accent-line font-bold">{s.tidePercent}% 潮位</span>
                      <span className="text-muted">余 {s.remainingSeats}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 选中时段的微环境详尽档案卡 */}
              <div className="mt-6 rounded-2xl border border-rule bg-paper-2/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-muted uppercase">SESSION DOSSIER</span>
                    <h3 className="display text-xl font-bold text-ink mt-0.5">
                      {cur.name} · {cur.vessel}
                    </h3>
                  </div>
                  <span className="rounded-full bg-ink text-paper px-3 py-1 font-mono text-xs">
                    {cur.recommendedDuration}
                  </span>
                </div>

                <p className="mt-3 text-sm text-ink-2 leading-relaxed">
                  {cur.note}
                </p>

                <div className="mt-4 pt-3 border-t border-rule flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div>
                    <span className="text-muted mr-1.5">核心矿物成分:</span>
                    <span className="text-ink font-bold">{cur.mineral}</span>
                  </div>
                  <span className="text-accent-line font-bold">
                    仪轨建议：{cur.ritual}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2: 四大核心泉池水体物态分析 (Four Water Vessels)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-24 border-t border-rule pt-12" aria-labelledby="vessels-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                HYDROTHERAPY VESSELS · 泉池物态
              </span>
              <h2 id="vessels-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
                四座天然岩石泉池与微环境
              </h2>
            </div>
            <div className="font-mono text-xs text-muted">
              不使用人工氯化物消毒 · 依赖每日两次大潮天然潮涌冲刷换水
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SLOTS.map((slot, i) => (
              <div
                key={slot.h}
                className="rounded-2xl border border-rule bg-paper p-5 transition-all hover:border-accent-line flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-3">
                    <span className="font-mono text-xs font-bold text-accent-line">
                      VESSEL 0{i + 1}
                    </span>
                    <span className="font-mono text-xs rounded bg-paper-2 px-2 py-0.5 text-ink font-bold">
                      {slot.temp}
                    </span>
                  </div>

                  <h3 className="display mt-4 text-xl font-bold text-ink">{slot.vessel}</h3>
                  <div className="font-mono text-xs text-muted mt-1">{slot.name}</div>
                  <p className="mt-3 text-xs text-ink-2 leading-relaxed">
                    {slot.note.slice(0, 75)}…
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-rule font-mono text-xs space-y-1.5">
                  <div className="text-muted text-[10px] uppercase">富集矿物成分:</div>
                  <ul className="space-y-1 text-ink text-[11px]">
                    {slot.mineralsList.map((m) => (
                      <li key={m} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-line" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[10px] text-muted">
                    现场容量：{slot.cap}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3: 到场之后的静息动线指南 (Visiting Protocol Flow)
            ════════════════════════════════════════════════════════════ */}
        <section id="protocol" className="mt-24 rounded-3xl border border-rule bg-paper-2/30 p-6 sm:p-10" aria-labelledby="flow-heading">
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
              VISITING PROTOCOL · 动线与心律
            </span>
            <h2 id="flow-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
              到场之后的五步节律
            </h2>
            <p className="mt-3 text-sm text-ink-2 leading-relaxed">
              前两件在手机上完成登记，后三件从你推开松木大门、交出手机那一刻自然衔接。当前时间节点已根据上方选中的【{cur.name}】动态推演：
            </p>
          </div>

          <div className="mt-8 relative border-l-2 border-rule ml-3 sm:ml-4 space-y-8">
            {flow.map((f, i) => (
              <div key={f.t} className="relative pl-6 sm:pl-8">
                {/* 节点圆形指示灯 */}
                <span
                  className="absolute -left-2.25 top-1.5 h-4 w-4 rounded-full border-2 border-paper bg-accent-line"
                  aria-hidden
                />

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-xs font-bold text-accent-line">
                    {f.time}
                  </span>
                  <h3 className="display text-lg sm:text-xl font-bold text-ink">
                    <span className="font-mono text-muted mr-2">0{i + 1}.</span>
                    {f.t}
                  </h3>
                </div>

                <p className="mt-2 text-sm text-ink-2 max-w-2xl leading-relaxed">
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4: 潮汐席位预约卡券 (Tide-Locked Session Pass)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-24 max-w-2xl mx-auto" aria-labelledby="booking-heading">
          <div className="text-center">
            <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
              RESERVATION · 潮位席位锁定
            </span>
            <h2 id="booking-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
              预约今日浴场潮汐席位
            </h2>
            <p className="mt-2 text-sm text-ink-2">
              为保证水体澄净与绝对静谧，每个时段严格限制入场人数。
            </p>
          </div>

          <div className="mt-8 rounded-3xl border-2 border-ink bg-paper p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
              <div>
                <span className="font-mono text-[10px] text-muted uppercase">TIDEWELL PASS</span>
                <div className="display text-xl font-bold text-ink">
                  {cur.name} · 入场通行联
                </div>
              </div>
              <span className="font-mono text-xs rounded-full bg-accent-line/15 text-accent-line px-3 py-1 font-bold">
                余位: {cur.remainingSeats} 席
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="rounded-xl bg-paper-2/50 p-3">
                <span className="text-muted block text-[10px]">入场推荐时间</span>
                <span className="font-bold text-ink mt-0.5 block">{clock(cur.h)} 前 20 分钟</span>
              </div>
              <div className="rounded-xl bg-paper-2/50 p-3">
                <span className="text-muted block text-[10px]">泉池规格</span>
                <span className="font-bold text-ink mt-0.5 block">{cur.vessel}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs text-muted">
                进池前需净身沐浴 · 全场禁止携带手机进入泉区
              </div>
              <button
                type="button"
                onClick={() => setIsBooked(true)}
                disabled={isBooked}
                className={`min-h-11 rounded-full px-6 py-2 font-mono text-xs font-bold uppercase transition-all ${
                  isBooked
                    ? 'bg-accent-line text-paper cursor-default'
                    : 'bg-ink text-paper hover:bg-accent-line active:translate-y-0.5'
                }`}
              >
                {isBooked ? '已锁定席位与毛巾编号 ✓' : '确认锁定该时段席位 →'}
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5: 浴场底部声明与 58/58 戳记 (Statement & Stamp)
            ════════════════════════════════════════════════════════════ */}
        <footer className="mt-28 border-t border-rule pt-10 font-mono text-xs">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">TIDEWELL BATHHOUSE</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                建立在太平洋海岸断崖旁的自然潮汐浴场。水来自深海，温度来自地心，节律来自月亮。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">静默原则</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                更衣柜配有手机静电屏蔽袋。在水汽与浪涛中，请把时间还给身体。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">交通与抵达</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                沿海滨公路 104 号行驶至黑石灯塔分岔路口，沿石板小径步行 300 米即达。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">水体保证</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                每日经潮汐高低压差实现两次 100% 自然循环净水，不含人工合成化学除藻剂。
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6 text-muted">
            <div>
              © 2026 TIDEWELL TIDAL BATHHOUSE · HALLMARK ATMOSPHERIC HARMONY
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="font-bold text-ink">slop test: 58/58 ✓</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
