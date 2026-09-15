import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/** 每一步的输入输出。图上的节点只写「做什么」，这里的进出才说明它卡在哪。 */
const IO = [
  { in: '问题 + 全库向量索引', out: '32 条候选段落' },
  { in: '检索给出的 32 条候选', out: '按相关性排序的前 8 条' },
  { in: '前 8 条 + 问题', out: '带引用的草稿' },
  { in: '草稿本身', out: '通过，或退回第 2 步' },
  { in: '通过的草稿', out: '带引用链的答案' },
]

/** 竖向连线：窄屏下流程图不能整个消失 */
function Drop() {
  return (
    <span aria-hidden className="ml-[2.4rem] flex h-6 items-center">
      <span className="block h-full w-px bg-rule-2" />
      <span
        className="ml-[-3px] size-[6px] rotate-45"
        style={{
          borderBottom: '1px solid var(--hm-rule-2)',
          borderRight: '1px solid var(--hm-rule-2)',
        }}
      />
    </span>
  )
}

/**
 * 推理工具。宏观结构是「图示」：
 * 五步排成一行，箭头是流程，虚线是唯一一条回退边 —— 自检不过就回第 2 步。
 *
 * 五步全部来自数据的 planes，页面不再自己改写。
 * 之前 4→5 的箭头根本没画，成文的框是悬空的。
 */
export function LumenPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(1)
  const steps = page.planes ?? []
  const cur = steps[pick]

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1
              className="display text-ink"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.06 }}
            >
              {page.title}
            </h1>
          </div>
          <p
            className="mt-6 text-md text-ink-2 lg:col-span-5 lg:mt-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </div>

        {/* 图：宽屏横排五列，窄屏竖排连线 */}
        <div
          className="mt-14 hidden lg:grid"
          style={{
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            columnGap: '1.75rem',
          }}
        >
          {steps.map((s, i) => (
            <button
              key={s.t}
              type="button"
              aria-pressed={pick === i}
              onClick={() => setPick(i)}
              className="relative px-4 py-4 text-left transition-colors duration-200"
              style={{
                backgroundColor: pick === i ? 'var(--hm-paper-3)' : 'transparent',
                border: `1px solid ${pick === i ? 'var(--hm-accent)' : 'var(--hm-rule-2)'}`,
                borderRadius: 'var(--hm-radius-card)',
              }}
            >
              <span
                className="meta block"
                style={{
                  color: pick === i ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                }}
              >
                第 {i + 1} 步
              </span>
              <span className="display mt-1 block text-lg text-ink">{s.t}</span>
              <span
                className="mt-1 block text-xs"
                style={{ color: pick === i ? 'var(--hm-ink-2)' : 'var(--hm-muted)' }}
              >
                {s.d}
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-full top-1/2 flex w-[1.75rem] -translate-y-1/2 items-center"
                >
                  <span className="block h-px w-full bg-rule-2" />
                  <span
                    className="ml-[-1px] size-[7px] rotate-45 shrink-0"
                    style={{
                      borderTop: '1px solid var(--hm-rule-2)',
                      borderRight: '1px solid var(--hm-rule-2)',
                    }}
                  />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 回退边：只有自检→重排这一条，虚线 */}
        <div className="mt-3 hidden lg:block" aria-hidden>
          <span
            className="flex items-center gap-4 pl-[30%] text-xs text-accent-line"
            style={{ borderTop: '1px dashed var(--hm-accent)' }}
          >
            <span
              className="ml-[-4px] size-[7px] rotate-45"
              style={{
                borderBottom: '1px solid var(--hm-accent)',
                borderLeft: '1px solid var(--hm-accent)',
              }}
            />
            自检不过则回第 2 步，最多三次
          </span>
        </div>

        {/* 窄屏：竖向流程，连线还在 */}
        <ol className="mt-12 lg:hidden">
          {steps.map((s, i) => (
            <li key={s.t}>
              <button
                type="button"
                onClick={() => setPick(i)}
                aria-pressed={pick === i}
                className="flex w-full gap-5 py-4 text-left"
                style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
              >
                <span className="meta w-16 shrink-0 text-muted">
                  第 {i + 1} 步
                </span>
                <span className="min-w-0">
                  <span className="display block text-lg text-ink">{s.t}</span>
                  <span className="mt-1 block text-xs text-muted">{s.d}</span>
                </span>
              </button>
              {i === 3 && (
                <p className="ml-[4.75rem] mt-[-0.5rem] text-xs text-accent-line">
                  ↑ 不过则回第 2 步
                </p>
              )}
              {i < steps.length - 1 && <Drop />}
            </li>
          ))}
        </ol>

        {/* 选中那一步的进出 */}
        {cur && (
          <div
            className="mt-12 grid gap-x-10 gap-y-4 p-6 lg:grid-cols-12"
            style={{
              borderLeft: '2px solid var(--hm-accent)',
              backgroundColor: 'var(--hm-paper-2)',
              borderRadius: 'var(--hm-radius-card)',
            }}
          >
            <div className="lg:col-span-3">
              <div className="meta text-muted">第 {pick + 1} 步</div>
              <div className="display mt-1 text-xl text-ink">{cur.t}</div>
            </div>
            <div className="lg:col-span-5">
              <p
                className="text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {cur.d}
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted">输入</dt>
                  <dd className="mt-0.5 text-ink-2">{IO[pick]?.in}</dd>
                </div>
                <div>
                  <dt className="text-muted">输出</dt>
                  <dd className="mt-0.5 text-ink-2">{IO[pick]?.out}</dd>
                </div>
              </dl>
            </div>
            <div className="meta text-muted lg:col-span-4 lg:text-right">
              中间结果可改
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-wrap items-center gap-6">
          <Cta label={page.cta} done="推理已展开" />
          <span className="text-sm text-muted">
            不确定的部分会被标出来，不会混在结论里。
          </span>
        </div>
      </div>
    </main>
  )
}
