import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 一张图。宽高按文件真实像素写，比例由 class 钉死，
 * 这样图没到时也不会跳版。webp 优先，jpg 兜底。
 */
function Shot({
  slug,
  alt,
  ratio,
  wide,
  eager,
}: {
  slug: string
  alt: string
  /** 例如 aspect-[3/2] */
  ratio: string
  /** 横幅还是竖幅，决定宽高属性的写法 */
  wide: boolean
  eager?: boolean
}) {
  return (
    <picture className="block min-w-0 overflow-hidden">
      <source srcSet={`/examples/${slug}.webp`} type="image/webp" />
      <img
        src={`/examples/${slug}.jpg`}
        alt={alt}
        width={1440}
        height={wide ? 960 : 2160}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        className={`${ratio} w-full min-w-0 object-cover transition-transform duration-500 hover:scale-[1.01]`}
      />
    </picture>
  )
}

/**
 * 时装屋。宏观结构是「影像主导」：
 * 每一屏由一张巨幅图片统治，文字只是注解。
 * 四张图的位置就是版式本身（首图 / 标题偏栏 / 双联竖幅 / 细节通栏）。
 */
export function AtelierPage({ page }: { page: ThemePage }) {
  const wrap = 'mx-auto px-[var(--page-gutter)]'
  const [hero, lookA, lookB, detail] = page.images ?? []
  const [selectedFabric, setSelectedFabric] = useState<'wool' | 'cashmere' | 'silk'>('cashmere')

  const FABRIC_SPECS = {
    cashmere: {
      name: '180 支双面阿尔卑斯羊绒',
      weight: '580g/m²',
      origin: '意大利比耶拉 (Biella) 传统水车工坊',
      hand: '骨架挺括，内里绒感细腻，不施化学软化剂',
    },
    wool: {
      name: '密织高捻美利奴羊毛',
      weight: '640g/m²',
      origin: '托斯卡纳手工粗纺织造',
      hand: '抗风保暖，手工绷肩留出天然延展裕度',
    },
    silk: {
      name: '重磅铜氨丝混纺里布',
      weight: '160g/m²',
      origin: '日本旭化成定制素色织物',
      hand: '丝滑亲肤，静电极低，随身体温度呼吸',
    },
  }

  const LOOKS = [
    {
      slug: lookA,
      look: 'LOOK 04',
      cap: '米色羊毛大衣，肩线放松，袖口翻过一道。',
      alt: '模特穿着米色羊毛大衣，四分之三侧身站在石灰墙前',
    },
    {
      slug: lookB,
      look: 'LOOK 11',
      cap: '煤灰羊绒长外套，站在旧玻璃房的钢架前。',
      alt: '模特穿着煤灰色羊绒长外套，站在锈蚀钢架前回头',
    },
  ].filter((l) => l.slug)

  return (
    <main id="main" className="pb-24 pt-8">
      {/* 第一折：整屏巨图 */}
      {hero && (
        <figure>
          <Shot
            slug={hero}
            eager
            wide
            ratio="aspect-[3/2]"
            alt="清晨的玻璃温室里，两位模特穿着廓形羊毛大衣站在盆栽之间"
          />
          <figcaption
            className={`${wrap} mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2`}
            style={{ maxWidth: 'var(--page-max)' }}
          >
            <span className="text-sm text-muted">{page.standfirst}</span>
            <span className="meta text-muted">
              左 深灰羊毛大衣 · 右 米白双面羊绒
            </span>
          </figcaption>
        </figure>
      )}

      {/* 标题偏到第四栏。h1 是这一季，品牌只在上方做小注 */}
      <div
        className={`${wrap} mt-20`}
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-4">
            <span className="meta font-mono font-bold text-accent-line">
              {page.brand} · AUTUMN / WINTER 2026
            </span>
            <h1
              className="display mt-3 text-ink"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.25rem)', lineHeight: 1.08 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-7 text-md text-ink-2"
              style={{ maxWidth: '38ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              十九套衣服，三个尺码。肩线全部手工绷过，翻过来能看到针脚。
              发布之后接受私人看样，一次仅接待两位。
            </p>
          </div>

          <dl className="lg:col-span-3 lg:col-start-10">
            {(page.items ?? []).map((it) => (
              <div
                key={it.v}
                className="py-4"
                style={{ borderTop: 'var(--hm-rule-card) solid var(--hm-rule)' }}
              >
                <dt className="meta text-muted">{it.k}</dt>
                <dd className="mt-1.5">
                  <span className="display block text-lg text-ink">
                    {it.v}
                  </span>
                  <span className="mt-1 block text-xs text-muted">{it.d}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 双联竖幅，保持 2:3 原比例，采用 minmax(0, 1fr) 防御 Gate 50 */}
      {LOOKS.length > 0 && (
        <div
          className={`${wrap} mt-20`}
          style={{ maxWidth: 'var(--page-max)' }}
        >
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
            {LOOKS.map((l) => (
              <figure key={l.slug} className="min-w-0">
                <Shot
                  slug={l.slug!}
                  wide={false}
                  ratio="aspect-[2/3]"
                  alt={l.alt}
                />
                <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                  <span className="meta font-mono font-bold text-ink">{l.look}</span>
                  <span
                    className="text-sm text-muted"
                    style={{ maxWidth: '34ch' }}
                  >
                    {l.cap}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* 专属互动装置：面料触感与裁缝手记 */}
      <div
        className={`${wrap} mt-20`}
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="rounded-lg border border-rule bg-paper/60 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
            <div>
              <span className="meta text-accent-line">装置 · 面料与工艺档案</span>
              <h2 className="display text-xl text-ink">FABRIC & TAILORING SPEC</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedFabric('cashmere')}
                className={`min-h-[36px] rounded px-3 py-1.5 font-mono text-xs transition-all ${
                  selectedFabric === 'cashmere'
                    ? 'bg-ink text-paper ring-2 ring-accent-line'
                    : 'border border-rule bg-paper text-ink-2 hover:border-ink'
                }`}
                aria-pressed={selectedFabric === 'cashmere'}
              >
                双面羊绒
              </button>
              <button
                type="button"
                onClick={() => setSelectedFabric('wool')}
                className={`min-h-[36px] rounded px-3 py-1.5 font-mono text-xs transition-all ${
                  selectedFabric === 'wool'
                    ? 'bg-ink text-paper ring-2 ring-accent-line'
                    : 'border border-rule bg-paper text-ink-2 hover:border-ink'
                }`}
                aria-pressed={selectedFabric === 'wool'}
              >
                美利奴羊毛
              </button>
              <button
                type="button"
                onClick={() => setSelectedFabric('silk')}
                className={`min-h-[36px] rounded px-3 py-1.5 font-mono text-xs transition-all ${
                  selectedFabric === 'silk'
                    ? 'bg-ink text-paper ring-2 ring-accent-line'
                    : 'border border-rule bg-paper text-ink-2 hover:border-ink'
                }`}
                aria-pressed={selectedFabric === 'silk'}
              >
                铜氨丝里布
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <span className="meta text-muted">材质规格</span>
              <div className="mt-1 font-mono text-sm font-bold text-ink">
                {FABRIC_SPECS[selectedFabric].name}
              </div>
              <div className="mt-1 font-mono text-xs text-muted">
                克重：{FABRIC_SPECS[selectedFabric].weight}
              </div>
            </div>
            <div>
              <span className="meta text-muted">产地来源</span>
              <div className="mt-1 text-sm text-ink-2">
                {FABRIC_SPECS[selectedFabric].origin}
              </div>
            </div>
            <div>
              <span className="meta text-muted">成衣手感与剪裁</span>
              <div className="mt-1 text-sm text-ink-2">
                {FABRIC_SPECS[selectedFabric].hand}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 细节通栏 */}
      {detail && (
        <figure className="mt-20">
          <Shot
            slug={detail}
            wide
            ratio="aspect-[3/2]"
            alt="旧木工作台上叠放的羊毛与羊绒面料，能看到手工缝线"
          />
          <figcaption
            className={`${wrap} mt-3 text-sm text-muted`}
            style={{ maxWidth: 'var(--page-max)' }}
          >
            面料来自三家意大利厂：羊毛、羊绒、铜氨丝。绷肩用的是同一批线。
          </figcaption>
        </figure>
      )}

      <div
        className={`${wrap} mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4`}
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="flex items-center gap-4">
          <Cta label={page.cta} done="看样席位已锁定" />
          <span className="text-sm text-muted">
            巴黎 · 三月。需要提前登记，不接受当天临时到场。
          </span>
        </div>
        <div className="font-mono text-xs text-muted">
          INVITATION CODE #MV-2026
        </div>
      </div>
    </main>
  )
}
