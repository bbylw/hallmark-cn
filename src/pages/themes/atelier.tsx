import type { ThemePage } from '../../data/pages'

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
    <picture className="block">
      <source srcSet={`/examples/${slug}.webp`} type="image/webp" />
      <img
        src={`/examples/${slug}.jpg`}
        alt={alt}
        width={1440}
        height={wide ? 960 : 2160}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        className={`${ratio} w-full object-cover`}
      />
    </picture>
  )
}

/**
 * 时装屋。宏观结构是「影像主导」：
 * 每一屏由一张巨幅图片统治，文字只是注解。
 *
 * 四张图的位置就是版式本身（首图 / 标题偏栏 / 双联竖幅 / 细节通栏），
 * 所以版式写在页面里，文件从数据的 images 按顺序取，只有一处来源。
 */
export function AtelierPage({ page }: { page: ThemePage }) {
  const wrap = 'mx-auto px-[var(--page-gutter)]'
  const [hero, lookA, lookB, detail] = page.images ?? []

  const LOOKS = [
    {
      slug: lookA,
      look: 'look 04',
      cap: '米色羊毛大衣，肩线放松，袖口翻过一道。',
      alt: '模特穿着米色羊毛大衣，四分之三侧身站在石灰墙前',
    },
    {
      slug: lookB,
      look: 'look 11',
      cap: '煤灰羊绒长外套，站在旧玻璃房的钢架前。',
      alt: '模特穿着煤灰色羊绒长外套，站在锈蚀钢架前回头',
    },
  ].filter((l) => l.slug)

  return (
    <main id="main" className="pb-24 pt-8">
      {/* 第一折：整屏就是这张图 */}
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
            {/* 右侧原本写的是「昂热 · 旧玻璃房 · 早七点」，和左边的导语
                说的是同一件事。改标注照片里的两件衣服，这才是时装页的图注。 */}
            <span className="meta text-muted">
              左 深灰羊毛大衣 · 右 米白双面羊绒
            </span>
          </figcaption>
        </figure>
      )}

      {/* 标题偏到第四栏。h1 是这一季，品牌只在上方做小注 —— 
          导航里已经有一次「Maison Verel」，h1 再来一次就是重复 */}
      <div
        className={`${wrap} mt-20`}
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-4">
            <span className="meta text-muted">{page.brand}</span>
            <h1
              className="display mt-3 text-ink"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.25rem)', lineHeight: 1.06 }}
            >
              {page.title}
            </h1>
            <p
              className="mt-7 text-md text-ink-2"
              style={{ maxWidth: '38ch', lineHeight: 'var(--lh-relaxed)' }}
            >
              十九套衣服，三个尺码。肩线全部手工绷过，翻过来能看到针脚。
              发布之后接受私人看样，一次两位。
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

      {/* 双联竖幅，保持 2:3 原比例 */}
      {LOOKS.length > 0 && (
        <div
          className={`${wrap} mt-20`}
          style={{ maxWidth: 'var(--page-max)' }}
        >
          <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2">
            {LOOKS.map((l) => (
              <figure key={l.slug}>
                <Shot
                  slug={l.slug!}
                  wide={false}
                  ratio="aspect-[2/3]"
                  alt={l.alt}
                />
                <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                  <span className="meta text-muted">{l.look}</span>
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
        className={`${wrap} mt-16 flex flex-wrap items-baseline gap-x-8 gap-y-3`}
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <a
          href="#main"
          className="display border-b-2 pb-1 text-xl text-ink transition-colors duration-200 hover:text-accent-line"
          style={{ borderColor: 'var(--hm-accent)' }}
        >
          {page.cta}
        </a>
        <span className="text-sm text-muted">
          巴黎，三月。需要提前登记，不接受当天到场。
        </span>
      </div>
    </main>
  )
}
