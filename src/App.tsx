import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { IndexPage } from './pages/index-page'
import { ThemePage } from './pages/theme-page'
import { useThemeSwitch } from './hooks/use-theme-switch'

const AboutPage = lazy(() =>
  import('./pages/about-page').then((m) => ({ default: m.AboutPage })),
)
const CustomPage = lazy(() =>
  import('./pages/custom-page').then((m) => ({ default: m.CustomPage })),
)

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function GlobalThemeWatcher() {
  const { activeToast } = useThemeSwitch()
  if (!activeToast) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full px-4 py-2 text-xs shadow-md transition-all duration-300"
      style={{
        backgroundColor: 'var(--hm-paper-2)',
        border: 'var(--hm-rule-card) solid var(--hm-accent)',
        color: 'var(--hm-ink)',
      }}
    >
      <span className="kbd text-[10px]">T</span>
      <span className="font-mono">{activeToast}</span>
    </div>
  )
}

function RouteFallback() {
  return (
    <div className="mx-auto min-h-[50vh] animate-pulse px-[var(--page-gutter)] py-24" style={{ maxWidth: 'var(--page-max)' }}>
      <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--hm-rule-2)' }} />
      <div className="mt-6 h-10 w-2/3 rounded" style={{ backgroundColor: 'var(--hm-paper-3)' }} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <GlobalThemeWatcher />
      <a href="#main" className="skip-link">
        跳到主要内容
      </a>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/themes/:id" element={<ThemePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="*" element={<IndexPage />} />
        </Routes>
      </Suspense>
      <div className="paper-grain" aria-hidden />
    </BrowserRouter>
  )
}
