import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FolderPlus, Landmark, Search } from 'lucide-react'
import { Btn, EASE, Field, Modal, inputCls } from '../components/ui'
import { img, P, users, type ProjectType, type PublicStatus, type Stage } from '../data/mock'
import { fmtDate, useStore } from '../store'
import { card, PageHead } from './PanelLayout'

export const pubBadge: Record<PublicStatus, { l: string; c: string }> = {
  publicado: { l: 'En sitio web', c: 'bg-sage/15 text-sage' },
  pendiente: { l: 'Pendiente de publicar', c: 'bg-gold/15 text-[#8a6a2c]' },
  privado: { l: 'Privado', c: 'bg-ink/8 text-muted' },
  archivado: { l: 'Archivado', c: 'bg-ink/8 text-muted line-through' },
}
const types: ('Todos' | ProjectType)[] = ['Todos', 'Residencial', 'Comercial', 'Remodelación', 'Construcción']

export default function Projects() {
  const [params, setParams] = useSearchParams()
  const { projects, clients, addProject } = useStore()
  const [type, setType] = useState<(typeof types)[number]>('Todos')
  const [q, setQ] = useState('')
  const estado = params.get('estado') as PublicStatus | null
  const [open, setOpen] = useState(params.get('nuevo') === '1')
  const nav = useNavigate()
  useEffect(() => { if (params.get('nuevo') === '1') setOpen(true) }, [params])

  const list = projects
    .filter((p) => (estado ? p.publicStatus === estado : p.publicStatus !== 'archivado'))
    .filter((p) => type === 'Todos' || p.type === type)
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <PageHead title="Proyectos" sub="Cada obra con su ficha, responsable, etapa y permiso de publicación." plan={1}>
        <Btn onClick={() => setOpen(true)}><FolderPlus className="h-4 w-4" /> Nuevo proyecto</Btn>
      </PageHead>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${type === t ? 'border-ink bg-ink text-paper' : 'hairline bg-white/50 hover:border-ink/40'}`}>{t}</button>
          ))}
          <select value={estado ?? ''} onChange={(e) => setParams(e.target.value ? { estado: e.target.value } : {}, { replace: true })} className="rounded-full border hairline bg-white/50 px-4 py-1.5 text-sm">
            <option value="">Cualquier estado web</option>
            <option value="publicado">En sitio web</option>
            <option value="pendiente">Pendiente de publicar</option>
            <option value="privado">Privado</option>
            <option value="archivado">Archivados</option>
          </select>
        </div>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar proyecto" className={`${inputCls} rounded-full pl-9`} />
        </div>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => {
            const c = clients.find((x) => x.id === p.clientId)
            return (
              <motion.div layout key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: i * 0.03, ease: EASE }}>
                <Link to={`/panel/proyectos/${p.id}`} className={`${card} group block overflow-hidden transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-ink/5`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                    <img src={img(p.cover, 700, 440)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${pubBadge[p.publicStatus].c} bg-white/85`}>{pubBadge[p.publicStatus].l}</span>
                    {p.inah && <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/85" title="Requiere gestión INAH"><Landmark className="h-3.5 w-3.5 text-clay" /></span>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-xl">{p.name}</h3>
                        <p className="truncate text-xs text-muted">{c?.name} · {p.type}</p>
                      </div>
                      <span className="shrink-0 rounded-md bg-sand px-2 py-0.5 text-[11px] font-semibold">{p.stage}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1, ease: EASE }} className={`h-full rounded-full ${p.progress === 100 ? 'bg-sage' : 'bg-clay'}`} />
                      </div>
                      <span className="text-xs font-semibold tabular-nums">{p.progress}%</span>
                    </div>
                    <p className="mt-3 text-xs text-muted">{p.owner} · act. {fmtDate(p.updatedAt)}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
      {!list.length && <p className={`${card} py-16 text-center text-sm text-muted`}>No hay proyectos con estos filtros.</p>}

      <NewProject
        open={open}
        onClose={() => { setOpen(false); if (params.get('nuevo')) setParams({}, { replace: true }) }}
        onSave={(f) => {
          const id = addProject({
            ...f, services: f.type === 'Remodelación' ? ['Casonas'] : f.type === 'Comercial' ? ['Comercial'] : f.type === 'Construcción' ? ['Construcción'] : ['Arquitectura'],
            stage: 'Anteproyecto', progress: 0, publicStatus: 'privado', permission: false, cover: P.blueprint, gallery: [P.blueprint], year: 2026, area: Number(f.area) || 0,
            tagline: '', descInternal: '', descPublic: '', driveFolder: `ADCOM / Proyectos / 2026 / ${f.name}`,
          })
          setOpen(false)
          nav(`/panel/proyectos/${id}`)
        }}
      />
    </>
  )
}

type NewF = { name: string; clientId: string; type: ProjectType; location: string; owner: string; area: string; inah: boolean }
function NewProject({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (f: Omit<NewF, 'area'> & { area: number }) => void }) {
  const clients = useStore((s) => s.clients)
  const empty: NewF = { name: '', clientId: '', type: 'Residencial', location: 'Mérida, Yucatán', owner: users[0].name, area: '', inah: false }
  const [f, setF] = useState(empty)
  const [err, setErr] = useState<Record<string, string>>({})
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (f.name.trim().length < 3) er.name = 'Ponle nombre al proyecto.'
    if (!f.clientId) er.clientId = 'Elige un cliente.'
    setErr(er)
    if (Object.keys(er).length) return
    onSave({ ...f, name: f.name.trim(), area: Number(f.area) || 0 })
    setF(empty)
  }
  return (
    <Modal open={open} onClose={onClose} title="Nuevo proyecto">
      <form onSubmit={save} noValidate className="space-y-4">
        <Field label="Nombre del proyecto" error={err.name}><input autoFocus className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ej. Casa Dzityá" /></Field>
        <Field label="Cliente" error={err.clientId}>
          <select className={inputCls} value={f.clientId} onChange={(e) => setF({ ...f, clientId: e.target.value })}>
            <option value="">Selecciona…</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <select className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as ProjectType, inah: e.target.value === 'Remodelación' ? f.inah : false })}>
              <option>Residencial</option><option>Comercial</option><option>Remodelación</option><option>Construcción</option>
            </select>
          </Field>
          <Field label="Superficie (m²)"><input className={inputCls} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value.replace(/\D/g, '') })} inputMode="numeric" /></Field>
        </div>
        <Field label="Ubicación general"><input className={inputCls} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
        <Field label="Responsable">
          <select className={inputCls} value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })}>{users.map((u) => <option key={u.id}>{u.name}</option>)}</select>
        </Field>
        <label className="flex items-center gap-3 rounded-xl bg-sand/60 p-3 text-sm">
          <input type="checkbox" checked={f.inah} onChange={(e) => setF({ ...f, inah: e.target.checked })} className="h-4 w-4 accent-[#b9562e]" />
          Requiere gestión o permisos ante el INAH
        </label>
        <p className="text-xs text-muted">Al guardar se crea la carpeta del proyecto en Google Drive (simulado).</p>
        <div className="flex justify-end gap-2 pt-1">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit">Crear proyecto</Btn>
        </div>
      </form>
    </Modal>
  )
}

export type { Stage }
