import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { EASE, PlanBadge } from '../components/ui'
import { plans } from '../data/mock'
import { card, PageHead } from './PanelLayout'

const map = [
  { m: 'Sitio web y portafolio público', p: 1, to: '/' },
  { m: 'Proyectos y permiso de publicación', p: 1, to: '/panel/proyectos' },
  { m: 'Clientes y contactos', p: 2, to: '/panel/clientes' },
  { m: 'Biblioteca vinculada con Drive', p: 2, to: '/panel/biblioteca' },
  { m: 'Borradores y aprobación de contenido', p: 2, to: '/panel/contenido' },
  { m: 'Agenda y seguimiento', p: 2, to: '/panel/agenda' },
  { m: 'Panel de pendientes', p: 2, to: '/panel' },
  { m: 'Publicación en Facebook e Instagram', p: 3, to: '/panel/contenido' },
  { m: 'Automatización Drive → IA → panel', p: 3, to: '/panel/configuracion' },
]

const steps = [
  ['Validación', '2–3 días'], ['Portafolio', '1.5–2 sem'], ['Panel interno', '1.5–2 sem'], ['Drive', '1–2 sem'], ['Contenido', '1–1.5 sem'], ['Meta', '2–3 sem'], ['Piloto', '1 sem'],
]

export default function Plans() {
  return (
    <>
      <PageHead title="Planes de la propuesta" sub="Puedes empezar con un alcance manejable y crecer sin pagar desde el inicio por toda la automatización." />

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p, i) => (
          <motion.section key={p.n} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
            className={`relative flex flex-col rounded-3xl p-6 sm:p-7 ${p.recommended ? 'bg-ink text-paper shadow-2xl shadow-ink/20 lg:-my-3 lg:py-10' : `${card}`}`}>
            {p.recommended && <span className="absolute -top-3 left-6 rounded-full bg-clay px-3 py-1 text-xs font-bold uppercase tracking-wider text-paper">Recomendado</span>}
            <PlanBadge n={p.n as 1 | 2 | 3} className="self-start" />
            <h2 className="mt-4 font-display text-3xl">{p.name}</h2>
            <p className={`mt-2 text-sm ${p.recommended ? 'text-paper/70' : 'text-muted'}`}>{p.goal}</p>
            <div className={`my-6 border-y py-5 ${p.recommended ? 'border-paper/15' : 'hairline'}`}>
              <p className={`text-xs uppercase tracking-wider ${p.recommended ? 'text-paper/50' : 'text-muted'}`}>Implementación orientativa</p>
              <p className="mt-1 font-display text-3xl">{p.impl} <span className="text-sm">MXN</span></p>
              <p className={`mt-3 text-xs uppercase tracking-wider ${p.recommended ? 'text-paper/50' : 'text-muted'}`}>Operación mensual</p>
              <p className="mt-1 text-lg font-semibold">{p.monthly} MXN</p>
            </div>
            <ul className="flex-1 space-y-2.5 text-sm">
              {p.items.map((it) => (
                <li key={it} className="flex gap-2.5"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.recommended ? 'text-clay' : 'text-sage'}`} /> {it}</li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">Importes orientativos, no definitivos. Se confirman con usuarios, número de proyectos, material y nivel de automatización. Servicios externos aparte.</p>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="mb-4 font-display text-xl">¿Qué incluye cada pantalla de esta demo?</h2>
          <ul className="divide-y divide-ink/10">
            {map.map((x) => (
              <li key={x.m}>
                <Link to={x.to} className="group flex items-center gap-3 py-3 text-sm">
                  <PlanBadge n={x.p as 1 | 2 | 3} />
                  <span className="flex-1">{x.m}</span>
                  <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="mb-1 font-display text-xl">Implementación por etapas</h2>
          <p className="mb-5 text-sm text-muted">Portafolio y panel inicial: 4–5 semanas · Con Drive, IA y aprobación: 6–7 · Con Meta validado: 7–9.</p>
          <ol className="relative space-y-4 border-l-2 border-sand pl-6">
            {steps.map(([s, t], i) => (
              <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07, ease: EASE }} className="relative">
                <span className={`absolute -left-[33px] top-0.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${i < 3 ? 'bg-ink text-paper' : 'bg-sand text-ink'}`}>{i}</span>
                <p className="flex items-center justify-between text-sm font-semibold">{s} <span className="flex items-center gap-1 text-xs font-normal text-muted"><Clock className="h-3 w-3" /> {t}</span></p>
              </motion.li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
