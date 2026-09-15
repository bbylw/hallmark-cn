import { CaretDown } from '@phosphor-icons/react'
import { useState } from 'react'
import { verbs } from '../data/verbs'

/** 四个动词压成一列手风琴，占窄栏，展开时原地给详情。 */
export function VerbStack() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      <div className="meta text-muted">四个动词</div>
      <div className="mt-3">
        {verbs.map((v, i) => (
          <div key={v.id} style={{ borderTop: '1px solid var(--hm-rule)' }}>
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center gap-3 py-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs text-ink">
                  {v.cmd}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {v.summary}
                </span>
              </span>
              <CaretDown
                size={13}
                weight="bold"
                aria-hidden
                className="shrink-0 text-muted transition-transform duration-200"
                style={{ transform: open === i ? 'rotate(180deg)' : 'none' }}
              />
            </button>
            {open === i ? (
              <div className="pb-4">
                <p
                  className="text-sm text-ink-2"
                  style={{ lineHeight: 'var(--lh-relaxed)' }}
                >
                  {v.detail}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {v.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0"
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
                <div className="meta mt-3 text-muted">产出：{v.output}</div>
              </div>
            ) : null}
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--hm-rule)' }} />
      </div>
    </div>
  )
}
