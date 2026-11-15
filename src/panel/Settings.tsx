import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Facebook, FolderOpen, Instagram, Sparkles, Workflow, Database, Plug } from 'lucide-react'
import { Btn, EASE, PlanBadge, inputCls } from '../components/ui'
import { services, users } from '../data/mock'
import { useStore } from '../store'
import { card, PageHead } from './PanelLayout'

const perms = ['Ver proyectos', 'Cargar material', 'Editar fichas', 'Aprobar publicaciones', 'Publicar en sitio', 'Configuración']
const matrix: Record<string, boolean[]> = {
  u1: [true, true, true, true, true, true],
  u2: [true, true, true, true, true, false],
  u3: [true, true, true, false, false, false],
  u4: [true, true, false, false, false, false],
}

export default function Settings() {
  const toast = useStore((s) => s.toast)
  const [tpl, setTpl] = useState('{proyecto} · {ubicación}\n{descripción}\n\n#ADCOM #ArquitecturaMérida')
  const conns = [
    { n: 'Google Drive', d: 'Carpetas base por proyecto', i: FolderOpen, on: true, plan: 1 as const },
    { n: 'Supabase', d: 'Datos de proyectos, clientes y estados', i: Database, on: true, plan: 1 as const },
    { n: 'IA para borradores', d: 'Textos y hashtags sugeridos', i: Sparkles, on: true, plan: 2 as const },
    { n: 'Make / n8n', d: 'Automatización Drive → IA → panel', i: Workflow, on: false, plan: 3 as const },
    { n: 'Facebook', d: 'Página ADCOM Mérida', i: Facebook, on: false, plan: 3 as const },
    { n: 'Instagram', d: 'Cuenta profesional pendiente', i: Instagram, on: false, plan: 3 as const },
  ]
  return (
    <>
      <PageHead title="Configuración" sub="Usuarios, permisos, servicios, plantillas y conexiones." plan={1} />

      <section className={`${card} mb-5 overflow-hidden`}>
        <div className="flex items-center justify-between border-b hairline p-5"><h2 className="font-display text-xl">Usuarios y roles</h2><Btn variant="light" onClick={() => toast('Invitación enviada (simulado)', 'info')}>Invitar usuario</Btn></div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b hairline text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4 font-semibold">Usuario</th>
                {perms.map((p) => <th key={p} className="p-4 text-center font-semibold">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map((u, r) => (
                <tr key={u.id} className="border-b hairline last:border-0">
                  <td className="p-4">
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-paper" style={{ background: u.color }}>{u.initials}</span>
                      <span><b className="block">{u.name}</b><span className="text-xs text-muted">{u.role}</span></span>
                    </span>
                  </td>
                  {matrix[u.id].map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.02 * (r * 6 + i), ease: EASE }} className={`mx-auto grid h-6 w-6 place-items-center rounded-full ${v ? 'bg-sage text-paper' : 'bg-sand'}`}>{v && <Check className="h-3.5 w-3.5" />}</motion.span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={`${card} p-5`}>
          <h2 className="mb-4 font-display text-xl">Conexiones</h2>
          <ul className="space-y-2">
            {conns.map((c) => (
              <li key={c.n} className="flex items-center gap-3 rounded-xl border hairline bg-white/50 p-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand"><c.i className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><b className="flex items-center gap-2 text-sm">{c.n} <PlanBadge n={c.plan} /></b><span className="text-xs text-muted">{c.d}</span></span>
                {c.on ? <span className="rounded-full bg-sage/15 px-2.5 py-1 text-xs font-semibold text-sage">Conectado</span> : <button onClick={() => toast(`${c.n}: se conecta en el Plan ${c.plan}`, 'info')} className="inline-flex items-center gap-1 rounded-full border hairline px-2.5 py-1 text-xs font-semibold hover:bg-white"><Plug className="h-3 w-3" /> Conectar</button>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Las cuentas externas quedan a nombre de ADCOM.</p>
        </section>

        <section className="space-y-5">
          <div className={`${card} p-5`}>
            <h2 className="mb-4 font-display text-xl">Servicios</h2>
            <div className="flex flex-wrap gap-2">{services.map((s) => <span key={s.key} className="rounded-full bg-sand px-3 py-1.5 text-sm">{s.title}</span>)}</div>
          </div>
          <div className={`${card} p-5`}>
            <h2 className="mb-1 font-display text-xl">Plantilla de publicación</h2>
            <p className="mb-3 text-xs text-muted">Base que usa la IA para escribir borradores.</p>
            <textarea value={tpl} onChange={(e) => setTpl(e.target.value)} className={`${inputCls} min-h-28 font-mono text-xs`} />
            <div className="mt-3 flex justify-end"><Btn onClick={() => toast('Plantilla guardada')}>Guardar</Btn></div>
          </div>
        </section>
      </div>
    </>
  )
}
