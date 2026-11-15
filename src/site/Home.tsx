import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Camera, CheckCheck, FolderOpen, Globe, Sparkles, Share2, ClipboardList, Quote } from 'lucide-react'
import { Counter, EASE, Reveal, SplitText } from '../components/ui'
import { img, P, services } from '../data/mock'
import { useStore } from '../store'

export default function Home({ ready }: { ready: boolean }) {
  return (
    <>
      <Hero ready={ready} />
      <Marquee />
      <Manifesto />
      <Services />
      <FeaturedProjects />
      <Numbers />
      <Process />
      <Testimonials />
      <CTA />
    </>
  )
}

function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  return (
    <section ref={ref} className="relative -mt-9 h-[100svh] min-h-[640px] overflow-hidden bg-ink text-paper">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <motion.img
          src={img(P.luxuryPool, 2200)}
          alt="Residencia contemporánea con alberca"
          className="h-full w-full object-cover"
          initial={{ scale: 1.25, filter: 'brightness(0.4)' }}
          animate={ready ? { scale: 1, filter: 'brightness(1)' } : {}}
          transition={{ duration: 2.2, ease: EASE }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/40 to-ink/90" />

      <motion.div style={{ opacity: fade }} className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 sm:px-8 sm:pb-20">
        {ready && (
          <>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-paper/70">
              <span className="h-px w-10 bg-clay" /> Arquitectura · Construcción · Mérida
            </motion.p>
            <SplitText as="h1" delay={0.4} text="Arquitectura que entiende la luz de Mérida." className="max-w-5xl font-display text-[13vw] font-light leading-[0.95] tracking-tight sm:text-7xl lg:text-[6.5rem]" />
            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1, ease: EASE }} className="max-w-md text-base leading-relaxed text-paper/75 sm:text-lg">
                Diseñamos, construimos y restauramos espacios residenciales, comerciales y casonas del Centro Histórico.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.15, ease: EASE }} className="flex flex-wrap gap-3">
                <Link to="/proyectos" className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white">
                  Ver proyectos <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link to="/contacto" className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3.5 text-sm font-semibold text-paper backdrop-blur transition hover:bg-paper/10">
                  Cotizar mi proyecto
                </Link>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.6 }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-paper/60 lg:flex">
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Desliza
      </motion.div>
    </section>
  )
}

function Marquee() {
  const words = ['Diseño arquitectónico', 'Diseño comercial', 'Construcción', 'Remodelación de casonas', 'Gestión INAH']
  const row = [...words, ...words]
  return (
    <div className="overflow-hidden border-b hairline bg-paper py-6 sm:py-8">
      <div className="marquee flex w-max items-center gap-10 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-4xl font-light sm:text-6xl">
            <span className={i % 2 ? 'text-outline' : ''}>{w}</span>
            <span className="h-2.5 w-2.5 rotate-45 bg-clay" />
          </span>
        ))}
      </div>
    </div>
  )
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const text = 'Cada proyecto empieza escuchando cómo se vive un espacio. Respetamos el clima, los materiales locales y la historia de cada casona, y documentamos la obra de principio a fin para que nuestros clientes vean su proyecto crecer.'
  const words = text.split(' ')
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-8 sm:py-36">
      <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">Nuestra forma de trabajar</p>
      <div ref={ref} className="font-display text-3xl font-light leading-[1.25] sm:text-5xl">
        {words.map((w, i) => <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
      </div>
    </section>
  )
}
function Word({ children, p, range }: { children: string; p: MotionValue<number>; range: [number, number] }) {
  const o = useTransform(p, range, [0.15, 1])
  return <motion.span style={{ opacity: o }} className="mr-[0.25em] inline-block">{children}</motion.span>
}

