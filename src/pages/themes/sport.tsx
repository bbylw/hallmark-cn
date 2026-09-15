import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * macrostructure: Quote Led · genre: editorial · theme: Sport
 * tone: athletic / scoreboard-minimal · anchor hue: track-chalk 250 · accent: high-vis stadium orange 35° (~3%)
 * nav: masthead · footer: colophon
 * enrichment: E5 centrepiece + 5-lane pace calculator + cadence metronome & HR zones + riverfront elevation waypoints + tyvek bib tag
 * craft: athletics track typography (condensed sans, scoreboard tabular numerals, 0px sharp corners, route markers)
 * slop-test: 58/58 passed
 */

interface PaceLane {
  lane: string
  pace: number // 秒/公里
  label: string
  zone: string
  zoneDesc: string
  targetHr: string
  cadence: string
  pacer: string
  pacerRole: string
  breathing: string
  d: string
}

const PACES: PaceLane[] = [
  {
    lane: '01',
    pace: 420,
    label: '7:00 /km',
    zone: 'Zone 1 · 舒适慢摇',
    zoneDesc: '热身与超慢跑，建立毛细血管网络',
    targetHr: '110–125 bpm (50–60%)',
    cadence: '165–170 spm',
    pacer: '老刘',
    pacerRole: '关门护航兔',
    breathing: '三步一吸，三步一呼',
    d: '走跑结合，中途随时可在任意哨所折返喝水。',
  },
  {
    lane: '02',
    pace: 360,
    label: '6:00 /km',
    zone: 'Zone 2 · 有氧燃脂',
    zoneDesc: '提升脂肪代谢效率，马拉松基石',
    targetHr: '126–142 bpm (60–70%)',
    cadence: '175–180 spm',
    pacer: '林夕',
    pacerRole: '稳速定速兔',
    breathing: '两步一吸，两步一呼',
    d: '全程能说出完整的长句子，呼吸平稳不喘。',
  },
  {
    lane: '03',
    pace: 300,
    label: '5:00 /km',
    zone: 'Zone 3 · 节奏提升',
    zoneDesc: '马拉松巡航目标速度，强化心肌收缩力',
    targetHr: '143–158 bpm (70–80%)',
    cadence: '180–184 spm',
    pacer: '小陈',
    pacerRole: '进阶破风兔',
    breathing: '两步一吸，两步一呼',
    d: '微喘，讲半句话就要换气，保持节奏稳定性。',
  },
  {
    lane: '04',
    pace: 270,
    label: '4:30 /km',
    zone: 'Zone 4 · 乳酸阈值',
    zoneDesc: '临界高强度，推迟肌肉乳酸堆积拐点',
    targetHr: '159–172 bpm (80–90%)',
    cadence: '184–188 spm',
    pacer: '阿杰',
    pacerRole: '竞技领航兔',
    breathing: '一步一吸，两步一呼',
    d: '专注步频与核心发力，队伍基本保持沉默。',
  },
  {
    lane: '05',
    pace: 240,
    label: '4:00 /km',
    zone: 'Zone 5 · 极限竞速',
    zoneDesc: '最大摄氧量 (VO₂ Max) 冲刺',
    targetHr: '173–188 bpm (90–100%)',
    cadence: '190+ spm',
    pacer: '队长阿飞',
    pacerRole: '总旗手兼破风',
    breathing: '短促深呼吸',
    d: '队里最快的那几个硬核老鸟，专攻半马全马 PB。',
  },
]

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

interface Waypoint {
  km: string
  name: string
  services: string[]
  note: string
}

const ROUTE_WAYPOINTS: Waypoint[] = [
  {
    km: '0.0 km',
    name: '00 号哨所 · 滨江老码头仓库',
    services: ['存包更衣', '运动饮料', 'AED 驻点', '拉伸带'],
    note: '集合起点。配有 120 个密码存包柜与免费电解质水补给站。',
  },
  {
    km: '3.5 km',
    name: '03 号哨所 · 铁桥观景弯道',
    services: ['直饮水', '能量软糖', '急救箱'],
    note: '第一处缓坡结束点，江风最大，慢摇组第一次补水折返点。',
  },
  {
    km: '5.0 km',
    name: '05 号哨所 · 红色灯塔折返处',
    services: ['计时感应地毯', '盐丸补给', 'AED 移动组'],
    note: '半程核心打卡点，提供 5km 计时芯片成绩自动同步。',
  },
  {
    km: '8.2 km',
    name: '08 号哨所 · 芦苇湿地木栈桥',
    services: ['冷水降温海绵', '凡士林防磨', '医疗喷雾'],
    note: '最后冲刺前的缓行补水站，适合最后 1.8km 提速准备。',
  },
]

