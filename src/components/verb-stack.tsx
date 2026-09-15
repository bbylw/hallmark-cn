import { CaretDown } from '@phosphor-icons/react'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { verbs } from '../data/verbs'

/**
 * 四个动词：压成手风琴，展开带平滑微动效与完整八态，
 * 严格遵循 Hallmark Gate 26 (交互状态) 与 Gate 12/14 (无多余过冲，仅 transform & opacity)。
 */
export function VerbStack() {
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()

  return (
    <div>
      <div className="meta flex items-baseline justify-between text-muted">
        <span>核心动词</span>
        <span>1 个默认 + 3 个显式</span>
      </div>
      <div className="mt-3">
        {verbs.map((v, i) => {
          const isOpen = open === i
          return (
            <div key={v.id} style={{ borderTop: '1px solid var(--hm-rule)' }}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-3 py-3.5 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-ink group-hover:text-accent-line">
                      {v.cmd}
                    </span>
                    {i === 0 ? (
                      <span className="meta rounded px-1.5 py-0.5 text-[9px] bg-paper-3 text-muted">
                        默认
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {v.summary}
                  </span>
                </span>
                <CaretDown
                  size={14}
                  weight="bold"
                  aria-hidden
                  className="shrink-0 text-muted transition-transform duration-200 group-hover:text-ink"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={reduce ? undefined : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={reduce ? undefined : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden pb-4"
                  >
                    <p
                      className="text-sm text-ink-2"
                      style={{ lineHeight: 'var(--lh-relaxed)' }}
                    >
                      {v.detail}
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {v.points.map((p) => (
                        <li key={p} className="flex items-baseline gap-2.5">
                          <span
                            aria-hidden
                            className="mt-2 size-1 shrink-0 rounded-full"
                            style={{ backgroundColor: 'var(--hm-accent)' }}
                          />
                          <span
                            className="text-xs text-muted"
                            style={{ lineHeight: 'var(--lh-relaxed)' }}
                          >
                            {p}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="meta mt-3.5 flex items-center gap-2 text-muted">
                      <span className="text-accent-line">产出</span>
                      <span>·</span>
                      <span>{v.output}</span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
        <div style={{ borderTop: '1px solid var(--hm-rule)' }} />
      </div>
    </div>
  )
}
