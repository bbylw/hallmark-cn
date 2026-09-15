import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { AboutPage } from './pages/about-page'
import { CustomPage } from './pages/custom-page'
import { IndexPage } from './pages/index-page'
import { ThemePage } from './pages/theme-page'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <a href="#main" className="skip-link">
        跳到主要内容
      </a>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/themes/:id" element={<ThemePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/custom" element={<CustomPage />} />
        <Route path="*" element={<IndexPage />} />
      </Routes>
      <div className="paper-grain" aria-hidden />
    </BrowserRouter>
  )
}
