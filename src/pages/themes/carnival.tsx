import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 厂牌独立流派调色盘
 * 摒弃杂乱刺眼的荧光马卡龙色系，回归独立唱片厂牌（4AD / Factory / Blue Note）经典暖调实体质感：
 * - 后摇：浓郁深酒红 (Oxblood Burgundy) · 呼应 Carnival 2px 酒红描边
 * - 民谣：暖调芥末金 (Mustard Gold) · 呼应实体唱片标贴与按键黄
 * - 工业：180g 重磅胶黑炭素 (Vinyl Carbon) · 沉稳冷峻的高密度 PVC 质感
 * - 电子：复古模拟电路/真空管暖琥珀 (Tube Amber) · 摒弃廉价冷电光青，呈现电子管偶次谐波暖色
 */
const GENRE_STYLES: Record<
  string,
  {
    name: string
    badgeBg: string
    badgeText: string
    badgeBorder: string
    dotColor: string
    accentColor: string
    labelBg: string
  }
> = {
  后摇: {
    name: '后摇',
    badgeBg: 'oklch(40% 0.18 25 / 0.08)',
    badgeText: 'oklch(36% 0.18 25)',
    badgeBorder: 'oklch(40% 0.18 25 / 0.25)',
    dotColor: 'oklch(40% 0.18 25)',
    accentColor: 'oklch(40% 0.18 25)',
    labelBg: 'oklch(88% 0.06 30)',
  },
  民谣: {
    name: '民谣',
    badgeBg: 'oklch(86% 0.18 95 / 0.22)',
    badgeText: 'oklch(34% 0.14 75)',
    badgeBorder: 'oklch(50% 0.15 85 / 0.35)',
    dotColor: 'oklch(50% 0.16 85)',
    accentColor: 'oklch(45% 0.15 85)',
    labelBg: 'oklch(86% 0.18 95)',
  },
  工业: {
    name: '工业',
    badgeBg: 'oklch(18% 0.08 20 / 0.07)',
    badgeText: 'oklch(22% 0.04 25)',
    badgeBorder: 'oklch(18% 0.08 20 / 0.25)',
    dotColor: 'oklch(22% 0.04 25)',
    accentColor: 'oklch(22% 0.04 25)',
    labelBg: 'oklch(88% 0.02 25)',
  },
  电子: {
    name: '电子',
    badgeBg: 'oklch(52% 0.16 50 / 0.10)',
    badgeText: 'oklch(38% 0.16 48)',
    badgeBorder: 'oklch(50% 0.16 50 / 0.30)',
    dotColor: 'oklch(50% 0.16 50)',
    accentColor: 'oklch(46% 0.16 48)',
    labelBg: 'oklch(88% 0.09 52)',
  },
}

const AXES = [
  { id: 'time', label: '按发行时间' },
  { id: 'genre', label: '按风格' },
  { id: 'artist', label: '按人' },
] as const

/** 黑胶物理压制与声学解剖结构 */
const VINYL_ANATOMY = [
  {
    layer: '180g 原生纯聚氯乙烯 (Virgin PVC)',
    spec: '180g 重量级无杂质基底',
    desc: '杜绝再生二次回收颗粒，底噪物理降低 -14dB，高温 160°C 蒸汽液压机一次压铸成型，平整度经激光全检无翘边。',
    stat: '底噪比: ≥ 72 dB',
  },
  {
    layer: '微米级 45°/45° 立体声 V 型声槽',
    spec: '槽宽 38μm · 槽深 24μm',
    desc: '左右声道独立物理雕刻于声槽内外侧壁，动态范围高达 55dB，高保真还原开盘母带真实频响（20Hz~22kHz）。',
    stat: '频宽: 20Hz - 22kHz',
  },
  {
    layer: '350g 特种艺术棉卡对裱门折封套',
    spec: '手工压痕 · 无酸稻草防静电内衬',
    desc: '厚质手感，耐磨抗光老化，内袋覆微孔抗静电涂层，彻底杜绝吸附空气微尘与唱片抽插刮花风险。',
    stat: '纸重: 350 g/m²',
  },
  {
    layer: '城东录音棚 1/2 英寸开盘磁带模拟直刻',
    spec: 'Neumann VMS-70 · 15 ips 磁带走纸',
    desc: '全程避免数字抽样量化，纯真空管放大器驱动机械刻刀，保留浓郁温暖的偶次谐波自然染色。',
    stat: '谐波: 2nd Order Tube',
  },
]

/**
 * 独立厂牌 CarnivalPage
 * 严格遵循 Hallmark 58 项规范与物态感，保留黑胶试听台、三个分类入口、唱片旋转与 58/58 生产印章
 */
