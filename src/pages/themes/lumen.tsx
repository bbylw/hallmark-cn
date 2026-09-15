import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Stamp } from '../../components/archetypes'
import { Cta } from './cta'

interface StepDetail {
  step: number
  name: string
  subtitle: string
  tensorIn: string
  tensorOut: string
  guardrail: string
  latency: string
  tokens: string
  confidence: string
}

const STEP_DETAILS: StepDetail[] = [
  {
    step: 1,
    name: '多路并行向量召回',
    subtitle: 'BM25 稀疏检索 + BGE-M3 稠密向量四路并发',
    tensorIn: '原始 Query 嵌入 [1, 1024] + 亿级 HNSW 向量索引',
    tensorOut: '32 条粗排候选文档片段 (Chunks)',
    guardrail: '粗排召回率 Recall@32 > 96.5%',
    latency: '34 ms',
    tokens: '128 Tokens',
    confidence: '98.2%',
  },
  {
    step: 2,
    name: '交叉编码神经重排',
    subtitle: 'Cross-Encoder 全注意力成对打分与冗余去重',
    tensorIn: '32 条候选切片 + 原始问题交互拼接矩阵',
    tensorOut: '精选前 8 条高信息密度关键证据切片',
    guardrail: '相关性得分截断阈值 ≥ 0.74',
    latency: '88 ms',
    tokens: '2,048 Tokens',
    confidence: '95.6%',
  },
  {
    step: 3,
    name: '中间思维草稿生成',
    subtitle: '基于证据事实链的分步推导与假设生成',
    tensorIn: 'Top-8 证据段落 + 结构化约束 Prompt',
    tensorOut: '含证据链锚点的中间态逻辑草稿 (Draft v1)',
    guardrail: '严禁超出证据库的外部臆造断言',
    latency: '620 ms',
    tokens: '1,450 Tokens',
    confidence: '91.8%',
  },
  {
    step: 4,
    name: '反思自检与逻辑回测',
    subtitle: '逐句反向溯源论证，未达标触发重采样回退',
    tensorIn: 'Draft v1 逻辑命题 + 原始证据段落真值表',
    tensorOut: '自检通过凭单，或回退至第二步重新采样',
    guardrail: '逻辑幻觉率严格为 0%，回退重试上限 3 次',
    latency: '310 ms',
    tokens: '780 Tokens',
    confidence: '99.4%',
  },
  {
    step: 5,
    name: '确定性成文与双向引用',
    subtitle: '输出最终报告，每一句结论均锚定证据哈希',
    tensorIn: '校验通过的确定性命题图谱',
    tensorOut: '支持双向交互溯源点击的终局回答',
    guardrail: '输出附带 SHA-256 引用溯源哈希与置信区间',
    latency: '380 ms',
    tokens: '920 Tokens',
    confidence: '99.8%',
  },
]

interface EvidenceChunk {
  id: string
  source: string
  score: string
  docId: string
  content: string
  status: 'used' | 'pruned'
}

const EVIDENCE_CHUNKS: EvidenceChunk[] = [
  {
    id: 'chunk-1',
    source: 'ArXiv:2401.08291 · 深度思考模型架构白皮书',
    score: '0.964',
    docId: 'SEC-4.2 [p. 18]',
    content: '在思维链 (Chain-of-Thought) 推演过程中，强监督的反思验证机制能有效抑制自由发散造成的累积误差，使复杂多步数理证明的准确率提升 42.8%。',
    status: 'used',
  },
  {
    id: 'chunk-2',
    source: 'ACM Computing Surveys · 向量检索与神经重排综述',
    score: '0.942',
    docId: 'SEC-2.1 [p. 07]',
    content: '相比单一稠密向量检索，BM25 结合密集语义向量的混合召回在长尾专业术语上的命中率提高 28.6%，Cross-Encoder 重排可过滤 75% 的虚假相关切片。',
    status: 'used',
  },
  {
    id: 'chunk-3',
    source: '开源推理引擎核心架构 RFC 规范文档',
    score: '0.887',
    docId: 'RFC-019 [p. 03]',
    content: '确定性推理要求中间状态必须完全可复现，每一个分支决策点需记录当前温度系数、随机种子与注意力分布熵值。',
    status: 'used',
  },
  {
    id: 'chunk-4',
    source: '基准测试评测报告 · 复杂逻辑推理消融实验',
    score: '0.781',
    docId: 'BENCH-08 [p. 22]',
    content: '未设自检回退环节的单向自回归模型在步数超过 7 步后幻觉漂移概率呈指数上升；引入回退重排后收敛成功率达 99.1%。',
    status: 'used',
  },
]

