import { ArrowUpRight } from '@phosphor-icons/react'
import { examples } from '../data/examples'
import { Reveal } from './ui/reveal'

/**
 * 案例展示画廊：
 * 呈现 14 个真实需求长出来的不同站点形态。
 * 严格遵循 Gate 50 (带图网格轨道使用 minmax(0, 1fr)) 与 Gate 49 (防文字折行)。
 */
export function ExampleGallery() {
  return (
    <section
      id="work"
      className="mx-auto px-[var(--page-gutter)] py-20 sm:py-24"
      style={{ maxWidth: 'var(--page-max)' }}
    >
      <Reveal>
        <div className="meta text-accent-line">Case Studies · 真实案例画廊</div>
        <h2
          className="display mt-1 text-ink"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          不同需求，不同形态
        </h2>
        <p
          className="mt-3 max-w-[54ch] text-md text-ink-2"
          style={{ lineHeight: 'var(--lh-relaxed)' }}
        >
          每一页源自不同的真实需求：酸面团 App、内容提取 API、唱片厂牌、蜂蜜农场、孔版印刷展、卧铺火车票。
          为每个需求定制专属骨架与调色，坚决不套模板。
        </p>
      </Reveal>

      {/* 使用 minmax(0, 1fr) 严密防护 Gate 50 */}
      <div
        className="mt-10 grid gap-x-5 gap-y-8"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 17rem), 1fr))',
        }}
      >
        {examples.map((e, i) => (
          <Reveal key={e.slug} delay={Math.min(i * 0.03, 0.25)}>
            <figure className="group">
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden transition-all duration-300 group-hover:shadow-md focus-visible:outline-2 focus-visible:outline-(--hm-focus)"
                style={{
                  borderRadius: 'var(--hm-radius-card)',
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                  backgroundColor: 'var(--hm-paper-2)',
                }}
                aria-label={`在新窗口打开查看 ${e.name} 真实案例（${e.category}）`}
              >
                <picture>
                  <source
                    srcSet={`/examples/${e.slug}.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`/examples/${e.slug}.jpg`}
                    alt={`${e.name} 首页视觉，体裁为 ${e.category}`}
                    width={960}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </picture>
              </a>
              <figcaption className="mt-3 flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-sm text-ink group-hover:text-accent-line transition-colors">
                  {e.name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="meta text-muted">
                    {e.theme ?? e.category}
                  </span>
                  <ArrowUpRight
                    size={13}
                    weight="bold"
                    className="text-muted group-hover:text-ink transition-colors"
                    aria-hidden
                  />
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
