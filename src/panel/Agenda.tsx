import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Phone, Plus, Users2, HardHat, Repeat } from 'lucide-react'
import { Btn, EASE, Field, Modal, inputCls } from '../components/ui'
import { TODAY, users, type AgendaItem } from '../data/mock'
import { fmtDate, useStore } from '../store'
import { card, PageHead } from './PanelLayout'

const kindIcon = { Llamada: Phone, 'Visita a obra': HardHat, Reunión: Users2, Seguimiento: Repeat }
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function Agenda() {
  const { agenda, clients, toggleAgenda, addAgenda } = useStore()
  const [month, setMonth] = useState(new Date(2026, 10, 1))
  const [day, setDay] = useState(TODAY)
  const [who, setWho] = useState('todos')
  const [open, setOpen] = useState(false)

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const start = new Date(first)
    start.setDate(1 - ((first.getDay() + 6) % 7))
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  }, [month])

  const filtered = agenda.filter((a) => who === 'todos' || a.owner === who)
  const dayItems = filtered.filter((a) => a.date === day).sort((a, b) => a.time.localeCompare(b.time))
  const upcoming = filtered.filter((a) => a.date > day && !a.done).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5)
  const overdue = filtered.filter((a) => a.date < TODAY && !a.done)

  return (
    <>
      <PageHead title="Agenda y seguimiento" sub="Llamadas, visitas y próximas acciones de cada cliente." plan={2}>
        <select value={who} onChange={(e) => setWho(e.target.value)} className="rounded-full border hairline bg-white/70 px-4 py-2 text-sm">
          <option value="todos">Todo el equipo</option>
          {users.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
        </select>
        <Btn onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Agendar</Btn>
      </PageHead>

      {overdue.length > 0 && (
        <div className="mb-4 rounded-2xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay-dark">
          <b>{overdue.length} pendiente(s) atrasado(s):</b> {overdue.map((o) => o.title).join(' · ')}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <section className={`${card} p-4 sm:p-6`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl capitalize">{month.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex gap-1">
              <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-full p-2 hover:bg-sand" aria-label="Mes anterior"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => { setMonth(new Date(2026, 10, 1)); setDay(TODAY) }} className="rounded-full px-3 text-sm font-semibold hover:bg-sand">Hoy</button>
              <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-full p-2 hover:bg-sand" aria-label="Mes siguiente"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => <span key={d} className="py-2">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const k = iso(d)
              const items = filtered.filter((a) => a.date === k)
              const inMonth = d.getMonth() === month.getMonth()
              const sel = k === day
              return (
                <button key={k} onClick={() => setDay(k)} className={`relative flex aspect-square flex-col items-center justify-start rounded-xl p-1 text-sm transition sm:aspect-[1.15] sm:items-start sm:p-2 ${sel ? 'bg-ink text-paper' : k === TODAY ? 'bg-clay/10 font-bold text-clay' : 'hover:bg-sand'} ${inMonth ? '' : 'opacity-35'}`}>
                  <span>{d.getDate()}</span>
                  <span className="mt-auto flex gap-0.5">
                    {items.slice(0, 3).map((a) => <span key={a.id} className={`h-1.5 w-1.5 rounded-full ${a.done ? 'bg-sage' : sel ? 'bg-paper' : 'bg-clay'}`} />)}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className={`${card} p-5 sm:p-6`}>
            <h2 className="mb-4 font-display text-xl capitalize">{day === TODAY ? 'Hoy, ' : ''}{fmtDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
            <AnimatePresence mode="popLayout">
              {dayItems.map((a) => <Row key={a.id} a={a} client={clients.find((c) => c.id === a.clientId)?.name} onToggle={() => toggleAgenda(a.id)} />)}
            </AnimatePresence>
            {!dayItems.length && (
              <div className="rounded-xl border border-dashed hairline py-8 text-center text-sm text-muted">
                Nada agendado este día.
                <button onClick={() => setOpen(true)} className="mt-2 block w-full font-semibold text-clay hover:underline">Agendar algo</button>
              </div>
            )}
          </div>
          <div className={`${card} p-5 sm:p-6`}>
            <h2 className="mb-3 font-display text-xl">Próximos</h2>
            <ul className="divide-y hairline">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="w-14 shrink-0 text-xs font-semibold text-muted">{fmtDate(a.date)}</span>
                  <span className="flex-1 truncate">{a.title}</span>
                  <span className="text-xs text-muted">{a.time}</span>
                </li>
              ))}
              {!upcoming.length && <li className="py-4 text-center text-sm text-muted">Sin próximos pendientes.</li>}
            </ul>
          </div>
        </section>
      </div>

      <NewItem open={open} day={day} onClose={() => setOpen(false)} onSave={(a) => { addAgenda(a); setDay(a.date); setOpen(false) }} />
    </>
  )
}

function Row({ a, client, onToggle }: { a: AgendaItem; client?: string; onToggle: () => void }) {
  const I = kindIcon[a.kind]
  return (
    <motion.div layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="mb-2 flex items-start gap-3 rounded-xl border hairline bg-white/60 p-3">
      <button onClick={onToggle} aria-label={a.done ? 'Marcar pendiente' : 'Marcar hecho'} className="mt-0.5">
        {a.done ? <CheckCircle2 className="h-5 w-5 text-sage" /> : <Circle className="h-5 w-5 text-ink/30 hover:text-ink" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${a.done ? 'text-muted line-through' : ''}`}>{a.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted"><I className="h-3.5 w-3.5" /> {a.time} · {a.kind} · {a.owner.replace(/^(Arq\.|Ing\.) /, '')}</p>
        {client && <Link to={`/panel/clientes?c=${a.clientId}`} className="mt-1 inline-block text-xs font-semibold text-clay hover:underline">{client}</Link>}
      </div>
    </motion.div>
  )
}

function NewItem({ open, day, onClose, onSave }: { open: boolean; day: string; onClose: () => void; onSave: (a: Omit<AgendaItem, 'id'>) => void }) {
  const clients = useStore((s) => s.clients)
  const [f, setF] = useState({ title: '', clientId: '', date: day, time: '10:00', owner: users[1].name, kind: 'Llamada' as AgendaItem['kind'] })
  const [err, setErr] = useState('')
  useEffect(() => { if (open) { setF((x) => ({ ...x, date: day, title: '', clientId: '' })); setErr('') } }, [open, day])
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (f.title.trim().length < 3) return setErr('Describe la actividad.')
    if (!f.clientId) return setErr('Elige un cliente.')
    setErr('')
    onSave({ ...f, title: f.title.trim(), done: false })
  }
  return (
    <Modal open={open} onClose={onClose} title="Agendar actividad">
      <form onSubmit={save} noValidate className="space-y-4">
        <Field label="Actividad"><input autoFocus className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Ej. Llamar para confirmar visita" /></Field>
        <Field label="Cliente">
          <select className={inputCls} value={f.clientId} onChange={(e) => setF({ ...f, clientId: e.target.value })}>
            <option value="">Selecciona…</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha"><input type="date" className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Hora"><input type="time" className={inputCls} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <select className={inputCls} value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as AgendaItem['kind'] })}>
              <option>Llamada</option><option>Visita a obra</option><option>Reunión</option><option>Seguimiento</option>
            </select>
          </Field>
          <Field label="Responsable">
            <select className={inputCls} value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })}>{users.map((u) => <option key={u.id}>{u.name}</option>)}</select>
          </Field>
        </div>
        {err && <p className="text-sm font-medium text-clay">{err}</p>}
        <div className="flex justify-end gap-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit">Agendar</Btn>
        </div>
      </form>
    </Modal>
  )
}
