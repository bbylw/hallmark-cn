import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import { themePages } from '../data/pages'
import { genres, themes, type GenreId } from '../data/themes'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** 卡片入场：滚动进入视口时上浮渐入，按列序错位 60ms，只播一次 */
function Reveal({
  children,
  index,
}: {
  children: React.ReactNode
  index: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="mb-4 break-inside-avoid"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

const STATIC = [
  { to: '/custom', k: 'Custom', v: 'Custom 分支', d: '现做一套，不在目录里' },
  { to: '/about', k: 'About', v: '关于这个站', d: '来源、做法与验收' },
]

/** 预览区高度分三档，让打样台高低错落，而不是齐平的一排 */
const BAND = ['12rem', '8.5rem', '6rem', '8.5rem', '6rem', '12rem']

const SEPS = [
  'var(--hm-paper-3)',
  'var(--hm-rule-2)',
  'var(--hm-ink-2)',
  'var(--hm-accent)',
]

type Filter = GenreId | 'all'

/** 各主题物理微质感与专属物态饰纹 */
function ThemeOrnament({ themeId }: { themeId: string }) {
  switch (themeId) {
    case 'carnival':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-5 -top-5 size-16 rounded-full border border-rule/30 opacity-70 group-hover:rotate-45 transition-transform duration-700"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 50%, var(--hm-ink) 0 1.2px, transparent 1.2px 3px)',
          }}
        />
      )
    case 'terminal':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] font-bold text-accent-line opacity-80 flex items-center gap-1"
        >
          <span className="size-1.5 rounded-full bg-accent-line animate-pulse" />
          <span>&gt;_ 80x24</span>
        </span>
      )
    case 'newsprint':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-widest uppercase border-b border-rule/50 pb-0.5"
        >
          VOL. XXIV · 1928
        </span>
      )
    case 'atelier':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-tighter opacity-80"
        >
          |···|···| 350g
        </span>
      )
    case 'almanac':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-accent-line font-bold opacity-85"
        >
          ☉ 360° · 24 气
        </span>
      )
    case 'aurora':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-xl opacity-35"
          style={{ backgroundColor: 'var(--hm-accent)' }}
        />
      )
    case 'riso':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold text-accent-line bg-paper px-1.5 py-0.5 rounded border border-rule/60 shadow-xs"
        >
          2-COLOR
        </span>
      )
    case 'lumen':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 size-14 rounded-full blur-md opacity-30"
          style={{ backgroundColor: 'var(--hm-accent)' }}
        />
      )
    case 'manifesto':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold text-paper bg-accent-line px-1 rounded-xs uppercase tracking-wider"
        >
          STENCIL
        </span>
      )
    case 'sport':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold italic text-accent-line"
        >
          45.8&quot; FAST //
        </span>
      )
    case 'grid':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-accent-line font-bold"
        >
          [ 0, 0 ]
        </span>
      )
    case 'cobalt':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-accent-line font-bold"
        >
          SYS::2026
        </span>
      )
    case 'specimen':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-wide"
        >
          Aa Bb 72pt
        </span>
      )
    case 'studio':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-tight flex items-center gap-1"
        >
          <span className="inline-block size-1.5 rounded-full border border-current" />
          <span>⌖ REF:400</span>
        </span>
      )
    case 'garden':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-accent-line font-medium tracking-wide flex items-center gap-1"
        >
          <span>❀ FLORA·12</span>
        </span>
      )
    case 'brutal':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-black text-paper bg-ink px-1.5 py-0.5 tracking-tighter"
        >
          RAW // 0-RAD
        </span>
      )
    case 'editorial':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted uppercase tracking-widest border-b border-rule/60 pb-0.5"
        >
          § 01 · FOLIO
        </span>
      )
    case 'bloom':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-5 -top-5 size-16 rounded-full blur-lg opacity-40"
          style={{ backgroundColor: 'var(--hm-accent)' }}
        />
      )
    case 'midnight':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted tracking-wider flex items-center gap-1 opacity-85"
        >
          <span className="inline-block size-1.5 rounded-full bg-accent-line" />
          <span>00:00 · 11%</span>
        </span>
      )
    case 'coral':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-accent-line font-bold bg-paper px-1.5 py-0.5 rounded-full border border-rule/50 shadow-2xs"
        >
          SaaS·v2.4
        </span>
      )
    case 'hum':
      return (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] font-bold text-ink bg-accent/20 px-1.5 py-0.5 rounded-full"
        >
          ☺ PLAY·20px
        </span>
      )
    default:
      return null
  }
}

