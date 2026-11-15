import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { EASE, Logo } from '../components/ui'
import { img, P, users } from '../data/mock'
import { useStore } from '../store'

export default function Login() {
  const setUser = useStore((s) => s.setUser)
  const current = useStore((s) => s.currentUser)
  const [sel, setSel] = useState(current)
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const go = () => {
    setBusy(true)
    setUser(sel)
    setTimeout(() => nav('/panel'), 700)
  }
  return (
    <div className="grid min-h-[calc(100svh-2.25rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: EASE }} src={img(P.living2, 1600)} alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-10 bottom-12 text-paper">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-paper/60">ADCOM Studio Hub</p>
          <p className="max-w-md font-display text-4xl font-light leading-tight">Proyectos, material y publicaciones en un solo lugar.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="w-full max-w-md">
          <Logo />
          <h1 className="mt-10 font-display text-4xl tracking-tight">Entrar al panel</h1>
          <p className="mt-2 text-sm text-muted">Elige con qué perfil quieres ver la demo. Cada rol tiene permisos distintos.</p>
          <div className="mt-8 space-y-2.5">
            {users.map((u) => (
              <button key={u.id} onClick={() => setSel(u.id)} className={`flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition ${sel === u.id ? 'border-ink bg-white shadow-lg shadow-ink/5' : 'hairline bg-white/40 hover:bg-white/80'}`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-paper" style={{ background: u.color }}>{u.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{u.name}</span>
                  <span className="block truncate text-xs text-muted">{u.role} · {u.permissions}</span>
                </span>
                <span className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${sel === u.id ? 'border-ink bg-ink ring-4 ring-ink/10' : 'border-ink/25'}`} />
              </button>
            ))}
          </div>
          <button onClick={go} disabled={busy} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-70">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Entrando…</> : <>Entrar <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck className="h-3.5 w-3.5" /> En la versión real: acceso con cuenta de Google de ADCOM</p>
        </motion.div>
      </div>
    </div>
  )
}
