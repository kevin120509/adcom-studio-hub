import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, CheckCircle2, Circle, FolderPlus, Globe2, Sparkles, AlertCircle, ImageIcon, PenSquare, CalendarClock } from 'lucide-react'
import { Counter, EASE } from '../components/ui'
import { img, TODAY, type Stage } from '../data/mock'
import { useMe, useStore } from '../store'
import { card, PageHead } from './PanelLayout'

const stages: Stage[] = ['Anteproyecto', 'Permisos', 'Obra', 'Entregado']

export default function Dashboard() {
  const me = useMe()
  const { projects, posts, agenda, media, clients, activity, toggleAgenda } = useStore()
  const active = projects.filter((p) => p.stage !== 'Entregado' && p.publicStatus !== 'archivado')
  const pendingPub = projects.filter((p) => p.publicStatus === 'pendiente')
  const inReview = posts.filter((p) => p.status === 'revisión')
  const todayItems = agenda.filter((a) => a.date === TODAY).sort((a, b) => a.time.localeCompare(b.time))
  const unclassified = media.filter((m) => m.status !== 'seleccionada')
  const prospects = clients.filter((c) => c.status === 'Prospecto')

  const kpis = [
    { l: 'Proyectos activos', v: active.length, to: '/panel/proyectos', i: FolderPlus },
    { l: 'Por publicar en web', v: pendingPub.length, to: '/panel/proyectos?estado=pendiente', i: Globe2 },
    { l: 'Publicaciones en revisión', v: inReview.length, to: '/panel/contenido', i: PenSquare },
    { l: 'Prospectos abiertos', v: prospects.length, to: '/panel/clientes?estado=Prospecto', i: CalendarClock },
  ]

  const todos = [
    ...inReview.map((p) => ({ k: p.id, t: `Revisar publicación “${p.title}”`, to: '/panel/contenido', i: PenSquare, tone: 'text-clay' })),
    ...pendingPub.map((p) => ({ k: p.id, t: p.permission ? `Publicar ${p.name} en el sitio` : `Pedir autorización de fotos — ${p.name}`, to: `/panel/proyectos/${p.id}`, i: p.permission ? Globe2 : AlertCircle, tone: p.permission ? 'text-sage' : 'text-gold' })),
    ...(unclassified.length ? [{ k: 'media', t: `Clasificar ${unclassified.length} archivos en Biblioteca`, to: '/panel/biblioteca', i: ImageIcon, tone: 'text-ink' }] : []),
  ]

  const hour = 9
  return (
    <>
      <PageHead title={`${hour < 12 ? 'Buenos días' : 'Buenas tardes'}, ${me.name.replace(/^(Arq\.|Ing\.) /, '').split(' ')[0]}`} sub="Esto es lo que pasa hoy en ADCOM." plan={2}>
        <Link to="/panel/proyectos?nuevo=1" className="inline-flex items-center gap-2 rounded-full border hairline bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white"><FolderPlus className="h-4 w-4" /> Nuevo proyecto</Link>
        <Link to="/panel/biblioteca?subir=1" className="inline-flex items-center gap-2 rounded-full border hairline bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white"><Camera className="h-4 w-4" /> Subir fotos</Link>
        <Link to="/panel/contenido?generar=1" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-clay"><Sparkles className="h-4 w-4" /> Borrador con IA</Link>
      </PageHead>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.6, ease: EASE }}>
            <Link to={k.to} className={`${card} group block p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-ink/5`}>
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-sand"><k.i className="h-4 w-4" /></span>
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <p className="mt-5 font-display text-4xl"><Counter to={k.v} /></p>
              <p className="mt-1 text-sm text-muted">{k.l}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className={`${card} p-5 sm:p-6`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Pendientes</h2>
            <span className="text-xs text-muted">{todos.length} por atender</span>
          </div>
          {todos.length ? (
            <ul className="divide-y hairline">
              {todos.map((t) => (
                <li key={t.k}>
                  <Link to={t.to} className="group flex items-center gap-3 py-3 text-sm">
                    <t.i className={`h-4 w-4 shrink-0 ${t.tone}`} />
                    <span className="flex-1">{t.t}</span>
                    <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="py-8 text-center text-sm text-muted">Todo al día. 🎉</p>}
        </section>

        <section className={`${card} p-5 sm:p-6`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Hoy</h2>
            <Link to="/panel/agenda" className="text-xs font-semibold text-clay hover:underline">Ver agenda</Link>
          </div>
          <ul className="space-y-2">
            {todayItems.map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-xl p-2 hover:bg-sand/50">
                <button onClick={() => toggleAgenda(a.id)} aria-label="Marcar como hecho" className="mt-0.5">
                  {a.done ? <CheckCircle2 className="h-5 w-5 text-sage" /> : <Circle className="h-5 w-5 text-ink/30 hover:text-ink" />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${a.done ? 'text-muted line-through' : ''}`}>{a.title}</p>
                  <p className="text-xs text-muted">{a.time} · {a.kind} · {a.owner}</p>
                </div>
              </li>
            ))}
            {!todayItems.length && <p className="py-6 text-center text-sm text-muted">Sin pendientes hoy.</p>}
          </ul>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className={`${card} p-5 sm:p-6`}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl">Proyectos por etapa</h2>
            <Link to="/panel/proyectos" className="text-xs font-semibold text-clay hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stages.map((s) => {
              const list = projects.filter((p) => p.stage === s && p.publicStatus !== 'archivado')
              return (
                <div key={s} className="rounded-xl bg-sand/50 p-3">
                  <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">{s} <span className="text-ink">{list.length}</span></p>
                  <div className="mt-3 space-y-2">
                    {list.slice(0, 3).map((p) => (
                      <Link key={p.id} to={`/panel/proyectos/${p.id}`} className="flex items-center gap-2 rounded-lg bg-white/80 p-1.5 pr-2 text-xs font-medium transition hover:bg-white hover:shadow">
                        <img src={img(p.cover, 80, 80)} alt="" className="h-8 w-8 rounded-md object-cover" />
                        <span className="truncate">{p.name}</span>
                      </Link>
                    ))}
                    {list.length > 3 && <p className="text-center text-xs text-muted">+{list.length - 3} más</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="mb-4 font-display text-xl">Actividad</h2>
          <ol className="relative space-y-4 border-l hairline pl-5">
            {activity.slice(0, 6).map((a) => (
              <li key={a.id} className="relative text-sm">
                <span className={`absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-paper ${{ clay: 'bg-clay', sage: 'bg-sage', gold: 'bg-gold', ink: 'bg-ink' }[a.tone]}`} />
                <p><b>{a.who}</b> {a.text}</p>
                <p className="text-xs text-muted">{a.at}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
