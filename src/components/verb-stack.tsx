import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { verbs } from '../data/verbs'
import { CopyButton } from './ui/copy-button'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * 四个核心动词控制台：
 * 采用工效极佳的 4 分段工作台（Segmented Console），点击瞬时切换，
 * 解决传统手风琴展开导致的局部纵向高度失控与滚轮截断问题。
 */
export function VerbStack() {
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const reduce = useReducedMotion()
  const v = verbs[activeIdx] ?? verbs[0]

  return (
    <div>
      <div className="meta flex items-baseline justify-between text-muted">
        <span className="font-mono text-[11px] font-bold">CORE VERBS · 核心动词</span>
        <span className="font-mono text-[10px]">1 默认 + 3 显式</span>
      </div>

      {/* 4 分段动词切换卡片 */}
      <div
        className="mt-2.5 grid grid-cols-4 gap-1 p-1 rounded-lg"
        role="tablist"
        aria-label="核心动词选择"
        style={{
          backgroundColor: 'var(--hm-paper-2)',
          border: '1px solid var(--hm-rule)',
        }}
      >
        {verbs.map((item, idx) => {
          const isCurrent = activeIdx === idx
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-verb-${item.id}`}
              aria-selected={isCurrent}
              aria-controls={`panel-verb-${item.id}`}
              onClick={() => setActiveIdx(idx)}
              className={`tap flex-col justify-center relative rounded px-1.5 py-1.5 text-center text-xs transition-colors duration-150 ${
                isCurrent
                  ? 'text-paper font-bold'
                  : 'text-muted hover:text-ink hover:bg-paper-3/40'
              }`}
            >
              {isCurrent ? (
                <motion.span
                  layoutId="verb-tab-bg"
                  aria-hidden
                  className="absolute inset-0 rounded bg-ink shadow-xs"
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.22, ease: EASE }
                  }
                />
              ) : null}
              <span className="relative block text-[11px] leading-tight font-medium">
                {item.zh}
              </span>
              <span className="relative block font-mono text-[9px] opacity-75 mt-0.5 truncate">
                {item.id}
              </span>
            </button>
          )
        })}
      </div>

      {/* 当前选中国家动词的精细档案面板 */}
      <motion.div
        key={v.id}
        id={`panel-verb-${v.id}`}
        role="tabpanel"
        aria-labelledby={`tab-verb-${v.id}`}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2.5 rounded-lg p-3 text-xs"
        style={{
          backgroundColor: 'var(--hm-paper-2)',
          border: 'var(--hm-rule-card) solid var(--hm-rule)',
        }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-rule/50 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-accent-line font-mono font-bold select-none">$</span>
            <code className="font-mono text-xs font-bold text-ink truncate select-all">
              <span className="text-accent-line">hallmark</span>
              {v.cmd.replace('hallmark', '') ? (
                <span className="text-ink"> {v.cmd.replace('hallmark', '').trim()}</span>
              ) : null}
            </code>
          </div>
          <CopyButton
            value={v.cmd}
            ariaLabel={`复制指令 ${v.cmd}`}
            className="btn shrink-0 px-2 py-1 text-[11px] font-mono border border-rule/60 hover:bg-paper"
          />
        </div>

        <p
          className="mt-2 text-ink-2 text-xs leading-relaxed"
        >
          {v.detail}
        </p>

        <ul className="mt-2.5 flex flex-col gap-1.5">
          {v.points.map((p) => (
            <li key={p} className="flex items-baseline gap-2">
              <span
                aria-hidden
                className="size-1 shrink-0 rounded-full mt-1.5"
                style={{ backgroundColor: 'var(--hm-accent)' }}
              />
              <span
                className="text-[11px] text-muted leading-normal"
              >
                {p}
              </span>
            </li>
          ))}
        </ul>

        <div className="meta mt-2.5 pt-2 border-t border-rule/40 flex items-center justify-between text-[11px]">
          <span className="text-accent-line font-medium">产出交付物</span>
          <span className="font-mono text-ink font-semibold px-2 py-0.5 rounded bg-paper border border-rule/50 shadow-2xs">
            {v.output}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
