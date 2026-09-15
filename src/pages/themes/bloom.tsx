import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/** 四个时段。潮位是今天的实测值，也是每行那根水位线的长度。 */
const SLOTS = [
  {
    h: 6,
    name: '涨潮 · 热池',
    tide: 97,
    temp: '42°C',
    cap: '限 60 人',
    note: '水最满的时候泡最热的池子。热池四十二度，进池前先冲一遍。',
  },
  {
    h: 11,
    name: '平潮 · 蒸汽',
    tide: 55,
    temp: '湿度 78%',
    cap: '限 40 人',
    note: '潮位不动，蒸汽房开到最大。坐十分钟就出来透气。',
  },
  {
    h: 16,
    name: '退潮 · 冷池',
    tide: 35,
    temp: '14°C',
    cap: '限 60 人',
    note: '水退到最低，冷池正好。十四度，进去二十秒就够。',
  },
  {
    h: 20,
    name: '夜潮 · 静躺',
    tide: 82,
    temp: '地脚线',
    cap: '限 30 人',
    note: '不开灯，只留一条地脚线。躺够四十分钟再走。',
  },
]

const clock = (hour: number) => {
  const h = Math.floor(hour) % 24
  const m = Math.round((hour - Math.floor(hour)) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * 潮汐浴场。整页是一张时刻表：
 * 大字是时段，等宽字是时刻，中间那根细线的长度就是当天的潮位。
 * 潮水不做成大色块，它是一根线。
 */
export function BloomPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(0)
  const cur = SLOTS[pick]

  // 「到场之后」的时刻是真的：后三段跟着选中的时段走
  const flow = (page.planes ?? []).map((p, i) => {
    const offset = [null, null, -0.5, 0, 1.2][i] as number | null
    return {
      ...p,
      time: offset === null ? '随时' : clock(cur.h + offset),
      online: offset === null,
    }
  })

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 刊头 */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <span className="meta text-muted">{page.brand}</span>
          <span className="meta text-muted">今日 涨潮 05:42 · 退潮 15:58</span>
        </div>

        <h1
          className="display mt-8 text-ink"
          style={{ fontSize: 'clamp(2.25rem, 5.6vw, 4rem)', lineHeight: 1.04 }}
        >
          {page.title}
        </h1>
        <p
          className="mt-5 text-balance text-md text-ink-2"
          style={{ maxWidth: '30ch', lineHeight: 'var(--lh-relaxed)' }}
        >
          {page.standfirst}
        </p>

        {/* 时刻表 */}
        <ol className="mt-16">
          {SLOTS.map((s, i) => {
            const on = i === pick
            return (
              <li
                key={s.h}
                style={{
                  borderTop: `1px solid var(--hm-${on ? 'rule-2' : 'rule'})`,
                }}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPick(i)}
                  className="flex w-full flex-wrap items-baseline gap-x-6 gap-y-2 py-5 text-left"
                >
                  <span
                    className="w-[3.6rem] shrink-0 font-mono text-sm transition-colors"
                    style={{
                      color: on ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                    }}
                  >
                    {clock(s.h)}
                  </span>
                  <span
                    className="display shrink-0 text-2xl transition-colors sm:w-[10.5rem]"
                    style={{ color: on ? 'var(--hm-ink)' : 'var(--hm-ink-2)' }}
                  >
                    {s.name}
                  </span>

                  {/* 水位线：长度就是这个时段的潮位。
                      窄屏强制独占一行，四行才共用同一个分母，长度才可比。 */}
                  <span
                    aria-hidden
                    className="flex w-full shrink-0 items-center sm:w-auto sm:flex-1"
                  >
                    <span
                      className="block h-[3px] rounded-full transition-opacity duration-300"
                      style={{
                        width: `${s.tide}%`,
                        backgroundColor: 'var(--hm-accent-line)',
                        opacity: on ? 1 : 0.38,
                      }}
                    />
                  </span>

                  <span className="shrink-0">
                    <span className="meta mr-1.5 text-muted">潮位</span>
                    <span className="font-mono text-sm text-ink-2">
                      {s.tide}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-muted sm:w-[8rem] sm:text-right">
                    {s.temp} · {s.cap}
                  </span>
                </button>

                {on && (
                  <p
                    className="-mt-2 pb-6 text-md text-ink-2"
                    style={{ maxWidth: '48ch', lineHeight: 'var(--lh-relaxed)' }}
                  >
                    {s.note}
                  </p>
                )}
              </li>
            )
          })}
          <li style={{ borderTop: '1px solid var(--hm-rule)' }} />
        </ol>

        {/* 到场之后 */}
        <div className="mt-20">
          <h2
            className="display text-ink"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            到场之后
          </h2>
          <p className="mt-2 text-sm text-muted" style={{ maxWidth: '36ch' }}>
            前两件在手机上就能做完，后三件从你进门那一刻开始算。
          </p>

          <ol className="mt-8">
            {flow.map((f, i) => (
              <li
                key={f.t}
                className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[5.5rem_1fr]"
                style={{ borderTop: '1px solid var(--hm-rule)' }}
              >
                <span
                  className="font-mono text-sm"
                  style={{
                    color: f.online ? 'var(--hm-muted)' : 'var(--hm-accent-line)',
                  }}
                >
                  {f.time}
                </span>
                <span>
                  <span className="display text-lg text-ink">
                    <span className="meta mr-3 text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {f.t}
                  </span>
                  <span
                    className="mt-1 block text-md text-ink-2"
                    style={{ maxWidth: '46ch', lineHeight: 'var(--lh-relaxed)' }}
                  >
                    {f.d}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Cta label={page.cta} done="时段留好了" />
          <span className="text-sm text-muted">
            每个时段限六十人。进池前先看一眼门口的流程牌。
          </span>
        </div>
      </div>
    </main>
  )
}