/* ──────────────────────────────────────────────────────────
   宏观结构蓝图：在卡片预览区底层绘制该页 macrostructure 线框。
   全部用主题自身令牌着色（ink 13% / accent 45%），像制图底稿——
   21 页 21 种结构互不重复，这才是 Hallmark 的核心卖点。
   ────────────────────────────────────────────────────────── */
const BP_INK = 'color-mix(in oklab, var(--hm-ink) 13%, transparent)'
const BP_SOFT = 'color-mix(in oklab, var(--hm-ink) 24%, transparent)'
const BP_ACC = 'color-mix(in oklab, var(--hm-accent) 45%, transparent)'

type MiniBox = { l: number; t: number; w: number; h: number; c?: string }
const mbx = (l: number, t: number, w: number, h: number, c?: string): MiniBox => ({
  l,
  t,
  w,
  h,
  c,
})

function MiniMacro({ macro }: { macro?: string }) {
  if (!macro) return null

  const boxes = (list: MiniBox[]) =>
    list.map((b, i) => (
      <span
        key={i}
        className="absolute rounded-[1.5px]"
        style={{
          left: `${b.l}%`,
          top: `${b.t}%`,
          width: `${b.w}%`,
          height: `${b.h}%`,
          backgroundColor: b.c ?? BP_INK,
        }}
      />
    ))

  let body: React.ReactNode
  switch (macro) {
    case 'Bento Grid':
      body = boxes([
        mbx(0, 0, 47, 56),
        mbx(51, 0, 49, 26),
        mbx(51, 30, 49, 26, BP_ACC),
        mbx(0, 60, 100, 40),
      ])
      break
    case 'Long Document':
      body = boxes([
        mbx(20, 8, 60, 7),
        mbx(20, 27, 60, 7),
        mbx(20, 46, 60, 7),
        mbx(20, 65, 60, 7),
        mbx(20, 84, 38, 7),
      ])
      break
    case 'Marquee Hero':
      body = boxes([
        mbx(0, 10, 100, 34, BP_ACC),
        mbx(0, 56, 64, 9),
        mbx(0, 73, 42, 9),
      ])
      break
    case 'Stat-Led':
      body = boxes([
        mbx(0, 16, 44, 58, BP_ACC),
        mbx(48, 16, 52, 27),
        mbx(48, 47, 52, 27),
      ])
      break
    case 'Workbench':
      body = boxes([
        mbx(0, 8, 28, 84),
        mbx(32, 8, 68, 52),
        mbx(32, 64, 68, 28, BP_ACC),
      ])
      break
    case 'Conversational FAQ':
      body = boxes([
        mbx(0, 10, 58, 14),
        mbx(42, 32, 58, 14, BP_ACC),
        mbx(0, 54, 58, 14),
        mbx(42, 76, 58, 14),
      ])
      break
    case 'Manifesto':
      body = boxes([
        mbx(0, 6, 100, 44),
        mbx(0, 60, 54, 12, BP_ACC),
        mbx(0, 80, 30, 8),
      ])
      break
    case 'Photographic':
      body = boxes([
        mbx(0, 0, 58, 100),
        mbx(62, 0, 38, 31),
        mbx(62, 34.5, 38, 31, BP_ACC),
        mbx(62, 69, 38, 31),
      ])
      break
    case 'Quote-Led':
      body = boxes([
        mbx(4, 8, 13, 13, BP_ACC),
        mbx(4, 30, 84, 12),
        mbx(4, 50, 66, 12),
        mbx(4, 72, 30, 8, BP_SOFT),
      ])
      break
    case 'Specimen':
      body = boxes([
        mbx(4, 10, 28, 62),
        mbx(38, 14, 58, 7),
        mbx(38, 30, 48, 7),
        mbx(38, 46, 58, 7),
        mbx(38, 62, 34, 7),
        mbx(4, 82, 92, 2.5, BP_SOFT),
      ])
      break
    case 'Catalogue':
      body = boxes([
        mbx(0, 10, 9, 12, BP_ACC),
        mbx(13, 12, 70, 8),
        mbx(0, 34, 9, 12),
        mbx(13, 36, 62, 8),
        mbx(0, 58, 9, 12),
        mbx(13, 60, 70, 8),
        mbx(0, 82, 9, 12),
        mbx(13, 84, 56, 8),
      ])
      break
    case 'Letter':
      body = boxes([
        mbx(0, 6, 34, 8, BP_SOFT),
        mbx(0, 26, 100, 7),
        mbx(0, 42, 100, 7),
        mbx(0, 58, 100, 7),
        mbx(58, 76, 42, 7, BP_SOFT),
        mbx(0, 90, 18, 5, BP_ACC),
      ])
      break
    case 'Index-First':
      body = boxes([
        mbx(0, 10, 3, 10, BP_ACC),
        mbx(7, 11, 64, 8),
        mbx(0, 32, 3, 10, BP_ACC),
        mbx(7, 33, 56, 8),
        mbx(0, 54, 3, 10, BP_ACC),
        mbx(7, 55, 64, 8),
        mbx(0, 76, 3, 10, BP_ACC),
        mbx(7, 77, 48, 8),
      ])
      break
    case 'Narrative Workflow':
      body = (
        <>
          <span
            className="absolute"
            style={{
              left: '5%',
              top: '10%',
              width: '2px',
              height: '80%',
              backgroundColor: BP_INK,
            }}
          />
          {[12, 44, 76].map((t, i) => (
            <span key={i}>
              <span
                className="absolute rounded-full"
                style={{
                  left: '2.8%',
                  top: `${t}%`,
                  width: '9px',
                  height: '9px',
                  backgroundColor: i === 2 ? BP_ACC : BP_SOFT,
                }}
              />
              <span
                className="absolute rounded-[1.5px]"
                style={{
                  left: '14%',
                  top: `${t + 1}%`,
                  width: '66%',
                  height: '8%',
                  backgroundColor: BP_INK,
                }}
              />
            </span>
          ))}
        </>
      )
      break
    case 'Split Studio':
      body = boxes([
        mbx(0, 0, 38, 100),
        mbx(42, 0, 58, 60),
        mbx(42, 64, 58, 36, BP_ACC),
      ])
      break
    case 'Feature Stack':
      body = boxes([
        mbx(0, 8, 100, 22),
        mbx(0, 39, 100, 22, BP_ACC),
        mbx(0, 70, 100, 22),
      ])
      break
    case 'Type Specimen':
      body = (
        <span
          className="display absolute left-0 top-1/2 -translate-y-1/2 select-none"
          style={{
            fontSize: '3.4rem',
            lineHeight: 1,
            color: BP_INK,
            letterSpacing: 'var(--hm-tracking-display)',
          }}
        >
          Aa
        </span>
      )
      break
    case 'Portfolio Grid':
      body = boxes([
        mbx(0, 8, 31, 36),
        mbx(34.5, 8, 31, 36, BP_ACC),
        mbx(69, 8, 31, 36),
        mbx(0, 56, 31, 36),
        mbx(34.5, 56, 31, 36),
        mbx(69, 56, 31, 36),
      ])
      break
    case 'Map / Diagram':
      body = (
        <>
          <span
            className="absolute"
            style={{
              left: '16%',
              top: '46%',
              width: '64%',
              height: '1.5px',
              backgroundColor: BP_INK,
              transform: 'rotate(-22deg)',
              transformOrigin: '0 50%',
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              left: '10%',
              top: '58%',
              width: '10px',
              height: '10px',
              backgroundColor: BP_ACC,
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              left: '76%',
              top: '16%',
              width: '10px',
              height: '10px',
              backgroundColor: BP_SOFT,
            }}
          />
        </>
      )
      break
    case 'Ecosystem Index':
      body = boxes([
        mbx(0, 8, 31, 26),
        mbx(34.5, 8, 31, 26, BP_ACC),
        mbx(69, 8, 31, 26),
        mbx(0, 48, 84, 8),
        mbx(0, 64, 70, 8),
        mbx(0, 80, 56, 8, BP_SOFT),
      ])
      break
    case 'Component Playground':
      body = (
        <span
          className="absolute rounded-[3px]"
          style={{
            left: '8%',
            top: '14%',
            width: '84%',
            height: '72%',
            border: `1.5px solid ${BP_SOFT}`,
          }}
        >
          <span
            className="absolute rounded-[1px]"
            style={{ left: '9%', top: '22%', width: '36%', height: '6%', backgroundColor: BP_ACC }}
          />
          <span
            className="absolute rounded-[1px]"
            style={{ left: '9%', top: '44%', width: '62%', height: '6%', backgroundColor: BP_INK }}
          />
          <span
            className="absolute rounded-[1px]"
            style={{ left: '9%', top: '66%', width: '50%', height: '6%', backgroundColor: BP_INK }}
          />
        </span>
      )
      break
    default:
      body = null
  }

  if (!body) return null
  return (
    <span aria-hidden className="pointer-events-none absolute inset-3">
      {body}
    </span>
  )
}

