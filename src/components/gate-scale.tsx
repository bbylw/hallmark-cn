import { gateGroups, totalGates } from '../data/gates'

const CITED = [19, 34, 46, 47, 48, 49, 50, 51, 52, 53, 54]

/** 57 道关卡画成一把刻度尺，被引用的那几道点亮，不做成卡片堆。 */
export function GateScale() {
  return (
    <div>
      <div className="meta flex items-baseline justify-between text-muted">
        <span>{totalGates} 道关卡</span>
        <span>逐条过</span>
      </div>

      <div
        className="mt-3 flex h-8 items-end gap-[2px]"
        role="img"
        aria-label={`${totalGates} 道关卡的刻度，其中 ${CITED.length} 道在下方被引用`}
      >
        {Array.from({ length: totalGates }, (_, i) => {
          const n = i + 1
          const on = CITED.includes(n)
          return (
            <span
              key={n}
              className="flex-1"
              style={{
                height: on ? '100%' : n % 10 === 0 ? '70%' : '40%',
                backgroundColor: on
                  ? 'var(--hm-accent)'
                  : 'var(--hm-rule-2)',
              }}
            />
          )
        })}
      </div>

      <ul className="mt-4 flex flex-col gap-1.5">
        {gateGroups.slice(0, 4).map((g) => (
          <li key={g.id} className="flex items-baseline gap-3">
            <span className="w-24 shrink-0 text-xs text-ink-2">{g.name}</span>
            <span className="font-mono text-[10px] text-muted">{g.count}</span>
            <span className="min-w-0 flex-1 text-xs text-muted">
              {g.samples[0]?.no ? `gate ${g.samples[0].no} ${g.samples[0].text}` : g.samples[0]?.text}
            </span>
          </li>
        ))}
      </ul>
      <p
        className="mt-3 text-xs text-muted"
        style={{ lineHeight: 'var(--lh-relaxed)' }}
      >
        八族共 {totalGates} 道，任何一道过不了就回去改，改完重跑。
      </p>
    </div>
  )
}
