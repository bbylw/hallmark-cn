import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/** 每一步的输入输出。图上的节点只写「做什么」，这里的进出才说明它卡在哪。 */
const IO = [
  { in: '原始 Prompt + 全库 Dense 稠密向量索引', out: '32 条候选语义粗排段落', guard: '召回率 > 94%' },
  { in: '检索给出的 32 条候选切片', out: '按 Cross-Encoder 重排得分最高的前 8 条', guard: '相关性截断阈值 0.72' },
  { in: '精选前 8 条切片 + 原始问题', out: '带溯源 Markdown 锚点的事实草稿', guard: '严禁臆造外部知识' },
  { in: '草稿本文 + 原始依据段落', out: '通过，或触发退回重排（最多 3 次）', guard: '引用严格逐句回测' },
  { in: '校验通过的确定性草稿', out: '带双向交互引用链条的最终答案', guard: '置信度标记输出' },
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
 * 推理工具 Lumen 主题。
 * 宏观结构：图示推理管线优先。
 * 装置：五步推理拓扑图、动态回退虚线、单步模拟流转台。
 */
export function LumenPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const steps = page.planes ?? []
  const cur = steps[pick]

  const runSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    let s = 0
    setPick(0)
    const interval = setInterval(() => {
      s++
      if (s < steps.length) {
        setPick(s)
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 500)
  }

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 刊头 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent-line animate-pulse" />
            <span className="meta font-mono font-bold text-accent-line">
              LUMEN COGNITIVE REASONING PIPELINE · V3
            </span>
          </div>
          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            className={`min-h-[32px] rounded border px-3 py-1 font-mono text-xs font-bold transition-all ${
              isRunning
                ? 'bg-ink text-paper'
                : 'border-rule bg-paper text-ink hover:border-ink'
            }`}
          >
            {isRunning ? '推理推演进行中...' : '▶ 模拟完整思维链推演'}
          </button>
        </div>

        <div className="mt-8 grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1
              className="display text-ink font-bold"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.08 }}
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
              className={`relative px-4 py-4 text-left transition-all ${
                pick === i ? 'ring-2 ring-accent-line shadow-sm' : ''
              }`}
              style={{
                backgroundColor: pick === i ? 'var(--hm-paper-3)' : 'transparent',
                border: `1px solid ${pick === i ? 'var(--hm-accent)' : 'var(--hm-rule-2)'}`,
                borderRadius: 'var(--hm-radius-card)',
              }}
            >
              <span
                className="meta block font-mono font-bold"
                style={{
                  color: pick === i ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                }}
              >
                第 {i + 1} 步
              </span>
              <span className="display mt-1 block text-lg font-bold text-ink">{s.t}</span>
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
        <div className="mt-4 hidden lg:block" aria-hidden>
          <span
            className="flex items-center gap-4 pl-[30%] text-xs text-accent-line font-mono font-bold"
            style={{ borderTop: '2px dashed var(--hm-accent)' }}
          >
            <span
              className="ml-[-4px] size-[7px] rotate-45"
              style={{
                borderBottom: '2px solid var(--hm-accent)',
                borderLeft: '2px solid var(--hm-accent)',
              }}
            />
            反思自检未达标则回第 2 步重新采样 · 最大回退重试 3 次
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
                className={`flex w-full gap-5 py-4 text-left transition-colors ${
                  pick === i ? 'bg-ink/5 pl-2 rounded' : ''
                }`}
                style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
              >
                <span className="meta w-16 shrink-0 font-mono font-bold text-accent-line">
                  第 {i + 1} 步
                </span>
                <span className="min-w-0">
                  <span className="display block text-lg font-bold text-ink">{s.t}</span>
                  <span className="mt-1 block text-xs text-muted">{s.d}</span>
                </span>
              </button>
              {i === 3 && (
                <p className="ml-[4.75rem] mt-[-0.5rem] font-mono text-xs text-accent-line font-bold">
                  ↑ 自检不过则回第 2 步
                </p>
              )}
              {i < steps.length - 1 && <Drop />}
            </li>
          ))}
        </ol>

        {/* 选中那一步的进出详情 */}
        {cur && (
          <div
            className="mt-12 grid gap-x-10 gap-y-4 p-6 sm:p-7 lg:grid-cols-12"
            style={{
              borderLeft: '3px solid var(--hm-accent)',
              backgroundColor: 'var(--hm-paper-2)',
              borderRadius: 'var(--hm-radius-card)',
            }}
          >
            <div className="lg:col-span-3">
              <div className="meta font-mono font-bold text-accent-line">第 {pick + 1} 步节点详情</div>
              <div className="display mt-1 text-xl font-bold text-ink">{cur.t}</div>
              <div className="mt-2 text-xs font-mono text-muted">
                守门准则：{IO[pick]?.guard}
              </div>
            </div>
            <div className="lg:col-span-6">
              <p
                className="text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                {cur.d}
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-3 font-mono text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted font-bold">输入张量 / 实体</dt>
                  <dd className="mt-0.5 text-ink-2">{IO[pick]?.in}</dd>
                </div>
                <div>
                  <dt className="text-muted font-bold">输出交付物</dt>
                  <dd className="mt-0.5 text-ink-2">{IO[pick]?.out}</dd>
                </div>
              </dl>
            </div>
            <div className="meta text-muted lg:col-span-3 lg:text-right font-mono text-xs">
              状态：已校验 · 确定性中间态可复现
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-rule pt-8">
          <Cta label={page.cta} done="已加载推理引擎" />
          <span className="text-sm text-muted">
            每一个推理跳跃均附带原始文献哈希引用，不确定的部分会被标出来，绝不混在结论里。
          </span>
        </div>
      </div>
    </main>
  )
}
