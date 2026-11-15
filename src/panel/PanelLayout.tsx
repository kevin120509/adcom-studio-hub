import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Users, FolderKanban, Images, PenSquare, CalendarDays, Settings, Layers, Bell, Search, Menu, X, LogOut, ExternalLink,
} from 'lucide-react'
import { EASE, Logo, PlanBadge } from '../components/ui'
import { useMe, useStore } from '../store'
import { TODAY } from '../data/mock'

export const navItems = [
  { to: '/panel', label: 'Inicio', icon: LayoutDashboard, plan: 2 as const, end: true },
  { to: '/panel/clientes', label: 'Clientes', icon: Users, plan: 2 as const },
  { to: '/panel/proyectos', label: 'Proyectos', icon: FolderKanban, plan: 1 as const },
  { to: '/panel/biblioteca', label: 'Biblioteca', icon: Images, plan: 2 as const },
  { to: '/panel/contenido', label: 'Contenido', icon: PenSquare, plan: 2 as const },
  { to: '/panel/agenda', label: 'Agenda', icon: CalendarDays, plan: 2 as const },
  { to: '/panel/configuracion', label: 'Configuración', icon: Settings, plan: 1 as const },
]

export default function PanelLayout() {
  const me = useMe()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [bell, setBell] = useState(false)
  const { pathname } = useLocation()
  const nav = useNavigate()
  const activity = useStore((s) => s.activity)
  const posts = useStore((s) => s.posts)
  const agenda = useStore((s) => s.agenda)
  const projects = useStore((s) => s.projects)
  const clients = useStore((s) => s.clients)
  const review = posts.filter((p) => p.status === 'revisión').length
  const today = agenda.filter((a) => a.date === TODAY && !a.done).length

  useEffect(() => { setOpen(false); setBell(false); setQ('') }, [pathname])

  const results = q.trim().length > 1
    ? [
        ...projects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).map((p) => ({ k: p.id, l: p.name, s: 'Proyecto', to: `/panel/proyectos/${p.id}` })),
        ...clients.filter((c) => `${c.name} ${c.company}`.toLowerCase().includes(q.toLowerCase())).map((c) => ({ k: c.id, l: c.name, s: 'Cliente', to: `/panel/clientes?c=${c.id}` })),
      ].slice(0, 6)
    : []

  const Side = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link to="/panel"><Logo small /></Link>
        <span className="rounded-md bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper">Studio Hub</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'text-paper' : 'text-ink/65 hover:bg-sand hover:text-ink'}`}>
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="side" className="absolute inset-0 rounded-xl bg-ink" transition={{ duration: 0.45, ease: EASE }} />}
                <n.icon className="relative h-[18px] w-[18px]" />
                <span className="relative flex-1">{n.label}</span>
                {n.label === 'Contenido' && review > 0 && <span className="relative rounded-full bg-clay px-1.5 text-[10px] font-bold text-paper">{review}</span>}
                {n.label === 'Agenda' && today > 0 && <span className={`relative rounded-full px-1.5 text-[10px] font-bold ${isActive ? 'bg-paper text-ink' : 'bg-ink/10'}`}>{today}</span>}
              </>
            )}
          </NavLink>
        ))}
        <div className="my-4 border-t hairline" />
        <NavLink to="/panel/planes" className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-clay text-paper' : 'text-clay hover:bg-clay/10'}`}>
          <Layers className="h-[18px] w-[18px]" /> Planes de la propuesta
        </NavLink>
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/65 hover:bg-sand hover:text-ink">
          <ExternalLink className="h-[18px] w-[18px]" /> Ver sitio público
        </Link>
      </nav>
      <div className="m-3 rounded-2xl border hairline bg-white/50 p-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-paper" style={{ background: me.color }}>{me.initials}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{me.name}</p>
            <p className="truncate text-xs text-muted">{me.role}</p>
          </div>
          <button onClick={() => nav('/panel/entrar')} className="rounded-lg p-2 text-muted hover:bg-sand hover:text-ink" aria-label="Cambiar de usuario" title="Cambiar de usuario"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[calc(100svh-2.25rem)] bg-paper">
      <aside className="sticky top-9 hidden h-[calc(100svh-2.25rem)] w-64 shrink-0 border-r hairline bg-paper lg:block">{Side}</aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 top-9 z-40 bg-ink/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed bottom-0 left-0 top-9 z-50 w-72 bg-paper shadow-2xl lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.4, ease: EASE }}>
              <button onClick={() => setOpen(false)} className="absolute right-3 top-4 z-10 rounded-full p-2 hover:bg-sand" aria-label="Cerrar menú"><X className="h-5 w-5" /></button>
              {Side}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-9 z-30 flex h-16 items-center gap-3 border-b hairline bg-paper/85 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-sand lg:hidden" aria-label="Abrir menú"><Menu className="h-5 w-5" /></button>
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar proyecto o cliente…" className="w-full rounded-full border hairline bg-white/60 py-2 pl-9 pr-4 text-sm outline-none focus:border-clay focus:bg-white" />
            <AnimatePresence>
              {q.trim().length > 1 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-11 overflow-hidden rounded-xl border hairline bg-white shadow-xl">
                  {results.length ? results.map((r) => (
                    <button key={r.k} onClick={() => nav(r.to)} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-sand/60">
                      <span>{r.l}</span><span className="text-xs text-muted">{r.s}</span>
                    </button>
                  )) : <p className="px-4 py-3 text-sm text-muted">Sin resultados para “{q}”</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-muted md:block">Sábado 14 de noviembre</span>
            <div className="relative">
              <button onClick={() => setBell((b) => !b)} className="relative rounded-full p-2.5 hover:bg-sand" aria-label="Notificaciones">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-clay ring-2 ring-paper" />
              </button>
              <AnimatePresence>
                {bell && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.25 }} className="absolute right-0 top-12 w-[min(88vw,340px)] overflow-hidden rounded-2xl border hairline bg-white shadow-2xl">
                    <p className="border-b hairline px-4 py-3 text-sm font-semibold">Actividad reciente</p>
                    <ul className="max-h-80 overflow-y-auto">
                      {activity.slice(0, 7).map((a) => (
                        <li key={a.id} className="border-b hairline px-4 py-3 text-sm last:border-0"><b>{a.who}</b> {a.text}<p className="mt-0.5 text-xs text-muted">{a.at}</p></li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-paper" style={{ background: me.color }}>{me.initials}</span>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function PageHead({ title, sub, plan, children }: { title: string; sub?: string; plan?: 1 | 2 | 3; children?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h1>
          {plan && <PlanBadge n={plan} />}
        </div>
        {sub && <p className="mt-1.5 text-sm text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export const card = 'rounded-2xl border hairline bg-white/55'
