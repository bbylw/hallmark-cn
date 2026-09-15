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
        className="mx-auto px-(--page-gutter)"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 左栏：独立滚动工作台（保留工效嵌套滚动条，作为完整工作台体验） */}
          <div className="pt-8 lg:col-span-5 lg:pt-10">
            <motion.div
              className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-12 lg:pr-6"
              style={{ scrollbarWidth: 'thin' }}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="meta inline-flex items-center gap-2 rounded-full px-2.5 py-1 bg-paper-2 border border-rule/70 text-accent-line text-[11px] font-mono shadow-2xs">
                <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
                <span className="font-bold tracking-wide">Hallmark v1.1.0</span>
                <span className="text-rule-2">/</span>
                <span className="text-ink-2 font-medium">Anti-AI-Slop Skill</span>
              </div>

              <h1
                className="display mt-3 text-ink tracking-tight"
                style={{
                  fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)',
                  lineHeight: 1.08,
                  letterSpacing: 'var(--hm-tracking-display)',
                }}
              >
                让 AI 写出来的界面，
                <span className="text-accent-line block sm:inline">看起来像是人做的</span>
              </h1>

              <p
                className="mt-3.5 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                专为 <span className="font-semibold text-ink">Claude Code</span>、<span className="font-semibold text-ink">Cursor</span> 和 <span className="font-semibold text-ink">Codex</span> 打造的设计 skill。
                它拒绝大模型默认的居中大圆角卡片与紫蓝渐变套路，为每个真实需求定制宏观骨架，严格套用 <span className="font-semibold text-ink">21 套独立主题</span> 与 <span className="font-semibold text-ink">58 道关卡</span>。
              </p>

              {/* 开发者 CLI 安装命令台 */}
              <div
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
                    {PM_OPTIONS.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setActivePm(pm.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          activePm === pm.id
                            ? 'bg-ink text-paper font-bold shadow-2xs'
                            : 'text-muted hover:text-ink'
                        }`}
                      >
                        {pm.id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
                    <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] text-ink whitespace-nowrap">
                      <span className="text-accent-line select-none font-bold">$</span>
                      <code className="select-all font-semibold tracking-tight">
                        <span className="text-accent-line">{activePm === 'pnpm' ? 'pnpm dlx' : activePm}</span>{' '}
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
              </div>

              {/* 四个核心动词 */}
              <div className="mt-6">
                <VerbStack />
              </div>

              {/* 58 道关卡标尺 */}
              <div className="hairline mt-6 pt-5">
                <GateScale />
              </div>

              {/* 底部链接与令牌规范说明 */}
              <div className="hairline mt-6 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <Link
                    to="/custom"
                    className="tap font-semibold text-ink-2 hover:text-accent-line transition-colors"
                  >
                    Custom 深度定制分支 →
                  </Link>
                  <Link
                    to="/about"
                    className="tap font-semibold text-ink-2 hover:text-accent-line transition-colors"
                  >
                    来源与验收 →
                  </Link>
                </div>
                <p
                  className="mt-2 text-[11px] text-muted font-mono"
                  style={{ lineHeight: 'var(--lh-normal)' }}
                >
                  21 套主题取自 Hallmark 官方 tokens.css，在 OKLCH 空间互不相邻。
                </p>
              </div>
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
