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
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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
          className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(var(--hm-rule) 1px, transparent 1px), linear-gradient(90deg, var(--hm-rule) 1px, transparent 1px)',
            backgroundSize: '2.75rem 2.75rem',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, transparent 100%)',
          }}
        />

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 左栏：独立滚动工作台（保留工效嵌套滚动条，作为完整工作台体验） */}
          <div className="pt-8 lg:col-span-5 lg:pt-10">
            <motion.div
              className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-12 lg:pr-6"
              style={{ scrollbarWidth: 'thin' }}
              initial={reduce ? false : 'hidden'}
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
              }}
            >
              <motion.div
                variants={fadeUp}
                className="meta inline-flex items-center gap-2 rounded-full px-2.5 py-1 bg-paper-2 border border-rule/70 text-accent-line text-[11px] font-mono shadow-2xs"
              >
                <span className="relative inline-flex size-2">
                  <span
                    aria-hidden
                    className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60"
                  />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="font-bold tracking-wide">Hallmark v1.1.0</span>
                <span className="text-rule-2">/</span>
                <span className="text-ink-2 font-medium">Anti-AI-Slop Skill</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="display mt-3 text-ink tracking-tight"
                style={{
                  fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)',
                  lineHeight: 1.08,
                  letterSpacing: 'var(--hm-tracking-display)',
                }}
              >
                让 AI 写出来的界面，
                <span className="relative inline-block text-accent-line">
                  看起来像是人做的
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-[3px] w-full bg-accent-line"
                    style={{ transformOrigin: '0 50%' }}
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                  />
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-3.5 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                专为 <span className="font-semibold text-ink">Claude Code</span>
                、<span className="font-semibold text-ink">Cursor</span> 和{' '}
                <span className="font-semibold text-ink">Codex</span>{' '}
                打造的设计 skill。
                它拒绝大模型默认的居中大圆角卡片与紫蓝渐变套路，为每个真实需求定制宏观骨架，严格套用{' '}
                <span className="font-semibold text-ink underline decoration-accent-line/50 decoration-[1.5px] underline-offset-[3px]">
                  21 套独立主题
                </span>{' '}
                与{' '}
                <span className="font-semibold text-ink underline decoration-accent-line/50 decoration-[1.5px] underline-offset-[3px]">
                  58 道关卡
                </span>
                。
              </motion.p>

              {/* 开发者 CLI 安装命令台 */}
              <motion.div
                variants={fadeUp}
                className="mt-5 p-3.5 transition-all shadow-xs"
                style={{
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                  borderRadius: 'var(--hm-radius-card)',
                  backgroundColor: 'var(--hm-paper-2)',
                }}
              >
                <div className="flex items-center justify-between gap-2 border-b border-rule/50 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-rule-2" />
                      <span className="size-2 rounded-full bg-rule-2" />
                      <span className="size-2 rounded-full bg-rule-2" />
                    </span>
                    <span className="meta text-[10px] text-muted font-mono font-bold tracking-wider">
                      INSTALL CLI
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {PM_OPTIONS.map((pm) => {
                      const on = activePm === pm.id
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setActivePm(pm.id)}
                          className={`relative px-2 py-0.5 rounded text-[10px] font-mono transition-colors duration-150 ${
                            on ? 'text-paper font-bold' : 'text-muted hover:text-ink'
                          }`}
                        >
                          {on ? (
                            <motion.span
                              layoutId="pm-tab-pill"
                              aria-hidden
                              className="absolute inset-0 rounded bg-ink shadow-2xs"
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

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
                    <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] text-ink whitespace-nowrap">
                      <span className="text-accent-line select-none font-bold">$</span>
                      <code className="select-all font-semibold tracking-tight">
                        <span className="text-accent-line">
                          {activePm === 'pnpm' ? 'pnpm dlx' : activePm}
                        </span>{' '}
                        <span className="text-muted">skills add</span>{' '}
                        <span className="text-ink font-bold">nutlope/hallmark</span>
                      </code>
                    </div>
                  </div>
                  <CopyButton
                    value={currentCmd}
                    ariaLabel={`复制 ${activePm} 安装命令`}
                    className="btn-primary shrink-0 px-3 py-1.5 text-xs font-mono shadow-xs"
                  />
                </div>

                <div className="mt-2.5 pt-2 border-t border-rule/30 flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono text-muted">
                  <span>✓ 零外部依赖</span>
                  <span>21 套 Tokens · 58 关卡约束</span>
                </div>
              </motion.div>

              {/* 四个核心动词 */}
              <motion.div variants={fadeUp} className="mt-6">
                <VerbStack />
              </motion.div>

              {/* 58 道关卡标尺 */}
              <motion.div variants={fadeUp} className="hairline mt-6 pt-5">
                <GateScale />
              </motion.div>

              {/* 底部链接与令牌规范说明 */}
              <motion.div variants={fadeUp} className="hairline mt-6 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
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
                  className="mt-2 text-[11px] text-muted font-mono"
                  style={{ lineHeight: 'var(--lh-normal)' }}
                >
                  21 套主题取自 Hallmark 官方 tokens.css，在 OKLCH 空间互不相邻。
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
                  <kbd className="kbd">T</kbd>
                  <span className="font-mono">随时按下，21 套主题即刻流转</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* 右栏：滚动的打样台 */}
          <div className="pb-20 pt-4 lg:col-span-7 lg:pt-10">
            <ContactSheet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
