import { Shuffle } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { macrostructures } from '../data/macrostructures'
import { Reveal } from './ui/reveal'

export function MacroRail() {
  const railRef = useRef<HTMLUListElement>(null)
  const [picked, setPicked] = useState<number | null>(null)

  function draw() {
    const next = Math.floor(Math.random() * macrostructures.length)
    setPicked(next)
    const node = railRef.current?.children[next]
    if (node instanceof HTMLElement) {
      node.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  return (
    <section
      id="shapes"
      className="mx-auto px-[var(--page-gutter)] py-24 sm:py-28"
      style={{ maxWidth: 'var(--page-max)' }}
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2
            className="display text-ink"
            style={{ fontSize: 'var(--text-2xl)' }}
          >
            先定结构，再挑皮肤
          </h2>
          <p
            className="mt-4 max-w-[52ch] text-md text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            21 种宏观结构。每一种是完整的一页形状：标题位置、正文构成、分隔线语言、按钮语气、图片处理、入场方式。
          </p>
        </div>
        <button type="button" onClick={draw} className="btn btn-ghost">
          <Shuffle size={16} weight="bold" aria-hidden />
          抽一个结构
        </button>
      </Reveal>

      <ul
        ref={railRef}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {macrostructures.map((m, i) => (
          <li
            key={m.name}
            className="card flex w-[17rem] shrink-0 snap-start flex-col p-5 transition-transform duration-200"
            style={
              picked === i
                ? {
                    outline: '2px solid var(--hm-accent)',
                    outlineOffset: '2px',
                  }
                : undefined
            }
          >
            <span className="meta text-muted">
              No. {String(m.no).padStart(2, '0')}
            </span>
            <h3 className="display mt-2 text-xl text-ink">{m.zh}</h3>
            <span className="mt-1 font-mono text-xs text-muted">{m.name}</span>
            <p
              className="mt-3 text-sm text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {m.desc}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