export function ContactSheet() {
  const [filter, setFilter] = useState<Filter>('all')

  const list = filter === 'all' ? themes : themes.filter((t) => t.genre === filter)

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="meta flex items-center gap-1.5 text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent animate-pulse" />
            <span>打样台 · 21 主题 + 2 独立分支</span>
          </div>
          <h2
            className="display mt-1 text-ink"
            style={{ fontSize: 'var(--text-xl)' }}
          >
            真实小样流
          </h2>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2">
          <span className="font-mono text-[11px] text-muted">
            OKLCH 色彩空间 · 4 大体裁覆盖
          </span>
          {/* 21 色速览：每个色点都是该主题自己的强调色，点击直达 */}
          <span className="flex items-center gap-[3px]" aria-label="21 套主题强调色速览">
            {themes.map((t) => (
              <Link
                key={t.id}
                to={`/themes/${t.id}`}
                data-theme={t.id}
                title={`${t.name} · ${t.zh}`}
                aria-label={`查看 ${t.name} 主题`}
                className="size-2.5 rounded-[1px] transition-transform duration-150 hover:scale-[1.6]"
                style={{ backgroundColor: 'var(--hm-accent)' }}
              />
            ))}
          </span>
        </div>
      </div>

      {/* 体裁筛选标签行 */}
      <div
        className="mt-4 flex flex-wrap gap-1.5"
        role="tablist"
        aria-label="主题体裁筛选"
      >
        <Chip
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          count={themes.length}
        >
          全部
        </Chip>
        {genres.map((g) => (
          <Chip
            key={g.id}
            active={filter === g.id}
            onClick={() => setFilter(g.id)}
            title={g.blurb}
            count={themes.filter((t) => t.genre === g.id).length}
          >
            {g.zh}
          </Chip>
        ))}
      </div>

      <p
        className="mt-3 max-w-[56ch] text-sm text-ink-2"
        style={{ lineHeight: 'var(--lh-relaxed)' }}
      >
        每张小样都是一整页独立实现。卡片严格套用该主题自身的设计令牌与字体栈，底纸色、圆角与色相真实呈现，点击即刻进入全尺寸交互装置。
      </p>

      <div
        className="mt-8 gap-4 sm:columns-2 xl:columns-3"
        style={{ columnGap: '1rem' }}
      >
          {list.map((t, i) => {
            const page = themePages.find((p) => p.theme === t.id)
            const tall = BAND[i % BAND.length] === '12rem'
            const genreObj = genres.find((g) => g.id === t.genre)
            return (
              <Reveal key={t.id} index={i}>
              <Link
                to={`/themes/${t.id}`}
                data-theme={t.id}
                className="group block overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-focus"
                style={{
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                  borderRadius: 'var(--hm-radius-card)',
                  backgroundColor: 'var(--hm-paper)',
                }}
              >
                <span
                  className="relative block overflow-hidden"
                  style={{
                    height: BAND[i % BAND.length],
                    backgroundColor: 'var(--hm-paper-2)',
                  }}
                >
                  {/* 宏观结构蓝图底稿：21 页 21 种结构 */}
                  <MiniMacro macro={page?.macro} />

                  {/* 顶部元数据标签：体裁 + 纸色 */}
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
                    <span
                      className="meta rounded px-1.5 py-0.5 text-[9px] font-mono"
                      style={{
                        backgroundColor: 'var(--hm-paper)',
                        color: 'var(--hm-ink-2)',
                        border: '1px solid var(--hm-rule)',
                      }}
                    >
                      {genreObj?.zh}
                    </span>
                    <span
                      className="meta rounded px-1 py-0.5 text-[9px] font-mono text-muted"
                      style={{ backgroundColor: 'var(--hm-paper-3)' }}
                    >
                      {t.band}纸
                    </span>
                  </span>

                  {/* 各主题专属物态饰纹 */}
                  <ThemeOrnament themeId={t.id} />

                  <span
                    className="display absolute inset-x-4 bottom-4 text-ink transition-colors group-hover:text-accent-line"
                    style={{
                      fontSize: tall
                        ? 'clamp(1.5rem, 2.6vw, 2.25rem)'
                        : 'clamp(1.1rem, 2vw, 1.6rem)',
                      lineHeight: 1.06,
                      letterSpacing: 'var(--hm-tracking-display)',
                    }}
                  >
                    {t.name}
                  </span>

                  {tall ? (
                    <span
                      aria-hidden
                      className="absolute right-4 top-4"
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        backgroundColor: 'var(--hm-accent)',
                        borderRadius: 'var(--hm-radius-input)',
                        boxShadow: '0 0 0 2px var(--hm-paper)',
                      }}
                    />
                  ) : null}

                  {/* 底部四色分割发丝条：悬停时微微隆起 */}
                  <span aria-hidden className="absolute inset-x-0 bottom-0 flex">
                    {SEPS.map((c, k) => (
                      <span
                        key={k}
                        className="h-1 flex-1 transition-all duration-300 group-hover:h-[5px]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                </span>

                <span
                  className="block p-4"
                  style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span
                      className="display min-w-0 text-ink group-hover:text-accent-line transition-colors"
                      style={{
                        fontSize: '1.15rem',
                        letterSpacing: 'var(--hm-tracking-display)',
                      }}
                    >
                      {page?.brand ?? t.zh}
                    </span>
                    <span className="meta shrink-0 text-accent-line flex items-center gap-1 font-mono text-xs">
                      <span>{page?.macroZh ?? ''}</span>
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </span>
                  </span>
                  <div className="meta mt-1.5 flex items-center gap-1.5 text-muted flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <span
                        aria-hidden
                        className="inline-block size-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: 'var(--hm-accent)' }}
                      />
                      <span>{t.accentName}</span>
                    </span>
                    <span>·</span>
                    <span>{t.zh}</span>
                    <span>·</span>
                    <span>{t.displayFace}</span>
                  </div>
                  <p className="mt-2 text-[11px] text-ink-2/80 line-clamp-1 leading-normal font-sans">
                    {t.note}
                  </p>
                </span>
              </Link>
              </Reveal>
            )
          })}

          {filter === 'all'
            ? STATIC.map((p, si) => (
                <Reveal key={p.to} index={list.length + si}>
                <Link
                  to={p.to}
                  className="group block overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-focus"
                  style={{
                    border: 'var(--hm-rule-card) solid var(--hm-rule)',
                    borderRadius: 'var(--hm-radius-card)',
                    backgroundColor: 'var(--hm-paper)',
                  }}
                >
                  <span
                    className="relative block overflow-hidden"
                    style={{
                      height: '6rem',
                      backgroundColor: 'var(--hm-paper-2)',
                    }}
                  >
                    <span className="absolute left-3 top-3 meta rounded px-1.5 py-0.5 text-[9px] font-mono border border-rule/60 bg-paper text-accent-line">
                      独立分支
                    </span>
                    <span
                      className="display absolute inset-x-4 bottom-4 text-ink group-hover:text-accent-line transition-colors"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.6vw, 2.35rem)',
                        lineHeight: 1.02,
                        letterSpacing: 'var(--hm-tracking-display)',
                      }}
                    >
                      {p.k}
                    </span>
                    <span aria-hidden className="absolute inset-x-0 bottom-0 flex">
                      {['var(--hm-rule-2)', 'var(--hm-ink-2)'].map((c, k) => (
                        <span
                          key={k}
                          className="h-1 flex-1"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                  </span>
                  <span
                    className="block p-4"
                    style={{
                      borderTop: 'var(--hm-rule-card) solid var(--hm-rule)',
                    }}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className="display block text-ink group-hover:text-accent-line transition-colors"
                        style={{
                          fontSize: '1.15rem',
                          letterSpacing: 'var(--hm-tracking-display)',
                        }}
                      >
                        {p.v}
                      </span>
                      <span className="meta text-accent-line font-mono text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </span>
                    <span className="meta mt-1.5 block text-muted">{p.d}</span>
                  </span>
                </Link>
                </Reveal>
              ))
            : null}
        </div>
      </div>
    )
  }

function Chip({
  children,
  active,
  onClick,
  title,
  count,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  title?: string
  count?: number
}) {
  const reduce = useReducedMotion()
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      title={title}
      className={`btn tap relative px-2.5 py-1 text-xs rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-focus flex items-center gap-1.5 ${
        active ? 'font-semibold' : 'hover:bg-paper-2'
      }`}
      style={{
        color: active ? 'var(--hm-paper)' : 'var(--hm-ink-2)',
        borderColor: active ? 'var(--hm-ink)' : 'var(--hm-rule)',
      }}
    >
      {active ? (
        <motion.span
          layoutId="genre-chip-pill"
          aria-hidden
          className="absolute inset-0 rounded-lg shadow-xs"
          style={{ backgroundColor: 'var(--hm-ink)' }}
          transition={reduce ? { duration: 0 } : { duration: 0.22, ease: EASE }}
        />
      ) : null}
      <span className="relative">{children}</span>
      {count !== undefined ? (
        <span
          className={`relative font-mono text-[10px] rounded px-1 py-0.5 leading-none ${
            active ? 'bg-paper/25 text-paper' : 'bg-paper-3 text-muted'
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
