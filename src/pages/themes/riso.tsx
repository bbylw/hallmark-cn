import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 孔版印刷展。装置：两层错位的套印，拖一下看纸是怎么跑的。
 * 标题用粗无衬线，正文用衬线 —— 这正是孔版印刷品的字面习惯。
 */
export function RisoPage({ page }: { page: ThemePage }) {
  const [off, setOff] = useState(7)
  const items = page.items ?? []

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-12">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 对开：标题 / 套印 */}
        <div className="grid items-center gap-x-12 gap-y-12 lg:grid-cols-2">
          <div>
            <span className="meta text-accent-line">{page.discipline}</span>
            <h1
              className="display mt-4 text-ink"
              style={{
                fontSize: 'clamp(2.25rem, 5.2vw, 3.5rem)',
                lineHeight: 1.04,
              }}
            >
              {page.title}
            </h1>
            <p
              className="mt-6 text-ink-2"
              style={{ fontSize: '1.125rem', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
            {/* 主行动放在对开的左列。之前这里是一列「纸/机/墨」，
                和下面 02/03 两条说的是同一件事，还多了一条数据里没有的「墨」 */}
            <div className="mt-10">
              <Cta label={page.cta} done="报名表发你了" />
            </div>
          </div>

          <div>
            <div
              className="relative aspect-[5/4] w-full overflow-hidden"
              style={{
                backgroundColor: 'var(--hm-paper-2)',
                borderRadius: 'var(--hm-radius-card)',
                border: 'var(--hm-rule-card) solid var(--hm-rule)',
              }}
            >
              {[
                { c: 'oklch(50% 0.19 220)', dx: off, dy: -off / 2 },
                { c: 'oklch(50% 0.22 25)', dx: -off, dy: off / 2 },
              ].map((layer, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute inset-0 grid place-items-center"
                  style={{
                    color: layer.c,
                    transform: `translate(${layer.dx}px, ${layer.dy}px)`,
                    mixBlendMode: 'multiply',
                  }}
                >
                  <span
                    className="display"
                    style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
                  >
                    OFF
                  </span>
                </span>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="meta text-muted">走纸偏差 {off} 毫米</span>
              <input
                type="range"
                min={0}
                max={18}
                value={off}
                onChange={(e) => setOff(Number(e.target.value))}
                className="mt-3 w-full"
                aria-label="调整套印错位量"
              />
            </label>
            <p className="mt-2 text-xs text-muted">
              零的时候两层重合，是这个字本来该有的样子。往右拖，就是纸跑掉之后的样子。
            </p>
          </div>
        </div>

        {/* 对开条目，左右交替 */}
        <div className="mt-20">
          {items.map((it, i) => (
            <div
              key={it.v}
              className="grid items-center gap-x-12 gap-y-6 py-10 lg:grid-cols-2"
              style={{ borderTop: '1px solid var(--hm-rule)' }}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="meta text-accent-line">{it.k}</div>
                <div
                  className="display mt-2 text-ink"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    lineHeight: 1.1,
                  }}
                >
                  {it.v}
                </div>
                <p
                  className="mt-2 text-sm text-muted"
                  style={{ lineHeight: 'var(--lh-relaxed)' }}
                >
                  {it.d}
                </p>
              </div>
              <div
                className={`flex items-center gap-4 ${i % 2 === 1 ? 'lg:order-1' : ''}`}
                aria-hidden
              >
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: 'var(--hm-rule)' }}
                />
                <span
                  className="display"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    lineHeight: 0.9,
                    color: 'transparent',
                    WebkitTextStroke: `2px ${
                      i % 2 === 1 ? 'oklch(50% 0.19 220)' : 'oklch(50% 0.22 25)'
                    }`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
