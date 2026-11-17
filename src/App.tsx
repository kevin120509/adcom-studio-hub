import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DemoBanner, Loader, Toasts } from './components/ui'
import SiteLayout from './site/SiteLayout'
import Home from './site/Home'
import Portfolio from './site/Portfolio'
import ProjectPage from './site/ProjectPage'
import ContactPage from './site/ContactPage'
import PanelLayout from './panel/PanelLayout'
import Login from './panel/Login'
import Dashboard from './panel/Dashboard'
import Clients from './panel/Clients'
import Projects from './panel/Projects'
import ProjectFile from './panel/ProjectFile'
import Library from './panel/Library'
import Content from './panel/Content'
import Agenda from './panel/Agenda'
import Settings from './panel/Settings'
import Plans from './panel/Plans'

function ScrollTop() {
  const { pathname } = useLocation()
  // el sitio público hace su propio scroll al cambiar de página (con transición)
  useEffect(() => { if (pathname.startsWith('/panel')) window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  return (
    <div className="grain pt-9">
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>
      <ScrollTop />
      <DemoBanner />
      <Routes>
        <Route element={<SiteLayout ready={!loading} />}>
          <Route index element={<Home ready={!loading} />} />
          <Route path="proyectos" element={<Portfolio />} />
          <Route path="proyectos/:slug" element={<ProjectPage />} />
          <Route path="contacto" element={<ContactPage />} />
        </Route>
        <Route path="panel/entrar" element={<Login />} />
        <Route path="panel" element={<PanelLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clients />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="proyectos/:id" element={<ProjectFile />} />
          <Route path="biblioteca" element={<Library />} />
          <Route path="contenido" element={<Content />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="configuracion" element={<Settings />} />
          <Route path="planes" element={<Plans />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toasts />
    </div>
  )
}
