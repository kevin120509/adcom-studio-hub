import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Facebook, Instagram, Pencil, RotateCcw, Send, Sparkles, ThumbsDown, Wand2, Heart, MessageCircle, Bookmark } from 'lucide-react'
import { Btn, EASE, Field, Modal, PlanBadge, inputCls } from '../components/ui'
import { img, TODAY, type Channel, type Post, type PostStatus } from '../data/mock'
import { fmtDate, useMe, useStore } from '../store'
import { card, PageHead } from './PanelLayout'

const cols: { k: PostStatus; l: string; dot: string }[] = [
  { k: 'borrador', l: 'Borrador', dot: 'bg-ink/30' },
  { k: 'revisión', l: 'En revisión', dot: 'bg-gold' },
  { k: 'aprobado', l: 'Aprobado', dot: 'bg-sage' },
  { k: 'publicado', l: 'Publicado', dot: 'bg-clay' },
]

const canApprove = (role: string) => role === 'Dirección' || role === 'Contenido y redes'

export function PostCard({ post }: { post: Post }) {
  const { movePost, projects } = useStore()
  const me = useMe()
  const [edit, setEdit] = useState(false)
  const project = projects.find((p) => p.id === post.projectId)
  const approver = canApprove(me.role)
  return (
    <>
      <motion.article layout layoutId={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden rounded-xl border hairline bg-white shadow-sm">
        <button onClick={() => setEdit(true)} className="group relative block w-full">
          <img src={img(post.image, 600, 340)} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-ink/0 text-paper opacity-0 transition group-hover:bg-ink/35 group-hover:opacity-100"><Pencil className="h-5 w-5" /></span>
          {post.aiGenerated && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink/75 px-2 py-0.5 text-[10px] font-semibold text-paper backdrop-blur"><Sparkles className="h-3 w-3" /> IA</span>}
        </button>
        <div className="p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{project?.name}</p>
          <h3 className="mt-0.5 text-sm font-semibold leading-snug">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{post.body}</p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted">
            <span className="flex items-center gap-1">
              {post.channel.includes('Facebook') && <Facebook className="h-3.5 w-3.5" />}
              {post.channel.includes('Instagram') && <Instagram className="h-3.5 w-3.5" />}
              {post.channel}
            </span>
            <span>{fmtDate(post.date)}</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {post.status === 'borrador' && <Btn className="w-full py-1.5 text-xs" onClick={() => movePost(post.id, 'revisión')}><Send className="h-3.5 w-3.5" /> Enviar a revisión</Btn>}
            {post.status === 'revisión' && (
              <>
                <Btn variant="light" className="flex-1 py-1.5 text-xs" disabled={!approver} title={approver ? '' : 'Tu rol no puede aprobar'} onClick={() => movePost(post.id, 'rechazado')}><ThumbsDown className="h-3.5 w-3.5" /> Rechazar</Btn>
                <Btn className="flex-1 bg-sage py-1.5 text-xs hover:bg-sage/90" disabled={!approver} title={approver ? '' : 'Tu rol no puede aprobar'} onClick={() => movePost(post.id, 'aprobado')}><Check className="h-3.5 w-3.5" /> Aprobar</Btn>
              </>
            )}
            {post.status === 'aprobado' && <Btn variant="clay" className="w-full py-1.5 text-xs" onClick={() => movePost(post.id, 'publicado')}><Send className="h-3.5 w-3.5" /> Publicar ahora <span className="rounded bg-paper/20 px-1 text-[9px]">PLAN 3</span></Btn>}
            {post.status === 'rechazado' && <Btn variant="light" className="w-full py-1.5 text-xs" onClick={() => movePost(post.id, 'borrador')}><RotateCcw className="h-3.5 w-3.5" /> Reabrir como borrador</Btn>}
            {post.status === 'publicado' && <p className="w-full rounded-full bg-clay/10 py-1.5 text-center text-xs font-semibold text-clay">Publicado ✓</p>}
          </div>
          {post.status === 'revisión' && !approver && <p className="mt-2 text-center text-[11px] text-muted">Solo Dirección o Contenido pueden aprobar.</p>}
        </div>
      </motion.article>
      <EditPost post={post} open={edit} onClose={() => setEdit(false)} />
    </>
  )
}

function EditPost({ post, open, onClose }: { post: Post; open: boolean; onClose: () => void }) {
  const { updatePost, toast } = useStore()
  const [f, setF] = useState({ title: post.title, body: post.body, tags: post.hashtags.join(' '), channel: post.channel })
  useEffect(() => { if (open) setF({ title: post.title, body: post.body, tags: post.hashtags.join(' '), channel: post.channel }) }, [open, post])
  const locked = post.status === 'publicado'
  return (
    <Modal open={open} onClose={onClose} title={locked ? 'Publicación' : 'Editar publicación'} wide>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Título interno"><input disabled={locked} className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Texto"><textarea disabled={locked} className={`${inputCls} min-h-36`} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
          <p className="-mt-2 text-right text-xs text-muted">{f.body.length} / 2,200</p>
          <Field label="Hashtags"><input disabled={locked} className={inputCls} value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} /></Field>
          <Field label="Canal">
            <select disabled={locked} className={inputCls} value={f.channel} onChange={(e) => setF({ ...f, channel: e.target.value as Channel })}>
              <option>Facebook</option><option>Instagram</option><option>Facebook + Instagram</option>
            </select>
          </Field>
          {!locked && (
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
              <Btn disabled={f.body.trim().length < 10} onClick={() => { updatePost(post.id, { title: f.title, body: f.body, channel: f.channel, hashtags: f.tags.split(/\s+/).filter(Boolean).map((t) => (t.startsWith('#') ? t : `#${t}`)) }); toast('Cambios guardados'); onClose() }}>Guardar</Btn>
            </div>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Vista previa</p>
          <div className="mx-auto max-w-[340px] overflow-hidden rounded-2xl border hairline bg-white shadow-xl">
            <div className="flex items-center gap-2 p-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[10px] font-bold text-paper">AD</span>
              <span className="text-sm font-semibold">adcom.merida</span>
            </div>
            <img src={img(post.image, 680, 680)} alt="" className="aspect-square w-full object-cover" />
            <div className="flex gap-3 p-3 pb-1"><Heart className="h-5 w-5" /><MessageCircle className="h-5 w-5" /><Send className="h-5 w-5" /><Bookmark className="ml-auto h-5 w-5" /></div>
            <p className="px-3 pb-4 text-sm"><b>adcom.merida</b> {f.body} <span className="text-[#3b6aa0]">{f.tags}</span></p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const drafts = (name: string, tone: string, loc: string) => {
  const t: Record<string, string> = {
    Cercano: `Así va ${name} ✨ Cada semana avanzamos un poco más en este proyecto en ${loc}. Gracias por dejarnos ser parte de su historia.`,
    Profesional: `${name}, ${loc}. Un proyecto que integra diseño contemporáneo, materiales locales y una ejecución cuidada en cada detalle.`,
    Inspirador: `Hay espacios que se diseñan para durar generaciones. ${name} es uno de ellos: luz, sombra y materia trabajando juntas en ${loc}.`,
  }
  return t[tone]
}

export default function Content() {
  const { posts, projects, addPost, log, toast } = useStore()
  const [params, setParams] = useSearchParams()
  const [gen, setGen] = useState(params.get('generar') === '1')
  const [showRejected, setShowRejected] = useState(false)
  useEffect(() => { if (params.get('generar') === '1') setGen(true) }, [params])
  const rejected = posts.filter((p) => p.status === 'rechazado')

  return (
    <>
      <PageHead title="Contenido y aprobación" sub="Borradores generados con IA, revisados por una persona antes de publicar." plan={2}>
        <Btn onClick={() => setGen(true)}><Wand2 className="h-4 w-4" /> Generar con IA</Btn>
      </PageHead>

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border hairline bg-white/40 p-3 text-xs text-muted">
        <span className="font-semibold text-ink">Flujo:</span>
        {['Borrador IA', 'Revisión de Abril', 'Aprobado', 'Publicado en redes'].map((s, i) => (
          <span key={s} className="flex items-center gap-2">{i > 0 && <span className="text-ink/30">→</span>}<span className="rounded-full bg-sand px-2.5 py-1">{s}</span></span>
        ))}
        <span className="ml-auto flex items-center gap-2">Publicación automática en Meta <PlanBadge n={3} /></span>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-4 scrollbar-thin sm:-mx-6 sm:px-6">
        <div className="grid min-w-[1000px] grid-cols-4 gap-4">
          {cols.map((c) => {
            const list = posts.filter((p) => p.status === c.k)
            return (
              <section key={c.k} className="rounded-2xl bg-sand/50 p-3">
                <h2 className="mb-3 flex items-center gap-2 px-1 text-sm font-semibold"><span className={`h-2 w-2 rounded-full ${c.dot}`} /> {c.l} <span className="ml-auto rounded-full bg-white/70 px-2 text-xs">{list.length}</span></h2>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">{list.map((p) => <PostCard key={p.id} post={p} />)}</AnimatePresence>
                  {!list.length && <p className="rounded-xl border border-dashed border-ink/15 py-8 text-center text-xs text-muted">Vacío</p>}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {rejected.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setShowRejected((v) => !v)} className="text-sm font-semibold text-muted hover:text-ink">{showRejected ? 'Ocultar' : 'Ver'} rechazadas ({rejected.length})</button>
          {showRejected && <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{rejected.map((p) => <PostCard key={p.id} post={p} />)}</div>}
        </div>
      )}

      <Generator
        open={gen}
        initialProject={params.get('proyecto') ?? ''}
        onClose={() => { setGen(false); if (params.get('generar')) setParams({}, { replace: true }) }}
        onCreate={(p) => {
          addPost(p)
          log(`generó con IA un borrador para ${projects.find((x) => x.id === p.projectId)?.name}`, 'clay', 'Studio Hub')
          toast('Borrador creado. Revísalo antes de enviarlo.')
          setGen(false)
          if (params.get('generar')) setParams({}, { replace: true })
        }}
      />
    </>
  )
}

function Generator({ open, onClose, onCreate, initialProject }: { open: boolean; onClose: () => void; onCreate: (p: Omit<Post, 'id'>) => void; initialProject: string }) {
  const projects = useStore((s) => s.projects).filter((p) => p.publicStatus !== 'archivado')
  const media = useStore((s) => s.media)
  const [pid, setPid] = useState(initialProject)
  const [tone, setTone] = useState('Cercano')
  const [channel, setChannel] = useState<Channel>('Facebook + Instagram')
  const [phase, setPhase] = useState<'form' | 'thinking' | 'typing'>('form')
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { if (open) { setPid(initialProject); setPhase('form'); setText(''); setErr('') } }, [open, initialProject])
  const p = projects.find((x) => x.id === pid)
  const full = p ? drafts(p.name, tone, p.location.split(',')[0]) : ''
  const tags = p ? ['#ADCOM', '#ArquitecturaMérida', p.type === 'Remodelación' ? '#CasonasMérida' : p.type === 'Comercial' ? '#DiseñoComercial' : '#CasaYucateca'] : []

  const run = () => {
    if (!p) return setErr('Elige un proyecto.')
    if (!p.permission) return setErr('Este proyecto no tiene permiso del cliente para publicar fotos.')
    setErr('')
    setPhase('thinking')
    setTimeout(() => {
      setPhase('typing')
      let i = 0
      const t = setInterval(() => { i += 3; setText(full.slice(0, i)); if (i >= full.length) clearInterval(t) }, 18)
    }, 1300)
  }
  const photo = p ? (media.find((m) => m.projectId === p.id && m.status === 'seleccionada')?.url ?? p.cover) : ''

  return (
    <Modal open={open} onClose={onClose} title="Generar publicación con IA" wide>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Field label="Proyecto">
            <select className={inputCls} value={pid} disabled={phase !== 'form'} onChange={(e) => { setPid(e.target.value); setErr('') }}>
              <option value="">Selecciona…</option>
              {projects.map((x) => <option key={x.id} value={x.id}>{x.name}{x.permission ? '' : ' (sin permiso)'}</option>)}
            </select>
          </Field>
          <Field label="Tono">
            <div className="flex flex-wrap gap-2">
              {['Cercano', 'Profesional', 'Inspirador'].map((t) => (
                <button key={t} type="button" disabled={phase !== 'form'} onClick={() => setTone(t)} className={`rounded-full border px-4 py-1.5 text-sm ${tone === t ? 'border-ink bg-ink text-paper' : 'hairline hover:bg-white'}`}>{t}</button>
              ))}
            </div>
          </Field>
          <Field label="Canal">
            <select className={inputCls} value={channel} disabled={phase !== 'form'} onChange={(e) => setChannel(e.target.value as Channel)}>
              <option>Facebook</option><option>Instagram</option><option>Facebook + Instagram</option>
            </select>
          </Field>
          {err && <p className="text-sm font-medium text-clay">{err}</p>}
          <p className="rounded-xl bg-sand/60 p-3 text-xs text-muted">La IA solo prepara el borrador. Nada se publica sin aprobación humana.</p>
        </div>
        <div className="rounded-2xl border hairline bg-white/60 p-4">
          {phase === 'form' && (
            <div className="grid h-full min-h-56 place-items-center text-center text-sm text-muted">
              <div>
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-clay" />
                Elige un proyecto y genera el borrador.
              </div>
            </div>
          )}
          {phase === 'thinking' && (
            <div className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-xl bg-sand"><div className="shimmer h-full w-full" /></div>
              {[90, 75, 82, 40].map((w, i) => <div key={i} className="h-3 overflow-hidden rounded bg-sand" style={{ width: `${w}%` }}><div className="shimmer h-full w-full" /></div>)}
              <p className="flex items-center gap-2 text-xs text-muted"><Sparkles className="h-3.5 w-3.5 animate-pulse text-clay" /> Analizando fotos y ficha del proyecto…</p>
            </div>
          )}
          {phase === 'typing' && p && (
            <div>
              <img src={img(photo, 700, 400)} alt="" className="aspect-video w-full rounded-xl object-cover" />
              <p className="mt-3 min-h-20 text-sm">{text}<span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-clay align-middle" /></p>
              {text.length >= full.length && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-[#3b6aa0]">{tags.join(' ')}</motion.p>}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        {phase === 'typing' ? (
          <>
            <Btn variant="ghost" onClick={() => { setPhase('form'); setText('') }}>Generar otra versión</Btn>
            <Btn disabled={text.length < full.length} onClick={() => p && onCreate({ projectId: p.id, title: `${p.name} · ${tone}`, body: full, hashtags: tags, channel, status: 'borrador', image: photo, date: TODAY, aiGenerated: true })}>Guardar como borrador</Btn>
          </>
        ) : (
          <>
            <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={run} disabled={phase === 'thinking'}><Wand2 className="h-4 w-4" /> Generar</Btn>
          </>
        )}
      </div>
    </Modal>
  )
}
