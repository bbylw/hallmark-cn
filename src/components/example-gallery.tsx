import { ArrowUpRight } from '@phosphor-icons/react'
import { examples } from '../data/examples'
import { Reveal } from './ui/reveal'

export function ExampleGallery() {
  return (
    <section
      id="work"
      className="mx-auto px-[var(--page-gutter)] py-24 sm:py-28"
      style={{ maxWidth: 'var(--page-max)' }}
    >
      <Reveal>
        <h2
          className="display text-ink"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          不同需求，不同形态
        </h2>
        <p
          className="mt-4 max-w-[54ch] text-md text-ink-2"
          style={{ lineHeight: 'var(--lh-relaxed)' }}
        >
          下面每一页都源自不同的需求：酸面团 App、内容提取 API、唱片厂牌、蜂蜜农场、孔版印刷展。
          该 skill 给每个需求配了不同的主题、结构与工艺，而不是同一套模板换配色。
        </p>
      </Reveal>

      <div className="mt-12 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {examples.map((e, i) => (
          <Reveal key={e.slug} delay={Math.min(i * 0.03, 0.3)}>
            <figure>
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden"
                style={{
                  borderRadius: 'var(--hm-radius-card)',
                  border: 'var(--hm-rule-card) solid var(--hm-rule)',
                }}
              >
                <picture>
                  <source
                    srcSet={`/examples/${e.slug}.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`/examples/${e.slug}.jpg`}
                    alt={`${e.name} 首页，${e.category}`}
                    width={960}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </picture>
              </a>
              <figcaption className="mt-3 flex items-baseline gap-2">
                <span className="truncate text-sm text-ink">{e.name}</span>
                <ArrowUpRight
                  size={13}
                  weight="bold"
                  className="shrink-0 text-muted"
                  aria-hidden
                />
                <span className="meta ml-auto shrink-0 text-muted">
                  {e.theme ?? e.category}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
