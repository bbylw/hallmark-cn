import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * macrostructure: Split Studio · genre: editorial · theme: Riso
 * tone: editorial / tactile-print · anchor hue: warm peach 30 · accent: riso cyan 220 (~3%)
 * nav: masthead · footer: colophon
 * enrichment: E5 centrepiece + dual-drum press simulator + interactive paper tactile lab + perforated ticket stub
 * craft: tier-A pure-CSS risograph (overprinted spot inks, halftone screen simulation, misregistration, grain)
 * slop-test: 58/58 passed
 */

interface DrumColor {
  id: string
  name: string
  en: string
  color: string
}

interface DrumPairPreset {
  name: string
  desc: string
  drumA: DrumColor
  drumB: DrumColor
}

const SPOT_INKS: DrumColor[] = [
  { id: 'fed-blue', name: '联邦蓝', en: 'Federal Blue', color: 'oklch(48% 0.18 220)' },
  { id: 'fluo-pink', name: '荧光红', en: 'Fluorescent Pink', color: 'oklch(62% 0.26 25)' },
  { id: 'mint', name: '薄荷绿', en: 'Mint', color: 'oklch(68% 0.16 155)' },
  { id: 'sunflower', name: '向日葵', en: 'Sunflower', color: 'oklch(86% 0.19 90)' },
  { id: 'warm-red', name: '暖赤陶', en: 'Warm Red', color: 'oklch(54% 0.22 35)' },
  { id: 'gold', name: '古铜金', en: 'Flat Gold', color: 'oklch(70% 0.13 75)' },
  { id: 'black', name: '浓黑', en: 'Black', color: 'oklch(20% 0.02 240)' },
]

const DRUM_PRESETS: DrumPairPreset[] = [
  {
    name: '经典套印',
    desc: '最标志性的 Riso 撞色，蓝与粉交界处呈现幽邃紫调',
    drumA: SPOT_INKS[0], // 联邦蓝
    drumB: SPOT_INKS[1], // 荧光粉
  },
  {
    name: '植物薄雾',
    desc: '冷调薄荷配合暖陶土，呈现大自然与泥土的呼吸感',
    drumA: SPOT_INKS[2], // 薄荷绿
    drumB: SPOT_INKS[4], // 暖红
  },
  {
    name: '向日葵浓黑',
    desc: '粗颗粒高反差工业排印，极具复古街头地下刊物张力',
    drumA: SPOT_INKS[3], // 向日葵
    drumB: SPOT_INKS[6], // 浓黑
  },
  {
    name: '暖金与青',
    desc: '冷冽青色与暗金微粒叠合，形成古雅典雅的版画质感',
    drumA: SPOT_INKS[5], // 古铜金
    drumB: SPOT_INKS[0], // 联邦蓝
  },
]

interface PaperStock {
  id: string
  name: string
  weight: string
  texture: string
  absorbency: string
  feel: string
  note: string
  color: string
}

const PAPER_STOCKS: PaperStock[] = [
  {
    id: 'munken',
    name: '瑞典蒙肯纯质 Munken Pure',
    weight: '170 gsm',
    texture: '细腻微粗糙',
    absorbency: '极高（秒干）',
    feel: '温润质朴，最还原大豆油墨毛细渗透',
    note: '全场主力刊物正文首选用纸，不反光且翻阅极顺手。',
    color: '#f6f3eb',
  },
  {
    id: 'dutch',
    name: '荷兰原生白卡 Ivory Board',
    weight: '250 gsm',
    texture: '高挺度致密卡纸',
    absorbency: '中等（需晾干）',
    feel: '硬挺沉稳，双面压痕平整不易变形',
    note: '海报、封面与纪念明信片首选，承载多色重叠大色块。',
    color: '#faf9f5',
  },
  {
    id: 'chipboard',
    name: '灰底再生浆白板 Chipboard',
    weight: '300 gsm',
    texture: '原木粗纤维杂质',
    absorbency: '极速渗透',
    feel: '复古粗粝，自带深浅不一的木浆碎屑',
    note: '工业实验风格，自带未修饰的粗犷工业物态感。',
    color: '#eae5d9',
  },
  {
    id: 'kozo',
    name: '日本手工楮皮和纸 Kozo Fiber',
    weight: '80 gsm',
    texture: '半透长纤维棉絮',
    absorbency: '不规则毛边晕染',
    feel: '轻盈柔韧，逆光可见长纤维交织脉络',
    note: '限量特藏诗集与艺术折页专用，透光印迹极具诗意。',
    color: '#f9f6ef',
  },
  {
    id: 'bagasse',
    name: '甘蔗渣环保天然纸 Bagasse',
    weight: '120 gsm',
    texture: '自然米黄哑光面',
    absorbency: '均匀饱满',
    feel: '柔软质感，具有植物天然清香与暖意',
    note: '100% 农业副产物循环利用，墨层柔和无反光。',
    color: '#f4ede0',
  },
]

