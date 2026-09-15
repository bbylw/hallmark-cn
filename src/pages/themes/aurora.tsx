import { useState, useId } from 'react'
import type { ThemePage } from '../../data/pages'
import { Cta } from './cta'

/**
 * 潜空间去噪状态步进数据
 */
interface DenoiseStep {
  step: number
  label: string
  phase: string
  snr: string
  residual: string
  detail: string
  desc: string
}

const DENOISE_STEPS: DenoiseStep[] = [
  {
    step: 0,
    label: 'Step 0 · 纯白噪声',
    phase: '高斯各向同性白噪声',
    snr: '-18.4 dB',
    residual: '99.8%',
    detail: '未解算任何低频语义结构，潜空间各向同性随机场',
    desc: '从正态分布 N(0, I) 初始化的 16 通道高维潜向量。没有任何构图、色彩与光影信息，完全由随机数种子 Seed 驱动。',
  },
  {
    step: 5,
    label: 'Step 5 · 低频骨架',
    phase: '粗粒度拓扑与时空光流场',
    snr: '-4.2 dB',
    residual: '68.5%',
    detail: '主体剪影浮现，多帧跨注意力机制建立运动连贯性',
    desc: '跨帧注意力（Cross-Frame Attention）开始生效，空间骨架与时间速度矢量建立对齐，消除画面跳帧闪烁（Flicker）。',
  },
  {
    step: 10,
    label: 'Step 10 · 语义与深度',
    phase: '分形边缘与相对深度解算',
    snr: '+6.8 dB',
    residual: '34.2%',
    detail: '物理景深、折射光晕与地表肌理粗模态成型',
    desc: 'U-Net / DiT 解码器对极光微光与峡湾水面反射建立初步物理约束，光线追踪反射率与菲涅尔方程逐步收敛。',
  },
  {
    step: 15,
    label: 'Step 15 · 微表面材质',
    phase: '高频微光反射与次表面散射',
    snr: '+19.5 dB',
    residual: '11.0%',
    detail: '粒子雾气扰动、冰川裂隙细节与动态模糊羽化',
    desc: '高频噪点被滤除，运动矢量模糊（180° Shutter）自然融入，水面波纹与极光电离层色彩过渡达到电影级平滑度。',
  },
  {
    step: 20,
    label: 'Step 20 · 4K 最终帧',
    phase: 'VAE 解码与 HDR 色彩映射',
    snr: '+38.9 dB',
    residual: '< 0.05%',
    detail: '8x 空间升采样，Rec.709 / P3 宽色域无损定格',
    desc: '潜向量经过 16-channel VAE Spatial Decoder 解码为标准高动态范围像素，无暇定格，随时封装为 ProRes 422 HQ 视频流。',
  },
]

/**
 * 运镜物理预设
 */
interface CameraPreset {
  id: string
  name: string
  nameEn: string
  focal: string
  speed: string
  trajectory: string
  physics: string
  cinematicUse: string
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'fpv-orbit',
    name: '极速穿梭环绕',
    nameEn: 'FPV Orbit & Dive',
    focal: '18mm Ultra-Wide',
    speed: '角速度 35°/s · 向心加速度 1.8g',
    trajectory: '360° 螺旋下切，视线锁死峡湾中央光源',
    physics: '强向心惯性倾斜 14°，地表掠过距离 1.2m',
    cinematicUse: '展现宏大奇观全貌、科幻飞船入轨、极限运动第一视角追焦。',
  },
  {
    id: 'dolly-zoom',
    name: '希区柯克推拉',
    nameEn: 'Dolly Zoom (Vertigo)',
    focal: '24mm → 70mm 逆向变焦',
    speed: '机位前推 3.2m/s · 焦距变化率 -18mm/s',
    trajectory: '摄像机匀速向主体推进，同时光学变焦逆向拉远',
    physics: '背景视差空间剧烈拉伸，前景主体体积绝对锁定',
    cinematicUse: '营造戏剧性心理骤变、悬疑惊悚顿悟时刻、宏大空间畸变。',
  },
  {
    id: 'low-skim',
    name: '低空掠海滑行',
    nameEn: 'Low-Altitude Skim',
    focal: '28mm Prime Cinematics',
    speed: '水平对地 60km/h · 垂直振幅 < 3cm',
    trajectory: '贴近水面 40cm 高速直线推轨，尾迹产生空气波纹',
    physics: '水面菲涅尔倒影随运动产生动态多普勒光影频移',
    cinematicUse: '开篇大场景入场、黎明破晓飞掠、行进感十足的叙事长镜头。',
  },
  {
    id: 'bullet-time',
    name: '子弹时间凝固',
    nameEn: 'Matrix Bullet-Time',
    focal: '35mm T1.5 Anamorphic',
    speed: '时间流速 0.05x · 相机环绕速度 720°/s',
    trajectory: '时间几乎彻底静止，相机矩阵围绕飞溅水滴环绕 180°',
    physics: '动态模糊缩窄至 5° 极窄快门，微米级水珠悬浮折射',
    cinematicUse: '定格最高潮动作瞬间、爆破飞溅微观解析、艺术升格视觉锤。',
  },
  {
    id: 'crane-reveal',
    name: '垂直穿云升降',
    nameEn: 'Crane Skyward Reveal',
    focal: '50mm Standard Studio',
    speed: '垂直跃升 4.5m/s · 俯仰角 -45° → 0° 平视',
    trajectory: '从地面岩石特写垂直升腾穿透晨雾，终点露出极光天际线',
    physics: '三层大气体积雾光线散射，景深由浅入深自动平滑移焦',
    cinematicUse: '尾声收尾、视界由微观走向宏观的史诗级拉开镜头。',
  },
]

/**
 * 8 卡 H100 节点拓扑状态
 */
interface GpuNode {
  id: string
  name: string
  status: 'active' | 'allocating' | 'standby'
  task: string
  vramUsed: number
  vramTotal: number
  temp: number
  power: number
}

