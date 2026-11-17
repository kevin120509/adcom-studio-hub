import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Landmark } from 'lucide-react'
import { EASE, Reveal, SplitText } from '../components/ui'
import HeroSlides from '../components/HeroSlides'
import { img } from '../data/mock'
import { useStore } from '../store'

const filters = [
  { k: 'Todos', l: 'Todos' },
  { k: 'Arquitectura', l: 'Arquitectura' },
  { k: 'Comercial', l: 'Diseño comercial' },
  { k: 'Construcción', l: 'Construcción' },
  { k: 'Casonas', l: 'Casonas' },
]

export default function Portfolio() {
  const [params, setParams] = useSearchParams()
  const f = params.get('f') ?? 'Todos'
  const all = useStore((s) => s.projects).filter((p) => p.publicStatus === 'publicado')
  const list = f === 'Todos' ? all : all.filter((p) => p.services.includes(f))

  return (
    <div>
      <section className="relative -mt-9 h-[78svh] min-h-[520px] overflow-hidden bg-ink text-paper">
        <HeroSlides
          slides={all.map((p) => ({ photo: p.cover, title: p.name, sub: p.location.split(',')[0], to: `/proyectos/${p.slug}` }))}
          interval={5500}
          overlayClass="bg-gradient-to-b from-ink/60 via-ink/30 to-ink/85"
        />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-8 sm:pb-24">
          <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-paper/70"><span className="h-px w-10 bg-clay" /> Portafolio · {all.length} proyectos publicados</p>
          <SplitText as="h1" text="Proyectos que ya forman parte de Mérida." className="max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-tight sm:text-7xl" />
        </div>
      </section>

      <section id="lista" className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal delay={0.1}>
          <div className="mt-12 flex gap-2 overflow-x-auto pb-2 scrollbar-thin" role="tablist">
            {filters.map((x) => {
              const count = x.k === 'Todos' ? all.length : all.filter((p) => p.services.includes(x.k)).length
              return (
                <button
                  key={x.k}
                  role="tab"
                  aria-selected={f === x.k}
                  onClick={() => setParams(x.k === 'Todos' ? {} : { f: x.k }, { replace: true })}
                  className={`relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${f === x.k ? 'border-ink text-paper' : 'hairline text-ink/70 hover:border-ink/40 hover:text-ink'}`}
                >
                  {f === x.k && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease: EASE }} />}
                  <span className="relative">{x.l} <span className="opacity-50">{count}</span></span>
                </button>
              )
            })}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:px-8">
        <motion.div layout className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className={i % 2 === 1 ? 'md:mt-24' : ''}
              >
                <Link to={`/proyectos/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                    <img src={img(p.cover, 1100, 825)} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/20" />
                    <span className="absolute bottom-5 right-5 grid h-14 w-14 scale-75 place-items-center rounded-full bg-paper text-ink opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                    {p.inah && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                        <Landmark className="h-3.5 w-3.5 text-clay" /> Patrimonio INAH
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl font-light transition group-hover:text-clay">{p.name}</h2>
                      <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted">
                      <p>{p.type}</p>
                      <p>{p.year}</p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed hairline py-20 text-center">
            <p className="font-display text-2xl">Aún no hay proyectos publicados en esta categoría.</p>
            <p className="mt-2 text-sm text-muted">Muy pronto compartiremos proyectos de esta categoría.</p>
          </div>
        )}
      </section>
    </div>
  )
}
