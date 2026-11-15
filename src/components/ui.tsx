import { AnimatePresence, motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Info, AlertTriangle, X, RotateCcw, Globe, LayoutDashboard } from 'lucide-react'
import { useStore } from '../store'

export const EASE = [0.16, 1, 0.3, 1] as const

export function Logo({ light = false, small = false }: { light?: boolean; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${light ? 'text-paper' : 'text-ink'}`}>
      <svg viewBox="0 0 40 40" className={small ? 'h-7 w-7' : 'h-9 w-9'} aria-hidden>
        <rect width="40" height="40" rx="9" fill="currentColor" />
        <path d="M10 29 20 10l10 19" fill="none" stroke={light ? '#1c1a17' : '#f4efe7'} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M14.5 23h11" stroke="#c2643a" strokeWidth="2.6" />
      </svg>
      <span className="leading-none">
        <span className={`block font-display font-medium tracking-tight ${small ? 'text-lg' : 'text-xl'}`}>ADCOM</span>
        {!small && <span className="block text-[10px] uppercase tracking-[0.28em] opacity-60">Mérida</span>}
      </span>
    </span>
  )
}

/* Pantalla de carga */
export function Loader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, 100, { duration: 2.1, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setN(Math.round(v)) })
    const t = setTimeout(onDone, 2600)
    return () => { c.stop(); clearTimeout(t) }
  }, [onDone])
  const words = ['Arquitectura', 'Diseño comercial', 'Construcción', 'Casonas']
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 text-paper sm:p-10"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-paper/50">
        <span>Grupo ADCOM</span>
        <span>Mérida · Yucatán</span>
      </div>
      <div className="relative">
        <motion.svg viewBox="0 0 120 80" className="mb-8 h-20 w-32 text-paper" aria-hidden>
          <motion.path d="M10 74 60 8l50 66" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: EASE }} />
          <motion.path d="M30 50h60" stroke="#c2643a" strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.9, ease: EASE }} />
        </motion.svg>
        <div className="overflow-hidden">
          <motion.h1 className="font-display text-6xl font-light tracking-tight sm:text-8xl" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }}>
            ADCOM
          </motion.h1>
        </div>
        <div className="mt-6 flex h-6 overflow-hidden text-sm text-paper/60">
          <motion.div animate={{ y: ['0%', '-25%', '-50%', '-75%'] }} transition={{ duration: 2.1, times: [0, 0.33, 0.66, 1], ease: 'easeInOut' }} className="flex flex-col">
            {words.map((w) => <span key={w} className="h-6 leading-6">{w}</span>)}
          </motion.div>
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-end justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-paper/50">Cargando Studio Hub</span>
          <span className="font-display text-5xl font-light tabular-nums">{n}<span className="text-clay">%</span></span>
        </div>
        <div className="h-px w-full bg-paper/15">
          <div className="h-px bg-clay" style={{ width: `${n}%` }} />
        </div>
      </div>
    </motion.div>
  )
}

/* Banda de demo + selector de vista */
export function DemoBanner() {
  const { pathname } = useLocation()
  const reset = useStore((s) => s.reset)
  const inPanel = pathname.startsWith('/panel')
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-between gap-3 bg-ink px-3 text-[11px] text-paper/80 sm:px-5 sm:text-xs">
      <span className="flex min-w-0 items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-clay" /></span>
        <span className="truncate"><b className="font-semibold text-paper">Demo</b><span className="hidden sm:inline"> · Propuesta CODIA para Grupo ADCOM · datos ficticios</span></span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <Link to="/" className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${!inPanel ? 'bg-paper text-ink' : 'hover:bg-paper/10'}`}>
          <Globe className="h-3.5 w-3.5" /> <span>Sitio</span>
        </Link>
        <Link to="/panel" className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${inPanel ? 'bg-paper text-ink' : 'hover:bg-paper/10'}`}>
          <LayoutDashboard className="h-3.5 w-3.5" /> <span>Panel</span>
        </Link>
        <button onClick={reset} title="Reiniciar datos de la demo" className="ml-1 rounded-full p-1.5 hover:bg-paper/10" aria-label="Reiniciar demo">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </span>
    </div>
  )
}

export function PlanBadge({ n, className = '' }: { n: 1 | 2 | 3; className?: string }) {
  const c = n === 1 ? 'border-sage/40 text-sage bg-sage/10' : n === 2 ? 'border-clay/40 text-clay bg-clay/10' : 'border-gold/50 text-gold bg-gold/10'
  return (
    <span title={`Incluido desde el Plan ${n}`} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c} ${className}`}>
      Plan {n}
    </span>
  )
}

export function Reveal({ children, delay = 0, y = 40, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* Título que entra palabra por palabra */
export function SplitText({ text, className = '', delay = 0, as: Tag = 'h2' }: { text: string; className?: string; delay?: number; as?: 'h1' | 'h2' | 'h3' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: 1800, bounce: 0 })
  const [v, setV] = useState(0)
  useEffect(() => { if (inView) mv.set(to) }, [inView, to, mv])
  useEffect(() => spring.on('change', (x) => setV(Math.round(x))), [spring])
  return <span ref={ref} className="tabular-nums">{prefix}{v.toLocaleString('es-MX')}{suffix}</span>
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismiss)
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-paper shadow-2xl shadow-ink/30"
          >
            {t.tone === 'warn' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-clay" /> : t.tone === 'info' ? <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9bb39c]" />}
            <span className="flex-1">{t.text}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Cerrar" className="opacity-50 hover:opacity-100"><X className="h-4 w-4" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={`max-h-[92svh] w-full overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl sm:p-7 ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl">{title}</h3>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-sand" aria-label="Cerrar"><X className="h-5 w-5" /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-clay">{error}</span>}
    </label>
  )
}

export const inputCls =
  'w-full rounded-lg border border-ink/15 bg-white/70 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-clay focus:bg-white focus:ring-4 focus:ring-clay/10'

export function Btn({ children, variant = 'dark', className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'dark' | 'light' | 'clay' | 'ghost' }) {
  const v = {
    dark: 'bg-ink text-paper hover:bg-ink-soft',
    light: 'bg-white/70 text-ink border border-ink/15 hover:bg-white',
    clay: 'bg-clay text-paper hover:bg-clay-dark',
    ghost: 'text-ink hover:bg-sand',
  }[variant]
  return (
    <button {...rest} className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${v} ${className}`}>
      {children}
    </button>
  )
}