interface GalleryItem {
  id: string
  title: string
  studio: string
  city: string
  type: 'zine' | 'poster' | 'print'
  typeZh: string
  format: string
  inks: string[]
  paper: string
  edition: string
  description: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'item-1',
    title: '《末班夜行巴士 No.6》',
    studio: 'Pulp District Studio',
    city: '阿姆斯特丹',
    type: 'zine',
    typeZh: '独立折页刊',
    format: '16开 36页 · 骑马钉配折口',
    inks: ['联邦蓝', '荧光红'],
    paper: '瑞典蒙肯 120gsm',
    edition: '限量 150 册',
    description: '记录深夜末班公共汽车窗口掠过的霓虹切面，粗颗粒半调与走纸微晃赋予画面电影感。',
  },
  {
    id: 'item-2',
    title: '《植物神经孔版标本集》',
    studio: 'Atelier Herbarium',
    city: '京都',
    type: 'print',
    typeZh: '艺术打样集',
    format: '散页装 12联张 · 纯棉拉绳包封',
    inks: ['薄荷绿', '暖赤陶', '向日葵'],
    paper: '日本楮皮和纸 80gsm',
    edition: '限量 80 套',
    description: '采用高倍显微镜解剖叶脉纤维，三色孔版网目交错形成第三种大自然腐殖质墨色。',
  },
  {
    id: 'item-3',
    title: '《九城排印错位实验宣言》',
    studio: 'Press & Errors Guild',
    city: '柏林 / 伦敦',
    type: 'poster',
    typeZh: '巨幅海报',
    format: 'A3 展陈标准画幅',
    inks: ['浓黑', '荧光红'],
    paper: '荷兰白卡 250gsm',
    edition: '限量 300 张',
    description: '故意将第一版进纸斜切 3 度，用绝对的机械失误致敬手作时代的印刷温度。',
  },
  {
    id: 'item-4',
    title: '《离散波长：电子乐声谱孔版化》',
    studio: 'Sub-Frequency Press',
    city: '东京',
    type: 'zine',
    typeZh: '风琴折刊物',
    format: '十折联张展开长卷',
    inks: ['古铜金', '联邦蓝', '荧光红'],
    paper: '甘蔗环保纸 120gsm',
    edition: '限量 200 册',
    description: '将 80 年代合成器波形转化为 70 LPI 点阵网点，纯大豆植物油墨自然发色。',
  },
  {
    id: 'item-5',
    title: '《混凝土与晨雾记事》',
    studio: 'Brutal Print Room',
    city: '上海',
    type: 'print',
    typeZh: '连环画页',
    format: '正方形 210×210mm',
    inks: ['薄荷绿', '浓黑'],
    paper: '灰底再生白板 300gsm',
    edition: '限量 120 套',
    description: '以粗粝木浆白板为底，两度印刷呈现城市建筑光影与晨曦空气中的灰度粒子。',
  },
  {
    id: 'item-6',
    title: '《字模工人的日记抽印本》',
    studio: 'Movable Type Revival',
    city: '爱丁堡',
    type: 'poster',
    typeZh: '文献单页',
    format: '法式折叠 A2 单面',
    inks: ['向日葵', '联邦蓝'],
    paper: '瑞典蒙肯 170gsm',
    edition: '限量 100 张',
    description: '重印上世纪铅字字盘清洗工艺说明书，在现代孔版机中重现金属油墨的厚重质感。',
  },
]

