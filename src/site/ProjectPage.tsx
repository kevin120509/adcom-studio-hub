import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Landmark, X } from 'lucide-react'
import { EASE, Reveal, SplitText } from '../components/ui'
import HeroSlides from '../components/HeroSlides'
import { img, services } from '../data/mock'
import { useStore } from '../store'

export default function ProjectPage() {
  const { slug } = useParams()
  const projects = useStore((s) => s.projects)
  const published = projects.filter((p) => p.publicStatus === 'publicado')
  const p = published.find((x) => x.slug === slug)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const [lb, setLb] = useState<number | null>(null)

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-32 pt-44 text-center">
        <p className="font-display text-4xl">Este proyecto no está publicado.</p>
        <p className="mt-3 text-muted">Puede que se haya ocultado desde el panel interno.</p>
        <Link to="/proyectos" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper"><ArrowLeft className="h-4 w-4" /> Volver al portafolio</Link>
      </div>
    )
  }
  const idx = published.indexOf(p)
  const lastAlone = (p.gallery.length - 1) % 2 === 1 && p.gallery.length > 1
  const next = published[(idx + 1) % published.length]
  const specs = [
    ['Tipo', p.type],
    ['Ubicación', p.location],
    ['Superficie', `${p.area.toLocaleString('es-MX')} m²`],
    ['Año', String(p.year)],
    ['Etapa', p.stage === 'Entregado' ? 'Entregado' : `En ${p.stage.toLowerCase()}`],
  ]

  return (
    <article>
      <div ref={ref} className="relative -mt-9 h-[92svh] min-h-[560px] overflow-hidden bg-ink">
        <HeroSlides
          key={p.id}
          slides={p.gallery.map((g, k) => ({ photo: g, title: `${p.name}`, sub: `Foto ${k + 1} de ${p.gallery.length}` }))}
          interval={5000}
          captions={false}
          imageStyle={{ y }}
          overlayClass="bg-gradient-to-t from-ink/85 via-ink/20 to-ink/40"
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-20 text-paper sm:px-8 sm:pb-24">
          <Link to="/proyectos" className="mb-8 inline-flex items-center gap-2 text-sm text-paper/70 hover:text-paper"><ArrowLeft className="h-4 w-4" /> Portafolio</Link>
          <div className="mb-4 flex flex-wrap gap-2">
            {p.services.map((s) => <span key={s} className="rounded-full bg-paper/15 px-3 py-1 text-xs backdrop-blur">{services.find((x) => x.key === s)?.title ?? s}</span>)}
            {p.inah && <span className="inline-flex items-center gap-1.5 rounded-full bg-clay px-3 py-1 text-xs"><Landmark className="h-3.5 w-3.5" /> Gestión INAH</span>}
          </div>
          <SplitText as="h1" text={p.name} className="font-display text-6xl font-light leading-none tracking-tight sm:text-8xl" />
          <p className="mt-4 max-w-xl text-lg text-paper/75">{p.tagline}</p>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_2fr] lg:py-28">
        <Reveal>
          <dl className="divide-y divide-ink/10 border-y hairline">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-4 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-2xl font-light leading-relaxed sm:text-3xl">{p.descPublic}</p>
          <Link to={`/contacto?proyecto=${encodeURIComponent(p.name)}`} className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-clay">
            Quiero un proyecto similar <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-6">
          {p.gallery.map((g, i) => (
            <Reveal key={g + i} delay={i * 0.06} className={i === 0 ? 'col-span-2 md:col-span-4 md:row-span-2' : lastAlone && i === p.gallery.length - 1 ? 'col-span-2 md:col-span-6' : 'md:col-span-2'}>
              <button onClick={() => setLb(i)} className="group block h-full w-full overflow-hidden rounded-xl bg-sand" aria-label={`Ampliar foto ${i + 1}`}>
                <img src={img(g, i === 0 ? 1400 : 700)} alt={`${p.name} — foto ${i + 1}`} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i === 0 ? 'aspect-[4/3] h-full' : lastAlone && i === p.gallery.length - 1 ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-square'}`} />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <Link to={`/proyectos/${next.slug}`} className="group relative block overflow-hidden bg-ink text-paper">
        <img src={img(next.cover, 1800, 700)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-[1.2s] group-hover:scale-105 group-hover:opacity-50" />
        <div className="relative mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 py-20 sm:px-8 sm:py-28">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-paper/60">Siguiente proyecto</p>
            <p className="font-display text-5xl font-light sm:text-7xl">{next.name}</p>
          </div>
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-paper text-ink transition duration-500 group-hover:translate-x-2"><ArrowRight className="h-6 w-6" /></span>
        </div>
      </Link>

      <AnimatePresence>
        {lb !== null && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/95 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLb(null)}>
            <button className="absolute right-4 top-12 rounded-full p-3 text-paper hover:bg-paper/10" aria-label="Cerrar"><X className="h-6 w-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + p.gallery.length) % p.gallery.length) }} className="absolute left-2 rounded-full p-3 text-paper hover:bg-paper/10 sm:left-6" aria-label="Anterior"><ChevronLeft className="h-8 w-8" /></button>
            <motion.img key={lb} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} src={img(p.gallery[lb], 1800)} alt="" className="max-h-[82svh] max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
            <button onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % p.gallery.length) }} className="absolute right-2 rounded-full p-3 text-paper hover:bg-paper/10 sm:right-6" aria-label="Siguiente"><ChevronRight className="h-8 w-8" /></button>
            <p className="absolute bottom-6 text-sm text-paper/60">{lb + 1} / {p.gallery.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
