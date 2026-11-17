import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Loader2, MapPin, MessageCircle, Phone } from 'lucide-react'
import { EASE, Field, Reveal, SplitText, inputCls } from '../components/ui'
import HeroSlides from '../components/HeroSlides'
import { smoothTo } from './SiteLayout'
import { img, P } from '../data/mock'
import { useStore } from '../store'

const opts = ['Diseño arquitectónico', 'Diseño comercial', 'Construcción', 'Remodelación de casona', 'Aún no lo sé']

export default function ContactPage() {
  const [params] = useSearchParams()
  const ref = params.get('proyecto')
  const submitLead = useStore((s) => s.submitLead)
  const [f, setF] = useState({ name: '', email: '', phone: '', service: '', message: ref ? `Me interesa un proyecto similar a ${ref}.` : '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.name.trim().length < 3) e.name = 'Escribe tu nombre completo.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Revisa el correo, parece incompleto.'
    if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'El teléfono debe tener 10 dígitos.'
    if (!f.service) e.service = 'Elige un tipo de proyecto.'
    if (f.message.trim().length < 10) e.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
    setErr(e)
    return Object.keys(e).length === 0
  }
  const send = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (state !== 'idle' || !validate()) return
    setState('sending')
    setTimeout(() => {
      submitLead(f)
      setState('done')
      const card = document.getElementById('form-card')
      if (card) smoothTo(card, -120)
    }, 1200)
  }
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF({ ...f, [k]: e.target.value })
    if (err[k]) setErr({ ...err, [k]: '' })
  }

  return (
    <div>
      <section className="relative -mt-9 h-[64svh] min-h-[460px] overflow-hidden bg-ink text-paper">
        <HeroSlides
          slides={[
            { photo: P.blueprint, title: 'Diseño', sub: 'Del primer trazo al proyecto ejecutivo' },
            { photo: P.site, title: 'Obra', sub: 'Residente y bitácora semanal' },
            { photo: P.casona, title: 'Casonas', sub: 'Restauración con gestión INAH' },
            { photo: P.villaPool, title: 'Entrega', sub: 'Llave en mano' },
          ]}
          interval={5000}
          overlayClass="bg-gradient-to-b from-ink/60 via-ink/35 to-ink/85"
        />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-8 sm:pb-24">
          <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-paper/70"><span className="h-px w-10 bg-clay" /> Contacto</p>
          <SplitText as="h1" text="Cuéntanos qué quieres construir." className="max-w-3xl font-display text-5xl font-light leading-[1.02] tracking-tight sm:text-7xl" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-28 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg text-muted">Respondemos en menos de 24 horas hábiles. Tu solicitud llega directo a la agenda del equipo.</p>
            <ul className="mt-10 space-y-4 text-sm">
              <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-sand"><MessageCircle className="h-4 w-4" /></span> WhatsApp 999 000 0000 <span className="text-muted">(ficticio)</span></li>
              <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-sand"><Phone className="h-4 w-4" /></span> hola@adcom-demo.mx</li>
              <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-sand"><MapPin className="h-4 w-4" /></span> Mérida, Yucatán</li>
            </ul>
            <img src={img(P.blueprint, 900, 500)} alt="Planos arquitectónicos" className="mt-12 hidden aspect-[16/9] w-full rounded-2xl object-cover lg:block" />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div id="form-card" className="relative overflow-hidden rounded-3xl border hairline bg-white/50 p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {state !== 'done' ? (
                <motion.form key="form" onSubmit={send} noValidate exit={{ opacity: 0, y: -20 }} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nombre" error={err.name}><input className={inputCls} value={f.name} onChange={set('name')} placeholder="Tu nombre" autoComplete="name" /></Field>
                    <Field label="Teléfono" error={err.phone}><input className={inputCls} value={f.phone} onChange={set('phone')} placeholder="999 123 4567" inputMode="tel" autoComplete="tel" /></Field>
                  </div>
                  <Field label="Correo" error={err.email}><input className={inputCls} value={f.email} onChange={set('email')} placeholder="tu@correo.com" type="email" autoComplete="email" /></Field>
                  <Field label="Tipo de proyecto" error={err.service}>
                    <div className="flex flex-wrap gap-2">
                      {opts.map((o) => (
                        <button type="button" key={o} onClick={() => { setF({ ...f, service: o }); setErr({ ...err, service: '' }) }} className={`rounded-full border px-4 py-2 text-sm transition ${f.service === o ? 'border-ink bg-ink text-paper' : 'hairline bg-white/60 hover:border-ink/40'}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Mensaje" error={err.message}><textarea className={`${inputCls} min-h-32 resize-y`} value={f.message} onChange={set('message')} placeholder="Ubicación, metros aproximados, fechas…" /></Field>
                  <button disabled={state === 'sending'} className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold text-paper transition hover:bg-clay disabled:opacity-70">
                    {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : <>Enviar solicitud <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></>}
                  </button>
                  <p className="text-center text-xs text-muted">Demo: la solicitud no se envía a nadie, solo aparece en el panel interno.</p>
                </motion.form>
              ) : (
                <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="py-10 text-center">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }} className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-sage/15 text-sage">
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.span>
                  <h2 className="font-display text-3xl">¡Gracias, {f.name.split(' ')[0]}!</h2>
                  <p className="mx-auto mt-3 max-w-sm text-muted">Recibimos tu solicitud. Te contactaremos pronto para platicar tu proyecto.</p>
                  <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-sand/70 p-5 text-left text-sm">
                    <p className="font-semibold">¿Qué sigue?</p>
                    <ul className="mt-2 space-y-1 text-muted">
                      <li>• Te llamamos en menos de 24 horas hábiles</li>
                      <li>• Agendamos una primera plática sin costo</li>
                      <li>• Si hace falta, visitamos tu terreno o casona</li>
                    </ul>
                  </div>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link to="/proyectos" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-clay">Ver proyectos <ArrowRight className="h-4 w-4" /></Link>
                    <button onClick={() => { setState('idle'); setF({ name: '', email: '', phone: '', service: '', message: '' }) }} className="rounded-full border hairline px-6 py-3 text-sm font-semibold hover:bg-white">Enviar otra</button>
                  </div>
                  <p className="mt-6 text-xs text-muted">Demo: la solicitud ya aparece en <Link to="/panel/clientes" className="font-semibold text-clay underline-offset-2 hover:underline">Clientes del panel</Link>.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
