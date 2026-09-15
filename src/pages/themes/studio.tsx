import { useState } from 'react'
import { Img } from '../../components/archetypes'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 设计工作室。作品网格：九个项目各有一张图，按年份分两层——
 * 最近一年三件用大图，更早的六件用小一号的图。
 *
 * 分层不是装饰：素材本来就该九个项目九张图。
 * 之前数据里只有三张，六个格子只能排字版，看着像漏了图。
 * 主题是 Fraunces 衬线，图注用衬线排客户名，字和图都立得住。
 */
export function StudioPage({ page }: { page: ThemePage }) {
  const [cat, setCat] = useState('全部')

  // 全部从数据推导，一处来源。
  // 之前页面里硬编码了一份，已经和数据漂移了（Ferns / 蜂场 / 工具 都对不上）。
  const work = (page.items ?? []).map((it, slot) => {
    const [type, kind] = it.v.split(' · ')
    return { client: it.k, type, kind, year: it.d ?? '', slot }
  })
  const shots = page.images ?? []
  const shotOf = (slot: number) => shots[slot] ?? null

  const cats = ['全部', ...[...new Set(work.map((w) => w.kind))]]
  const countOf = (c: string) =>
    c === '全部' ? work.length : work.filter((w) => w.kind === c).length

  const shown = work.filter((w) => cat === '全部' || w.kind === cat)
  // 分层的唯一前提是三层列排得满：只有总数能被 3 整除时才分，
  // 否则筛出两件、七件都会留空位。数据按年份倒序，前三个就是最近的。
  const split = shown.length >= 6 && shown.length % 3 === 0 ? 3 : 0
  const featured = shown.slice(0, split)
  const rest = shown.slice(split)

  /** 一条图注。大小两个层级共用，只是字号不同。 */
  const Caption = ({
    w,
    size,
  }: {
    w: (typeof work)[number]
    size: 'lg' | 'sm'
  }) => (
    <figcaption className={size === 'lg' ? 'mt-3' : 'mt-2.5'}>
      <div
        className={`display text-ink ${size === 'lg' ? 'text-lg' : 'text-base'}`}
      >
        {w.client}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
        <span>{w.type}</span>
        <span aria-hidden>·</span>
        <span>{w.kind}</span>
        <span className="meta ml-auto">{w.year}</span>
      </div>
    </figcaption>
  )

  const Tile = ({ w, size }: { w: (typeof work)[number]; size: 'lg' | 'sm' }) => (
    <figure className="group">
      <div
        className="overflow-hidden"
        style={{
          border: '1px solid var(--hm-rule)',
          borderRadius: 'var(--hm-radius-card)',
        }}
      >
        {/* 缩放交给 Img 自己做，这里再叠一层会变成 1.06 倍 */}
        <div
          className={`overflow-hidden ${
            size === 'lg' ? 'aspect-[4/3]' : 'aspect-[16/9]'
          }`}
        >
          <Img slug={shotOf(w.slot) ?? ''} alt={w.client} variant="fill" />
        </div>
      </div>
      <Caption w={w} size={size} />
    </figure>
  )

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <h1
              className="display text-ink"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 3.25rem)', lineHeight: 1.06 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-4 text-md text-ink-2"
              style={{ maxWidth: '38ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              {page.standfirst}
            </p>
            <p className="meta mt-3 text-muted">十四个里，这里放九个。</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className="btn px-3 py-1.5 text-sm"
                style={{
                  backgroundColor: cat === c ? 'var(--hm-cta-bg)' : 'transparent',
                  color: cat === c ? 'var(--hm-cta-fg)' : 'var(--hm-ink-2)',
                  borderColor: cat === c ? 'var(--hm-cta-bg)' : 'var(--hm-rule)',
                }}
              >
                {c}
                <span
                  className="meta ml-2"
                  style={{
                    color: cat === c ? 'var(--hm-cta-fg)' : 'var(--hm-muted)',
                  }}
                >
                  {countOf(c)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 最近一年：大图。sm 起三列，三件刚好一行 */}
        {featured.length > 0 && (
          <div className="mt-14">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="meta text-ink">近期</span>
              <span className="meta text-muted">{featured.length} 件</span>
            </div>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-3">
              {featured.map((w) => (
                <Tile key={w.client} w={w} size="lg" />
              ))}
            </div>
          </div>
        )}

        {/* 更早：小一号的图，六件两行 */}
        {rest.length > 0 && (
          <div className="mt-16">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3"
              style={{ borderBottom: '1.5px solid var(--hm-ink)' }}
            >
              <span className="meta text-ink">
                {featured.length ? '更早' : '全部作品'}
              </span>
              <span className="meta text-muted">{rest.length} 件</span>
            </div>
            <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-3">
              {rest.map((w) => (
                <Tile key={w.client} w={w} size="sm" />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Cta label={page.cta} done="收到，会回你" />
          <span className="text-sm text-muted">
            我们一次只接两个项目，通常提前一个月排。
          </span>
        </div>
      </div>
    </main>
  )
}
