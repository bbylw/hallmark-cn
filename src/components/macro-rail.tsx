import { Shuffle } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { macrostructures } from '../data/macrostructures'
import { Reveal } from './ui/reveal'

/**
 * 宏观结构导轨：
 * 21 种宏观结构横向铺开，支持「抽一个结构」即时高亮滚动，
 * 严格遵照 Gate 34 (无外溢) 与 Gate 26 (按钮八态)。
 */
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
      className="mx-auto px-(--page-gutter) py-20 sm:py-24"
      style={{ maxWidth: 'var(--page-max)' }}
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="meta text-accent-line">Macrostructures · 宏观结构导轨</div>
          <h2
            className="display mt-1 text-ink"
            style={{ fontSize: 'var(--text-2xl)' }}
          >
            先定骨架，再挑皮肤
          </h2>
          <p
            className="mt-3 max-w-[54ch] text-md text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            Hallmark 拒绝统一从「居中卡片流」起跑。21 种宏观结构各自决定标题位置、正文构成、分隔线语言、按钮语气与图片处理。
          </p>
        </div>
        <button
          type="button"
          onClick={draw}
          className="btn btn-ghost tap gap-2 text-xs sm:text-sm"
          aria-label="随机抽取一种宏观结构"
        >
          <Shuffle size={15} weight="bold" aria-hidden />
          <span>随机抽一个结构</span>
        </button>
      </Reveal>

      {/* 选中的结构浮窗指示 */}
      {picked !== null ? (
        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
          <span className="text-accent-line">已抽中：</span>
          <span className="font-semibold text-ink">
            No. {String(macrostructures[picked].no).padStart(2, '0')} {macrostructures[picked].zh} ({macrostructures[picked].name})
          </span>
        </div>
      ) : null}

      <ul
        ref={railRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {macrostructures.map((m, i) => {
          const isPicked = picked === i
          return (
            <li
              key={m.name}
              className="card group flex w-[18rem] shrink-0 snap-start flex-col p-5 transition-all duration-300"
              style={{
                borderColor: isPicked ? 'var(--hm-accent)' : undefined,
                boxShadow: isPicked ? '0 0 0 1px var(--hm-accent)' : undefined,
                transform: isPicked ? 'translateY(-2px)' : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="meta text-muted">
                  No. {String(m.no).padStart(2, '0')}
                </span>
                {isPicked ? (
                  <span className="meta rounded px-1.5 py-0.5 text-[9px] text-accent-ink" style={{ backgroundColor: 'var(--hm-accent)' }}>
                    抽中
                  </span>
                ) : null}
              </div>
              <h3 className="display mt-3 text-xl text-ink group-hover:text-accent-line transition-colors">
                {m.zh}
              </h3>
              <span className="mt-1 font-mono text-xs text-muted">{m.name}</span>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {m.desc}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
