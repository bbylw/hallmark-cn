import { useState } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

const FACTS = [
  ['页数', '148 页 · 全胶装加固'],
  ['开本', '185 × 260 mm 经典季刊开本'],
  ['印数', '限定 3,000 册 · 独立编号'],
  ['出版', '三月 / 六月 / 九月 / 十二月'],
  ['用纸', '内文 90g 纯质樱花纸 · 封面 240g 丝绒特种卡'],
]

const COLUMNS = [
  ['年度订阅', '一年四本，不接广告。寄到手上之前绝不会先上网，享受独家纸本专属特权。'],
  ['实体零售', '全国精选独立书店和美术馆书店同步上架，亦支持在本官网直接单本购藏。'],
  ['自由投稿', '写清楚你要讲的那件事，以及为什么是你来讲。双月审核，每投必复。'],
]

interface ExcerptInfo {
  author: string
  readingTime: string
  lead: string
}

const ARTICLE_EXCERPTS: Record<string, ExcerptInfo> = {
  default: {
    author: '本期特约编辑部',
    readingTime: '约需阅读 9 分钟',
    lead: '当工业标准把每一块砖削成同样的直角，我们开始在旧墙皮脱落的缝隙里寻找属于人的呼吸。这不仅是一次空间考察，而是一次对被遗忘工艺的招魂。',
  },
}

/** 刊内页码。按条目序号算，接口改动时不用手改。 */
const pageNo = (i: number) => `p.${String(12 + i * 17).padStart(3, '0')}`

/**
 * 季刊目录。宏观结构是「索引优先」，所以索引本身要有入口，不能是平的一片：
 *   本期专题（一条，单独成块，字号最大）
 *   目录（其余文章，编号 + 前导点线 + 页码 + 互动摘录）
 *   固定（版权这类常设页，不编号、弱化）
 */
