import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import { ContactSheet } from '../components/contact-sheet'
import { Footer } from '../components/footer'
import { GateScale } from '../components/gate-scale'
import { SiteNav } from '../components/site-nav'
import { VerbStack } from '../components/verb-stack'
import { CopyButton } from '../components/ui/copy-button'
import { useThemeAttr } from '../theme-attr'

const INSTALL_CMD = 'npx skills add nutlope/hallmark'

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

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteNav />

      <main
        id="main"
        className="mx-auto px-[var(--page-gutter)]"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 左栏：固定工作台 */}
          <div className="pt-10 lg:col-span-5 lg:pt-12">
            <motion.div
              className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-12 lg:pr-6"
              style={{ scrollbarWidth: 'thin' }}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="meta flex items-center gap-2 text-accent-line">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: 'var(--hm-accent)' }} />
                <span>Hallmark v1.1.0 · Anti-AI-Slop Skill</span>
              </div>

              <h1
                className="display mt-3 text-ink"
                style={{
                  fontSize: 'clamp(2rem, 3.4vw, 3rem)',
                  lineHeight: 1.05,
                  letterSpacing: 'var(--hm-tracking-display)',
                }}
              >
                让 AI 写出来的界面，看起来像是人做的
              </h1>

              <p
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                专为 Claude Code、Cursor 和 Codex 打造的设计 skill。
                它拒绝大模型被训练出的居中卡片与紫蓝渐变套路，为每个需求定制宏观结构，套用 21 套独立主题，跑完 58 道关卡才予交付。
              </p>

              {/* 安装命令框 */}
              <div
                className="mt-7 flex flex-wrap items-center gap-3 p-3.5"
                style={{
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                  borderRadius: 'var(--hm-radius-card)',
                  backgroundColor: 'var(--hm-paper-2)',
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="meta mb-1 text-[10px] text-muted">一键安装 Skill</div>
                  <code className="block break-all font-mono text-xs text-ink sm:text-sm">
                    {INSTALL_CMD}
                  </code>
                </div>
                <CopyButton
                  value={INSTALL_CMD}
                  ariaLabel="复制安装命令"
                  className="btn-primary shrink-0 px-3.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div className="mt-9">
                <VerbStack />
              </div>

              <div className="hairline mt-9 pt-8">
                <GateScale />
              </div>

              <div className="hairline mt-9 pt-6">
                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <Link
                    to="/custom"
                    className="tap font-medium text-ink-2 hover:text-accent-line"
                  >
                    Custom 深度定制分支 →
                  </Link>
                  <Link
                    to="/about"
                    className="tap font-medium text-ink-2 hover:text-accent-line"
                  >
                    来源与验收 →
                  </Link>
                </div>
                <p
                  className="mt-3 text-xs text-muted"
                  style={{ lineHeight: 'var(--lh-relaxed)' }}
                >
                  21 套主题的色值、字体与圆角逐条取自 Hallmark 官方 tokens.css，
                  在 OKLCH 空间互不相邻，没有一套是凭空编造。
                </p>
              </div>
            </motion.div>
          </div>

          {/* 右栏：滚动的打样台 */}
          <div className="pb-20 pt-4 lg:col-span-7 lg:pt-12">
            <ContactSheet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
