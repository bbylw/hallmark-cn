import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import { ContactSheet } from '../components/contact-sheet'
import { Footer } from '../components/footer'
import { GateScale } from '../components/gate-scale'
import { SiteNav } from '../components/site-nav'
import { VerbStack } from '../components/verb-stack'
import { CopyButton } from '../components/ui/copy-button'
import { useThemeAttr } from '../theme-attr'

const PM_OPTIONS = [
  { id: 'npx', cmd: 'npx skills add nutlope/hallmark' },
  { id: 'bunx', cmd: 'bunx skills add nutlope/hallmark' },
  { id: 'pnpm', cmd: 'pnpm dlx skills add nutlope/hallmark' },
] as const

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** 左栏工作台的分段入场：徽章 → 标题 → 引述 → CLI → 动词 → 关卡 → 链接 */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}

/**
 * 索引页（01/24）：
 * 宏观结构采用 Split Studio / Workbench 对开式：
 * 左栏粘滞整屏不滚，装着 Hallmark 的核心论点、安装命令、动词栈与 58 道关卡标尺；
 * 右栏展开 24 张各具灵魂的小样打样流。
 * 严格遵循 Hallmark 58 关卡与 anti-patterns 规范。
 */
export function IndexPage() {
  useThemeAttr('grid')
  const reduce = useReducedMotion()
  const [activePm, setActivePm] = useState<(typeof PM_OPTIONS)[number]['id']>('npx')
  const currentCmd = PM_OPTIONS.find((p) => p.id === activePm)?.cmd ?? PM_OPTIONS[0].cmd

  return (
    <div className="min-h-dvh bg-paper">
      <SiteNav />

      <main
        id="main"
        className="relative mx-auto px-(--page-gutter)"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        {/* 图纸底纹：淡方格网自上而下淡出，呼应「打样台」的制图语义 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(color-mix(in oklab, var(--hm-rule) 70%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--hm-rule) 70%, transparent) 1px, transparent 1px)',
            backgroundSize: '3rem 3rem',
            maskImage:
              'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
          }}
        />

        <div className="relative grid gap-16 lg:grid-cols-12 lg:gap-14">
          {/* 左栏：独立滚动工作台（隐藏嵌套滚动条视觉，保留滚动能力） */}
          <div className="pt-10 pb-4 lg:col-span-5 lg:pt-14 lg:pb-0">
            <motion.div
              className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:pb-16 lg:pr-8 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              initial={reduce ? false : 'hidden'}
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.08 },
                },
              }}
            >
              {/* 制图眉题：页码 / 宏观结构 / 当前主题，一行定住 Grid 的技术语气 */}
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-between gap-3 border-b border-rule/70 pb-3 font-mono text-[10px] tracking-[0.14em] text-muted uppercase"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block size-1.5 bg-accent-line" aria-hidden />
                  <span>01 / Split Studio</span>
                </span>
                <span className="hidden sm:inline">Workbench · Grid</span>
                <span>[ 0, 0 ]</span>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-5 inline-flex items-center gap-2.5 px-3 py-1.5 bg-paper-2 border border-rule text-accent-line font-mono text-[11px] shadow-2xs"
                style={{ borderRadius: 'var(--hm-radius-pill)' }}
              >
                <span className="relative inline-flex size-1.5">
                  <span
                    aria-hidden
                    className="absolute inline-flex size-full animate-ping bg-accent opacity-60"
                  />
                  <span className="relative inline-flex size-1.5 bg-accent" />
                </span>
                <span className="font-bold tracking-[0.08em]">HALLMARK v1.1.0</span>
                <span className="text-rule-2" aria-hidden>
                  /
                </span>
                <span className="text-ink-2 font-medium tracking-[0.08em]">
                  ANTI-AI-SLOP SKILL
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="display mt-6 text-ink text-balance"
                style={{
                  fontSize: 'clamp(2rem, 1.6vw + 1.3rem, 2.75rem)',
                  lineHeight: 1.32,
                  letterSpacing: 'var(--hm-tracking-display)',
                }}
              >
                <span className="block text-balance">让 AI 写出来的界面，</span>
                <span
                  className="block w-fit text-balance text-accent-line"
                  style={{
                    textDecoration: 'underline',
                    textDecorationThickness: '0.07em',
                    textDecorationColor: 'color-mix(in oklab, var(--hm-accent) 75%, transparent)',
                    textUnderlineOffset: '0.14em',
                  }}
                >
                  看起来像是人做的
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-[32em] text-base text-ink-2 text-pretty"
                style={{ lineHeight: 1.95 }}
              >
                专为 <span className="font-semibold text-ink">Claude Code</span>、
                <span className="font-semibold text-ink">Cursor</span> 和
                <span className="font-semibold text-ink">Codex</span>{' '}
                打造的设计 skill。
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-3 max-w-[32em] text-base text-ink-2 text-pretty"
                style={{ lineHeight: 1.95 }}
              >
                拒绝居中大圆角卡片与紫蓝渐变那一套，为每个真实需求定制宏观骨架，严格套用{' '}
                <span className="font-semibold text-ink underline decoration-accent-line/60 decoration-[1.5px] underline-offset-[4px]">
                  21 套独立主题
                </span>{' '}
                与{' '}
                <span className="font-semibold text-ink underline decoration-accent-line/60 decoration-[1.5px] underline-offset-[4px]">
                  58 道关卡
                </span>
                。
              </motion.p>

              {/* 三格数据带：数字用展示体，标签用等宽，Grid 的表格美学 */}
              <motion.div
                variants={fadeUp}
                className="mt-8 grid grid-cols-3 border-y border-rule/70"
                role="list"
                aria-label="Hallmark 规模：21 套主题，21 种结构，58 道关卡"
              >
                {[
                  { v: '21', k: '独立主题', d: 'TOKENS' },
                  { v: '21', k: '宏观结构', d: 'MACRO' },
                  { v: '58', k: '硬检验关卡', d: 'GATES' },
                ].map((s, i) => (
                  <div
                    key={s.d}
                    role="listitem"
                    className={`flex flex-col gap-2 px-4 py-4 first:pl-0 last:pr-0 ${
                      i > 0 ? 'border-l border-rule/70' : ''
                    }`}
                  >
                    <span
                      className="display text-ink tabular-nums"
                      style={{ fontSize: '1.8rem', lineHeight: 1 }}
                    >
                      {s.v}
                      <span className="text-accent-line" aria-hidden>
                        .
                      </span>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-xs text-ink-2">{s.k}</span>
                      <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                        {s.d}
                      </span>
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* 开发者 CLI 安装命令台：第一颗圆点用信号红，呼应 Grid「一条红」 */}
              <motion.div
                variants={fadeUp}
                className="relative mt-8 p-5 transition-all shadow-xs sm:p-6"
                style={{
                  border: 'var(--hm-rule-card) solid var(--hm-ink)',
                  borderRadius: 'var(--hm-radius-card)',
                  backgroundColor: 'var(--hm-paper-2)',
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-px left-8 h-[3px] w-10 bg-accent-line"
                />
                <div className="flex items-center justify-between gap-2 border-b border-rule pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1.5" aria-hidden>
                      <span className="size-2 bg-accent-line" />
                      <span className="size-2 rounded-full bg-rule-2" />
                      <span className="size-2 rounded-full bg-rule-2" />
                    </span>
                    <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-muted">
                      INSTALL — CLI
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1 p-1"
                    style={{ backgroundColor: 'var(--hm-paper-3)' }}
                  >
                    {PM_OPTIONS.map((pm) => {
                      const on = activePm === pm.id
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setActivePm(pm.id)}
                          aria-pressed={on}
                          className={`relative px-2.5 py-1 text-[10px] font-mono transition-colors duration-150 ${
                            on ? 'text-paper font-bold' : 'text-muted hover:text-ink'
                          }`}
                          style={{
                            borderRadius: 'var(--hm-radius-input)',
                          }}
                        >
                          {on ? (
                            <motion.span
                              layoutId="pm-tab-pill"
                              aria-hidden
                              className="absolute inset-0 shadow-2xs"
                              style={{
                                backgroundColor: 'var(--hm-ink)',
                                borderRadius: 'var(--hm-radius-input)',
                              }}
                              transition={
                                reduce
                                  ? { duration: 0 }
                                  : { duration: 0.22, ease: EASE }
                              }
                            />
                          ) : null}
                          <span className="relative">{pm.id}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 py-1.5">
                  <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none py-1">
                    <div className="flex items-center gap-2.5 font-mono text-sm text-ink whitespace-nowrap sm:text-[15px]">
                      <span
                        className="flex size-5 shrink-0 items-center justify-center font-bold text-paper"
                        style={{ backgroundColor: 'var(--hm-accent-line)' }}
                        aria-hidden
                      >
                        $
                      </span>
                      <code className="select-all font-semibold tracking-tight">
                        <span className="text-accent-line">
                          {activePm === 'pnpm' ? 'pnpm dlx' : activePm}
                        </span>{' '}
                        <span className="font-normal text-muted">skills add</span>{' '}
                        <span className="text-ink font-bold">nutlope/hallmark</span>
                      </code>
                    </div>
                  </div>
                  <CopyButton
                    value={currentCmd}
                    ariaLabel={`复制 ${activePm} 安装命令`}
                    className="btn-primary shrink-0 px-4 py-2 text-xs font-mono shadow-xs"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-rule flex items-center justify-between font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
                  <span>✓ 零外部依赖</span>
                  <span>Tokens · Gates</span>
                </div>
              </motion.div>

              {/* 四个核心动词 */}
              <motion.div variants={fadeUp} className="mt-12">
                <VerbStack />
              </motion.div>

              {/* 58 道关卡标尺 */}
              <motion.div variants={fadeUp} className="hairline mt-12 pt-8">
                <GateScale />
              </motion.div>

              {/* 底部链接与令牌规范说明 */}
              <motion.div variants={fadeUp} className="hairline mt-12 pt-7">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
                  <Link
                    to="/custom"
                    className="tap group font-semibold text-ink-2 hover:text-accent-line transition-colors"
                  >
                    Custom 深度定制分支
                    <span
                      aria-hidden
                      className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                  <Link
                    to="/about"
                    className="tap group font-semibold text-ink-2 hover:text-accent-line transition-colors"
                  >
                    来源与验收
                    <span
                      aria-hidden
                      className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </div>
                <p
                  className="mt-4 text-[13px] text-muted font-mono"
                  style={{ lineHeight: 1.8 }}
                >
                  21 套主题取自 Hallmark 官方 tokens.css，在 OKLCH 空间互不相邻。
                </p>
                <div className="mt-4 flex items-center gap-2.5 text-[13px] text-muted">
                  <kbd className="kbd">T</kbd>
                  <span className="font-mono">随时按下，21 套主题即刻流转</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* 右栏：滚动的打样台 */}
          <div className="pb-24 pt-8 lg:col-span-7 lg:pt-16">
            <ContactSheet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