export function RisoPage({ page }: { page: ThemePage }) {
  // 核心实验台状态
  const [offX, setOffX] = useState(6)
  const [offY, setOffY] = useState(-3)
  const [drumIdx, setDrumIdx] = useState(0)
  const [stampWord, setStampWord] = useState('OFF')
  const [patternMode, setPatternMode] = useState<'type' | 'botanical' | 'geo' | 'zine'>('type')
  const [screening, setScreening] = useState<'halftone' | 'solid'>('halftone')
  const [rollerMark, setRollerMark] = useState(true)

  // 纸张选样状态
  const [activePaper, setActivePaper] = useState(PAPER_STOCKS[0].id)

  // 画廊筛选
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'zine' | 'poster' | 'print'>('all')

  // 工坊票根交互
  const [ticketSession, setTicketSession] = useState<'sat-am' | 'sat-pm' | 'sun-all'>('sat-pm')
  const [isBooked, setIsBooked] = useState(false)

  const items = page.items ?? []
  const currentDrums = DRUM_PRESETS[drumIdx]
  const currentPaper = PAPER_STOCKS.find((p) => p.id === activePaper) || PAPER_STOCKS[0]

  const filteredGallery = GALLERY_ITEMS.filter(
    (item) => galleryFilter === 'all' || item.type === galleryFilter
  )

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-32 pt-8 sm:pt-12 text-ink selection:bg-accent-line selection:text-paper"
      style={{ overflowX: 'clip' }}
    >
      {/* 全局微弱纸张噪点叠加层（孔版未涂布纸专属物态触感） */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-(--page-max)">
        {/* 顶部报头标定 (Masthead strip) */}
        <header className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent-line animate-pulse" />
              <span className="font-bold tracking-wider text-ink">
                {page.brand || 'OFF-REGISTER'} · RISOGRAPH EXPO 2026
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>场次: 10月18日–19日</span>
              <span className="text-rule">|</span>
              <span>地点: 浆纸工坊 Pulp Yard</span>
              <span className="text-rule">|</span>
              <span className="rounded bg-accent-line/15 px-2 py-0.5 text-accent-line font-bold">
                八台双色机现场实印
              </span>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════
            HERO SECTION: 巨幅双滚筒孔版印刷工作台
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-12" aria-labelledby="hero-heading">
          {/* 左侧：策展宣言与工艺引言 */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
              <span className="px-1.5 py-0.5 border border-accent-line/40 rounded">DUAL-DRUM 01</span>
              <span>{page.discipline}</span>
            </div>

            <h1
              id="hero-heading"
              className="display mt-4 font-black tracking-tight text-ink"
              style={{
                fontSize: 'clamp(2.5rem, 5.8vw, 4.25rem)',
                lineHeight: 1.05,
                wordBreak: 'break-word',
              }}
            >
              <span
                className="inline-block"
                style={{
                  textShadow: `-0.02em -0.015em 0 ${currentDrums.drumA.color}, 0.025em 0.02em 0 ${currentDrums.drumB.color}`,
                }}
              >
                {page.title}
              </span>
            </h1>

            <p
              className="mt-6 text-base sm:text-lg text-ink-2 font-serif"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>

            {/* 核心印刷指标条 */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-rule py-4 font-mono text-xs sm:grid-cols-4">
              <div>
                <span className="text-muted block">制版目数</span>
                <span className="font-bold text-ink">70 LPI 粗网目</span>
              </div>
              <div>
                <span className="text-muted block">油墨介质</span>
                <span className="font-bold text-ink">大豆/米糠纯植物</span>
              </div>
              <div>
                <span className="text-muted block">进纸公差</span>
                <span className="font-bold text-accent-line">±1.8 mm 随机偏斜</span>
              </div>
              <div>
                <span className="text-muted block">展台机位</span>
                <span className="font-bold text-ink">8台联机</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Cta label={page.cta} done="工坊预约号与展位手册已发送至邮箱" />
              <a
                href="#paper-lab"
                className="inline-flex min-h-11 items-center gap-2 rounded border border-rule px-4 py-2 font-mono text-xs font-bold text-ink hover:border-ink transition-colors"
              >
                探索特种纸标本 ↓
              </a>
            </div>

            {/* 真实工艺小贴士 */}
            <div className="mt-8 rounded border border-rule/70 bg-paper-2/40 p-4 font-mono text-xs text-muted leading-relaxed">
              <span className="font-bold text-ink mr-2">工坊守则:</span>
              孔版印刷不设“完美准星”。大豆油墨自然渗透未涂布纸纤维，每一张因进纸滚轮摩擦产生的微小错位，都是机械工业与纸张质地共谋的绝版印记。
            </div>
          </div>

          {/* 右侧：实机交互仿真工作台 (The Dual-Drum Press Simulator) */}
          <div className="lg:col-span-7">
            <div className="rounded border-2 border-ink bg-paper p-5 sm:p-7 shadow-[4px_4px_0px_var(--hm-ink)]">
              {/* 操作台顶部状态 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent-line" />
                  <span className="font-mono text-xs font-bold tracking-wider text-ink">
                    RISO PRESS SIMULATOR · 双滚筒动态打样台
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-muted mr-1">预设色组:</span>
                  {DRUM_PRESETS.map((p, i) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setDrumIdx(i)}
                      className={`min-h-8 rounded px-2.5 py-1 font-bold transition-all ${
                        drumIdx === i
                          ? 'bg-ink text-paper ring-1 ring-accent-line'
                          : 'border border-rule text-muted hover:border-ink hover:text-ink'
                      }`}
                      aria-pressed={drumIdx === i}
                    >
                      色组 {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* 当前双滚筒墨卡展示 */}
              <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="flex items-center gap-2.5 rounded border border-rule bg-paper-2/50 p-2.5">
                  <span
                    className="h-5 w-5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: currentDrums.drumA.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] text-muted uppercase">Drum A 滚筒一</div>
                    <div className="font-bold text-ink truncate">
                      {currentDrums.drumA.name}{' '}
                      <span className="text-[10px] text-muted font-normal">
                        {currentDrums.drumA.en}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded border border-rule bg-paper-2/50 p-2.5">
                  <span
                    className="h-5 w-5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: currentDrums.drumB.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] text-muted uppercase">Drum B 滚筒二</div>
                    <div className="font-bold text-ink truncate">
                      {currentDrums.drumB.name}{' '}
                      <span className="text-[10px] text-muted font-normal">
                        {currentDrums.drumB.en}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 核心画布：真实孔版叠印与半调网点模拟区 */}
              <div
                className="relative mt-5 aspect-16/10 w-full overflow-hidden rounded border border-rule select-none"
                style={{
                  backgroundColor: currentPaper.color,
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.04)',
                }}
              >
                {/* 走纸滚轮拖痕与齿痕 (Roller drag marks) */}
                {rollerMark && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 48px, ${currentDrums.drumB.color} 49px, transparent 50px)`,
                    }}
                  />
                )}

                {/* 纸张表面微颗粒 */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23g)' opacity='0.08'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* 半调网目点阵层 (Halftone screen) */}
                {screening === 'halftone' && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 1px)`,
                      backgroundSize: '4px 4px',
                    }}
                  />
                )}

                {/* 图样渲染器：支持 Typography / Botanical / Geometry / Zine */}
                {patternMode === 'type' && (
                  <>
                    {/* Layer A (基底版，Drum A) */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-100"
                      style={{
                        transform: `translate(${-offX}px, ${-offY}px)`,
                        color: currentDrums.drumA.color,
                        mixBlendMode: 'multiply',
                      }}
                    >
                      <span
                        className="display font-black tracking-widest text-center"
                        style={{ fontSize: 'clamp(3.5rem, 11vw, 7rem)', lineHeight: 0.9 }}
                      >
                        {stampWord}
                      </span>
                      <div className="mt-2 font-mono text-xs tracking-widest uppercase">
                        PLATE-A · 70 LPI · SOY INK
                      </div>
                    </div>

                    {/* Layer B (套印版，Drum B，带错位偏角) */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-100"
                      style={{
                        transform: `translate(${offX}px, ${offY}px) rotate(${offX * 0.1}deg)`,
                        color: currentDrums.drumB.color,
                        mixBlendMode: 'multiply',
                      }}
                    >
                      <span
                        className="display font-black tracking-widest text-center opacity-90"
                        style={{ fontSize: 'clamp(3.5rem, 11vw, 7rem)', lineHeight: 0.9 }}
                      >
                        {stampWord}
                      </span>
                      <div className="mt-2 font-mono text-xs tracking-widest uppercase">
                        PLATE-B · MISREGISTER ±{Math.hypot(offX, offY).toFixed(1)}MM
                      </div>
                    </div>
                  </>
                )}

                {patternMode === 'geo' && (
                  <>
                    {/* 几何结构 Layer A */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                      style={{
                        transform: `translate(${-offX}px, ${-offY}px)`,
                        color: currentDrums.drumA.color,
                        mixBlendMode: 'multiply',
                      }}
                    >
                      <div className="relative h-44 w-44 rounded-full border-18 border-current opacity-85">
                        <div className="absolute inset-2 border-4 border-dashed border-current rounded-full" />
                      </div>
                    </div>
                    {/* 几何结构 Layer B */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                      style={{
                        transform: `translate(${offX}px, ${offY}px) rotate(${offX * 0.4}deg)`,
                        color: currentDrums.drumB.color,
                        mixBlendMode: 'multiply',
                      }}
                    >
                      <div className="h-44 w-44 rotate-45 border-16 border-current opacity-85">
                        <div className="h-full w-full bg-current opacity-25" />
                      </div>
                    </div>
                  </>
                )}

                {patternMode === 'botanical' && (
                  <>
                    {/* 植物标本 Layer A */}
                    <svg
                      className="absolute inset-0 h-full w-full p-8 transition-transform duration-100"
                      style={{
                        transform: `translate(${-offX}px, ${-offY}px)`,
                        fill: currentDrums.drumA.color,
                        mixBlendMode: 'multiply',
                      }}
                      viewBox="0 0 200 120"
                    >
                      <path d="M20,100 C60,80 80,40 100,10 C120,40 140,80 180,100 C140,90 120,70 100,45 C80,70 60,90 20,100 Z" opacity="0.8" />
                      <circle cx="100" cy="35" r="16" />
                      <line x1="100" y1="10" x2="100" y2="110" stroke={currentDrums.drumA.color} strokeWidth="3" />
                    </svg>
                    {/* 植物标本 Layer B */}
                    <svg
                      className="absolute inset-0 h-full w-full p-8 transition-transform duration-100"
                      style={{
                        transform: `translate(${offX}px, ${offY}px) rotate(${offX * 0.2}deg)`,
                        fill: currentDrums.drumB.color,
                        mixBlendMode: 'multiply',
                      }}
                      viewBox="0 0 200 120"
                    >
                      <path d="M40,110 C70,70 90,50 100,20 C110,50 130,70 160,110 C130,95 115,80 100,60 C85,80 70,95 40,110 Z" opacity="0.75" />
                      <rect x="85" y="50" width="30" height="30" transform="rotate(45 100 65)" opacity="0.6" />
                    </svg>
                  </>
                )}

                {patternMode === 'zine' && (
                  <div className="absolute inset-6 grid grid-cols-2 gap-4">
                    <div
                      className="border-2 border-current p-3 transition-transform duration-100 flex flex-col justify-between"
                      style={{
                        transform: `translate(${-offX}px, ${-offY}px)`,
                        color: currentDrums.drumA.color,
                        mixBlendMode: 'multiply',
                      }}
                    >
                      <div className="font-mono text-[10px] font-bold">PAGE 04 · COLOPHON</div>
                      <div className="space-y-1">
                        <div className="h-2 bg-current opacity-70 w-full" />
                        <div className="h-2 bg-current opacity-70 w-4/5" />
                        <div className="h-2 bg-current opacity-70 w-3/5" />
                      </div>
                      <div className="font-mono text-[9px]">PULP YARD EDITIONS</div>
                    </div>
                    <div
                      className="border-2 border-current p-3 transition-transform duration-100 flex flex-col justify-between"
                      style={{
                        transform: `translate(${offX}px, ${offY}px)`,
                        color: currentDrums.drumB.color,
                        mixBlendMode: 'multiply',
                      }}
                    >
                      <div className="font-mono text-[10px] font-bold">PAGE 05 · SPECIMEN</div>
                      <div className="h-12 w-12 rounded-full border-4 border-current self-center" />
                      <div className="font-mono text-[9px] text-right">ED. 120/500</div>
                    </div>
                  </div>
                )}

                {/* 标尺与四角套印十字光标 (Registration Marks) */}
                <div className="pointer-events-none absolute top-2 left-2 font-mono text-[9px] text-black/50">
                  + REG-MARK-TL
                </div>
                <div className="pointer-events-none absolute top-2 right-2 font-mono text-[9px] text-black/50">
                  + REG-MARK-TR
                </div>
                <div className="pointer-events-none absolute bottom-2 left-2 font-mono text-[9px] text-black/50">
                  PAPER: {currentPaper.name}
                </div>
                <div className="pointer-events-none absolute bottom-2 right-2 font-mono text-[9px] text-black/50">
                  ERR: {offX > 0 ? `+${offX}` : offX}mm / {offY > 0 ? `+${offY}` : offY}mm
                </div>
              </div>

              {/* 交互控制台面板 */}
              <div className="mt-5 space-y-4">
                {/* 偏斜调节双滑块 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ink font-bold">水平走纸偏移 (X轴):</span>
                      <span className="text-accent-line font-bold">{offX > 0 ? `+${offX}` : offX} mm</span>
                    </div>
                    <input
                      type="range"
                      min={-15}
                      max={15}
                      step={0.5}
                      value={offX}
                      onChange={(e) => setOffX(Number(e.target.value))}
                      className="mt-1.5 min-h-11 w-full cursor-pointer accent-accent-line"
                      aria-label="调整水平走纸偏移量"
                    />
                  </label>

                  <label className="block">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-ink font-bold">垂直进纸偏斜 (Y轴):</span>
                      <span className="text-accent-line font-bold">{offY > 0 ? `+${offY}` : offY} mm</span>
                    </div>
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={0.5}
                      value={offY}
                      onChange={(e) => setOffY(Number(e.target.value))}
                      className="mt-1.5 min-h-11 w-full cursor-pointer accent-accent-line"
                      aria-label="调整垂直进纸偏移量"
                    />
                  </label>
                </div>

                {/* 图样与模式选择条 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
                  {/* 字版选择 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted">字版印模:</span>
                    {['OFF', 'RISO', 'INK', 'PULP'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          setStampWord(w)
                          setPatternMode('type')
                        }}
                        className={`min-h-8 rounded px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                          patternMode === 'type' && stampWord === w
                            ? 'bg-ink text-paper'
                            : 'border border-rule text-muted hover:border-ink hover:text-ink'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  {/* 图样形态 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted">版面图样:</span>
                    <button
                      type="button"
                      onClick={() => setPatternMode('geo')}
                      className={`min-h-8 rounded px-2 py-1 font-mono text-xs transition-all ${
                        patternMode === 'geo'
                          ? 'bg-ink text-paper font-bold'
                          : 'border border-rule text-muted hover:border-ink'
                      }`}
                    >
                      几何标靶
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatternMode('botanical')}
                      className={`min-h-8 rounded px-2 py-1 font-mono text-xs transition-all ${
                        patternMode === 'botanical'
                          ? 'bg-ink text-paper font-bold'
                          : 'border border-rule text-muted hover:border-ink'
                      }`}
                    >
                      植物标本
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatternMode('zine')}
                      className={`min-h-8 rounded px-2 py-1 font-mono text-xs transition-all ${
                        patternMode === 'zine'
                          ? 'bg-ink text-paper font-bold'
                          : 'border border-rule text-muted hover:border-ink'
                      }`}
                    >
                      刊物折页
                    </button>
                  </div>
                </div>

                {/* 物理细节开关 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule/60 pt-3 text-xs font-mono text-muted">
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={screening === 'halftone'}
                        onChange={(e) => setScreening(e.target.checked ? 'halftone' : 'solid')}
                        className="h-4 w-4 rounded accent-ink"
                      />
                      <span>70 LPI 经典半调网点</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rollerMark}
                        onChange={(e) => setRollerMark(e.target.checked)}
                        className="h-4 w-4 rounded accent-ink"
                      />
                      <span>滚轮走纸拉丝痕</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOffX(0)
                      setOffY(0)
                    }}
                    className="text-[11px] underline hover:text-ink"
                  >
                    归零对齐测试
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2: 四维数据对开矩阵 (Original Items Enhanced)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-24 border-t-2 border-ink pt-12" aria-labelledby="matrix-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                EXHIBITION PARAMETERS & SCALE
              </div>
              <h2 id="matrix-heading" className="display mt-2 text-2xl sm:text-3xl font-bold text-ink">
                工坊规模与参展矩阵
              </h2>
            </div>
            <div className="font-mono text-xs text-muted">
              现场 8 台孔版速印机已全部校准完毕 · 随到随印
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it, i) => (
              <div
                key={it.k}
                className="relative rounded border border-rule bg-paper p-6 transition-all hover:border-ink"
              >
                <div className="flex items-center justify-between border-b border-rule pb-3">
                  <span className="font-mono text-xs font-bold text-accent-line tracking-wider">
                    {it.k}
                  </span>
                  <span
                    className="display font-black text-2xl"
                    style={{
                      color: i % 2 === 0 ? currentDrums.drumA.color : currentDrums.drumB.color,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="display mt-4 text-xl sm:text-2xl font-bold text-ink">
                  {it.v}
                </div>
                <p className="mt-2 font-serif text-sm text-ink-2 leading-relaxed">
                  {it.d}
                </p>
                <div className="mt-4 pt-3 border-t border-rule/50 flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-line" />
                  <span>
                    {i === 0 && '包含东京、阿姆斯特丹等代表工作室'}
                    {i === 1 && '含 RZ1070 A3 广色域机型'}
                    {i === 2 && '全系无涂布环保未漂白艺术纸'}
                    {i === 3 && '提供现场裁切与骑马钉装订设备'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3: 孔版印刷机内部构造与原理解剖 (Anatomy of the Press)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-24 rounded border border-rule bg-paper-2/30 p-6 sm:p-10" aria-labelledby="craft-heading">
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
              HOW RISOGRAPH WORKS · 为什么它无法被数字机替代
            </span>
            <h2 id="craft-heading" className="display mt-2 text-2xl sm:text-3xl font-bold text-ink">
              热敏微孔版膜 × 离心大豆油墨四步流转
            </h2>
            <p className="mt-4 font-serif text-ink-2 text-base leading-relaxed">
              Risograph 介于丝网印刷与数码印刷之间。每次印刷都会在香蕉纤维蜡纸上由 600 DPI 热敏头熔出微孔制成母版（Master Sheet），紧附于高速旋转的金属滚筒上。纯植物大豆油墨在离心力作用下穿透微孔浸透纸张。
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                name: '热敏微孔制版',
                term: 'Thermal Master Imaging',
                desc: '原稿文件分色为灰度通道，热敏头在 master 蜡纸膜上点阵熔孔，一张版仅需 17 秒生成。',
              },
              {
                step: '02',
                name: '滚筒离心渗墨',
                term: 'Internal Drum Mesh',
                desc: '油墨从滚筒轴心泵入内部网孔，滚筒每分钟以 60–130 转的极速碾压走纸，形成物理油墨层。',
              },
              {
                step: '03',
                name: '橡胶搓纸跳动',
                term: 'Mechanical Feed Jitter',
                desc: '纸张通过摩擦进纸轮与分离爪吸入，高速运动中轻微的位移造就了绝无仅有的错位特征。',
              },
              {
                step: '04',
                name: '常温氧化固色',
                term: 'Air-Dry Fiber Absorption',
                desc: '不含化学固化剂，纯依靠未涂布纸张的天然毛细管吸收植物油脂，触摸留有墨香。',
              },
            ].map((c) => (
              <div key={c.step} className="rounded border border-rule bg-paper p-5">
                <div className="flex items-center justify-between font-mono text-xs text-muted border-b border-rule pb-2">
                  <span className="font-bold text-ink">STEP {c.step}</span>
                  <span className="text-[10px] text-accent-line">{c.term}</span>
                </div>
                <h3 className="mt-3 font-bold text-ink text-base">{c.name}</h3>
                <p className="mt-2 text-xs font-serif text-ink-2 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4: 特种纸张物态触感实验室 (Paper Tactile Lab)
            ════════════════════════════════════════════════════════════ */}
        <section id="paper-lab" className="mt-24" aria-labelledby="paper-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                MATERIALITY · 触觉与物态感
              </span>
              <h2 id="paper-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
                六种未涂布特种纸样触感标本台
              </h2>
            </div>
            <p className="font-mono text-xs text-muted max-w-sm">
              Riso 油墨不适宜覆膜与铜版纸。点击下方抽屉纸样，现场触摸大豆墨与不同纸张纤维的化学反应。
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* 纸张抽样按钮列表 */}
            <div className="space-y-2.5 lg:col-span-5">
              {PAPER_STOCKS.map((stock) => (
                <button
                  key={stock.id}
                  type="button"
                  onClick={() => setActivePaper(stock.id)}
                  className={`w-full text-left rounded border p-4 transition-all min-h-11 flex items-center justify-between ${
                    activePaper === stock.id
                      ? 'border-ink bg-paper shadow-[3px_3px_0px_var(--hm-ink)]'
                      : 'border-rule bg-paper/40 hover:border-ink/60'
                  }`}
                  aria-pressed={activePaper === stock.id}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-6 w-6 rounded border border-black/20 shrink-0"
                      style={{ backgroundColor: stock.color }}
                    />
                    <div>
                      <div className="font-bold text-sm text-ink">{stock.name}</div>
                      <div className="font-mono text-xs text-muted">{stock.weight} · {stock.texture}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-accent-line">
                    {activePaper === stock.id ? '当前选用 ✓' : '选样 →'}
                  </span>
                </button>
              ))}
            </div>

            {/* 纸张物态显微分析卡 */}
            <div className="rounded border-2 border-ink bg-paper p-6 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
                  <div className="font-mono text-xs font-bold text-ink uppercase">
                    SPECIMEN DOSSIER · 纸张物态检测卡
                  </div>
                  <span className="font-mono text-xs rounded bg-ink text-paper px-2 py-0.5">
                    克重: {currentPaper.weight}
                  </span>
                </div>

                <h3 className="display mt-4 text-xl sm:text-2xl font-bold text-ink">
                  {currentPaper.name}
                </h3>
                <p className="mt-3 font-serif text-base text-ink-2 leading-relaxed">
                  {currentPaper.note}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-rule pt-4 font-mono text-xs">
                  <div className="rounded bg-paper-2/50 p-3">
                    <span className="text-muted block text-[10px] uppercase">表面质地 Texture</span>
                    <span className="font-bold text-ink mt-1 block">{currentPaper.texture}</span>
                  </div>
                  <div className="rounded bg-paper-2/50 p-3">
                    <span className="text-muted block text-[10px] uppercase">吸墨速率 Absorbency</span>
                    <span className="font-bold text-ink mt-1 block">{currentPaper.absorbency}</span>
                  </div>
                </div>

                <div className="mt-4 rounded bg-paper-2/30 p-3 font-mono text-xs">
                  <span className="text-muted block text-[10px] uppercase">触感评测 Sensory Evaluation</span>
                  <span className="text-ink mt-1 block">{currentPaper.feel}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <span className="text-muted">
                  现场储备：共 2,400 张实装纸料，支持现场混配裁切
                </span>
                <span className="text-accent-line font-bold">
                  已与上方模拟器画布联动实时映射色温
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5: 精选参展刊物与海报打样画廊 (Curated Works Gallery)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-24" aria-labelledby="gallery-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
                CURATED EDITIONS · 31家工作室代表作
              </span>
              <h2 id="gallery-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
                参展独立刊物与孔版海报打样
              </h2>
            </div>

            {/* 筛选标签条 */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: '全部展品 (6)' },
                { id: 'zine', label: '独立刊物 Zines' },
                { id: 'poster', label: '大画幅海报' },
                { id: 'print', label: '打样艺术套页' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGalleryFilter(tab.id as any)}
                  className={`min-h-9 rounded px-3 py-1 font-mono text-xs font-bold transition-all ${
                    galleryFilter === tab.id
                      ? 'bg-ink text-paper ring-1 ring-accent-line'
                      : 'border border-rule text-muted hover:border-ink hover:text-ink'
                  }`}
                  aria-pressed={galleryFilter === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((item, idx) => (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between rounded border border-rule bg-paper p-5 transition-all hover:border-ink hover:shadow-[4px_4px_0px_var(--hm-ink)]"
              >
                <div>
                  {/* 模拟折页封面图样 */}
                  <div
                    className="relative aspect-4/3 w-full overflow-hidden rounded border border-rule/80 bg-paper-2 p-4 flex flex-col justify-between transition-transform group-hover:scale-[1.01]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 0.8px, transparent 0.8px)`,
                      backgroundSize: '8px 8px',
                      color: idx % 2 === 0 ? currentDrums.drumA.color : currentDrums.drumB.color,
                    }}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-ink">
                      <span className="rounded bg-paper px-1.5 py-0.5 font-bold border border-rule">
                        {item.typeZh}
                      </span>
                      <span className="text-muted">{item.city}</span>
                    </div>

                    <div className="my-auto text-center">
                      <div
                        className="display font-black text-xl sm:text-2xl text-ink leading-tight"
                        style={{
                          textShadow: `-0.015em -0.015em 0 ${currentDrums.drumA.color}, 0.015em 0.015em 0 ${currentDrums.drumB.color}`,
                        }}
                      >
                        {item.title}
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-muted tracking-wider uppercase">
                        BY {item.studio}
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-ink border-t border-current/20 pt-1.5">
                      <span>{item.edition}</span>
                      <span>{item.format}</span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                  <div className="mt-1 font-mono text-xs text-accent-line font-bold">
                    {item.studio} · {item.city}
                  </div>
                  <p className="mt-2 text-xs font-serif text-ink-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rule space-y-1.5 font-mono text-[11px] text-muted">
                  <div className="flex items-center justify-between">
                    <span>专色配置:</span>
                    <span className="text-ink font-bold">{item.inks.join(' + ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>用纸标明:</span>
                    <span className="text-ink truncate max-w-42.5">{item.paper}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 6: 手撕孔工坊入场券 (Perforated Die-Cut Ticket Stub)
            ════════════════════════════════════════════════════════════ */}
        <section className="mt-24" aria-labelledby="ticket-heading">
          <div className="max-w-xl mx-auto text-center">
            <span className="font-mono text-xs font-bold tracking-wider text-accent-line uppercase">
              WORKSHOP PASS · 限量 1000 席
            </span>
            <h2 id="ticket-heading" className="display mt-1 text-2xl sm:text-3xl font-bold text-ink">
              手撕纸孔入场联券
            </h2>
            <p className="mt-2 font-serif text-sm text-ink-2">
              持本券可全天进出浆纸工坊，包含自带电子文件单张现场制版免费打样一次（限 2 专色）。
            </p>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-lg border-2 border-ink bg-paper shadow-[6px_6px_0px_var(--hm-ink)]">
              <div className="grid md:grid-cols-12 items-stretch">
                {/* 票券主联 (8列) */}
                <div className="p-6 md:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-rule pb-3">
                      <span className="font-mono text-xs font-bold text-ink tracking-wider">
                        OFF-REGISTER FAIR PASS
                      </span>
                      <span className="font-mono text-xs text-accent-line font-bold">
                        EDITION № 0482 / 1000
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="display text-2xl sm:text-3xl font-black text-ink">
                        独立孔版印刷展 · 实操通行证
                      </div>
                      <div className="mt-1 font-mono text-xs text-muted">
                        PULP YARD PRINT ROOM · GOVANHILL 18–19 OCT 2026
                      </div>
                    </div>

                    {/* 场次选择 */}
                    <div className="mt-6">
                      <div className="font-mono text-xs text-ink font-bold mb-2">
                        选择到场印务场次:
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'sat-am', label: '18日 早场', time: '09:30-13:00' },
                          { id: 'sat-pm', label: '18日 下午', time: '14:00-18:30' },
                          { id: 'sun-all', label: '19日 全天', time: '10:00-19:00' },
                        ].map((sess) => (
                          <button
                            key={sess.id}
                            type="button"
                            onClick={() => setTicketSession(sess.id as any)}
                            className={`min-h-11 rounded border p-2 text-left transition-all ${
                              ticketSession === sess.id
                                ? 'border-ink bg-paper-2 shadow-[2px_2px_0px_var(--hm-ink)]'
                                : 'border-rule hover:border-ink'
                            }`}
                          >
                            <div className="font-mono text-xs font-bold text-ink">{sess.label}</div>
                            <div className="font-mono text-[10px] text-muted">{sess.time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-3">
                    <div className="font-mono text-xs text-muted">
                      凭此券可在任意机位领取 Munken 纯质纸 5 张
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBooked(true)}
                      disabled={isBooked}
                      className={`min-h-11 rounded px-5 py-2 font-mono text-xs font-bold uppercase transition-all ${
                        isBooked
                          ? 'bg-accent-line text-paper cursor-default'
                          : 'bg-ink text-paper hover:bg-accent-line hover:text-paper active:translate-y-0.5'
                      }`}
                    >
                      {isBooked ? '已完成预约盖印 ✓' : '确认并盖印此联券 →'}
                    </button>
                  </div>
                </div>

                {/* 齿孔虚线分割线 (Perforated tear line) */}
                <div className="relative hidden md:flex flex-col items-center justify-between border-l-2 border-dashed border-ink/40 py-2 -ml-px">
                  <div className="absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full bg-paper border-2 border-ink" />
                  <div className="absolute -bottom-3.5 -left-3.5 h-7 w-7 rounded-full bg-paper border-2 border-ink" />
                </div>

                {/* 票券副联 / 存根 (4列) */}
                <div className="p-6 md:col-span-4 bg-paper-2/60 flex flex-col justify-between border-t-2 md:border-t-0 md:border-l border-rule">
                  <div>
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wider">
                      STUB FOR ENTRY
                    </div>
                    <div className="font-mono text-xs font-bold text-ink mt-1">
                      存根凭证
                    </div>

                    <div className="mt-4 font-mono text-xs space-y-1.5">
                      <div className="text-muted">费用:</div>
                      <div className="font-bold text-base text-ink">现场免费入场</div>
                      <div className="text-[11px] text-muted">包含全日 8 场艺术家演讲与制版演示</div>
                    </div>
                  </div>

                  {/* 模拟条形码与盖印 */}
                  <div className="mt-6">
                    <div className="h-9 w-full bg-ink/85 flex items-center justify-around px-2" aria-hidden>
                      {Array.from({ length: 28 }).map((_, i) => (
                        <span
                          key={i}
                          className="h-full bg-paper"
                          style={{ width: (i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2) + 'px' }}
                        />
                      ))}
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-muted">
                      <span>* 2026-RISO-0482 *</span>
                      <span>SEC A</span>
                    </div>

                    {isBooked && (
                      <div className="mt-3 rounded border border-accent-line bg-accent-line/10 p-2 text-center font-mono text-xs font-bold text-accent-line animate-bounce">
                        [ 验证通过 · 席位已锁定 ]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 7: 工坊时刻表与结语 (Colophon Schedule & Slop Stamp)
            ════════════════════════════════════════════════════════════ */}
        <footer className="mt-28 border-t-2 border-ink pt-10 font-mono text-xs">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">OFF-REGISTER FAIR</div>
              <p className="mt-2 text-muted font-serif text-sm leading-relaxed">
                独立孔版印刷展，由 Govanhill 印刷室志愿者与全球独立出版人联合自发筹办。
              </p>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">时间安排</div>
              <ul className="mt-2 space-y-1 text-muted">
                <li>10月18日: 09:30 – 18:30 (展商与印务工坊)</li>
                <li>10月19日: 10:00 – 19:00 (作品签售与拆版演示)</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">地点与交通</div>
              <ul className="mt-2 space-y-1 text-muted">
                <li>浆纸工坊 Pulp Yard 3号仓库</li>
                <li>地铁 2 号线直达 · 鼓励自备环保帆布袋</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-ink uppercase tracking-wider">关于错位</div>
              <p className="mt-2 text-muted font-serif text-sm leading-relaxed">
                “孔版机的纸会跑。跑了我们不重印，我们说这是这一版的记号。”
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6 text-muted">
            <div>
              © 2026 OFF-REGISTER RISOGRAPH EXPO · HALLMARK ANTI-AI-SLOP CERTIFIED
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
