import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudUpload, FileText, Film, Folder, HardDrive, Image as ImageIcon, Ruler, Star, Upload } from 'lucide-react'
import { Btn, EASE, Field, Modal, inputCls } from '../components/ui'
import { img, type Media, type MediaKind, type MediaStatus } from '../data/mock'
import { fmtDate, useStore } from '../store'
import { card, PageHead } from './PanelLayout'

const kindIcon: Record<MediaKind, typeof ImageIcon> = { foto: ImageIcon, plano: Ruler, documento: FileText, video: Film }
const statusC: Record<MediaStatus, string> = {
  original: 'bg-white/90 text-muted',
  'en revisión': 'bg-gold/90 text-paper',
  seleccionada: 'bg-sage/90 text-paper',
}

export function MediaTile({ m }: { m: Media }) {
  const setStatus = useStore((s) => s.setMediaStatus)
  const [open, setOpen] = useState(false)
  const Icon = kindIcon[m.kind]
  return (
    <>
      <motion.button layout onClick={() => setOpen(true)} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} className="group overflow-hidden rounded-xl border hairline bg-white/60 text-left transition hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          {m.kind === 'foto' || m.kind === 'video' ? (
            <img src={img(m.url, 500, 375)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center bg-[repeating-linear-gradient(45deg,#e9e1d4,#e9e1d4_8px,#efe8dc_8px,#efe8dc_16px)]"><Icon className="h-10 w-10 text-ink/30" /></div>
          )}
          {m.kind === 'video' && <span className="absolute inset-0 grid place-items-center"><span className="grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-paper"><Film className="h-5 w-5" /></span></span>}
          <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur ${statusC[m.status]}`}>{m.status}</span>
        </div>
        <div className="p-2.5">
          <p className="flex items-center gap-1.5 truncate text-xs font-semibold"><Icon className="h-3.5 w-3.5 shrink-0 text-muted" /> {m.name}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted">{m.uploadedBy} · {fmtDate(m.date)} · {m.size}</p>
        </div>
      </motion.button>
      <Modal open={open} onClose={() => setOpen(false)} title={m.name} wide>
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <img src={img(m.url, 1000, 750)} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
          <div className="space-y-4 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between"><dt className="text-muted">Tipo</dt><dd className="capitalize">{m.kind}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Subió</dt><dd>{m.uploadedBy}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Fecha</dt><dd>{fmtDate(m.date, { day: 'numeric', month: 'long' })}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tamaño</dt><dd>{m.size}</dd></div>
            </dl>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Estado de revisión</p>
              <div className="grid gap-2">
                {(['original', 'en revisión', 'seleccionada'] as MediaStatus[]).map((st) => (
                  <button key={st} onClick={() => setStatus(m.id, st)} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left capitalize transition ${m.status === st ? 'border-ink bg-ink text-paper' : 'hairline hover:bg-white'}`}>
                    {st} {st === 'seleccionada' && <Star className="h-4 w-4" />}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Las fotos “seleccionadas” pueden usarse en el sitio y en redes. El original nunca se modifica en Drive.</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default function Library() {
  const { media, projects, addMedia } = useStore()
  const [params, setParams] = useSearchParams()
  const [folder, setFolder] = useState<string>('all')
  const [kind, setKind] = useState<'todos' | MediaKind>('todos')
  const [status, setStatus] = useState<'todos' | MediaStatus>('todos')
  const [up, setUp] = useState(params.get('subir') === '1')
  useEffect(() => { if (params.get('subir') === '1') setUp(true) }, [params])

  const list = media
    .filter((m) => folder === 'all' || m.projectId === folder)
    .filter((m) => kind === 'todos' || m.kind === kind)
    .filter((m) => status === 'todos' || m.status === status)
  const folders = projects.filter((p) => p.publicStatus !== 'archivado')
  const used = 38.4

  return (
    <>
      <PageHead title="Biblioteca de material" sub="Fotos, planos y documentos de cada obra, conectados a Google Drive." plan={2}>
        <Btn onClick={() => setUp(true)}><Upload className="h-4 w-4" /> Subir material</Btn>
      </PageHead>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className={`${card} p-3`}>
            <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">Carpetas de Drive</p>
            <button onClick={() => setFolder('all')} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm ${folder === 'all' ? 'bg-ink text-paper' : 'hover:bg-sand'}`}><HardDrive className="h-4 w-4" /> Todo <span className="ml-auto text-xs opacity-60">{media.length}</span></button>
            <div className="mt-1 max-h-72 space-y-0.5 overflow-y-auto scrollbar-thin lg:max-h-none">
              {folders.map((p) => (
                <button key={p.id} onClick={() => setFolder(p.id)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${folder === p.id ? 'bg-ink text-paper' : 'hover:bg-sand'}`}>
                  <Folder className={`h-4 w-4 shrink-0 ${folder === p.id ? '' : 'text-gold'}`} /> <span className="truncate">{p.name}</span>
                  <span className="ml-auto text-xs opacity-60">{media.filter((m) => m.projectId === p.id).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={`${card} p-4`}>
            <p className="flex items-center justify-between text-sm font-semibold">Espacio en Drive <span className="text-xs font-normal text-muted">{used} / 100 GB</span></p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand"><motion.div initial={{ width: 0 }} animate={{ width: `${used}%` }} transition={{ duration: 1.2, ease: EASE }} className="h-full rounded-full bg-gold" /></div>
            <p className="mt-2 text-xs text-muted">Los originales viven en Drive; el sistema solo guarda enlaces y estados.</p>
          </div>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['todos', 'foto', 'plano', 'documento', 'video'] as const).map((k) => (
              <button key={k} onClick={() => setKind(k)} className={`rounded-full border px-3.5 py-1.5 text-sm capitalize ${kind === k ? 'border-ink bg-ink text-paper' : 'hairline bg-white/50 hover:border-ink/40'}`}>{k === 'todos' ? 'Todo' : k + 's'}</button>
            ))}
            <span className="mx-1 hidden w-px bg-ink/10 sm:block" />
            {(['todos', 'original', 'en revisión', 'seleccionada'] as const).map((k) => (
              <button key={k} onClick={() => setStatus(k)} className={`rounded-full border px-3.5 py-1.5 text-sm capitalize ${status === k ? 'border-clay bg-clay text-paper' : 'hairline bg-white/50 hover:border-ink/40'}`}>{k === 'todos' ? 'Cualquier estado' : k}</button>
            ))}
          </div>
          <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>{list.map((m) => <MediaTile key={m.id} m={m} />)}</AnimatePresence>
          </motion.div>
          {!list.length && <p className={`${card} py-16 text-center text-sm text-muted`}>No hay archivos con estos filtros.</p>}
        </section>
      </div>

      <UploadModal
        open={up}
        defaultProject={folder !== 'all' ? folder : ''}
        onClose={() => { setUp(false); if (params.get('subir')) setParams({}, { replace: true }) }}
        onDone={(pid, n) => { addMedia(pid, n); setFolder(pid); setUp(false); if (params.get('subir')) setParams({}, { replace: true }) }}
      />
    </>
  )
}