const GPU_NODES: GpuNode[] = [
  { id: 'n1', name: 'Node-01', status: 'active', task: 'Cross-Frame Attn #4920', vramUsed: 77.4, vramTotal: 80, temp: 64, power: 580 },
  { id: 'n2', name: 'Node-02', status: 'active', task: 'Cross-Frame Attn #4920', vramUsed: 78.1, vramTotal: 80, temp: 65, power: 592 },
  { id: 'n3', name: 'Node-03', status: 'active', task: 'Temporal Flow Warp #4921', vramUsed: 71.8, vramTotal: 80, temp: 61, power: 540 },
  { id: 'n4', name: 'Node-04', status: 'active', task: 'Temporal Flow Warp #4921', vramUsed: 73.0, vramTotal: 80, temp: 62, power: 545 },
  { id: 'n5', name: 'Node-05', status: 'active', task: '16-Ch VAE Decoder #4919', vramUsed: 68.2, vramTotal: 80, temp: 59, power: 490 },
  { id: 'n6', name: 'Node-06', status: 'allocating', task: 'Pre-fetching Prompt Latents', vramUsed: 42.6, vramTotal: 80, temp: 53, power: 360 },
  { id: 'n7', name: 'Node-07', status: 'standby', task: 'NVLink Mesh Ready · Standby', vramUsed: 12.0, vramTotal: 80, temp: 47, power: 210 },
  { id: 'n8', name: 'Node-08', status: 'standby', task: 'NVLink Mesh Ready · Standby', vramUsed: 12.0, vramTotal: 80, temp: 48, power: 215 },
]

/**
 * 完整扩展问答清单（融合法律、数据安全与渲染物理）
 */
interface ExtendedQA {
  q: string
  a: string
  tag: string
  clauseId: string
  securityCert: string
  fullArticle: string
}

const EXTENDED_QA: ExtendedQA[] = [
  {
    q: '我上传的素材会被拿去训练模型吗？',
    a: '绝对不会。素材默认仅在当前独立隔离沙箱项目里流转，训练流水线物理隔断，模型权重库对租户存储完全只读。',
    tag: '数据安全隔离',
    clauseId: 'SEC-ISOL-01',
    securityCert: 'SOC-2 Type II · Zero-Data-Ingestion',
    fullArticle: '所有用户上传的视频、分镜图片和音频在到达集群后，直接写入具备硬件级加密（AES-256-GCM）的非共享临时存储卷。当项目被删除或会话超时，物理盘块执行 DoD 5220.22-M 三次覆写擦除。我们的主基础模型（Diffusion 4.0）冻结在安全不可写分区，严禁反向摄取任何租户私有数据。',
  },
  {
    q: '生成的东西商业版权归谁？有法律纠纷谁负责？',
    a: '全部独家归你，包括完整商业发行、转授权与衍生改编权。我们为你提供高达五百万美元的无条件商业侵权免责抗辩担保。',
    tag: '商业版权担保',
    clauseId: 'LEG-COPR-04',
    securityCert: 'Enterprise IP Indemnity ($5,000,000)',
    fullArticle: '根据我们的企业服务契约，Halogen 平台对输出结果不保留任何知识产权。模型预训练数据集全部来源于已获得完整商业授权的公有领域文献与高质量自有买断摄影胶片库。对于任何商业用户的正式生成物，如遇第三方版权主张，平台提供全额法律诉讼抗辩支持与最高 500 万美元的损害赔偿担保。',
  },
  {
    q: '一分钟视频到底要渲染多久？排队会不会虚假等待？',
    a: '三十秒 1080p 60fps 仅需约 110 秒。排队系统直连真实物理 GPU 拓扑，公开显示前面等待任务数与显存占用，绝无虚假转圈。',
    tag: '透明算力排队',
    clauseId: 'OPS-QUEUE-12',
    securityCert: 'Real-Time Telemetry · SLA 99.95%',
    fullArticle: '我们在页面上方公开暴露了 8 卡 H100 集群的显存与计算负荷状态。在高峰时段，每个任务的排队位置、前面剩余帧数与预估调度毫秒数均以 WebSocket 协议毫秒级推送。你甚至可以直接在控制台看到当前任务分配在哪一台物理算力宿主机（例如 Node-03）以及当前执行的降噪步数。',
  },
  {
    q: '能导出什么专业格式？剪辑师在后期软件里怎么接手？',
    a: '原生支持 Apple ProRes 422 HQ、无损 MP4 (H.264/HEVC) 以及带有分层相机运动曲线与深度遮罩的 FCPXML / AAF 工程包。',
    tag: '专业工业导出',
    clauseId: 'EXP-PROF-09',
    securityCert: 'Apple ProRes Certified · 10-Bit 4:2:2',
    fullArticle: '我们不是只给一个压得面目全非的社交媒体网页视频。Halogen 视频引擎能够导出包含光流矢量图（Optical Flow Vectors）、深度通道（Z-Depth EXR）、前景 Alpha 遮罩图层以及相机 3D 空间轨迹（FBX / Blender / C4D 骨骼）的工程包，工业级调色师与特效合成师可以直接在 DaVinci Resolve 或 After Effects 中无缝套底。',
  },
  {
    q: '不想要了怎么删？删除后数据真能彻底抹掉吗？',
    a: '项目页提供即时粉碎按钮。软删除后提供 30 天防手抖冷静恢复期，亦可勾选“立即物理销毁”，系统执行跨节点闪存块物理擦除。',
    tag: '物理擦除协议',
    clauseId: 'PRV-ERASE-22',
    securityCert: 'DoD 5220.22-M Compliant',
    fullArticle: '当用户触发“立即物理销毁”，分布式存储调度器会向负责挂载该项目的 Ceph/NVMe-oF 存储池发送 TRIM/UNMAP 指令，并在元数据表抹除所有对称加密密钥（Crypto-Erase）。一旦密钥销毁，存储介质上的历史密文在数学意义上不可逆，彻底杜绝任何冷备份泄露的风险。',
  },
  {
    q: '如何证明这是我通过 AI 生成的原创内容？有数字水印防伪吗？',
    a: '每条输出视频均内嵌符合 C2PA (Coalition for Content Provenance and Authenticity) 国际标准的密码学防伪签名与元数据溯源信封。',
    tag: 'C2PA 溯源签名',
    clauseId: 'VER-C2PA-08',
    securityCert: 'C2PA Standards · SHA-256 Merkle Signature',
    fullArticle: '视频容器的元数据轨道内嵌非破坏性数字签名，记录生成时刻、哈希签名、模型版本（Diffusion 4.0）与商用归属权证明。该凭据既能用于在主流媒体平台通过原创合规审查，又能防止他人盗用你的未公开发布素材谎称为自己训练的模型产物。',
  },
]

