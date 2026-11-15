import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ExternalLink, FolderOpen, Globe2, Landmark, Lock, Sparkles, Upload, Archive, EyeOff } from 'lucide-react'
import { Btn, EASE, PlanBadge, inputCls } from '../components/ui'
import { img, users, type Stage } from '../data/mock'
import { can, fmtDate, useMe, useStore } from '../store'
import { card } from './PanelLayout'
import { pubBadge } from './Projects'
import { MediaTile } from './Library'
import { PostCard } from './Content'

const stages: Stage[] = ['Anteproyecto', 'Permisos', 'Obra', 'Entregado']
const stageProgress: Record<Stage, number> = { Anteproyecto: 15, Permisos: 35, Obra: 60, Entregado: 100 }

export default function ProjectFile() {
  const { id } = useParams()
  return <ProjectFileInner key={id} id={id} />
}

function ProjectFileInner({ id }: { id?: string }) {
  const nav = useNavigate()
  const s = useStore()
  const me = useMe()
  const canEdit = can(me.id, 'editar')
  const canPublish = can(me.id, 'publicarSitio')
  const p = s.projects.find((x) => x.id === id)
  const [tab, setTab] = useState<'resumen' | 'material' | 'contenido'>('resumen')
  const [desc, setDesc] = useState({ i: p?.descInternal ?? '', p: p?.descPublic ?? '', t: p?.tagline ?? '' })

  if (!p) return <div className="py-20 text-center"><p className="font-display text-2xl">Proyecto no encontrado</p><Link to="/panel/proyectos" className="mt-4 inline-block text-clay underline">Volver</Link></div>

  const client = s.clients.find((c) => c.id === p.clientId)
  const media = s.media.filter((m) => m.projectId === p.id)
  const posts = s.posts.filter((x) => x.projectId === p.id)
  const ready = p.permission && desc.p.trim().length > 20 && media.some((m) => m.kind === 'foto' && m.status === 'seleccionada')
  const checks = [
    { ok: p.permission, l: 'Cliente autorizó publicar fotos' },
    { ok: desc.p.trim().length > 20, l: 'Descripción pública escrita' },
    { ok: media.some((m) => m.kind === 'foto' && m.status === 'seleccionada'), l: 'Al menos una foto seleccionada' },
  ]

  const saveDesc = () => {
    s.updateProject(p.id, { descInternal: desc.i, descPublic: desc.p, tagline: desc.t })
    s.toast('Ficha guardada')
  }

  return (
    <>
      <button onClick={() => nav(-1)} className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Volver</button>

      <div className={`${card} overflow-hidden`}>
        <div className="relative h-52 sm:h-64">
          <img src={img(p.cover, 1600, 500)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3 text-paper sm:inset-x-7">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className={`rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold ${pubBadge[p.publicStatus].c}`}>{pubBadge[p.publicStatus].l}</span>
                {p.inah && <span className="inline-flex items-center gap-1 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold"><Landmark className="h-3 w-3" /> INAH</span>}
              </div>
              <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{p.name}</h1>
              <p className="text-sm text-paper/75">{client?.name} · {p.location}</p>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); s.toast(`Abriendo Drive: ${p.driveFolder} (simulado)`, 'info') }} className="inline-flex items-center gap-2 rounded-full bg-paper/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-paper/25">
              <FolderOpen className="h-4 w-4" /> Carpeta en Drive
            </a>
          </div>
        </div>

        {/* Etapas */}
        <div className="border-t hairline p-5 sm:p-7">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold">Etapa del proyecto</span>
            <span className="text-muted">Avance {p.progress}%</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {stages.map((st, i) => {
              const cur = stages.indexOf(p.stage)
              const done = i <= cur
              return (
                <button key={st} disabled={!canEdit} onClick={() => { s.updateProject(p.id, { stage: st, progress: Math.max(stageProgress[st], st === p.stage ? p.progress : 0) }); s.log(`movió ${p.name} a etapa ${st}`) }} className="group min-w-0 text-left disabled:cursor-not-allowed">
                  <div className="h-1.5 overflow-hidden rounded-full bg-sand"><motion.div animate={{ width: done ? '100%' : '0%' }} transition={{ duration: 0.6, ease: EASE }} className="h-full bg-ink" /></div>
                  <span title={st} className={`mt-2 flex min-w-0 items-center gap-1 text-[10px] font-semibold sm:text-sm ${done ? 'text-ink' : 'text-muted group-hover:text-ink'}`}>{done && <Check className="hidden h-3.5 w-3.5 shrink-0 sm:block" />}<span className="truncate">{st}</span></span>
                </button>
              )
            })}
          </div>
          <input type="range" disabled={!canEdit} min={0} max={100} value={p.progress} onChange={(e) => s.updateProject(p.id, { progress: Number(e.target.value) })} className="mt-5 w-full accent-[#b9562e]" aria-label="Avance" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex gap-1 rounded-full border hairline bg-white/50 p-1">
            {([['resumen', 'Ficha'], ['material', `Material · ${media.length}`], ['contenido', `Posts · ${posts.length}`]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`relative flex-1 whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium sm:px-3 sm:text-sm ${tab === k ? 'text-paper' : 'text-ink/60 hover:text-ink'}`}>
                {tab === k && <motion.span layoutId="ptab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.4, ease: EASE }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>

          {tab === 'resumen' && (
            <div className={`${card} space-y-5 p-5 sm:p-6`}>
              <div className="grid gap-4 text-sm sm:grid-cols-3">
                <div><p className="text-xs text-muted">Tipo</p><p className="font-semibold">{p.type}</p></div>
                <div><p className="text-xs text-muted">Superficie</p><p className="font-semibold">{p.area} m²</p></div>
                <div>
                  <p className="text-xs text-muted">Responsable</p>
                  <select value={p.owner} onChange={(e) => s.updateProject(p.id, { owner: e.target.value })} className="mt-0.5 rounded-md border hairline bg-white px-2 py-1 text-sm font-semibold">
                    {users.map((u) => <option key={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><Lock className="h-3 w-3" /> Descripción interna (solo equipo)</span>
                <textarea value={desc.i} onChange={(e) => setDesc({ ...desc, i: e.target.value })} className={`${inputCls} min-h-20`} />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><Globe2 className="h-3 w-3" /> Frase corta para el sitio</span>
                <input value={desc.t} onChange={(e) => setDesc({ ...desc, t: e.target.value })} className={inputCls} placeholder="Ej. Una casa abierta al jardín." />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><Globe2 className="h-3 w-3" /> Descripción pública</span>
                <textarea value={desc.p} onChange={(e) => setDesc({ ...desc, p: e.target.value })} className={`${inputCls} min-h-28`} placeholder="Lo que verá cualquier persona en el portafolio…" />
              </label>
              <div className="flex flex-wrap justify-end gap-2">
                <Btn variant="light" onClick={() => { setDesc({ ...desc, p: `${p.type === 'Remodelación' ? 'Remodelación' : 'Proyecto'} de ${p.area} m² en ${p.location}. Diseñado por ADCOM para aprovechar la luz y la ventilación natural, con materiales locales y acabados de bajo mantenimiento.`, t: desc.t || 'Diseño que respira con el clima de Yucatán.' }); s.toast('Borrador de descripción listo para revisar', 'info') }}>
                  <Sparkles className="h-4 w-4" /> Sugerir con IA <PlanBadge n={3} />
                </Btn>
                <Btn onClick={saveDesc} disabled={!canEdit} title={canEdit ? '' : 'Tu rol no puede editar fichas'}>Guardar ficha</Btn>
              </div>
            </div>
          )}

          {tab === 'material' && (
            <div className={`${card} p-5 sm:p-6`}>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted">{p.driveFolder}</p>
                <Btn variant="light" onClick={() => s.addMedia(p.id, 3)}><Upload className="h-4 w-4" /> Subir fotos</Btn>
              </div>
              {media.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{media.map((m) => <MediaTile key={m.id} m={m} />)}</div>
              ) : <p className="rounded-xl border border-dashed hairline py-12 text-center text-sm text-muted">Sin material. Sube las primeras fotos de obra.</p>}
            </div>
          )}

          {tab === 'contenido' && (
            <div className="space-y-3">
              <Link to={`/panel/contenido?generar=1&proyecto=${p.id}`} className={`${card} flex items-center justify-center gap-2 border-dashed p-4 text-sm font-semibold hover:bg-white`}><Sparkles className="h-4 w-4 text-clay" /> Generar publicación con IA para este proyecto</Link>
              {posts.map((x) => <PostCard key={x.id} post={x} />)}
              {!posts.length && <p className="py-8 text-center text-sm text-muted">Aún no hay publicaciones de este proyecto.</p>}
            </div>
          )}
        </div>

        {/* Publicación web */}
        <aside className={`${card} h-fit p-5 sm:p-6 xl:sticky xl:top-28`}>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-xl">Portafolio web</h2>
            <PlanBadge n={1} />
          </div>
          <p className="mb-5 text-sm text-muted">Controla si este proyecto aparece en el sitio público.</p>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-sand/60 p-3">
            <span className="text-sm font-medium">Permiso del cliente para publicar</span>
            <button
              role="switch"
              aria-checked={p.permission}
              disabled={!canPublish}
              onClick={() => { s.updateProject(p.id, { permission: !p.permission, ...(p.permission && p.publicStatus === 'publicado' ? { publicStatus: 'pendiente' as const } : {}) }); s.toast(p.permission ? 'Permiso retirado: el proyecto sale del sitio' : 'Permiso registrado', p.permission ? 'warn' : 'ok') }}
              className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${p.permission ? 'bg-sage' : 'bg-ink/20'}`}
            >
              <motion.span layout className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${p.permission ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </label>

          <ul className="my-5 space-y-2 text-sm">
            {checks.map((c) => (
              <li key={c.l} className={`flex items-center gap-2 ${c.ok ? '' : 'text-muted'}`}>
                <span className={`grid h-5 w-5 place-items-center rounded-full ${c.ok ? 'bg-sage text-paper' : 'border border-ink/20'}`}>{c.ok && <Check className="h-3 w-3" />}</span>
                {c.l}
              </li>
            ))}
          </ul>

          {p.publicStatus === 'publicado' ? (
            <div className="space-y-2">
              <Link to={`/proyectos/${p.slug}`} className="flex w-full items-center justify-center gap-2 rounded-full bg-sage py-2.5 text-sm font-semibold text-paper hover:opacity-90"><ExternalLink className="h-4 w-4" /> Ver en el sitio</Link>
              <Btn variant="light" className="w-full" disabled={!canPublish} onClick={() => s.setPublicStatus(p.id, 'privado')}><EyeOff className="h-4 w-4" /> Ocultar del sitio</Btn>
            </div>
          ) : (
            <div className="space-y-2">
              <Btn variant="clay" className="w-full py-2.5" disabled={!ready || !canPublish} onClick={() => s.setPublicStatus(p.id, 'publicado')}><Globe2 className="h-4 w-4" /> Publicar en el sitio</Btn>
              {!canPublish ? <p className="text-center text-xs text-muted">Tu rol ({me.role}) no puede publicar en el sitio. Pídelo a Dirección o Contenido.</p> : !ready && <p className="text-center text-xs text-muted">Completa la lista de arriba para poder publicar.</p>}
              {p.publicStatus !== 'pendiente' && canEdit && <Btn variant="light" className="w-full" onClick={() => s.setPublicStatus(p.id, 'pendiente')}>Marcar pendiente de publicar</Btn>}
            </div>
          )}
          {p.publicStatus !== 'archivado' && canPublish && (
            <button onClick={() => s.setPublicStatus(p.id, 'archivado')} className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-xs text-muted hover:text-ink"><Archive className="h-3.5 w-3.5" /> Archivar proyecto</button>
          )}
          <p className="mt-4 border-t hairline pt-4 text-xs text-muted">Actualizado {fmtDate(p.updatedAt, { day: 'numeric', month: 'long' })}</p>
        </aside>
      </div>
    </>
  )
}