function UploadModal({ open, onClose, onDone, defaultProject }: { open: boolean; onClose: () => void; onDone: (pid: string, n: number) => void; defaultProject: string }) {
  const projects = useStore((s) => s.projects).filter((p) => p.publicStatus !== 'archivado')
  const [pid, setPid] = useState(defaultProject)
  const [n, setN] = useState(0)
  const [prog, setProg] = useState<number | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => { if (open) { setPid(defaultProject); setN(0); setProg(null); setErr('') } }, [open, defaultProject])
  const start = () => {
    if (!pid) return setErr('Elige el proyecto al que pertenecen las fotos.')
    if (!n) return setErr('Agrega al menos un archivo.')
    setErr('')
    setProg(0)
    let v = 0
    const t = setInterval(() => {
      v += 9 + Math.random() * 14
      if (v >= 100) { clearInterval(t); setProg(100); setTimeout(() => onDone(pid, n), 350) } else setProg(v)
    }, 140)
  }
  return (
    <Modal open={open} onClose={onClose} title="Subir material">
      <div className="space-y-4">
        <Field label="Proyecto">
          <select className={inputCls} value={pid} onChange={(e) => { setPid(e.target.value); setErr('') }}>
            <option value="">Selecciona…</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <button type="button" onClick={() => { setN((x) => x + 3); setErr('') }} className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 bg-white/50 px-4 py-10 text-center transition hover:border-clay hover:bg-clay/5">
          <CloudUpload className="h-9 w-9 text-clay" />
          <span className="text-sm font-semibold">{n ? `${n} fotos listas para subir` : 'Toca para elegir fotos'}</span>
          <span className="text-xs text-muted">Demo: cada toque agrega 3 fotos de ejemplo</span>
        </button>
        {prog !== null && (
          <div>
            <div className="mb-1 flex justify-between text-xs"><span>Guardando en Drive…</span><span className="tabular-nums">{Math.round(prog)}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-clay transition-all" style={{ width: `${prog}%` }} /></div>
          </div>
        )}
        {err && <p className="text-sm font-medium text-clay">{err}</p>}
        <div className="flex justify-end gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={start} disabled={prog !== null}>Subir</Btn>
        </div>
      </div>
    </Modal>
  )
}