function Services() {
  const [hover, setHover] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 25 })
  const sy = useSpring(y, { stiffness: 200, damping: 25 })
  return (
    <section id="servicios" className="relative bg-sand/60 py-24 sm:py-32" onMouseMove={(e) => { x.set(e.clientX); y.set(e.clientY) }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SplitText text="Cuatro especialidades, un mismo equipo." className="max-w-2xl font-display text-4xl font-light leading-tight sm:text-6xl" />
          <Reveal><p className="max-w-sm text-muted">Desde el primer trazo hasta la entrega, y después: cada obra se documenta y se convierte en portafolio.</p></Reveal>
        </div>
        <ul className="border-t hairline">
          {services.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.06}>
              <li onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="group border-b hairline">
                <Link to={`/proyectos?f=${s.key}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 sm:gap-10 sm:py-9">
                  <span className="font-display text-sm text-muted">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-3xl font-light transition duration-500 group-hover:translate-x-3 group-hover:text-clay sm:text-5xl">{s.title}</h3>
                    <p className="mt-2 max-w-xl text-sm text-muted md:hidden">{s.text}</p>
                  </div>
                  <span className="flex items-center gap-6">
                    <span className="hidden max-w-xs text-sm text-muted lg:block">{s.text}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-full border hairline transition duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
      {/* vista previa flotante (solo escritorio) */}
      <motion.div style={{ left: sx, top: sy }} className="pointer-events-none fixed z-30 hidden -translate-x-1/2 -translate-y-1/2 [@media(hover:hover)]:block">
        <AnimatePresence>
          {hover !== null && (
            <motion.img
              key={hover}
              src={img(services[hover].photo, 520, 380)}
              alt=""
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute -translate-x-1/2 -translate-y-1/2 h-[190px] w-[260px] rounded-xl object-cover shadow-2xl"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

function FeaturedProjects() {
  const projects = useStore((s) => s.projects).filter((p) => p.publicStatus === 'publicado')
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  useEffect(() => {
    const calc = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 32))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [projects.length])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} style={{ height: `calc(100svh + ${dist}px)` }} className="relative bg-ink text-paper">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-20">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-paper/50">Proyectos seleccionados</p>
            <h2 className="font-display text-4xl font-light sm:text-6xl">Obra reciente</h2>
          </div>
          <Link to="/proyectos" className="hidden items-center gap-2 rounded-full border border-paper/25 px-5 py-2.5 text-sm hover:bg-paper hover:text-ink sm:inline-flex">
            Todo el portafolio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <motion.div ref={track} style={{ x }} className="flex gap-5 pl-4 sm:gap-8 sm:pl-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {projects.map((p, i) => (
            <Link key={p.id} to={`/proyectos/${p.slug}`} className="group relative h-[min(60svh,560px)] w-[78vw] shrink-0 overflow-hidden rounded-2xl sm:w-[440px] lg:w-[520px]">
              <img src={img(p.cover, 1100)} alt={p.name} className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-paper/15 px-3 py-1 text-[11px] uppercase tracking-wider backdrop-blur">{p.type}</span>
              <span className="absolute right-5 top-5 font-display text-sm text-paper/60">{String(i + 1).padStart(2, '0')}</span>
              <div className="absolute inset-x-5 bottom-5">
                <h3 className="font-display text-3xl font-light">{p.name}</h3>
                <p className="mt-1 text-sm text-paper/65">{p.location} · {p.year}</p>
                <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold opacity-0 transition duration-500 group-hover:opacity-100">Ver ficha <ArrowRight className="h-4 w-4" /></p>
              </div>
            </Link>
          ))}
          <Link to="/proyectos" className="grid h-[min(60svh,560px)] w-[60vw] shrink-0 place-items-center rounded-2xl border border-paper/20 text-center sm:w-[320px]">
            <span>
              <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-clay"><ArrowRight className="h-6 w-6" /></span>
              <span className="font-display text-2xl">Ver todos</span>
            </span>
          </Link>
          <div className="w-4 shrink-0" />
        </motion.div>
        <div className="mx-auto mt-8 h-px w-[min(80rem,calc(100%-2rem))] bg-paper/15">
          <motion.div style={{ width: bar }} className="h-px bg-clay" />
        </div>
      </div>
    </section>
  )
}

function Numbers() {
  const n = [
    { v: 15, s: '+', l: 'años en Mérida' },
    { v: 120, s: '+', l: 'proyectos entregados' },
    { v: 18, s: '', l: 'casonas restauradas' },
    { v: 98, s: '%', l: 'clientes que nos recomiendan' },
  ]
  return (
    <section className="border-b hairline">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-8 lg:grid-cols-4">
        {n.map((x, i) => (
          <Reveal key={x.l} delay={i * 0.08} className={`py-12 sm:py-16 ${i % 2 ? 'pl-6 sm:pl-10' : ''} ${i > 0 ? 'lg:border-l lg:pl-10 hairline' : ''}`}>
            <p className="font-display text-5xl font-light sm:text-7xl"><Counter to={x.v} suffix={x.s} /></p>
            <p className="mt-2 text-sm text-muted">{x.l}</p>
          </Reveal>
        ))}
      </div>
      <p className="pb-4 text-center text-[11px] text-muted/70">Cifras ilustrativas para la demo</p>
    </section>
  )
}

function Process() {
  const steps = [
    { i: Camera, t: 'Fotografía en obra', d: 'El equipo sube fotos y planos desde el celular.' },
    { i: FolderOpen, t: 'Drive por proyecto', d: 'Los originales se guardan ordenados, nunca en un teléfono.' },
    { i: ClipboardList, t: 'Ficha en Studio Hub', d: 'Cliente, etapa, responsable y permiso de publicación.' },
    { i: Sparkles, t: 'Borrador con IA', d: 'Título, texto y hashtags listos para revisar.' },
    { i: CheckCheck, t: 'Aprobación humana', d: 'Nada se publica sin que alguien de ADCOM lo apruebe.' },
    { i: Globe, t: 'Portafolio web', d: 'El proyecto aparece en este sitio automáticamente.' },
    { i: Share2, t: 'Facebook e Instagram', d: 'Publicación multicanal, sujeta a permisos de Meta.' },
  ]
  return (
    <section id="proceso" className="mx-auto max-w-7xl px-4 py-24 sm:px-8 sm:py-32">
      <div className="mb-16 grid gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-clay">ADCOM Studio Hub</p>
          <SplitText text="De la obra al portafolio, sin perder una sola foto." className="font-display text-4xl font-light leading-tight sm:text-6xl" />
        </div>
        <Reveal>
          <p className="text-muted lg:max-w-md lg:justify-self-end">Detrás de este sitio hay un sistema interno que organiza proyectos, material y publicaciones. Así se ve el flujo completo:</p>
          <Link to="/panel" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-clay">
            Ver el panel por dentro <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={(i % 4) * 0.07} className={i === 6 ? 'lg:col-span-1' : ''}>
            <li className="group relative h-full rounded-2xl border hairline bg-white/40 p-6 transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-ink/5">
              <div className="mb-8 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-paper transition duration-500 group-hover:bg-clay"><s.i className="h-5 w-5" /></span>
                <span className="font-display text-3xl font-light text-ink/15">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display text-xl">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
            </li>
          </Reveal>
        ))}
        <Reveal delay={0.2}>
          <li className="flex h-full flex-col justify-between rounded-2xl bg-clay p-6 text-paper">
            <p className="font-display text-2xl font-light leading-snug">Menos tiempo en Canva. Más proyectos publicados.</p>
            <p className="mt-6 text-sm text-paper/75">Flujo propuesto por CODIA</p>
          </li>
        </Reveal>
      </ol>
    </section>
  )
}

function Testimonials() {
  const t = [
    { q: 'Respetaron cada detalle de la casona y nos acompañaron con el INAH de principio a fin.', a: 'Fernanda S.', r: 'Hotel boutique, Centro' },
    { q: 'Cada semana recibíamos fotos del avance. Nunca tuvimos que preguntar cómo iba la obra.', a: 'Mariana P.', r: 'Residencia en Temozón' },
    { q: 'Abrimos a tiempo y el local funciona tan bien como se ve.', a: 'Roberto C.', r: 'Café de especialidad' },
  ]
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % t.length), 5500); return () => clearInterval(id) }, [t.length])
  return (
    <section className="relative overflow-hidden bg-sand/60 py-24 sm:py-32">
      <img src={img(P.interior3, 1600)} alt="" className="absolute right-0 top-0 hidden h-full w-1/3 object-cover opacity-90 lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <Quote className="mb-8 h-10 w-10 text-clay" />
        <div className="min-h-[220px] max-w-3xl sm:min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: EASE }}>
              <p className="font-display text-3xl font-light leading-snug sm:text-5xl">“{t[i].q}”</p>
              <p className="mt-8 text-sm"><b>{t[i].a}</b> <span className="text-muted">· {t[i].r}</span></p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex gap-2">
          {t.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Testimonio ${k + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-ink' : 'w-4 bg-ink/20 hover:bg-ink/40'}`} />
          ))}
        </div>
        <p className="mt-6 text-[11px] text-muted/70">Testimonios ficticios de ejemplo</p>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-paper py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-8">
        <Reveal><p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">¿Tienes un terreno, un local o una casona?</p></Reveal>
        <SplitText text="Platiquemos tu proyecto." className="font-display text-5xl font-light leading-none tracking-tight sm:text-8xl" />
        <Reveal delay={0.3}>
          <Link to="/contacto" className="group mt-12 inline-flex items-center gap-3 rounded-full bg-ink py-4 pl-8 pr-4 text-base font-semibold text-paper transition hover:bg-clay">
            Solicitar cotización
            <span className="grid h-10 w-10 place-items-center rounded-full bg-paper text-ink transition duration-500 group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
