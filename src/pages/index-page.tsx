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
 * 索引页用对开式：左栏整屏不滚，装着全部的说明与控件；
 * 右栏才是 24 张小样的滚动流。不是「hero → 卡片 → 特性 → CTA」那条标准滚落。
 */
export function IndexPage() {
  useThemeAttr('grid')
  const reduce = useReducedMotion()

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteNav />

      <div
        className="mx-auto px-[var(--page-gutter)]"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 左栏：固定 */}
          <div className="pt-12 lg:col-span-5">
            <motion.div
              className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-12 lg:pr-6"
              style={{ scrollbarWidth: 'thin' }}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="display text-ink"
                style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.9rem)' }}
              >
                让 AI 写出来的界面，看起来像是人做的
              </h1>
              <p
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                一个给 Claude Code、Cursor 和 Codex 用的设计 skill。
                它给需求挑宏观结构，套上 21 种主题之一，跑完 57 道关卡再交付。
              </p>

              <div
                className="mt-8 flex flex-wrap items-center gap-3 p-4"
                style={{
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                  borderRadius: 'var(--hm-radius-card)',
                  backgroundColor: 'var(--hm-paper-2)',
                }}
              >
                <code className="min-w-0 flex-1 break-all font-mono text-sm text-ink">
                  {INSTALL_CMD}
                </code>
                <CopyButton
                  value={INSTALL_CMD}
                  ariaLabel="复制安装命令"
                  className="btn-primary shrink-0 px-3 py-1.5 text-sm"
                />
              </div>

              <div className="mt-10">
                <VerbStack />
              </div>

              <div className="hairline mt-10 pt-8">
                <GateScale />
              </div>

              <div className="hairline mt-10 pt-6">
                <div className="flex flex-wrap gap-6 text-sm">
                  <Link
                    to="/custom"
                    className="tap text-ink-2 hover:text-accent-line"
                  >
                    Custom 分支
                  </Link>
                  <Link
                    to="/about"
                    className="tap text-ink-2 hover:text-accent-line"
                  >
                    数据来源与验收
                  </Link>
                </div>
                <p
                  className="mt-3 text-xs text-muted"
                  style={{ lineHeight: 'var(--lh-relaxed)' }}
                >
                  21 套主题的色值、字体与圆角逐条取自 Hallmark 官方 tokens.css，
                  没有一套是编的。
                </p>
              </div>
            </motion.div>
          </div>

          {/* 右栏：滚动的打样台 */}
          <div className="pb-20 pt-4 lg:col-span-7 lg:pt-12">
            <ContactSheet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
