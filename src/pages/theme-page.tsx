import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router'
import { Footer, Nav } from '../components/archetypes'
import { themePageByTheme } from '../data/pages'
import { useThemeAttr } from '../theme-attr'
import { THEME_PAGE_COMPONENTS } from './themes'

function ThemeSkeleton() {
  return (
    <div
      className="mx-auto min-h-[60vh] animate-pulse px-[var(--page-gutter)] py-20"
      style={{ maxWidth: 'var(--page-max)' }}
      aria-busy="true"
      aria-label="正在加载主题装置..."
    >
      <div
        className="h-4 w-28 rounded"
        style={{ backgroundColor: 'var(--hm-rule-2)' }}
      />
      <div
        className="mt-6 h-12 w-3/4 max-w-xl rounded"
        style={{ backgroundColor: 'var(--hm-paper-3)' }}
      />
      <div
        className="mt-6 h-6 w-1/2 max-w-md rounded"
        style={{ backgroundColor: 'var(--hm-paper-2)' }}
      />
      <div
        className="mt-12 h-64 w-full rounded"
        style={{
          backgroundColor: 'var(--hm-paper-2)',
          border: 'var(--hm-rule-card) solid var(--hm-rule)',
        }}
      />
    </div>
  )
}

export function ThemePage() {
  const { id = '' } = useParams()
  useThemeAttr(id)

  const page = themePageByTheme.get(id)
  if (!page) return <Navigate to="/" replace />

  const Body = THEME_PAGE_COMPONENTS[page.theme]

  return (
    <div className="min-h-[100dvh] bg-paper">
      <Nav page={page} />
      <Suspense fallback={<ThemeSkeleton />}>
        {Body ? <Body page={page} /> : null}
      </Suspense>
      <Footer page={page} />
    </div>
  )
}
