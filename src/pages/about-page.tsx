import { ExampleGallery } from '../components/example-gallery'
import { Footer } from '../components/footer'
import { MacroRail } from '../components/macro-rail'
import { Reveal } from '../components/ui/reveal'
import { SiteNav } from '../components/site-nav'
import { useThemeAttr } from '../theme-attr'

const SPEC = [
  ['来源文档', '根目录 README.md', 'Hallmark 官方中文说明，原味呈现'],
  ['主题色值', 'site/css/tokens.css', '21 套 OKLCH、字体、圆角逐条精准复现'],
  ['宏观结构', 'references/macrostructures.md', '21 种骨架，一页一种独立形态'],
  ['检验关卡', 'references/slop-test.md', '58 道硬核关卡（含 gate 38a / 54 / 55 / 56 / 57）'],
  ['案例截图', 'docs/screenshots', '14 张高清样张，压成 webp 并留 jpg 兜底'],
  ['技术栈', 'Vite 8 · React 19 · TS 7 · Tailwind 4', 'Motion 13，Bun 驱动依赖'],
  ['字体矩阵', 'Fontsource Variable Fonts', 'Newsreader, Archivo, Fraunces, JetBrains Mono 等'],
]

/**
 * 关于页（02/24）：
 * 宏观结构采用 Long Document / Colophon（出版物末尾技术规格与版权页）。
 * 左侧为设计哲学论述与验收规范，右侧为等宽技术矩阵与统计总览，中间贯穿发丝分割线。
 */
export function AboutPage() {
  useThemeAttr('almanac')

  return (
    <div className="min-h-dvh bg-paper">
      <SiteNav />
      <main
        id="main"
        className="mx-auto px-(--page-gutter) py-16 sm:py-24"
        style={{ maxWidth: 'var(--page-max)' }}
      >
        <Reveal>
          <div className="meta text-accent-line">Colophon · 出版版权页与技术规范</div>
          <h1
            className="display mt-2 text-ink"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.06,
              letterSpacing: 'var(--hm-tracking-display)',
            }}
          >
            关于这个站
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* 左栏：哲学与验收 */}
          <div
            className="lg:col-span-6 lg:border-r lg:pr-12"
            style={{ borderColor: 'var(--hm-rule)' }}
          >
            <Reveal>
              <p
                className="text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                这是一个用来展示 Hallmark 设计哲学的站。它没有把 21 套主题塞进一个下拉菜单里敷衍切换，
                而是给每一套都做了一个真的页面：独立 URL、各自的虚构需求、各自的写法与专属交互装置。
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
                为什么不做简单配色切换器
              </h2>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                切换器换的只有配色，结构没动，看不出 Hallmark 真正在做的事。
                Hallmark 的区别是「两个需求长出两个完全不同的站点」，那就必须真的是两个站点。
              </p>
            </Reveal>

            <Reveal className="mt-12" delay={0.08}>
              <h2
                className="display text-ink"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                验收与品质底线
              </h2>
              <p
                className="mt-4 text-md text-ink-2"
                style={{ lineHeight: 'var(--lh-relaxed)' }}
              >
                <code className="rounded bg-paper-3 px-1.5 py-0.5 font-mono text-xs text-ink">
                  npm run verify
                </code>{' '}
                会启动真实环境将 24 条独立路由逐页跑一遍：WCAG 对比度、横向溢出、
                控件折行、图片加载、控制台报错、单一 h1 语义层级，以及 reduced-motion 下的可访问性。
              </p>
            </Reveal>
          </div>

          {/* 右栏：技术规格表 */}
          <div className="lg:col-span-6">
            <Reveal delay={0.05}>
              <div className="meta text-muted">技术规格 · Spec Matrix</div>
              <dl className="mt-4">
                {SPEC.map(([k, v, d]) => (
                  <div
                    key={k}
                    className="hairline grid gap-x-4 py-4 sm:grid-cols-[7.5rem_1fr]"
                  >
                    <dt className="font-mono text-xs font-semibold text-accent-line">
                      {k}
                    </dt>
                    <dd>
                      <span className="block text-sm text-ink">{v}</span>
                      <span className="mt-1 block text-xs text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                        {d}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="mt-12" delay={0.08}>
              <div className="meta text-muted">全站页面规模</div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-8 gap-y-4">
                {[
                  ['21', '主题独立展台'],
                  ['1', '工作台索引页'],
                  ['1', '版权与规格页'],
                  ['1', 'Custom 分支页'],
                ].map(([n, label]) => (
                  <span key={label} className="flex items-baseline gap-2.5">
                    <span className="display text-3xl font-semibold text-ink">
                      {n}
                    </span>
                    <span className="text-xs text-muted">{label}</span>
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