/** 竖向连线组件：移动端流程不断裂 */
function DropLine() {
  return (
    <span aria-hidden className="ml-[2.4rem] flex h-6 items-center">
      <span className="block h-full w-px bg-rule-2" />
      <span
        className="ml-[-3px] size-[6px] rotate-45"
        style={{
          borderBottom: '1px solid var(--hm-rule-2)',
          borderRight: '1px solid var(--hm-rule-2)',
        }}
      />
    </span>
  )
}

/**
 * AI 推理工具 Lumen 独立页。
 * 遵循 Hallmark Skills 规范打造可解释的认知推理物态感：
 * 1. 顶部认知引擎性能监控条（Thinking Tokens / 延迟 / 熵收敛指标）
 * 2. 五步认知拓扑图（支持模拟自动推演，保持测试契约）
 * 3. 动态反思自检回退虚线回路
 * 4. 实时思维链轨迹追踪仪（<think> 逻辑推导、假设回测与自我修正）
 * 5. 检索增强向量证据库雷达（Top-4 切片高分相关性打分与引用）
 * 6. 幻觉自愈对比工作台（Draft v1 臆测 vs Final v2 严密证据）
 * 7. 底部配置标准 Hallmark Stamp 58/58 生产印章
 */
export function LumenPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [showThinkingProcess, setShowThinkingProcess] = useState(true)

  const uid = useId()
  const steps = page.planes ?? []
  const curDetail = STEP_DETAILS[pick] || STEP_DETAILS[0]
  const curPlane = steps[pick]

  const runSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    let s = 0
    setPick(0)
    const interval = setInterval(() => {
      s++
      if (s < steps.length) {
        setPick(s)
      } else {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 550)
  }

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-28 pt-10 sm:pt-14 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>

        {/* 顶部推理集群状态条 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 text-accent-line font-bold border border-accent/30">
              <span className="size-2 rounded-full bg-accent-line animate-pulse" />
              LUMEN COGNITIVE REASONING PIPELINE · V4
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-muted">确定性思维链留痕</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">可验证哈希归因</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2">
            <span>语义熵率：0.12 (高确定性)</span>
            <span className="text-accent-line font-bold">端到端延迟：1.42 s</span>
          </div>
        </header>

        {/* 刊头与推演触发按钮 (保持测试契约) */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-b border-rule pb-8">
          <div className="max-w-[55ch]">
            <span className="meta font-mono font-bold text-accent-line tracking-wider">
              {page.discipline} · VISIBLE REASONING TRACE & VERIFIABILITY
            </span>
            <h1
              className="display mt-3 text-ink font-bold"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                lineHeight: 1.05,
                letterSpacing: 'var(--hm-tracking-display)',
              }}
            >
              {page.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-ink-2 leading-relaxed">
              {page.standfirst}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3">
            <button
              type="button"
              onClick={runSimulation}
              disabled={isRunning}
              className={`min-h-11 rounded-lg border px-4 py-2 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2 ${
                isRunning
                  ? 'bg-ink text-paper border-ink animate-pulse'
                  : 'border-accent-line bg-accent/10 text-ink hover:bg-accent/20'
              }`}
            >
              <span>{isRunning ? '⏳' : '▶'}</span>
              <span>{isRunning ? '推理推演进行中...' : '模拟完整思维链推演'}</span>
            </button>
            <span className="font-mono text-xs text-muted">
              支持点击任意节点查看单步张量输入与守门规程
            </span>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────
            装置 1：五步认知拓扑图 (宽屏横排五列 + 窄屏竖向连线)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-topo-title`} className="mt-12">
          <h2 id={`${uid}-topo-title`} className="sr-only">推理认知拓扑管线</h2>

          {/* 宽屏五列网格 */}
          <div
            className="hidden lg:grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            }}
          >
            {steps.map((s, i) => {
              const isSelected = pick === i
              return (
                <button
                  key={s.t}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setPick(i)}
                  className={`relative p-4 text-left transition-all rounded-xl border min-h-[140px] flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-accent-line bg-accent/15 shadow-md ring-2 ring-accent-line/50'
                      : 'border-rule bg-paper-2/50 hover:border-rule-2 hover:bg-paper-2'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{
                          color: isSelected
                            ? 'var(--hm-accent-line)'
                            : 'var(--hm-muted)',
                        }}
                      >
                        第 {i + 1} 步
                      </span>
                      <span className="text-[10px] font-mono text-muted">
                        {STEP_DETAILS[i]?.latency}
                      </span>
                    </div>
                    <span className="display mt-1.5 block text-lg font-bold text-ink">
                      {s.t}
                    </span>
                    <span
                      className="mt-1 block text-xs leading-normal"
                      style={{
                        color: isSelected
                          ? 'var(--hm-ink)'
                          : 'var(--hm-muted)',
                      }}
                    >
                      {s.d}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-rule/50 flex items-center justify-between font-mono text-[10px] text-muted">
                    <span>置信度</span>
                    <span className="text-accent-line font-bold">
                      {STEP_DETAILS[i]?.confidence}
                    </span>
                  </div>

                  {/* 节点间前进箭头 */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-paper border border-rule z-10 flex items-center justify-center text-[10px] text-muted pointer-events-none shadow-xs"
                    >
                      →
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* 回退边：第 4 步自检不通过则回退至第 2 步重新采样 */}
          <div className="mt-3 hidden lg:block" aria-hidden>
            <div
              className="flex items-center gap-3 pl-[32%] text-xs text-accent-line font-mono font-bold py-1.5"
              style={{ borderTop: '2px dashed var(--hm-accent)' }}
            >
              <span className="size-2 rotate-45 border-b-2 border-l-2 border-accent-line -mt-0.5" />
              <span>
                ↺ 反思自检若发现逻辑跳跃或未经证实断言，触发回退至第 2 步重新扩大证据采样 · 最大重试 3 次
              </span>
            </div>
          </div>

          {/* 窄屏竖向连线展示 */}
          <ol className="mt-8 lg:hidden space-y-1">
            {steps.map((s, i) => (
              <li key={s.t}>
                <button
                  type="button"
                  onClick={() => setPick(i)}
                  aria-pressed={pick === i}
                  className={`flex w-full gap-4 p-4 text-left transition-all rounded-lg border min-h-14 ${
                    pick === i
                      ? 'border-accent-line bg-accent/15 font-semibold'
                      : 'border-rule bg-paper-2/40'
                  }`}
                >
                  <span className="meta w-14 shrink-0 font-mono font-bold text-accent-line text-xs">
                    第 {i + 1} 步
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="display block text-base font-bold text-ink">
                        {s.t}
                      </span>
                      <span className="text-[10px] font-mono text-muted">
                        {STEP_DETAILS[i]?.latency}
                      </span>
                    </div>
                    <span className="mt-0.5 block text-xs text-muted">
                      {s.d}
                    </span>
                  </div>
                </button>
                {i === 3 && (
                  <p className="ml-5 mt-1 font-mono text-xs text-accent-line font-bold flex items-center gap-1">
                    <span>↺</span>
                    <span>自检未达标自动回退至第 2 步重排</span>
                  </p>
                )}
                {i < steps.length - 1 && <DropLine />}
              </li>
            ))}
          </ol>
        </section>

        {/* ────────────────────────────────────────────────────────────
            当前选中节点的输入/输出张量与守门准则剖析
            ──────────────────────────────────────────────────────────── */}
        <section className="mt-8 rounded-xl border border-rule bg-paper-2 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3.5 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-accent-line">
                第 {pick + 1} 步节点详情 · {curPlane?.t}
              </span>
              <span className="text-muted hidden sm:inline">|</span>
              <span className="text-ink-2">{curDetail.subtitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted">延迟：{curDetail.latency}</span>
              <span className="px-2 py-0.5 rounded bg-paper border border-rule text-ink font-bold">
                消耗：{curDetail.tokens}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-x-8 gap-y-4 lg:grid-cols-12 text-xs font-mono">
            <div className="lg:col-span-5 p-4 rounded-lg bg-paper border border-rule/80">
              <span className="text-muted block text-[10px] uppercase font-bold">
                输入张量 / 上游实体 (Tensor In)
              </span>
              <p className="text-ink font-bold mt-1 leading-relaxed">
                {curDetail.tensorIn}
              </p>
            </div>

            <div className="lg:col-span-4 p-4 rounded-lg bg-paper border border-rule/80">
              <span className="text-muted block text-[10px] uppercase font-bold">
                输出交付物 / 确定性中间态 (Tensor Out)
              </span>
              <p className="text-ink font-bold mt-1 leading-relaxed">
                {curDetail.tensorOut}
              </p>
            </div>

            <div className="lg:col-span-3 p-4 rounded-lg bg-accent/10 border border-accent/30 flex flex-col justify-between">
              <div>
                <span className="text-accent-line block text-[10px] uppercase font-bold">
                  守门硬指标 (Guardrail)
                </span>
                <p className="text-ink font-bold mt-1">
                  {curDetail.guardrail}
                </p>
              </div>
              <span className="text-[10px] text-muted block mt-2">
                状态：经过严密断言验证 · 可重放
              </span>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 2：真实思维链轨迹追踪仪 (Chain-of-Thought Trace)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-cot-title`} className="mt-14 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 02 · REAL-TIME CHAIN-OF-THOUGHT TRACE INSPECTOR
              </span>
              <h2 id={`${uid}-cot-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                思考过程流式轨迹 · &lt;think&gt; 内部反思展开
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowThinkingProcess(!showThinkingProcess)}
              className="min-h-11 px-3 py-1 rounded border border-rule bg-paper text-xs font-mono font-bold text-ink-2 hover:text-ink cursor-pointer"
            >
              {showThinkingProcess ? '收起思考流 [-]' : '展开完整思考流 [+]'}
            </button>
          </div>

          {showThinkingProcess && (
            <div className="mt-5 rounded-lg border border-rule bg-paper p-5 sm:p-6 font-mono text-xs leading-relaxed">
              <div className="flex items-center justify-between border-b border-rule/60 pb-2.5 text-[11px] text-muted">
                <span className="text-accent-line font-bold">&lt;think&gt; 内部推理流 (4,820 Thinking Tokens)</span>
                <span>自回归注意力熵: 0.12 · 漂移度: 0.00%</span>
              </div>

              <div className="mt-4 space-y-3 text-ink-2">
                <p>
                  <strong className="text-ink">1. 目标解构：</strong> 用户查询核心问题涉及多步数理证明与分布式系统容错逻辑。先识别必须依赖的原始论文定义（ArXiv:2401.08291）。
                </p>
                <p>
                  <strong className="text-ink">2. 检索证据验证：</strong> 召回 32 条候选切片，经 Cross-Encoder 打分，切片 #1 得分 0.964，切片 #2 得分 0.942。确认证据链完整，覆盖定理假设前提。
                </p>
                <p className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                  ⚠️ <strong>自检触发反思 (Step 4 回测)：</strong> 在生成临时结论时，初步假设曾尝试断言“所有无状态节点无需配置持久日志”，经回测切片 #3 RFC-019 发现冲突——RFC 明确规定关键决策需记录注意力熵。立即推翻并剔除该断言，更正为“决策节点需维持确定性中间态散列”。
                </p>
                <p>
                  <strong className="text-ink">3. 结论收敛：</strong> 剔除潜在幻觉，所有断言均与证据库形成 1-to-1 引用绑定，逻辑链闭环成立。
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rule/60 flex items-center justify-between text-[11px] text-muted">
                <span>&lt;/think&gt; 思考完成，切换至最终报告交付格式</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">校验状态：逻辑验证通过 ✓</span>
              </div>
            </div>
          )}
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 3：检索证据切片库与相似度雷达 (Evidence Chunks Radar)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-ev-title`} className="mt-14 rounded-xl border border-rule bg-paper-2/40 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 03 · DENSE EMBEDDING & EVIDENCE RADAR
              </span>
              <h2 id={`${uid}-ev-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                检索增强证据切片库与 Cross-Encoder 打分
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              精选 Top 4 事实切片 · 杜绝黑盒无据生成
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {EVIDENCE_CHUNKS.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-lg border border-rule bg-paper flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs border-b border-rule/60 pb-2">
                    <span className="font-bold text-ink truncate pr-2">{ev.source}</span>
                    <span className="px-1.5 py-0.5 rounded bg-accent/15 text-accent-line font-bold shrink-0">
                      Score: {ev.score}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-ink-2 leading-relaxed">
                    “{ev.content}”
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-rule/50 flex items-center justify-between font-mono text-[11px] text-muted">
                  <span>位置：{ev.docId}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    引用状态：已校验通过
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 底部 Cta 与行动引导 */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8">
          <div className="flex flex-wrap items-center gap-4">
            <Cta label={page.cta} done="已加载推理引擎沙盒环境" />
            <span className="text-xs text-muted font-mono max-w-[50ch]">
              每一个推理跳跃均附带原始文献哈希引用，不确定的部分会被标出来，绝不混在结论里。
            </span>
          </div>
          <span className="font-mono text-xs text-muted">
            LUMEN ENGINE · VERIFIABLE PROOF ARTIFACTS
          </span>
        </div>

        {/* 底部 Hallmark 规范生产印章与六维评分 */}
        <footer className="mt-20">
          <Stamp page={page} />
        </footer>

      </div>
    </main>
  )
}
export default LumenPage
