import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const INKS = [
  { name: '青', code: 'C', color: 'oklch(62% 0.18 230)' },
  { name: '品红', code: 'M', color: 'oklch(60% 0.22 340)' },
  { name: '黄', code: 'Y', color: 'oklch(88% 0.18 95)' },
  { name: '黑', code: 'K', color: 'oklch(20% 0.01 255)' },
]

const SPECS = [
  ['纸张', '一百二十克胶版'],
  ['成品', '五百九十四 × 八百四十一'],
  ['印数', '每版三百张'],
  ['装帧', '骑马钉，不覆膜'],
]

const CELL = [
  { span: 'col-span-2 row-span-2', tone: 'accent' },
  { span: 'col-span-2', tone: 'fill' },
  { span: 'col-span-1', tone: 'tint' },
  { span: 'col-span-1', tone: 'tint' },
  { span: 'col-span-2', tone: 'bare' },
  { span: 'col-span-2', tone: 'bare' },
] as const

/**
 * 四色海报节。装置：四色分色条，每一色故意错开，
 * 页面本身就是一张拼版台 —— 大格放主展数字，小格放其余场次，最后两格是现场。
 */
export function GridPage({ page }: { page: ThemePage }) {
  const items = page.items ?? []

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        {/* 分色条 */}
        <div className="flex flex-col gap-[3px]" aria-hidden>
          {INKS.map((s, i) => (
            <div
              key={s.code}
              className="h-[3px]"
              style={{
                backgroundColor: s.color,
                marginLeft: `${i * 7}px`,
                marginRight: `${(INKS.length - 1 - i) * 7}px`,
              }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {INKS.map((s) => (
            <span key={s.code} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5"
                style={{ backgroundColor: s.color }}
              />
              <span className="meta text-muted">
                {s.name} {s.code}
              </span>
            </span>
          ))}
          <span className="meta ml-auto text-muted">只印四色，不许加专色</span>
        </div>

        {/* 标题：第二行缩进 */}
        <h1
          className="display mt-14 text-ink"
          style={{ fontSize: 'clamp(2.5rem, 7.2vw, 5.25rem)', lineHeight: 1.02 }}
        >
          <span className="block">四面墙，</span>
          <span className="block pl-[12%]">三十七张海报</span>
        </h1>

        <div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          {/* 左：场次说明 */}
          <div className="lg:col-span-3">
            <p
              className="text-md text-ink-2"
              style={{ lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
            <div className="mt-8">
              {SPECS.map(([k, v]) => (
                <div
                  key={k}
                  className="py-3"
                  style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
                >
                  <div className="meta text-muted">{k}</div>
                  <div className="mt-1 font-mono text-xs text-ink-2">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Cta label={page.cta} done="已加入购票队列" />
            </div>
          </div>

          {/* 右：拼版 */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 gap-px lg:grid-cols-4" style={{ backgroundColor: 'var(--hm-rule)' }}>
              {items.map((it, i) => {
                const c = CELL[i] ?? CELL[5]
                const accent = c.tone === 'accent'
                return (
                  <div
                    key={it.v}
                    className={`${c.span} flex min-h-[9rem] flex-col justify-between p-5`}
                    style={{
                      backgroundColor: accent
                        ? 'var(--hm-accent)'
                        : c.tone === 'fill'
                          ? 'var(--hm-paper-2)'
                          : c.tone === 'tint'
                            ? 'var(--hm-paper-3)'
                            : 'var(--hm-paper)',
                    }}
                  >
                    <span
                      className="meta"
                      style={{
                        color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-muted)',
                      }}
                    >
                      {it.k}
                    </span>
                    <span>
                      <span
                        className="display block"
                        style={{
                          fontSize: accent
                            ? 'clamp(2rem, 4.6vw, 3.5rem)'
                            : 'var(--text-xl)',
                          lineHeight: 1.05,
                          color: accent ? 'var(--hm-accent-ink)' : 'var(--hm-ink)',
                        }}
                      >
                        {it.v}
                      </span>
                      {it.d ? (
                        <span
                          className="mt-1.5 block text-xs"
                          style={{
                            color: accent
                              ? 'var(--hm-accent-ink)'
                              : 'var(--hm-muted)',
                            opacity: accent ? 0.8 : 1,
                          }}
                        >
                          {it.d}
                        </span>
                      ) : null}
                    </span>
                  </div>
                )
              })}

            </div>
          </div>
        </div>

        {/* 这两张是 Hallmark 生成的示例网页，不是海报，
            混在拼版里既不像海报也没人知道是什么，单独列出来 */}
        {page.images?.length ? (
          <div className="mt-16 grid gap-x-10 gap-y-6 lg:grid-cols-[16rem_1fr]">
            <figcaption>
              <span className="meta text-muted">官方示例</span>
              <p
                className="mt-3 text-sm text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                Hallmark 用这套主题生成的示例页。讲座里讲的「错位的那一毫米」，
                在其中一个示例里就是这么做的。
              </p>
            </figcaption>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.images.slice(0, 2).map((s) => (
                <div
                  key={s}
                  className="overflow-hidden"
                  style={{
                    border: '1px solid var(--hm-rule)',
                    borderRadius: 'var(--hm-radius-card)',
                  }}
                >
                  <Img slug={s} alt={`Hallmark 生成的示例页 ${s}`} variant="fill" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
