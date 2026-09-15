import { Navigate, useParams } from 'react-router'
import { Footer, Nav } from '../components/archetypes'
import { themePageByTheme } from '../data/pages'
import { useThemeAttr } from '../theme-attr'
import { THEME_PAGE_COMPONENTS } from './themes'

export function ThemePage() {
  const { id = '' } = useParams()
  useThemeAttr(id)

  const page = themePageByTheme.get(id)
  if (!page) return <Navigate to="/" replace />

  const Body = THEME_PAGE_COMPONENTS[page.theme]

  return (
    <div className="min-h-[100dvh] bg-paper">
      <Nav page={page} />
      <Body page={page} />
      <Footer page={page} />
    </div>
  )
}
