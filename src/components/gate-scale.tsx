import { useState } from 'react'
import { gateGroups, totalGates } from '../data/gates'

const CITED = [15, 19, 34, 41, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]

/**
 * 58 道关卡刻度尺：
 * 1. 58 道精细标尺刻度，高亮核心关卡；
 * 2. 支持交互式探查 8 大关卡族群，点击/悬浮可切换查看各族群专属判据；
 * 3. 严格满足触控安全与 Hallmark Gate 26 (交互状态) 纪律。
 */
export function GateScale() {
  const [selectedId, setSelectedId] = useState<string>('variety')
  const currentGroup = gateGroups.find((g) => g.id === selectedId) ?? gateGroups[0]

  return (
    <div>
      <div className="meta flex items-baseline justify-between text-muted">
        <span>检验关卡</span>
        <span>{totalGates} 道 · 8 大族群</span>
      </div>

      {/* 58 道刻度尺 */}
      <div
        className="mt-3 flex h-9 items-end gap-[2px] rounded p-1"
        role="img"
        aria-label={`${totalGates} 道关卡的刻度，其中 ${CITED.length} 道为重点检查项`}
        style={{ backgroundColor: 'var(--hm-paper-2)' }}
      >
        {Array.from({ length: totalGates }, (_, i) => {
          const n = i + 1
          const on = CITED.includes(n)
          return (
            <span
              key={n}
              title={`Gate ${n}${on ? ' (核心关注)' : ''}`}
              className="flex-1 transition-all duration-200"
              style={{
                height: on ? '100%' : n % 10 === 0 ? '70%' : '38%',
                backgroundColor: on
                  ? 'var(--hm-accent)'
                  : 'var(--hm-rule-2)',
                borderRadius: '1px',
              }}
            />
          )
        })}
      </div>

      {/* 族群标签行：水平滑动或折行 */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {gateGroups.map((g) => {
          const isCurrent = g.id === selectedId
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedId(g.id)}
              aria-pressed={isCurrent}
              className="tap flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hm-focus)]"
              style={{
                backgroundColor: isCurrent ? 'var(--hm-paper-3)' : 'transparent',
                color: isCurrent ? 'var(--hm-ink)' : 'var(--hm-muted)',
                fontWeight: isCurrent ? 600 : 400,
                border: isCurrent
                  ? 'var(--hm-rule-card) solid var(--hm-accent-line)'
                  : 'var(--hm-rule-card) solid transparent',
              }}
            >
              <span>{g.name}</span>
              <span className="font-mono text-[10px] opacity-70">
                {g.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 当前选中国家的判据卡片 */}
      <div
        className="mt-3.5 rounded p-3 text-xs"
        style={{
          backgroundColor: 'var(--hm-paper-2)',
          border: 'var(--hm-rule-card) solid var(--hm-rule)',
        }}
      >
        <div className="font-medium text-ink-2" style={{ lineHeight: 'var(--lh-normal)' }}>
          {currentGroup.blurb}
        </div>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {currentGroup.samples.map((s, idx) => (
            <li key={idx} className="flex items-baseline gap-2 text-muted">
              {s.no ? (
                <span className="font-mono font-semibold text-accent-line shrink-0">
                  gate {s.no}
                </span>
              ) : (
                <span className="size-1 rounded-full shrink-0 mt-1" style={{ backgroundColor: 'var(--hm-rule-2)' }} />
              )}
              <span style={{ lineHeight: 'var(--lh-relaxed)' }}>{s.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p
        className="mt-3 text-xs text-muted"
        style={{ lineHeight: 'var(--lh-relaxed)' }}
      >
        八族共 {totalGates} 道硬检验，交付前逐条过，任何一条判负必须推翻重改。
      </p>
    </div>
  )
}