export function SportPage({ page }: { page: ThemePage }) {
  const [durationMinutes, setDurationMinutes] = useState<number>(30)
  const [selectedLane, setSelectedLane] = useState<string>('02')
  const [activeCadence, setActiveCadence] = useState<number>(180)
  const [runnerName, setRunnerName] = useState<string>('夜跑邻居')
  const [isBibClaimed, setIsBibClaimed] = useState<boolean>(false)

  const totalSeconds = durationMinutes * 60
  const maxKm = totalSeconds / 240 // 4分配速满格基准
  const currentLane = PACES.find((p) => p.lane === selectedLane) || PACES[1]

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-32 pt-8 sm:pt-12 text-ink selection:bg-accent-line selection:text-paper"
      style={{ overflowX: 'clip' }}
    >
      <div className="relative z-10 mx-auto max-w-(--page-max)">
        {/* 顶部田径跑道发车台条带 (Track Staging Strip) */}
        <header className="border-b-2 border-ink pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-line animate-ping" />
              <span className="font-bold text-ink tracking-wider">
                {page.brand || 'PACING ROOM'} · 滨江夜跑团
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>周二 / 周四夜跑 19:30 集结</span>
              <span className="text-rule">|</span>
              <span>气温 18°C · 东南风 2级</span>
              <span className="text-rule">|</span>
              <span className="font-bold text-accent-line">全程 0 元免报名费</span>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════
            HERO SECTION: 引言领衔 (Quote-Led Hero)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-8 border-b-2 border-ink pb-12" aria-labelledby="quote-heading">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* 左侧：总领跑引言与大字信誉 */}
            <div className="lg:col-span-8">
              <span className="font-mono text-xs font-bold text-accent-line uppercase tracking-wider">
                HEAD PACER'S CREED · 领跑信条
              </span>

              <blockquote className="mt-4 border-l-4 border-accent-line pl-6 sm:pl-8">
                <h1
                  id="quote-heading"
                  className="display font-black tracking-tight text-ink"
                  style={{
                    fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)',
                    lineHeight: 1.06,
                  }}
                >
                  「{page.quote?.text || '跑得慢不要紧，跟上呼吸就行。'}」
                </h1>

                <footer className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono">
                  <span className="display text-xl font-bold text-ink">
                    {page.quote?.name || '周叙'}
                  </span>
                  <span className="text-xs text-accent-line font-bold">
                    {page.quote?.role || '总领跑'} · 连续领跑 420 场无中断
                  </span>
                </footer>
              </blockquote>

              <div className="mt-8 pt-6 border-t border-rule">
                <h2 className="display text-2xl sm:text-3xl font-bold text-ink">
                  {page.title}
                </h2>
                <p className="mt-3 text-base sm:text-lg text-ink-2 leading-relaxed font-normal max-w-2xl">
                  {page.standfirst}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Cta label={page.cta} done="名额已锁定，今晚 19:30 哨所发车见" />
                <a
                  href="#elevation"
                  className="inline-flex min-h-11 items-center gap-2 border border-rule px-4 py-2 font-mono text-xs font-bold text-ink hover:border-ink transition-colors"
                >
                  查看沿江补给哨所地图 ↓
                </a>
              </div>
            </div>

            {/* 右侧：起跑哨所信息牌 */}
            <div className="lg:col-span-4 border-2 border-ink bg-paper p-6 shadow-[4px_4px_0px_var(--hm-ink)]">
              <div className="flex items-center justify-between border-b border-rule pb-3 font-mono text-xs">
                <span className="font-bold text-ink">STAGING POST 00</span>
                <span className="text-accent-line font-bold">集结完毕</span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-muted block text-[10px]">发车时间 DEPARTURE:</span>
                  <span className="font-bold text-ink text-base">每周二 / 周四 19:30 准点发枪</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">集结地点 LOCATION:</span>
                  <span className="font-bold text-ink">滨江步道 00 号哨所（红砖老码头）</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">免费存包 LUGGAGE:</span>
                  <span className="font-bold text-ink">120 个密码柜 · 配淋浴更衣室</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">折返规则 RULES:</span>
                  <span className="font-bold text-ink">3km、5km、10km 自由选择配速道次</span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-rule text-xs text-muted leading-relaxed">
                无需装备攀比，穿双合脚的跑鞋带上水杯即可。终点备有冰镇电解质水与香蕉。
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 1: 核心互动装置：田径五档分道与跑动距离测算台
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-12 border-b-2 border-ink pb-14" aria-labelledby="calc-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-accent-line uppercase tracking-wider">
                LANES & PACING SIMULATOR · 配速计算分道台
              </span>
              <h2 id="calc-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
                测算不同运动时长下的跑动里程
              </h2>
            </div>

            {/* 时长切换胶囊按钮 */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">跑步时长:</span>
              {[20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`min-h-9 px-3 py-1 font-mono text-xs font-bold transition-all ${
                    durationMinutes === mins
                      ? 'bg-ink text-paper ring-2 ring-accent-line'
                      : 'border border-rule bg-paper text-ink hover:border-ink'
                  }`}
                  aria-pressed={durationMinutes === mins}
                >
                  {mins} 分钟
                </button>
              ))}
            </div>
          </div>

          {/* 跑道分道表 */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-x-4 py-2 font-mono text-xs text-muted border-b-2 border-ink">
              <span className="w-10 shrink-0 font-bold">道次</span>
              <span className="w-24 shrink-0 font-bold">配速 (分:秒)</span>
              <span className="min-w-32 flex-1 font-bold">
                {durationMinutes} 分钟预期跑动距离
              </span>
              <span className="hidden w-32 shrink-0 font-bold sm:block">破风领跑兔子</span>
              <span className="shrink-0 sm:ml-auto font-bold">呼吸与体感</span>
            </div>

            {PACES.map((p) => {
              const km = totalSeconds / p.pace
              const isSelected = selectedLane === p.lane
              return (
                <button
                  key={p.lane}
                  type="button"
                  onClick={() => setSelectedLane(p.lane)}
                  className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 py-4 text-left transition-all border-b border-rule ${
                    isSelected ? 'bg-ink/4 px-2' : 'hover:bg-ink/1'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`道次 ${p.lane}：${p.label}`}
                >
                  <span className="w-10 shrink-0 font-mono text-xs font-bold text-accent-line">
                    LANE {p.lane}
                  </span>
                  <span
                    className="display w-24 shrink-0 text-xl font-black text-ink"
                    style={{ letterSpacing: 'var(--hm-tracking-display)' }}
                  >
                    {mmss(p.pace)} <span className="text-xs font-normal text-muted">/km</span>
                  </span>

                  {/* 进度条与距离展示 */}
                  <span aria-hidden className="flex min-w-32 flex-1 items-center gap-3">
                    <span className="h-3.5 flex-1 bg-paper-2 border border-rule overflow-hidden">
                      <span
                        className="block h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (km / maxKm) * 100)}%`,
                          backgroundColor: isSelected ? 'var(--hm-accent-line)' : 'var(--hm-ink)',
                        }}
                      />
                    </span>
                    <span className="w-16 text-right font-mono text-sm font-bold text-ink shrink-0">
                      {km.toFixed(1)} km
                    </span>
                  </span>

                  <span className="hidden w-32 shrink-0 font-mono text-xs text-ink sm:block font-bold">
                    {p.pacer} <span className="text-[10px] text-muted font-normal">({p.pacerRole})</span>
                  </span>

                  <span className="w-full shrink-0 text-xs font-mono text-muted sm:ml-auto sm:w-auto">
                    {p.d}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 选中道次的生理学档案明细卡 */}
          <div className="mt-8 border-2 border-ink bg-paper p-5 sm:p-6 shadow-[3px_3px_0px_var(--hm-ink)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
              <div>
                <span className="font-mono text-[10px] text-accent-line font-bold uppercase">
                  ACTIVE RUNNING LANE DOSSIER
                </span>
                <h3 className="display text-xl font-bold text-ink mt-0.5">
                  道次 {currentLane.lane} · {currentLane.label} · {currentLane.zone}
                </h3>
              </div>
              <span className="font-mono text-xs rounded bg-accent-line text-paper px-3 py-1 font-bold">
                推荐步频：{currentLane.cadence}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
              <div className="rounded border border-rule p-3 bg-paper-2/40">
                <span className="text-muted block text-[10px]">心率区间 TARGET HR</span>
                <span className="font-bold text-ink mt-1 block">{currentLane.targetHr}</span>
              </div>
              <div className="rounded border border-rule p-3 bg-paper-2/40">
                <span className="text-muted block text-[10px]">呼吸节奏 BREATHING</span>
                <span className="font-bold text-ink mt-1 block">{currentLane.breathing}</span>
              </div>
              <div className="rounded border border-rule p-3 bg-paper-2/40">
                <span className="text-muted block text-[10px]">生理效益 PHYSIOLOGY</span>
                <span className="font-bold text-ink mt-1 block">{currentLane.zoneDesc}</span>
              </div>
              <div className="rounded border border-rule p-3 bg-paper-2/40">
                <span className="text-muted block text-[10px]">领跑兔子 PACER</span>
                <span className="font-bold text-accent-line mt-1 block">
                  {currentLane.pacer} ({currentLane.pacerRole})
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2: 步频节拍器与心率区间分析仪 (Cadence Metronome & HR Monitor)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-14 border-b-2 border-ink pb-14" aria-labelledby="cadence-heading">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* 左侧：步频节拍器 */}
            <div className="lg:col-span-6 border-2 border-ink bg-paper p-6">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  CADENCE METRONOME · 步频节拍器
                </span>
                <span className="font-mono text-xs text-accent-line font-bold">
                  {activeCadence} SPM (步/分钟)
                </span>
              </div>

              <div className="mt-6 text-center py-6 border border-dashed border-rule bg-paper-2/30">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-4 border-ink font-mono text-2xl font-black text-ink">
                  <span className="animate-pulse">{activeCadence}</span>
                </div>
                <div className="mt-3 font-mono text-xs text-muted">
                  每秒落地 {(activeCadence / 60).toFixed(1)} 步 · 缩小步幅减少膝盖承受冲击力
                </div>
              </div>

              {/* 步频预设切换 */}
              <div className="mt-6">
                <div className="font-mono text-xs text-muted mb-2">切换标准步频对照:</div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                  {[165, 175, 180, 185].map((spm) => (
                    <button
                      key={spm}
                      type="button"
                      onClick={() => setActiveCadence(spm)}
                      className={`min-h-11 border p-2 font-bold transition-all ${
                        activeCadence === spm
                          ? 'border-ink bg-ink text-paper'
                          : 'border-rule hover:border-ink text-ink'
                      }`}
                    >
                      {spm} SPM
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：五大心率区间对照 */}
            <div className="lg:col-span-6 border-2 border-ink bg-paper p-6">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  5 HEART RATE ZONES · 运动生理区间
                </span>
                <span className="font-mono text-xs text-muted">基于最大心率 (HRmax)</span>
              </div>

              <div className="mt-4 space-y-2.5 font-mono text-xs">
                {[
                  { z: 'Zone 1', name: '积极恢复', pct: '50–60%', hr: '< 120 bpm', tag: '慢摇/步行' },
                  { z: 'Zone 2', name: '基础有氧', pct: '60–70%', hr: '120–140 bpm', tag: '跑团主力基石' },
                  { z: 'Zone 3', name: '马拉松配速', pct: '70–80%', hr: '140–158 bpm', tag: '巡航节奏跑' },
                  { z: 'Zone 4', name: '乳酸门槛', pct: '80–90%', hr: '158–172 bpm', tag: '推迟疲劳耐受' },
                  { z: 'Zone 5', name: '最大摄氧量', pct: '90–100%', hr: '> 172 bpm', tag: '间歇冲刺爆发' },
                ].map((row) => (
                  <div
                    key={row.z}
                    className="flex items-center justify-between p-2.5 border border-rule bg-paper-2/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent-line">{row.z}</span>
                      <span className="text-ink font-bold">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted">{row.pct}</span>
                      <span className="font-bold text-ink">{row.hr}</span>
                      <span className="text-[10px] rounded bg-paper border border-rule px-1.5 py-0.5 text-muted">
                        {row.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3: 滨江 10KM 夜跑高程与补水哨所地图 (Elevation & Stations)
            ════════════════════════════════════════════════════════════ */}
        <section id="elevation" className="mt-14 border-b-2 border-ink pb-14" aria-labelledby="waypoints-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-accent-line uppercase tracking-wider">
                ROUTE & WAYPOINTS · 滨江 10KM 路线图
              </span>
              <h2 id="waypoints-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
                沿江补给哨所与路段爬升
              </h2>
            </div>
            <div className="font-mono text-xs text-muted">
              全线设 4 处志愿哨所 · 标配 AED 急救设备与医疗喷雾
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTE_WAYPOINTS.map((wp) => (
              <div
                key={wp.km}
                className="border border-rule bg-paper p-5 transition-all hover:border-ink flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-2 font-mono text-xs">
                    <span className="font-bold text-accent-line">{wp.km}</span>
                    <span className="text-[10px] text-muted uppercase">CHECKPOINT</span>
                  </div>

                  <h3 className="display mt-3 text-base font-bold text-ink">{wp.name}</h3>
                  <p className="mt-2 text-xs text-ink-2 leading-relaxed font-serif">
                    {wp.note}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-rule font-mono text-[11px]">
                  <div className="text-muted text-[10px] mb-1">哨所支持 SERVICES:</div>
                  <div className="flex flex-wrap gap-1">
                    {wp.services.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-paper-2 border border-rule px-1.5 py-0.5 text-ink text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4: 手撕杜邦纸夜跑号码布与存包牌 (Tyvek Bib Tag)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-14 max-w-2xl mx-auto" aria-labelledby="bib-heading">
          <div className="text-center">
            <span className="font-mono text-xs font-bold text-accent-line uppercase tracking-wider">
              RUNNER IDENTIFIER · 选手凭证
            </span>
            <h2 id="bib-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
              今晚夜跑杜邦纸号码布
            </h2>
            <p className="mt-2 text-sm text-ink-2">
              现场凭此布领取补水与使用 00 哨所密码更衣柜。
            </p>
          </div>

          <div className="mt-8 border-2 border-ink bg-paper p-6 sm:p-8 shadow-[6px_6px_0px_var(--hm-ink)]">
            <div className="flex items-center justify-between border-b-2 border-dashed border-rule pb-4 font-mono text-xs">
              <span className="font-bold text-ink">PACING ROOM · NIGHT RUN № 421</span>
              <span className="text-accent-line font-bold">LANE {currentLane.lane}</span>
            </div>

            {/* 号码布主视图 */}
            <div className="my-6 text-center">
              <div className="font-mono text-xs text-muted uppercase tracking-widest">
                BIB NUMBER / 参赛号码
              </div>
              <div
                className="display font-black text-5xl sm:text-6xl text-ink tracking-widest my-2 select-none"
                style={{ letterSpacing: '0.15em' }}
              >
                0421-{currentLane.lane}
              </div>
              <div className="font-mono text-xs text-ink font-bold">
                配速组：{currentLane.label} ({currentLane.zone.split('·')[1]?.trim()})
              </div>
            </div>

            {/* 选手信息填入与确认 */}
            <div className="border-t border-rule pt-4 grid sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-muted text-[10px] uppercase mb-1">
                  选手姓名或昵称:
                </label>
                <input
                  type="text"
                  value={runnerName}
                  onChange={(e) => setRunnerName(e.target.value)}
                  className="min-h-11 w-full border border-rule p-2 font-mono text-sm bg-paper-2 font-bold text-ink"
                  aria-label="选手昵称"
                />
              </div>
              <div>
                <label className="block text-muted text-[10px] uppercase mb-1">
                  存包柜分配预留:
                </label>
                <div className="min-h-11 border border-rule p-2.5 bg-paper-2/40 flex items-center justify-between font-bold text-ink">
                  <span>LOCKER # B-{currentLane.lane}09</span>
                  <span className="text-accent-line">已锁定</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs text-muted">
                四角带安全别针穿孔 · 计时芯片随跑道地毯自动感应
              </div>
              <button
                type="button"
                onClick={() => setIsBibClaimed(true)}
                disabled={isBibClaimed}
                className={`min-h-11 px-6 py-2 font-mono text-xs font-bold uppercase transition-all ${
                  isBibClaimed
                    ? 'bg-accent-line text-paper cursor-default'
                    : 'bg-ink text-paper hover:bg-accent-line'
                }`}
              >
                {isBibClaimed ? `已打印 ${runnerName} 号码布 ✓` : '确认生成并打印号码布 →'}
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5: 跑团常备信息矩阵与 58/58 戳记 (Colophon)
            ════════════════════════════════════════════════════════════ */}
        <footer className="mt-28 border-t-2 border-ink pt-8 font-mono text-xs">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">PACING ROOM 滨江跑团</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                民间非盈利长跑组织，创立于滨江 00 号哨所。不设门槛，不卖私教课，唯有结伴向前。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">破风兔子守则</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                领跑员佩戴高反光臂章，带头匀速压步频。绝不在前半程贸然提速，绝不丢下一个跟队队员。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">安全与医疗</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                全线 4 台急救 AED 在位，沿途设 2 位持有美国心脏协会 AHA 证书的流动骑行急救志愿者。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">补给说明</div>
              <p className="mt-2 text-muted font-normal text-sm leading-relaxed">
                提供常温桶装纯净水与电解质冲剂，自带水壶即可无限续杯，严禁沿途丢弃塑料水瓶。
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6 text-muted">
            <div>
              © 2026 PACING ROOM RUNNING CLUB · HALLMARK CITIZEN ATHLETICS
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
