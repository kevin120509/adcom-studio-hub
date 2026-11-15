import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { EASE, Logo } from '../components/ui'

const nav = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/#servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/#proceso', label: 'Proceso' },
  { to: '/contacto', label: 'Contacto' },
]

export default function SiteLayout({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const overHero = (pathname === '/' || pathname.startsWith('/proyectos/')) && !solid

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400)
    setSolid(y > 60)
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1 })
    let id = 0
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  const goHash = (h: string) => {
    const el = document.getElementById(h.replace('#', ''))
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' })
  }

  useEffect(() => {
    setOpen(false)
    if (hash && ready) {
      const t = setTimeout(() => goHash(hash), 120)
      return () => clearTimeout(t)
    }
  }, [pathname, hash, ready])

  // tocar un enlace de sección cuando ya estás en ella también debe desplazar
  const onNav = (to: string) => {
    setOpen(false)
    const i = to.indexOf('#')
    if (i >= 0 && pathname === '/' && hash === to.slice(i)) goHash(to.slice(i))
  }

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-100%' : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-9 z-40 transition-colors duration-500 ${solid || open ? 'border-b hairline bg-paper/85 backdrop-blur-xl' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8">
          <Link to="/" aria-label="ADCOM inicio"><Logo light={overHero && !open} /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={n.end}
                onClick={() => onNav(n.to)}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition ${overHero ? 'text-paper/85 hover:text-paper' : 'text-ink/70 hover:text-ink'} ${isActive && !n.to.includes('#') ? (overHero ? 'text-paper' : 'text-ink') : ''}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/contacto" className={`hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition sm:inline-flex ${overHero ? 'bg-paper text-ink hover:bg-white' : 'bg-ink text-paper hover:bg-clay'}`}>
              Cotizar proyecto <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button onClick={() => setOpen((o) => !o)} className={`rounded-full p-2.5 md:hidden ${overHero && !open ? 'text-paper' : 'text-ink'}`} aria-label="Abrir menú">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden md:hidden">
              <div className="flex flex-col gap-1 px-4 pb-6">
                {nav.map((n, i) => (
                  <motion.div key={n.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link to={n.to} onClick={() => onNav(n.to)} className="block border-b hairline py-3 font-display text-2xl">{n.label}</Link>
                  </motion.div>
                ))}
                <Link to="/contacto" className="mt-4 rounded-full bg-ink py-3 text-center text-sm font-semibold text-paper">Cotizar proyecto</Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <main className={ready ? '' : 'h-svh overflow-hidden'}>
        <Outlet />
      </main>

      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo light />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">Arquitectura, diseño comercial, construcción y remodelación de casonas en Mérida, Yucatán.</p>
            </div>
            <div>
              <h4 className="mb-4 text-xs uppercase tracking-[0.25em] text-paper/40">Sitio</h4>
              <ul className="space-y-2 text-sm text-paper/75">
                <li><Link to="/proyectos" className="hover:text-paper">Proyectos</Link></li>
                <li><Link to="/#servicios" className="hover:text-paper">Servicios</Link></li>
                <li><Link to="/contacto" className="hover:text-paper">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs uppercase tracking-[0.25em] text-paper/40">Contacto</h4>
              <ul className="space-y-2 text-sm text-paper/75">
                <li>999 000 0000 <span className="text-paper/40">(ficticio)</span></li>
                <li>hola@adcom-demo.mx</li>
                <li>Mérida, Yucatán</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs uppercase tracking-[0.25em] text-paper/40">Equipo ADCOM</h4>
              <Link to="/panel/entrar" className="inline-flex items-center gap-1.5 rounded-full border border-paper/20 px-4 py-2 text-sm hover:bg-paper hover:text-ink">
                Entrar a Studio Hub <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="mt-14 overflow-hidden">
            <p className="select-none font-display text-[22vw] font-light leading-[0.8] tracking-tighter text-paper/[0.06] md:text-[17vw]">ADCOM</p>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row">
            <span>© 2026 Grupo ADCOM · Demo con información ficticia</span>
            <span>Propuesta diseñada por CODIA Software</span>
          </div>
        </div>
      </footer>
    </>
  )
}
