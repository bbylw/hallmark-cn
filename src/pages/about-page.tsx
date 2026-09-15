import { ExampleGallery } from '../components/example-gallery'
import { Footer } from '../components/footer'
import { MacroRail } from '../components/macro-rail'
import { Reveal } from '../components/ui/reveal'
import { SiteNav } from '../components/site-nav'
import { useThemeAttr } from '../theme-attr'

const SPEC = [
  ['来源文档', '根目录 README.md', 'Hallmark 官方中文说明，未改动'],
  ['主题色值', 'site/css/tokens.css', '21 套 OKLCH、字体、圆角逐条照搬'],
  ['宏观结构', 'references/macrostructures.md', '21 种，一页一种'],
  ['关卡编号', 'references/slop-test.md', 'gate 19 / 34 / 46 / 47 / 48 等'],
  ['案例截图', 'docs/screenshots', '14 张，压成 webp 留 jpg 兜底'],
  ['技术栈', 'Vite 8 · React 19 · TS 7 · Tailwind 4', 'Motion 13，Bun 管依赖'],
]

/** 关于页做成书末版权页：左边是散文，右边是等宽规格表，中间一条竖线。 */
export function AboutPage() {
  useThemeAttr('almanac')

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteNav />
      <main
        id="main"
        className="mx-auto px-[var(--page-gutter)] py-20 sm:py-24"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <Reveal>
          <div className="meta text-muted">colophon</div>
          <h1
            className="display mt-2 text-ink"
            style={{ fontSize: 'var(--text-display)' }}
          >
            关于这个站
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div
            className="lg:col-span-6 lg:border-r lg:pr-12"
            style={{ borderColor: 'var(--hm-rule)' }}
          >
            <Reveal>
              <p
                className="text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                这是一个用来展示 Hallmark 的站。它没有把 21 套主题塞进一个下拉菜单里切换，
                而是给每一套都做了一个真的页面：独立 URL、各自的虚构需求、各自的写法。
              </p>
              <p
                className="mt-5 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                每页换的不只是颜色。标题放在哪、正文怎么组织、分隔线用什么语言、
                按钮怎么说话、导航和页脚长什么样，全都不同。每页还带一个只属于它的装置，
                比如种苗目录用的是一条耐寒温度轴，孔版印刷展可以拖着看套印错位，
                可变字体那一页拖滑块时字重和圆头半径会一起走。
              </p>
            </Reveal>

            <Reveal className="mt-12" delay={0.05}>
              <h2
                className="display text-ink"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                为什么不做切换器
              </h2>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                切换器换的只有配色，结构没动，看不出 Hallmark 真正在做的事。
                Hallmark 的区别是「两个需求长出两个不同的站点」，那就得真的是两个站点。
              </p>
            </Reveal>

            <Reveal className="mt-12" delay={0.08}>
              <h2
                className="display text-ink"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                验收
              </h2>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                <code className="font-mono text-sm">bun run verify</code>{' '}
                会起静态服务并用本机 Chrome 把 24 条路由逐页跑一遍：对比度、横向溢出、
                控件折行、图片加载、控制台报错、h1 唯一，以及 reduced-motion 下的可见性。
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.05}>
              <div className="meta text-muted">数据从哪来</div>
              <dl className="mt-4">
                {SPEC.map(([k, v, d]) => (
                  <div
                    key={k}
                    className="hairline grid gap-x-4 py-4 sm:grid-cols-[7rem_1fr]"
                  >
                    <dt className="font-mono text-xs text-muted">{k}</dt>
                    <dd>
                      <span className="block text-sm text-ink">{v}</span>
                      <span className="mt-1 block text-xs text-muted">{d}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="mt-12" delay={0.08}>
              <div className="meta text-muted">页 数</div>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-8 gap-y-3">
                {[
                  ['21', '主题页'],
                  ['1', '索引页'],
                  ['1', '关于页'],
                  ['1', 'Custom 分支页'],
                ].map(([n, label]) => (
                  <span key={label} className="flex items-baseline gap-2">
                    <span className="display text-3xl text-ink">{n}</span>
                    <span className="text-sm text-muted">{label}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="hairline mt-20">
          <MacroRail />
        </div>
        <div className="hairline">
          <ExampleGallery />
        </div>
      </main>
      <Footer />
    </div>
  )
}
