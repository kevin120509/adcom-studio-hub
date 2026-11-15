import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, Mail, MessageCircle, Phone, Plus, Search, UserRound, X } from 'lucide-react'
import { Btn, EASE, Field, Modal, inputCls } from '../components/ui'
import { img, TODAY, users, type Client, type ClientStatus } from '../data/mock'
import { fmtDate, useStore } from '../store'
import { card, PageHead } from './PanelLayout'

const tabs: ('Todos' | ClientStatus)[] = ['Todos', 'Prospecto', 'Activo', 'Cerrado']
const badge: Record<ClientStatus, string> = {
  Prospecto: 'bg-gold/15 text-[#8a6a2c]',
  Activo: 'bg-sage/15 text-sage',
  Cerrado: 'bg-ink/8 text-muted',
}

export default function Clients() {
  const [params, setParams] = useSearchParams()
  const estado = (params.get('estado') as ClientStatus | null) ?? 'Todos'
  const selId = params.get('c')
  const { clients, projects, addClient, updateClient, addAgenda, toast } = useStore()
  const [q, setQ] = useState('')
  const [newOpen, setNewOpen] = useState(false)

  const list = clients
    .filter((c) => estado === 'Todos' || c.status === estado)
    .filter((c) => `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(q.toLowerCase()))
  const sel = clients.find((c) => c.id === selId)

  const setParam = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v); else n.delete(k)
    setParams(n, { replace: true })
  }

  return (
    <>
      <PageHead title="Clientes y contactos" sub="La agenda de clientes, ordenada y sin libretas." plan={2}>
        <Btn onClick={() => setNewOpen(true)}><Plus className="h-4 w-4" /> Nuevo cliente</Btn>
      </PageHead>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-full border hairline bg-white/50 p-1">
          {tabs.map((t) => {
            const n = t === 'Todos' ? clients.length : clients.filter((c) => c.status === t).length
            return (
              <button key={t} onClick={() => setParam('estado', t === 'Todos' ? null : t)} className={`relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${estado === t ? 'text-paper' : 'text-ink/60 hover:text-ink'}`}>
                {estado === t && <motion.span layoutId="ctab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.4, ease: EASE }} />}
                <span className="relative">{t} <span className="opacity-60">{n}</span></span>
              </button>
            )
          })}
        </div>
        <div className="relative md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar por nombre o empresa" className={`${inputCls} rounded-full pl-9`} />
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="hidden grid-cols-[1.4fr_1fr_1.4fr_0.8fr_0.7fr] gap-4 border-b hairline px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted lg:grid">
          <span>Cliente</span><span>Tipo</span><span>Siguiente acción</span><span>Responsable</span><span>Estado</span>
        </div>
        <ul className="divide-y divide-ink/10">
          <AnimatePresence initial={false}>
            {list.map((c) => (
              <motion.li key={c.id} layout initial={{ opacity: 0, backgroundColor: '#f1dccf' }} animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0)' }} transition={{ duration: 1.2 }}>
                <button onClick={() => setParam('c', c.id)} className={`grid w-full gap-2 px-5 py-4 text-left text-sm transition hover:bg-sand/40 lg:grid-cols-[1.4fr_1fr_1.4fr_0.8fr_0.7fr] lg:items-center lg:gap-4 ${selId === c.id ? 'bg-sand/60' : ''}`}>
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand font-semibold">{c.name[0]}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{c.name}</span>
                      <span className="block truncate text-xs text-muted">{c.company} · {c.source}</span>
                    </span>
                  </span>
                  <span className="text-muted">{c.type}</span>
                  <span>
                    <span className="block">{c.nextAction}</span>
                    <span className={`text-xs ${c.nextDate <= TODAY ? 'font-semibold text-clay' : 'text-muted'}`}>{c.nextDate <= TODAY ? 'Hoy · ' : ''}{fmtDate(c.nextDate, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  </span>
                  <span className="text-muted">{c.owner.replace(/^(Arq\.|Ing\.) /, '')}</span>
                  <span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[c.status]}`}>{c.status}</span></span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {!list.length && <p className="py-14 text-center text-sm text-muted">No hay clientes con ese filtro.</p>}
      </div>

      {/* Detalle lateral */}
      <AnimatePresence>
        {sel && (
          <>
            <motion.div className="fixed inset-0 top-9 z-[60] bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setParam('c', null)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.45, ease: EASE }} className="fixed bottom-0 right-0 top-9 z-[61] w-full overflow-y-auto bg-paper p-6 shadow-2xl sm:w-[440px]">
              <ClientDetail
                c={sel}
                projects={projects.filter((p) => p.clientId === sel.id)}
                onClose={() => setParam('c', null)}
                onUpdate={(patch) => { updateClient(sel.id, patch); toast('Cliente actualizado') }}
                onSchedule={(date, time, title) => {
                  addAgenda({ clientId: sel.id, title, date, time, owner: sel.owner, kind: 'Seguimiento', done: false })
                  updateClient(sel.id, { nextAction: title, nextDate: date })
                }}
                onContact={(how) => { updateClient(sel.id, { lastContact: TODAY }); toast(`${how} a ${sel.name} (simulado) · último contacto actualizado`, 'info') }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <NewClient open={newOpen} onClose={() => setNewOpen(false)} onSave={(c) => { const id = addClient(c); setNewOpen(false); toast('Cliente registrado'); setParam('c', id) }} />
    </>
  )
}

function ClientDetail({ c, projects, onClose, onUpdate, onSchedule, onContact }: {
  c: Client
  projects: ReturnType<typeof useStore.getState>['projects']
  onClose: () => void
  onUpdate: (p: Partial<Client>) => void
  onSchedule: (date: string, time: string, title: string) => void
  onContact: (how: string) => void
}) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('2026-11-18')
  const [time, setTime] = useState('10:00')
  const [notes, setNotes] = useState(c.notes)
  return (
    <div key={c.id}>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-ink font-display text-xl text-paper">{c.name[0]}</span>
          <div>
            <h2 className="font-display text-2xl leading-tight">{c.name}</h2>
            <p className="text-sm text-muted">{c.company} · {c.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-sand" aria-label="Cerrar"><X className="h-5 w-5" /></button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => onContact('Llamada')} className="flex flex-col items-center gap-1 rounded-xl border hairline bg-white/60 py-3 text-xs font-semibold hover:bg-white"><Phone className="h-4 w-4" /> Llamar</button>
        <button onClick={() => onContact('WhatsApp enviado')} className="flex flex-col items-center gap-1 rounded-xl border hairline bg-white/60 py-3 text-xs font-semibold hover:bg-white"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
        <button onClick={() => onContact('Correo enviado')} className="flex flex-col items-center gap-1 rounded-xl border hairline bg-white/60 py-3 text-xs font-semibold hover:bg-white"><Mail className="h-4 w-4" /> Correo</button>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Teléfono</dt><dd>{c.phone}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">Correo</dt><dd className="truncate">{c.email}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Origen</dt><dd>{c.source}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Último contacto</dt><dd>{fmtDate(c.lastContact, { day: 'numeric', month: 'long' })}</dd></div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Estado</dt>
          <dd>
            <select value={c.status} onChange={(e) => onUpdate({ status: e.target.value as ClientStatus })} className="rounded-lg border hairline bg-white px-2 py-1 text-sm">
              <option>Prospecto</option><option>Activo</option><option>Cerrado</option>
            </select>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Responsable</dt>
          <dd>
            <select value={c.owner} onChange={(e) => onUpdate({ owner: e.target.value })} className="rounded-lg border hairline bg-white px-2 py-1 text-sm">
              {users.map((u) => <option key={u.id}>{u.name}</option>)}
            </select>
          </dd>
        </div>
      </dl>

      <div className="mt-6 rounded-2xl bg-clay/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-clay">Siguiente acción</p>
        <p className="mt-1 font-medium">{c.nextAction}</p>
        <p className="text-sm text-muted">{fmtDate(c.nextDate, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (title.trim().length < 3) return; onSchedule(date, time, title.trim()); setTitle('') }}
        className="mt-4 space-y-2 rounded-2xl border hairline p-4"
      >
        <p className="text-sm font-semibold">Agendar seguimiento</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Enviar cotización" className={inputCls} />
        <div className="grid grid-cols-[1fr_7.5rem] gap-2">
          <input type="date" value={date} min={TODAY} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
        </div>
        <Btn type="submit" disabled={title.trim().length < 3} className="w-full"><CalendarPlus className="h-4 w-4" /> Agendar</Btn>
      </form>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold">Proyectos ({projects.length})</p>
        {projects.length ? (
          <div className="space-y-2">
            {projects.map((p) => (
              <Link key={p.id} to={`/panel/proyectos/${p.id}`} className="flex items-center gap-3 rounded-xl border hairline bg-white/50 p-2 hover:bg-white">
                <img src={img(p.cover, 100, 100)} alt="" className="h-11 w-11 rounded-lg object-cover" />
                <span className="flex-1 text-sm"><b className="block font-semibold">{p.name}</b><span className="text-xs text-muted">{p.stage} · {p.progress}%</span></span>
              </Link>
            ))}
          </div>
        ) : <p className="flex items-center gap-2 rounded-xl bg-sand/50 p-3 text-sm text-muted"><UserRound className="h-4 w-4" /> Sin proyectos todavía.</p>}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold">Notas</p>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== c.notes && onUpdate({ notes })} className={`${inputCls} min-h-24`} placeholder="Notas internas…" />
      </div>
    </div>
  )
}

function NewClient({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (c: Omit<Client, 'id'>) => void }) {
  const empty = { name: '', company: '', phone: '', email: '', type: 'Residencial' as Client['type'] }
  const [f, setF] = useState(empty)
  const [err, setErr] = useState<Record<string, string>>({})
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (f.name.trim().length < 3) er.name = 'Nombre obligatorio.'
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = '10 dígitos.'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Correo no válido.'
    setErr(er)
    if (Object.keys(er).length) return
    onSave({ ...f, company: f.company || 'Particular', status: 'Prospecto', lastContact: TODAY, nextAction: 'Primer contacto', nextDate: TODAY, owner: 'Abril Navarro', source: 'Registro manual', notes: '' })
    setF(empty)
  }
  return (
    <Modal open={open} onClose={onClose} title="Nuevo cliente">
      <form onSubmit={save} noValidate className="space-y-4">
        <Field label="Nombre" error={err.name}><input autoFocus className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Empresa (opcional)"><input className={inputCls} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teléfono" error={err.phone}><input className={inputCls} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel" /></Field>
          <Field label="Correo" error={err.email}><input className={inputCls} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        </div>
        <Field label="Tipo de cliente">
          <select className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as Client['type'] })}>
            <option>Residencial</option><option>Comercial</option><option>Desarrollador</option><option>Institución</option>
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit">Guardar cliente</Btn>
        </div>
      </form>
    </Modal>
  )
}