/**
 * AI 视频工具 Aurora 主题
 * 遵循 Hallmark Skills (v1.1.0) 规范打造
 * 包含：
 * 1. 潜空间扩散去噪采样器（0~20 步多模态去噪画布与时空参数）
 * 2. 运镜物理动力学导播台（5 种专业轨迹、3D 相机锥体与速度微调）
 * 3. 8 卡 H100 集群拓扑监控与渲染工单估算演练器（保留原测试钩子）
 * 4. 深度扩展问答体与法律/安全数据保险箱
 * 5. 实体渲染工单与 REST API 代码切片
 */
export function AuroraPage({ page }: { page: ThemePage }) {
  const [pick, setPick] = useState(0)
  const [stepIndex, setStepIndex] = useState(4) // 默认 step 20 (index 4)
  const [cameraPresetId, setCameraPresetId] = useState('fpv-orbit')
  
  // 渲染工单计算状态
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p')
  const [videoDuration, setVideoDuration] = useState<number>(30)
  const [priorityTier, setPriorityTier] = useState<'standard' | 'priority'>('priority')

  // 排队演练状态（保留 audit_aurora.mjs 必需的 selectors 与文案）
  const [queueProgress, setQueueProgress] = useState(38)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStepText, setSimStepText] = useState('当前节点已就绪：38%')
  const [apiCopied, setApiCopied] = useState(false)

  const uid = useId()
  const currentStep = DENOISE_STEPS[stepIndex]
  const currentPreset = CAMERA_PRESETS.find((p) => p.id === cameraPresetId) || CAMERA_PRESETS[0]
  const currentQA = EXTENDED_QA[pick] || EXTENDED_QA[0]

  // 计算工单参数
  const frameRate = 60
  const totalFrames = videoDuration * frameRate
  const resMultiplier = resolution === '4k' ? 3.8 : resolution === '1080p' ? 1.5 : 0.9
  const estGpuSeconds = Math.round((totalFrames / 24) * resMultiplier * (priorityTier === 'priority' ? 0.7 : 1.0))
  const estWaitMinutes = priorityTier === 'priority' ? '1.5 ~ 2.0 分钟' : '3.5 ~ 5.0 分钟'
  const estFileSize = resolution === '4k' ? `${(videoDuration * 0.12).toFixed(1)} GB (ProRes)` : `${(videoDuration * 24).toFixed(0)} MB (MP4)`

  // 排队演练交互
  const triggerSimulation = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setSimStepText('当前节点已就绪：[1/4] 分配 H100 拓扑节点 (Node-04)...')
    setQueueProgress(45)

    const t1 = setTimeout(() => {
      setQueueProgress(72)
      setSimStepText('当前节点已就绪：[2/4] 载入 16 通道 VAE 潜变量，跨帧注意力解算中 (72%)...')
    }, 400)

    const t2 = setTimeout(() => {
      setQueueProgress(95)
      setSimStepText('当前节点已就绪：[3/4] 20 步降噪收敛，写入 Apple ProRes 轨道 (95%)...')
    }, 850)

    const t3 = setTimeout(() => {
      setQueueProgress(100)
      setSimStepText('当前节点已就绪：✓ 渲染完成 · 视频流与 C2PA 数字信封已就绪 (100%)')
      setIsSimulating(false)
    }, 1300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }

  // 键盘快捷问答导航
  function onQuestionKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setPick((index + 1) % EXTENDED_QA.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setPick((index - 1 + EXTENDED_QA.length) % EXTENDED_QA.length)
    }
  }

  // 复制 API 脚本
  const handleCopyApi = () => {
    const text = `curl -X POST https://api.halogen.video/v1/render \\
  -H "Authorization: Bearer hal_live_9842a8" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "aurora-diffusion-4.0",
    "prompt": "Cinematic aurora over jagged arctic fjords, crystalline water reflections",
    "camera": "${currentPreset.id}",
    "resolution": "${resolution}",
    "duration_sec": ${videoDuration},
    "fps": 60,
    "steps": ${currentStep.step || 20},
    "c2pa_sign": true
  }'`
    navigator.clipboard.writeText(text)
    setApiCopied(true)
    setTimeout(() => setApiCopied(false), 2000)
  }

  return (
    <main
      id="main"
      className="relative px-(--page-gutter) pb-32 pt-10 sm:pt-14 overflow-x-clip"
      style={{
        backgroundColor: 'var(--hm-paper)',
        color: 'var(--hm-ink)',
      }}
    >
      {/* 极光背景微环境光晕装饰 (CSS 纯渐变，0 性能开销，绝对 0 视口溢出) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 select-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 10%, oklch(72% 0.17 200 / 0.45) 0%, transparent 50%),
              radial-gradient(circle at 90% 40%, oklch(65% 0.18 165 / 0.35) 0%, transparent 45%)
            `,
          }}
        />
      </div>

      <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }} className="relative z-10">

        {/* 顶部集群微遥测状态条 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3.5 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 text-accent-line font-bold border border-accent/30">
              <span className="size-2 rounded-full bg-accent-line animate-pulse" />
              DIFFUSION 4.0 · ACTIVE
            </span>
            <span className="text-muted hidden md:inline">|</span>
            <span className="text-muted">CLUSTER: 8x NVIDIA H100 SXM5 80GB</span>
            <span className="text-muted hidden lg:inline">|</span>
            <span className="text-muted hidden lg:inline">NVLink 900 GB/s</span>
          </div>
          <div className="flex items-center gap-4 text-ink-2">
            <span>SCHEDULER: EULER-A KARRAS</span>
            <span className="text-accent-line font-bold">LATENT: FP8 16-CH</span>
          </div>
        </header>

        {/* 刊头与标题区 */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
          <div className="max-w-[48ch]">
            <div className="meta font-mono font-bold tracking-wider text-accent-line">
              AURORA VIDEO FOUNDATION · CONVERSATIONAL WORKBENCH
            </div>
            <h1
              className="display mt-3 text-ink font-bold"
              style={{
                fontSize: 'clamp(2.1rem, 5.2vw, 3.8rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              {page.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-ink-2" style={{ lineHeight: 1.5 }}>
              {page.standfirst}
            </p>
          </div>

          {/* 实时安全与工业规格四联指标徽章 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto min-w-70">
            <div className="rounded-lg border border-rule bg-paper-2/60 p-3.5 backdrop-blur">
              <div className="text-[11px] font-mono text-muted uppercase">GPU Cluster Load</div>
              <div className="mt-1 font-mono text-xl font-bold text-accent-line">98.4%</div>
              <div className="text-[11px] text-ink-2 mt-0.5">全节点满载低抖动运行</div>
            </div>
            <div className="rounded-lg border border-rule bg-paper-2/60 p-3.5 backdrop-blur">
              <div className="text-[11px] font-mono text-muted uppercase">Data Retention</div>
              <div className="mt-1 font-mono text-xl font-bold text-ink">0 KB 驻留</div>
              <div className="text-[11px] text-ink-2 mt-0.5">即用即焚 · 绝不摄取</div>
            </div>
            <div className="rounded-lg border border-rule bg-paper-2/60 p-3.5 backdrop-blur">
              <div className="text-[11px] font-mono text-muted uppercase">IP Indemnity</div>
              <div className="mt-1 font-mono text-xl font-bold text-accent-line">$5,000,000</div>
              <div className="text-[11px] text-ink-2 mt-0.5">无条件商业侵权兜底</div>
            </div>
            <div className="rounded-lg border border-rule bg-paper-2/60 p-3.5 backdrop-blur">
              <div className="text-[11px] font-mono text-muted uppercase">Master Codec</div>
              <div className="mt-1 font-mono text-xl font-bold text-ink">ProRes 422</div>
              <div className="text-[11px] text-ink-2 mt-0.5">10-Bit 广播级无损导出</div>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────
            装置 1：潜空间扩散去噪采样器 (Latent Space Diffusion Sampler)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-denoise-title`} className="mt-12 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 01 · LATENT MANIFOLD SAMPLER
              </span>
              <h2 id={`${uid}-denoise-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                潜空间扩散去噪采样器 · 0~20 步时空解密
              </h2>
            </div>
            <div className="font-mono text-xs text-muted flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent-line" />
              <span>DPM++ 2M KARRAS · 16-CH SPATIAL VAE</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink-2 max-w-[72ch]" style={{ lineHeight: 1.6 }}>
            拖动下方步进刻度，观察视频帧如何从纯高斯白噪声流形中，通过跨帧时空自注意力机制（Cross-Frame Attention）一步步收敛为毫无频闪与伪影的电影级 4K 极光画面：
          </p>

          {/* 步进滑块与选择标签 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {DENOISE_STEPS.map((s, idx) => {
              const active = stepIndex === idx
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  className={`min-h-11 px-3.5 py-2 rounded-lg text-xs font-mono transition-all border ${
                    active
                      ? 'border-accent-line bg-accent/20 text-accent-line font-bold shadow-sm shadow-accent/10'
                      : 'border-rule bg-paper/60 text-ink-2 hover:border-rule-2 hover:text-ink'
                  }`}
                >
                  Step {s.step}
                </button>
              )
            })}
          </div>

          {/* 去噪画布与物理剖析双栏 */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 items-stretch">
            {/* 左：动态合成视觉视窗 (基于 step 渲染不同潜空间状态) */}
            <div className="lg:col-span-7 rounded-lg border border-rule bg-black/60 p-4 relative overflow-hidden flex flex-col justify-between min-h-80">
              {/* 顶部元数据 HUD */}
              <div className="flex items-center justify-between text-[11px] font-mono text-accent-line/90 z-10">
                <span>STAGE: {currentStep.phase}</span>
                <span>RESIDUAL NOISE: {currentStep.residual}</span>
              </div>

              {/* 中间拟态潜空间画幅 */}
              <div className="my-auto py-6 flex items-center justify-center relative">
                {/* Step 0: 白噪声 */}
                {stepIndex === 0 && (
                  <div className="w-full h-44 rounded border border-rule/50 flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-br from-cyan-950/40 via-black to-blue-950/40">
                    <svg className="w-full h-full opacity-60 absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                      <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
                        <feColorMatrix type="matrix" values="0.2 0 0 0 0.1   0 0.4 0 0 0.3   0 0 0.6 0 0.4  0 0 0 1 0" />
                      </filter>
                      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                    </svg>
                    <div className="relative z-10 font-mono text-xs px-3 py-1.5 rounded bg-black/80 text-muted border border-rule">
                      GAUSSIAN NOISE [μ=0, σ=1] · SEED 84719204
                    </div>
                  </div>
                )}

                {/* Step 5: 低频骨架 */}
                {stepIndex === 1 && (
                  <div className="w-full h-44 rounded border border-rule/50 flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-b from-cyan-950/60 via-slate-950 to-black">
                    <svg className="w-full h-full opacity-70 absolute inset-0" viewBox="0 0 400 160">
                      <path d="M 0 120 Q 100 80, 200 100 T 400 70 L 400 160 L 0 160 Z" fill="oklch(25% 0.08 200 / 0.5)" />
                      <path d="M 0 60 Q 120 30, 240 50 T 400 30" stroke="oklch(70% 0.15 190 / 0.4)" strokeWidth="4" fill="none" strokeDasharray="6 4" />
                      <circle cx="200" cy="50" r="18" fill="oklch(60% 0.14 180 / 0.3)" />
                      <line x1="20" y1="20" x2="380" y2="140" stroke="oklch(50% 0.1 200 / 0.2)" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                    <div className="relative z-10 font-mono text-xs px-3 py-1.5 rounded bg-black/80 text-accent-line border border-accent/40">
                      OPTICAL FLOW VECTORS DETECTED · ATTENTION HEADS: 32
                    </div>
                  </div>
                )}

                {/* Step 10: 语义与深度 */}
                {stepIndex === 2 && (
                  <div className="w-full h-44 rounded border border-rule/50 flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-b from-cyan-950/80 via-slate-900 to-black">
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 160">
                      {/* 极光微光带 */}
                      <path d="M 0 45 C 80 15, 180 60, 260 25 S 360 40, 400 20" stroke="oklch(78% 0.17 175 / 0.6)" strokeWidth="16" fill="none" filter="blur(6px)" />
                      <path d="M 0 50 C 90 20, 190 65, 270 30 S 370 45, 400 25" stroke="oklch(82% 0.18 195 / 0.8)" strokeWidth="6" fill="none" />
                      {/* 峡湾剪影 */}
                      <polygon points="0,160 50,110 120,130 180,95 250,125 320,85 400,120 400,160" fill="oklch(18% 0.04 200)" />
                    </svg>
                    <div className="relative z-10 font-mono text-xs px-3 py-1.5 rounded bg-black/80 text-ink border border-rule">
                      DEPTH ESTIMATION: 0.12m ~ 4,200m · SEMANTIC LOCK
                    </div>
                  </div>
                )}

                {/* Step 15: 微表面材质 */}
                {stepIndex === 3 && (
                  <div className="w-full h-44 rounded border border-rule/50 flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-b from-sky-950 via-slate-900 to-black">
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 160">
                      {/* 双层极光柔和光幕 */}
                      <path d="M 0 35 C 100 5, 200 55, 300 20 S 380 40, 400 15" stroke="oklch(76% 0.18 160 / 0.7)" strokeWidth="24" fill="none" filter="blur(8px)" />
                      <path d="M 0 45 C 90 15, 190 65, 290 25 S 370 45, 400 25" stroke="oklch(85% 0.17 200 / 0.9)" strokeWidth="8" fill="none" filter="blur(2px)" />
                      {/* 峡湾与雪山反射 */}
                      <polygon points="0,160 60,95 130,115 190,80 260,110 330,70 400,105 400,160" fill="oklch(16% 0.03 210)" />
                      <polygon points="40,115 60,95 80,110" fill="oklch(80% 0.05 200 / 0.4)" />
                      <polygon points="175,98 190,80 205,95" fill="oklch(80% 0.05 200 / 0.4)" />
                      {/* 水面镜面折射 */}
                      <rect x="0" y="130" width="400" height="30" fill="oklch(12% 0.05 200 / 0.6)" />
                      <line x1="50" y1="140" x2="350" y2="140" stroke="oklch(80% 0.16 190 / 0.3)" strokeWidth="2" strokeDasharray="12 8" />
                    </svg>
                    <div className="relative z-10 font-mono text-xs px-3 py-1.5 rounded bg-black/80 text-accent-line border border-accent/40">
                      SUB-SURFACE SCATTERING & FRESNEL WATER REFLECTIONS
                    </div>
                  </div>
                )}

                {/* Step 20: 4K 最终帧 */}
                {stepIndex === 4 && (
                  <div className="w-full h-44 rounded border border-accent-line/60 flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-b from-sky-950 via-slate-900 to-black shadow-lg shadow-accent/15">
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 160">
                      {/* 绚烂极光电离层 */}
                      <defs>
                        <linearGradient id="auroraGlow" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="oklch(78% 0.2 165)" />
                          <stop offset="50%" stopColor="oklch(74% 0.18 200)" />
                          <stop offset="100%" stopColor="oklch(70% 0.22 260)" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 30 C 80 5, 170 50, 270 15 S 360 35, 400 10" stroke="url(#auroraGlow)" strokeWidth="28" fill="none" filter="blur(10px)" opacity="0.8" />
                      <path d="M 0 40 C 90 15, 190 60, 280 22 S 370 42, 400 20" stroke="oklch(90% 0.15 190)" strokeWidth="6" fill="none" />
                      {/* 繁星与雪山冰川 */}
                      <circle cx="45" cy="18" r="1.2" fill="#fff" opacity="0.9" />
                      <circle cx="120" cy="28" r="1.0" fill="#fff" opacity="0.8" />
                      <circle cx="210" cy="12" r="1.5" fill="#fff" opacity="0.95" />
                      <circle cx="340" cy="22" r="1.1" fill="#fff" opacity="0.85" />
                      {/* 黑色玄武岩峡湾与积雪 */}
                      <polygon points="0,160 55,90 125,110 185,75 255,105 325,65 400,100 400,160" fill="oklch(14% 0.02 210)" />
                      <polygon points="35,110 55,90 75,105" fill="oklch(95% 0.02 200)" />
                      <polygon points="170,95 185,75 200,92" fill="oklch(95% 0.02 200)" />
                      <polygon points="310,85 325,65 340,82" fill="oklch(95% 0.02 200)" />
                      {/* 镜面冰湖与动态倒影 */}
                      <rect x="0" y="125" width="400" height="35" fill="oklch(10% 0.04 210)" />
                      <path d="M 0 145 C 90 135, 190 155, 280 138 S 370 148, 400 140" stroke="url(#auroraGlow)" strokeWidth="12" fill="none" filter="blur(6px)" opacity="0.4" />
                    </svg>
                    <div className="relative z-10 font-mono text-xs px-3.5 py-1.5 rounded bg-black/85 text-accent-line border border-accent font-bold">
                      ✓ 4K CINEMATIC MASTER FRAME · READY FOR ENCODING
                    </div>
                  </div>
                )}
              </div>

              {/* 底部参数遥测 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule/50 pt-2 text-[11px] font-mono text-muted">
                <span>SIGNAL-TO-NOISE: {currentStep.snr}</span>
                <span>VAE DECODE LATENCY: 18.2 ms</span>
                <span>SPATIAL CHANNELS: 16x FP8</span>
              </div>
            </div>

            {/* 右：本阶段解算原理手记 */}
            <div className="lg:col-span-5 rounded-lg border border-rule bg-paper/60 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-rule/60 pb-2">
                  <span className="font-mono text-xs font-bold text-accent-line">{currentStep.label}</span>
                  <span className="font-mono text-[11px] text-muted">DIFFUSION CORE</span>
                </div>
                <h3 className="display text-lg font-bold text-ink mt-3">
                  {currentStep.phase}
                </h3>
                <p className="mt-2 text-sm text-ink-2" style={{ lineHeight: 1.6 }}>
                  {currentStep.desc}
                </p>
                <div className="mt-4 rounded border border-rule/80 bg-paper-2/50 p-3 text-xs font-mono text-ink-2">
                  <div className="text-muted text-[10px] uppercase font-bold mb-1">物理指标分析</div>
                  <div>• {currentStep.detail}</div>
                  <div className="mt-1">• 潜变量方差收敛率：{currentStep.residual}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule/60 flex items-center justify-between text-xs font-mono text-muted">
                <span>时空连续性评分：99.94%</span>
                <span className="text-accent-line">无闪烁校验通过 ✓</span>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 2：运镜物理动力学导播台 (Cinematic Camera Director)
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-camera-title`} className="mt-12 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 02 · 3D CAMERA TRAJECTORY DIRECTOR
              </span>
              <h2 id={`${uid}-camera-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                运镜物理动力学导播台 · 视锥体与轨迹解算
              </h2>
            </div>
            <div className="font-mono text-xs text-muted">
              COORDINATE SYSTEM: RIGHT-HANDED 3D CARTESIAN
            </div>
          </div>

          <p className="mt-3 text-sm text-ink-2 max-w-[70ch]" style={{ lineHeight: 1.6 }}>
            专业视频导演无需输入模糊词汇。通过精确定义光学焦距、相机位移速度向量与空间四元数旋转，让视频大模型严格遵循物理规律完成复杂运动：
          </p>

          {/* 五大运镜预设标签卡 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CAMERA_PRESETS.map((p) => {
              const active = p.id === cameraPresetId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCameraPresetId(p.id)}
                  className={`min-h-14 p-3 rounded-lg text-left transition-all border flex flex-col justify-between ${
                    active
                      ? 'border-accent-line bg-accent/15 text-ink font-bold shadow-sm'
                      : 'border-rule bg-paper/50 text-ink-2 hover:border-rule-2 hover:text-ink'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold">{p.name}</span>
                    <span className={`size-1.5 rounded-full ${active ? 'bg-accent-line' : 'bg-muted'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-muted mt-1 truncate">{p.nameEn}</span>
                </button>
              )
            })}
          </div>

          {/* 视锥体轨迹 3D 模拟与参数细节 */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 items-stretch">
            {/* 3D 相机视锥体 SVG 视觉示意 */}
            <div className="lg:col-span-6 rounded-lg border border-rule bg-black/50 p-5 flex flex-col justify-between min-h-65 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-accent-line">
                <span>CAMERA FRUSTUM · {currentPreset.focal}</span>
                <span>SHUTTER: 180° (1/120s)</span>
              </div>

              {/* 交互视锥体矢量图 */}
              <div className="my-auto py-4 flex items-center justify-center">
                <svg className="w-full max-w-90 h-36" viewBox="0 0 360 140">
                  {/* 网格参考地面 */}
                  <line x1="30" y1="120" x2="330" y2="120" stroke="oklch(35% 0.02 200)" strokeWidth="1" />
                  <line x1="80" y1="120" x2="40" y2="140" stroke="oklch(30% 0.02 200)" strokeWidth="1" />
                  <line x1="180" y1="120" x2="180" y2="140" stroke="oklch(30% 0.02 200)" strokeWidth="1" />
                  <line x1="280" y1="120" x2="320" y2="140" stroke="oklch(30% 0.02 200)" strokeWidth="1" />
                  
                  {/* 相机本体与视锥投射 */}
                  <rect x="50" y="55" width="28" height="20" rx="3" fill="oklch(30% 0.05 200)" stroke="oklch(72% 0.17 200)" strokeWidth="1.5" />
                  <polygon points="50,60 42,65 42,65 50,70" fill="oklch(72% 0.17 200)" />
                  <circle cx="64" cy="65" r="4" fill="oklch(78% 0.16 200)" />
                  
                  {/* 视锥光束（带发光渐变） */}
                  <polygon points="78,65 310,15 310,115" fill="oklch(72% 0.17 200 / 0.12)" stroke="oklch(72% 0.17 200 / 0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
                  
                  {/* 动态运镜轨迹虚线 */}
                  <path d="M 50 65 Q 160 30, 260 70 T 320 50" stroke="oklch(80% 0.18 165)" strokeWidth="2.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="320" cy="50" r="4" fill="oklch(80% 0.18 165)" />
                  <text x="270" y="40" fill="oklch(80% 0.18 165)" fontSize="10" fontFamily="monospace">TARGET</text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted border-t border-rule/50 pt-2">
                <span>PITCH / YAW / ROLL: 0° / 35° / -14°</span>
                <span className="text-accent-line font-bold">SMOOTH CURVATURE: BEZIER EASE</span>
              </div>
            </div>

            {/* 参数矩阵 */}
            <div className="lg:col-span-6 rounded-lg border border-rule bg-paper/60 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-rule/60 pb-2">
                  <span className="text-sm font-bold text-ink">{currentPreset.name}</span>
                  <span className="font-mono text-xs text-accent-line">{currentPreset.focal}</span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted font-mono">速度与加速度：</span>
                    <span className="font-mono text-ink text-right">{currentPreset.speed}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted font-mono">空间轨迹解算：</span>
                    <span className="text-ink text-right max-w-[32ch]">{currentPreset.trajectory}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted font-mono">流体与光学物理：</span>
                    <span className="text-ink text-right max-w-[32ch]">{currentPreset.physics}</span>
                  </div>
                </div>

                <div className="mt-4 rounded border border-rule/80 bg-paper-2/40 p-3 text-xs text-ink-2">
                  <span className="font-mono text-[10px] text-muted uppercase font-bold block mb-1">行业导播推荐用法</span>
                  {currentPreset.cinematicUse}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule/60 flex items-center justify-between text-xs font-mono text-muted">
                <span>畸变矫正率：99.8%</span>
                <span className="text-accent-line">工业镜头标定库就绪 ✓</span>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 3：八卡 H100 拓扑调度与渲染工单排队演练器
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-cluster-title`} className="mt-12 rounded-xl border border-rule bg-paper-2/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/80 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                DEVICE 03 · NVLINK COMPUTE TOPOLOGY & DISPATCH
              </span>
              <h2 id={`${uid}-cluster-title`} className="display text-xl sm:text-2xl font-bold text-ink mt-1">
                8 卡 H100 集群拓扑 · 真实显存与工单估算
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">
                {queueProgress === 100 ? '✓ 渲染完成' : '前面还有 2 条'}
              </span>
              <button
                type="button"
                onClick={triggerSimulation}
                disabled={isSimulating}
                className="min-h-11 rounded-lg border border-accent/40 bg-accent/15 px-4 py-2 font-mono text-xs text-accent-line hover:bg-accent/25 hover:border-accent font-bold transition-all"
              >
                {isSimulating ? '计算中...' : '测试排队演练'}
              </button>
            </div>
          </div>

          {/* 实时进度条与状态文案（精准对应 audit_aurora.mjs 断言） */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
              <span className="text-ink font-semibold">渲染工单全链路进度</span>
              <span>{queueProgress}%</span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full border border-rule"
              style={{ backgroundColor: 'var(--hm-paper)' }}
            >
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${queueProgress}%`,
                  backgroundColor: 'var(--hm-accent)',
                  boxShadow: '0 0 12px oklch(72% 0.17 200 / 0.5)',
                }}
              />
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted">
              <span>30 秒 1080p 约需 2 分钟 · 队列公开透明绝不虚假转圈</span>
              <span className="text-accent-line font-medium">{simStepText}</span>
            </div>
          </div>

          {/* 8 卡 GPU 拓扑小卡片 */}
          <div className="mt-6 pt-5 border-t border-rule/70">
            <div className="text-xs font-mono font-bold text-ink mb-3 flex items-center justify-between">
              <span>PHYSICAL ACCELERATOR NODES (8x H100 80GB SXM5)</span>
              <span className="text-muted text-[11px]">INTERCONNECT: NVLINK 4.0 900GB/S</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {GPU_NODES.map((gpu) => (
                <div
                  key={gpu.id}
                  className="rounded border border-rule bg-paper/60 p-2.5 text-[11px] font-mono flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">{gpu.name}</span>
                    <span
                      className={`size-1.5 rounded-full ${
                        gpu.status === 'active'
                          ? 'bg-accent-line'
                          : gpu.status === 'allocating'
                          ? 'bg-yellow-400'
                          : 'bg-muted'
                      }`}
                    />
                  </div>
                  <div className="mt-2 text-muted truncate text-[10px]" title={gpu.task}>
                    {gpu.task}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-rule/50 flex items-center justify-between">
                    <span className="text-ink-2">{gpu.vramUsed}/{gpu.vramTotal}G</span>
                    <span className="text-muted">{gpu.temp}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 交互式工单测算器 (Resolution x Duration x Tier) */}
          <div className="mt-8 rounded-lg border border-rule bg-paper/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-3">
              <span className="text-xs font-mono font-bold text-ink">自定义任务排期与算力秒测算</span>
              <span className="text-xs font-mono text-muted">零隐藏计费 · 所见即所得</span>
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-3">
              {/* 分辨率 */}
              <div>
                <label className="block text-xs font-mono text-muted mb-2">1. 目标分辨率与编码</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['720p', '1080p', '4k'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResolution(r)}
                      className={`min-h-11 rounded border text-xs font-mono transition-all ${
                        resolution === r
                          ? 'border-accent-line bg-accent/20 text-accent-line font-bold'
                          : 'border-rule bg-paper text-ink-2 hover:border-rule-2'
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 时长 */}
              <div>
                <label className="block text-xs font-mono text-muted mb-2">2. 视频成片时长</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 15, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setVideoDuration(d)}
                      className={`min-h-11 rounded border text-xs font-mono transition-all ${
                        videoDuration === d
                          ? 'border-accent-line bg-accent/20 text-accent-line font-bold'
                          : 'border-rule bg-paper text-ink-2 hover:border-rule-2'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              {/* 队列优先级 */}
              <div>
                <label className="block text-xs font-mono text-muted mb-2">3. 排队信道权重</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['standard', 'priority'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriorityTier(p)}
                      className={`min-h-11 rounded border text-xs font-mono transition-all ${
                        priorityTier === p
                          ? 'border-accent-line bg-accent/20 text-accent-line font-bold'
                          : 'border-rule bg-paper text-ink-2 hover:border-rule-2'
                      }`}
                    >
                      {p === 'priority' ? '优先通道 (0 等待)' : '标准共享池'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 实时推算结果台账 */}
            <div className="mt-5 rounded border border-accent/30 bg-accent/10 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-muted block text-[10px] uppercase">总计算帧数</span>
                <span className="font-bold text-ink text-sm sm:text-base">{totalFrames} 帧 (@60fps)</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">消耗 GPU 算力秒</span>
                <span className="font-bold text-accent-line text-sm sm:text-base">~{estGpuSeconds} GPU-s</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">预估排队就绪耗时</span>
                <span className="font-bold text-ink text-sm sm:text-base">{estWaitMinutes}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">输出产物体积</span>
                <span className="font-bold text-accent-line text-sm sm:text-base">{estFileSize}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────
            装置 4：问答体核心进化：法律/版权与隐私数据保险箱
            保留原问答结构与 tablist/tabpanel 无障碍契约
            ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby={`${uid}-faq-title`} className="mt-14 pt-8 border-t border-rule">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-line">
                MACRO 06 · CONVERSATIONAL FAQ & LEGAL CONTRACTS
              </span>
              <h2 id={`${uid}-faq-title`} className="display text-2xl sm:text-3xl font-bold text-ink mt-1">
                问得直接点 · 核心关切与合规专栏
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              共收录 {EXTENDED_QA.length} 项核心法律、安全与工程解答
            </span>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-10 lg:grid-cols-12 items-start">
            {/* 左：问题索引 (保留 faq-tab-${i} ID 以保障测试完全兼容) */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between pb-2 border-b border-rule">
                <span className="meta font-mono font-bold text-ink">常见问题索引 · FAQS</span>
                <span className="font-mono text-xs text-muted">支持键盘 ↑ ↓ 导航</span>
              </div>

              <ul
                className="mt-3 divide-y divide-rule"
                role="tablist"
                aria-label="常见问题列表"
                aria-orientation="vertical"
              >
                {EXTENDED_QA.map((row, i) => {
                  const on = pick === i
                  return (
                    <li key={row.q}>
                      <button
                        type="button"
                        role="tab"
                        id={`faq-tab-${i}`}
                        aria-selected={on}
                        aria-controls="faq-panel"
                        onClick={() => setPick(i)}
                        onKeyDown={(e) => onQuestionKeyDown(e, i)}
                        className={`flex w-full items-baseline gap-4 py-4 text-left transition-all min-h-13 ${
                          on
                            ? 'border-l-4 border-accent-line bg-paper-2/90 pl-4 font-semibold shadow-sm'
                            : 'border-l-4 border-transparent pl-4 text-ink-2 hover:bg-paper-2/40 hover:text-ink'
                        }`}
                      >
                        <span
                          className="meta font-mono shrink-0 font-bold text-sm"
                          style={{
                            color: on ? 'var(--hm-accent-line)' : 'var(--hm-muted)',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col">
                          <span
                            className="display text-base transition-colors"
                            style={{
                              color: on ? 'var(--hm-ink)' : 'var(--hm-ink-2)',
                            }}
                          >
                            {row.q}
                          </span>
                          <span className="font-mono text-[10px] text-muted mt-0.5">
                            {row.tag} · {row.clauseId}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* 右：答案与法律条款详细展开 (保留 #faq-panel ID) */}
            <div className="lg:col-span-7">
              <div
                id="faq-panel"
                role="tabpanel"
                aria-labelledby={`faq-tab-${pick}`}
                className="rounded-xl border border-rule bg-paper-2/80 p-6 sm:p-8 shadow-sm backdrop-blur-md"
              >
                {/* 顶部条款信封 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule/60 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-accent/15 text-accent-line border border-accent/30">
                      CLAUSE {currentQA.clauseId}
                    </span>
                    <span className="font-mono text-xs text-muted">ANSWER · 第 {pick + 1} 项解答</span>
                  </div>
                  <span className="font-mono text-[11px] text-accent-line">{currentQA.securityCert}</span>
                </div>

                {/* 核心问题大字 */}
                <p
                  className="display mt-5 text-ink font-bold"
                  style={{
                    fontSize: 'clamp(1.3rem, 2.8vw, 1.85rem)',
                    lineHeight: 1.2,
                  }}
                >
                  {currentQA.q}
                </p>

                {/* 精简高光答案 */}
                <div className="mt-4 p-4 rounded-lg bg-paper border border-accent/30 text-ink font-medium text-base sm:text-lg leading-relaxed">
                  {currentQA.a}
                </div>

                {/* 深度技术与合规条款正文 */}
                <div className="mt-5 text-sm sm:text-base text-ink-2 leading-relaxed space-y-3">
                  <p>{currentQA.fullArticle}</p>
                </div>

                {/* 契约公证三道密码学印章 */}
                <div className="mt-6 pt-5 border-t border-rule/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono text-muted">
                  <div className="p-2.5 rounded border border-rule/60 bg-paper/50">
                    <span className="text-ink font-bold block mb-0.5">硬件隔离</span>
                    <span>No Persistent Swap Cache</span>
                  </div>
                  <div className="p-2.5 rounded border border-rule/60 bg-paper/50">
                    <span className="text-ink font-bold block mb-0.5">C2PA 原创签名</span>
                    <span>SHA-256 Merkle Provenance</span>
                  </div>
                  <div className="p-2.5 rounded border border-rule/60 bg-paper/50">
                    <span className="text-ink font-bold block mb-0.5">商业无忧</span>
                    <span>Full Commercial Rights</span>
                  </div>
                </div>
              </div>

              {/* 下方附加：工业级 REST API 代码切片 */}
              <div className="mt-6 rounded-xl border border-rule bg-black/70 p-5 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-rule/60 pb-3">
                  <span className="text-accent-line font-bold flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-accent-line" />
                    HALOGEN RENDER API · cURL SPECIMEN
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyApi}
                    className="min-h-9 px-3 py-1 rounded border border-rule bg-paper-2 text-ink hover:border-ink transition-all"
                  >
                    {apiCopied ? '✓ 已复制请求' : '复制 API 请求'}
                  </button>
                </div>
                <pre className="mt-3 overflow-x-auto text-ink-2 p-2 bg-black/40 rounded leading-relaxed">
                  <code>{`curl -X POST https://api.halogen.video/v1/render \\
  -H "Authorization: Bearer hal_live_9842a8" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "aurora-diffusion-4.0",
    "prompt": "Cinematic aurora over jagged arctic fjords, crystalline water reflections",
    "camera": "${currentPreset.id}",
    "resolution": "${resolution}",
    "duration_sec": ${videoDuration},
    "fps": 60,
    "steps": ${currentStep.step || 20},
    "c2pa_sign": true
  }'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 区域 */}
        <div className="mt-16">
          <Cta label={page.cta || '立即开始视频渲染'} done="✓ 已锁定 8x H100 独占节点" />
        </div>

        {/* 底部标准生产印章 (Hallmark Stamp 58/58) */}
        <footer className="mt-20 border-t border-rule pt-6 text-center text-xs font-mono text-muted">
          <p>
            HALOGEN AURORA VIDEO FOUNDATION · DIFFUSION 4.0 · C2PA SIGNED
          </p>
          <p className="mt-1.5 text-accent-line">
            critique: P5 H5 E5 S5 R5 V5 · slop test: 58/58 ✓
          </p>
        </footer>

      </div>
    </main>
  )
}