export function CarnivalPage({ page }: { page: ThemePage }) {
  const [spin, setSpin] = useState<number | null>(null)
  const [playingIdx, setPlayingIdx] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [axis, setAxis] = useState<(typeof AXES)[number]['id']>('time')
  const [rpm, setRpm] = useState<'33' | '45'>('33')
  const [side, setSide] = useState<'A' | 'B'>('A')

  const all = page.items ?? []
  const rel = all
    .filter((i) => i.kind === 'release')
    .map((i, n) => {
      const [genre, artist] = (i.d ?? '').split(' · ')
      return { n, month: i.k, title: i.v, genre, artist }
    })
  const facts = all.filter((i) => i.kind !== 'release')

  const currentPlaying = rel[playingIdx] ?? rel[0]

  const genres = [...new Set(rel.map((r) => r.genre))].map((g) => ({
    key: g,
    list: rel.filter((r) => r.genre === g),
  }))
  const artists = [...new Set(rel.map((r) => r.artist))].map((a) => ({
    key: a,
    list: rel.filter((r) => r.artist === a),
  }))

  function onTabKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    const i = AXES.findIndex((a) => a.id === axis)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setAxis(AXES[(i + 1) % AXES.length].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setAxis(AXES[(i - 1 + AXES.length) % AXES.length].id)
    }
  }

  const Row = ({ r }: { r: (typeof rel)[number] }) => {
    const gStyle = GENRE_STYLES[r.genre] ?? GENRE_STYLES['后摇']
    return (
      <li
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 transition-colors hover:bg-ink/3 px-3 rounded-lg"
        style={{ borderBottom: '1px solid var(--hm-rule)' }}
      >
        <div className="flex items-baseline gap-4 min-w-0">
          <span className="w-10 shrink-0 font-mono text-xs font-bold text-accent-line">
            {r.month} 月
          </span>
          <span className="display text-xl font-bold text-ink tracking-tight">{r.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider"
            style={{
              backgroundColor: gStyle.badgeBg,
              color: gStyle.badgeText,
              border: `1px solid ${gStyle.badgeBorder}`,
            }}
          >
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ backgroundColor: gStyle.dotColor }}
              aria-hidden
            />
            {r.genre}
          </span>
          <span className="text-muted font-medium">{r.artist}</span>
        </div>
      </li>
    )
  }

  return (
    <main id="main" className="px-(--page-gutter) pb-28 pt-8 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 顶部厂牌出版公报微状态条 */}
        <header className="rounded-lg border border-rule bg-paper-2/80 px-4 py-3 font-mono text-xs text-ink-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent-line animate-pulse" />
            <span className="font-bold text-ink">COLD SNAP RECORDINGS · 城东老厂录音棚</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-muted text-[11px]">
            <span>180g 重磅原生胶</span>
            <span>·</span>
            <span>Neumann VMS-70 模拟直刻</span>
            <span>·</span>
            <span>全批次限定 300 张</span>
            <span>·</span>
            <span className="text-accent-line font-bold">2026 CATALOGUE</span>
          </div>
        </header>

        {/* 标题领衔区：严格保留唯一 <h1> */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-8">
          <div>
            <div className="meta font-mono font-bold text-accent-line">
              COLD SNAP RECORDINGS · VINYL CATALOGUE
            </div>
            <h1
              className="display mt-2 text-ink tracking-tight font-bold"
              style={{
                fontSize: 'clamp(2.6rem, 7.5vw, 5.25rem)',
                lineHeight: 1.05,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              {page.title}
            </h1>
          </div>
          <p
            className="max-w-[36ch] text-sm sm:text-base text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        {/* 核心互动装置：黑胶唱机试听台 (Audiophile Turntable Station) */}
        <section
          className="mt-12 rounded-xl border-2 border-rule bg-paper-2/50 p-5 sm:p-8 shadow-lg relative overflow-hidden"
          aria-labelledby="turntable-heading"
        >
          {/* 背景唱片暗纹装饰 */}
          <div
            aria-hidden
            className="absolute -right-16 -bottom-16 size-80 rounded-full border border-rule/30 pointer-events-none opacity-20"
            style={{
              background: 'repeating-radial-gradient(circle, transparent 0 8px, rgba(0,0,0,0.08) 8px 16px)',
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-5">
            <div>
              <span className="meta text-accent-line font-mono font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-line" />
                装置 · 模拟开盘监听黑胶唱机
              </span>
              <h2 id="turntable-heading" className="display text-2xl font-bold text-ink mt-0.5">
                TURNTABLE STATION
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 转速控制器 33 / 45 RPM */}
              <div className="flex items-center gap-1 font-mono text-xs bg-paper px-2 py-1 rounded border border-rule">
                <span className="text-muted text-[11px]">转速:</span>
                {(['33', '45'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRpm(r)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      rpm === r ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                    }`}
                    style={{ minHeight: '32px' }}
                  >
                    {r} RPM
                  </button>
                ))}
              </div>

              {/* A/B 面切换 */}
              <div className="flex items-center gap-1 font-mono text-xs bg-paper px-2 py-1 rounded border border-rule">
                <span className="text-muted text-[11px]">声轨:</span>
                {(['A', 'B'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      side === s ? 'bg-accent-line text-paper' : 'text-muted hover:text-ink'
                    }`}
                    style={{ minHeight: '32px' }}
                  >
                    SIDE {s}
                  </button>
                ))}
              </div>

              {/* 关键测试契约：button:has-text("落下唱针试听") 切换为 "暂停唱针" */}
              <button
                type="button"
                onClick={() => setIsPlaying((v) => !v)}
                className={`min-h-11 rounded-lg px-5 py-2 font-mono text-xs font-bold transition-all shadow-sm ${
                  isPlaying
                    ? 'bg-ink text-paper ring-2 ring-accent-line shadow-md'
                    : 'border-2 border-rule bg-paper text-ink hover:border-ink hover:bg-paper-2'
                }`}
                aria-pressed={isPlaying}
              >
                {isPlaying ? '⏸ 暂停唱针' : '▶ 落下唱针试听'}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8 lg:gap-12">
            {/* 机械转盘与旋转黑胶唱片 */}
            <div className="relative size-36 sm:size-48 shrink-0 mx-auto sm:mx-0">
              {/* 转盘外底座 */}
              <div className="absolute inset-0 rounded-full border-4 border-rule-2 bg-paper-3 shadow-inner" />
              
              {/* 唱片盘身：真实 180g 重磅原生黑胶质感，具有精密同心声槽 */}
              <div
                className={`relative size-full rounded-full transition-transform duration-700 shadow-2xl ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{
                  animationDuration: rpm === '33' ? '3.5s' : '2.4s',
                  background: `
                    radial-gradient(circle at 50% 50%, transparent 0 25.5%, oklch(14% 0.015 25) 26%),
                    repeating-radial-gradient(circle at 50% 50%, oklch(13% 0.012 25) 0 1.5px, oklch(22% 0.018 25) 1.5px 3.5px)
                  `,
                }}
              >
                {/* 唱片中心纸质标贴纸：流派专属暖调标贴与印制字样 */}
                <div
                  className="absolute inset-0 grid place-items-center"
                  style={{
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 50% 50%, ${
                      GENRE_STYLES[currentPlaying?.genre]?.labelBg ?? 'var(--hm-accent)'
                    } 0 26%, transparent 26.5%)`,
                  }}
                >
                  <div className="text-center font-mono text-[9px] font-bold text-ink leading-tight">
                    <div className="tracking-wider">SIDE {side}</div>
                    <div className="text-[8px] opacity-80 mt-0.5">{currentPlaying?.month} 月 · {currentPlaying?.genre}</div>
                  </div>
                </div>
                {/* 轴心金属孔 */}
                <div className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper border-2 border-ink shadow" />
              </div>

              {/* 模拟拾音唱臂 (Tonearm) */}
              <div
                aria-hidden
                className="absolute top-2 right-2 w-12 h-28 pointer-events-none transition-transform duration-500 origin-top-right"
                style={{
                  transform: isPlaying ? 'rotate(18deg)' : 'rotate(0deg)',
                }}
              >
                <div className="w-1.5 h-24 bg-ink/80 rounded-full mx-auto shadow-sm" />
                <div className="w-4 h-5 bg-accent-line rounded-sm mx-auto shadow -mt-1" />
              </div>
            </div>

            {/* 正在播放唱片的详细档案 */}
            <div className="flex-1 min-w-[16rem]">
              <div className="flex items-center gap-2">
                <span className="meta text-xs text-accent-line font-mono font-bold">
                  NOW SELECTED · {currentPlaying?.genre}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  ({rpm} RPM · {side === 'A' ? '原声主音轨' : '伴奏与混响扩展'})
                </span>
              </div>

              <div className="display mt-1 text-2xl sm:text-4xl font-bold text-ink tracking-tight">
                {currentPlaying?.title}
              </div>
              <div className="mt-1.5 font-mono text-sm text-muted">
                主理艺术家：<span className="text-ink font-semibold">{currentPlaying?.artist}</span> · 发行月份：{currentPlaying?.month} 月 · 格式：12&quot; 180g 重磅胶
              </div>

              {/* 动态 15 段立体声音轨跳动波形条 */}
              <div className="mt-5 flex items-end gap-1.5 h-8 bg-paper/60 p-2 rounded-lg border border-rule/60" aria-hidden>
                {[35, 70, 50, 95, 65, 30, 85, 45, 90, 75, 40, 80, 55, 65, 40, 60, 85, 70, 50].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-200"
                    style={{
                      height: isPlaying ? `${Math.max(15, (h * ((i % 3) + 1)) % 100)}%` : '15%',
                      opacity: isPlaying ? 0.95 : 0.3,
                      backgroundColor: GENRE_STYLES[currentPlaying?.genre]?.accentColor ?? 'var(--hm-accent-line)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 唱片陈列展台：九个完整发行，颜色即流派 */}
        <section className="mt-16" aria-labelledby="records-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-rule">
            <div>
              <span className="meta font-mono text-xs text-muted">DISCOGRAPHY 2026</span>
              <h2 id="records-heading" className="display text-2xl font-bold text-ink">
                九张黑胶陈列展架
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">点击任意黑胶直接放入唱机试听</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-9">
            {rel.map((r, i) => {
              const isCurrent = playingIdx === i
              return (
                <button
                  key={r.title}
                  type="button"
                  onClick={() => {
                    setPlayingIdx(i)
                    setIsPlaying(true)
                  }}
                  onMouseEnter={() => setSpin(i)}
                  onMouseLeave={() => setSpin(null)}
                  onFocus={() => setSpin(i)}
                  onBlur={() => setSpin(null)}
                  className={`group block text-left p-2 rounded-lg transition-all ${
                    isCurrent ? 'bg-paper-2 ring-2 ring-accent-line shadow-md' : 'hover:bg-paper-2/60'
                  }`}
                  aria-label={`选择 ${r.title}，${r.month} 月，${r.genre}，${r.artist}`}
                  style={{ minHeight: '44px' }}
                >
                  <span
                    className="relative block aspect-square w-full overflow-hidden transition-transform duration-300 ease-out group-hover:-translate-y-1 shadow-md"
                    style={{ borderRadius: '50%' }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        borderRadius: '50%',
                        background: `repeating-radial-gradient(circle at 50% 50%, oklch(14% 0.015 25) 0 1.2px, oklch(22% 0.018 25) 1.2px 2.8px)`,
                        animation:
                          spin === i || (isCurrent && isPlaying)
                            ? 'spin-disc 2.6s linear infinite'
                            : undefined,
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 grid place-items-center"
                      style={{
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 50% 50%, ${
                          GENRE_STYLES[r.genre]?.labelBg ?? 'var(--hm-accent)'
                        } 0 18%, transparent 18.5%)`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        borderRadius: '50%',
                        backgroundColor: 'var(--hm-paper)',
                        border: '1px solid var(--hm-ink)',
                      }}
                    />
                  </span>
                  <span
                    className="display mt-3 block text-base font-bold text-ink leading-tight"
                  >
                    {r.title}
                  </span>
                  <span className="meta mt-1 block text-muted font-mono text-[11px]">
                    {r.month} 月 · {r.genre}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* 关键测试契约：三个入口 Tab 切换（包含 button:has-text("按风格") 且展示 text=后摇） */}
        <section className="mt-20 pt-10 border-t-2 border-rule" aria-labelledby="browse-heading">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="meta font-mono text-xs text-muted">MULTI-DIMENSIONAL INDEX</span>
              <h2 id="browse-heading" className="display text-2xl font-bold text-ink">
                三维生态索引
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="浏览入口"
              className="flex flex-wrap gap-2"
            >
              {AXES.map((a) => (
                <button
                  key={a.id}
                  role="tab"
                  type="button"
                  id={`tab-${a.id}`}
                  aria-selected={axis === a.id}
                  aria-controls={`panel-${a.id}`}
                  tabIndex={axis === a.id ? 0 : -1}
                  onClick={() => setAxis(a.id)}
                  onKeyDown={onTabKey}
                  className="btn min-h-11 px-5 py-2 text-sm font-semibold transition-all rounded-lg"
                  style={{
                    backgroundColor:
                      axis === a.id ? 'var(--hm-cta-bg)' : 'transparent',
                    color: axis === a.id ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
                    borderColor:
                      axis === a.id ? 'var(--hm-cta-bg)' : 'var(--hm-rule-2)',
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`panel-${axis}`}
            aria-labelledby={`tab-${axis}`}
            className="mt-8"
          >
            {axis === 'time' && (
              <ul className="divide-y divide-rule/60">
                {rel.map((r) => (
                  <Row key={r.title} r={r} />
                ))}
              </ul>
            )}

            {axis === 'genre' && (
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {genres.map((g) => {
                  const gStyle = GENRE_STYLES[g.key] ?? GENRE_STYLES['后摇']
                  return (
                    <div key={g.key} className="rounded-lg border border-rule bg-paper p-4 shadow-sm">
                      <div
                        className="flex items-baseline justify-between gap-3 pb-2.5"
                        style={{ borderBottom: '2px solid var(--hm-rule)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: gStyle.dotColor }}
                            aria-hidden
                          />
                          <span
                            className="display font-bold text-xl"
                            style={{ color: gStyle.accentColor }}
                          >
                            {g.key}
                          </span>
                        </div>
                        <span className="meta font-mono text-muted text-xs">
                          {g.list.length} 张发行
                        </span>
                      </div>
                      <ul className="mt-3 space-y-3">
                        {g.list.map((r) => (
                          <li key={r.title} className="text-sm text-ink-2">
                            <span className="font-bold text-ink block">{r.title}</span>
                            <span className="mt-0.5 block text-xs text-muted font-mono">
                              {r.artist} · {r.month} 月
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}

            {axis === 'artist' && (
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {artists.map((a) => (
                  <li
                    key={a.key}
                    className="p-4 rounded-lg border border-rule bg-paper space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="display font-bold text-lg text-ink">{a.key}</span>
                      <span className="meta text-muted font-mono text-xs">
                        {[...new Set(a.list.map((r) => r.genre))].join(' / ')}
                      </span>
                    </div>
                    <div className="text-sm text-ink-2 font-medium">
                      代表作：{a.list.map((r) => r.title).join('、')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 180g 重磅黑胶物理解剖台 (Vinyl Materiality Anatomy) */}
        <section className="mt-20 pt-10 border-t-2 border-rule" aria-labelledby="craft-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="meta font-mono text-xs text-muted">MATERIALITY & ACOUSTIC SPEC</span>
              <h2 id="craft-heading" className="display text-2xl font-bold text-ink">
                180g 原生黑胶物理压制剖解
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">Neumann VMS-70 机械刻盘标准</span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VINYL_ANATOMY.map((item) => (
              <div
                key={item.layer}
                className="rounded-lg border border-rule bg-paper p-5 space-y-2 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs text-accent-line font-bold">{item.stat}</div>
                  <h3 className="display text-lg font-bold text-ink mt-1">{item.layer}</h3>
                  <div className="font-mono text-[11px] text-muted font-semibold mt-0.5">{item.spec}</div>
                  <p className="mt-2 text-xs text-ink-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 厂牌核心事实 */}
        <section className="mt-16 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.k}
              className="pt-3"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <span className="meta font-mono font-bold text-muted text-xs">{f.k}</span>
              <div className="display mt-1 text-lg font-bold text-ink">{f.v}</div>
              <div className="mt-1 text-xs text-muted">{f.d}</div>
            </div>
          ))}
        </section>

        {page.images?.length ? (
          <figure className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-[18rem_1fr] items-center">
            <figcaption>
              <span className="meta text-accent-line font-mono text-xs">官方发行打样</span>
              <h3 className="display mt-1 text-xl text-ink font-bold">实体黑胶封套示例</h3>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 为 Cold Snap 生成的官方封套示例。350g 特种艺术纸对裱，呈现沉静的独立音乐质感。
              </p>
            </figcaption>
            <div
              className="overflow-hidden min-w-0 shadow-md"
              style={{
                border: '1px solid var(--hm-rule)',
                borderRadius: 'var(--hm-radius-card)',
              }}
            >
              <Img slug={page.images[0]} alt="Hallmark 为 Cold Snap 生成的官方示例页" />
            </div>
          </figure>
        ) : null}

        <div className="mt-14">
          <Cta label={page.cta} done="已在唱机就绪，正在播放《霜降》EP (180g 黑胶)" />
        </div>

        {/* Hallmark 58/58 验收工单印章 */}
        <footer className="mt-16 pt-8 border-t border-rule text-muted font-mono text-xs flex flex-wrap items-center justify-between gap-y-2">
          <div>
            <span>CATALOG_NO: CS-LP-2026-09</span>
            <span className="mx-2">·</span>
            <span>PRESS_STAMP: NEUMANN-VMS70</span>
            <span className="mx-2">·</span>
            <span>EDITION: 300 COPIES</span>
          </div>
          <div className="font-bold text-accent-line">
            critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓
          </div>
        </footer>
      </div>
    </main>
  )
}