export function EditorialPage({ page }: { page: ThemePage }) {
  const all = page.items ?? []
  const feature = all[0]
  const standing = all[all.length - 1]
  const articles = all.slice(1, -1)

  const [activeArticle, setActiveArticle] = useState<string | null>(feature?.v ?? null)

  return (
    <main id="main" className="px-[var(--page-gutter)] pb-24 pt-10 sm:pt-14">
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
        
        {/* 刊头 */}
        <header
          className="flex flex-wrap items-end justify-between gap-6 pb-6"
          style={{ borderBottom: '2px solid var(--hm-ink)' }}
        >
          <div>
            <span className="meta font-mono font-bold text-accent-line">
              QUARTERLY LITERARY & VISUAL REVIEW · ISSUE 28
            </span>
            <h1
              className="display mt-2 text-ink font-bold"
              style={{ fontSize: 'clamp(2.25rem, 5.4vw, 3.75rem)', lineHeight: 1.08 }}
            >
              {page.title}
            </h1>
          </div>
          <p
            className="max-w-[34ch] text-sm text-ink-2"
            style={{ lineHeight: 'var(--lh-relaxed)' }}
          >
            {page.standfirst}
          </p>
        </header>

        <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* 本期专题 */}
            {feature && (
              <section aria-labelledby="feature">
                <div
                  className="flex flex-wrap items-baseline justify-between gap-4 pb-3"
                  style={{ borderBottom: '2px solid var(--hm-ink)' }}
                >
                  <h2 id="feature" className="meta font-mono font-bold text-ink">
                    本期封面特辑 · FEATURE STORY
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {pageNo(0)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArticle(feature.v)}
                  className="group block w-full py-6 text-left transition-colors"
                >
                  <span
                    className="display block text-ink transition-colors duration-200 ease-out group-hover:text-accent-line font-bold"
                    style={{
                      fontSize: 'clamp(1.6rem, 3.6vw, 2.6rem)',
                      lineHeight: 1.1,
                    }}
                  >
                    {feature.v}
                  </span>
                  <span className="mt-2 block text-sm text-muted" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                    {feature.d}
                  </span>
                </button>
              </section>
            )}

            {/* 核心互动装置：版芯速读摘录面板 */}
            {activeArticle && (
              <div className="my-8 rounded-lg border border-rule bg-paper/70 p-5 sm:p-6 transition-all duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
                  <div className="flex items-center gap-2">
                    <span className="meta font-mono font-bold text-accent-line">EXCERPT</span>
                    <span className="font-mono text-xs text-muted">· {ARTICLE_EXCERPTS.default.readingTime}</span>
                  </div>
                  <span className="meta text-xs text-muted font-mono">{ARTICLE_EXCERPTS.default.author}</span>
                </div>
                <blockquote className="mt-4 text-sm text-ink-2" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                  “{ARTICLE_EXCERPTS.default.lead}”
                </blockquote>
                <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted">
                  <span>排印：Newsreader 16pt / 28pt 行距</span>
                  <span>随刊附赠丝网藏书票一枚</span>
                </div>
              </div>
            )}

            {/* 目录 */}
            <section aria-labelledby="contents" className="mt-10">
              <h2 id="contents" className="meta font-mono font-bold text-muted">
                本期篇目目录 · CONTENTS
              </h2>
              <ul className="mt-3">
                {articles.map((it, i) => {
                  const no = i + 2
                  const at = all.indexOf(it)
                  const isSelected = activeArticle === it.v
                  return (
                    <li key={it.v}>
                      <button
                        type="button"
                        onClick={() => setActiveArticle(it.v)}
                        className={`group flex w-full items-baseline gap-4 py-3.5 text-left transition-colors ${
                          isSelected ? 'bg-ink/5 pl-2 rounded' : 'hover:pl-1'
                        }`}
                        style={{
                          borderBottom: 'var(--hm-rule-card) solid var(--hm-rule)',
                        }}
                      >
                        <span className="meta w-8 shrink-0 font-mono text-muted">
                          {String(no).padStart(2, '0')}
                        </span>
                        <span className="meta w-14 shrink-0 font-mono font-bold text-accent-line">
                          {it.k}
                        </span>
                        <span className="min-w-0">
                          <span
                            className="display block text-ink transition-all duration-200 ease-out group-hover:text-accent-line font-medium"
                            style={{
                              fontSize: 'clamp(1.15rem, 2.1vw, 1.5rem)',
                              lineHeight: 1.18,
                            }}
                          >
                            {it.v}
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {it.d}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="mx-2 hidden min-w-6 flex-1 translate-y-[-0.3em] sm:block"
                          style={{ borderBottom: '1px dotted var(--hm-rule-2)' }}
                        />
                        <span className="ml-auto shrink-0 font-mono text-xs text-muted sm:ml-0">
                          {pageNo(at)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            {/* 常设页 */}
            {standing && (
              <div
                className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 text-muted"
                style={{ borderTop: '1px solid var(--hm-rule)' }}
              >
                <span className="meta font-mono font-bold">固定常设</span>
                <span className="meta">{standing.k}</span>
                <span className="text-sm">{standing.v}</span>
                <span
                  aria-hidden
                  className="mx-2 hidden min-w-6 flex-1 translate-y-[-0.3em] sm:block"
                  style={{ borderBottom: '1px dotted var(--hm-rule-2)' }}
                />
                <span className="ml-auto shrink-0 font-mono text-xs sm:ml-0">
                  {pageNo(all.length - 1)}
                </span>
              </div>
            )}
          </div>

          {/* 版本出版信息 */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24 rounded-lg border border-rule bg-paper/50 p-5">
              <div className="flex items-center justify-between border-b border-rule pb-2">
                <span className="meta font-mono font-bold text-ink">本期物态参数</span>
                <span className="font-mono text-[10px] text-muted">COLOPHON</span>
              </div>
              <dl className="mt-4 divide-y divide-rule">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="py-2.5">
                    <dt className="meta text-muted">{k}</dt>
                    <dd className="mt-1 font-mono text-xs text-ink-2 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6">
                <Cta label={page.cta} done="订阅已确认，新刊出厂即寄" />
              </div>
            </div>
          </aside>
        </div>

        {/* 底部三大支柱 */}
        <div className="mt-20 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          {COLUMNS.map(([k, d]) => (
            <div
              key={k}
              className="pt-4"
              style={{ borderTop: '2px solid var(--hm-ink)' }}
            >
              <div className="meta font-mono font-bold text-ink">{k}</div>
              <p
                className="mt-2 text-sm text-ink-2"
                style={{ maxWidth: '34ch', lineHeight: 'var(--lh-relaxed)' }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
