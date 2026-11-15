import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as D from './data/mock'

type Toast = { id: number; text: string; tone?: 'ok' | 'info' | 'warn' }

interface State {
  projects: D.Project[]
  clients: D.Client[]
  media: D.Media[]
  posts: D.Post[]
  agenda: D.AgendaItem[]
  activity: D.Activity[]
  currentUser: string
  toasts: Toast[]

  toast: (text: string, tone?: Toast['tone']) => void
  dismiss: (id: number) => void
  setUser: (id: string) => void
  log: (text: string, tone?: D.Activity['tone'], who?: string) => void

  updateProject: (id: string, patch: Partial<D.Project>) => void
  setPublicStatus: (id: string, s: D.PublicStatus) => void
  addProject: (p: Omit<D.Project, 'id' | 'slug' | 'updatedAt'>) => string

  addClient: (c: Omit<D.Client, 'id'>) => string
  updateClient: (id: string, patch: Partial<D.Client>) => void

  addMedia: (projectId: string, count: number) => void
  setMediaStatus: (id: string, s: D.MediaStatus) => void

  addPost: (p: Omit<D.Post, 'id'>) => string
  updatePost: (id: string, patch: Partial<D.Post>) => void
  movePost: (id: string, s: D.PostStatus) => void

  addAgenda: (a: Omit<D.AgendaItem, 'id'>) => void
  toggleAgenda: (id: string) => void

  submitLead: (lead: { name: string; email: string; phone: string; service: string; message: string }) => void
  reset: () => void
}

const initial = () => ({
  projects: structuredClone(D.projects),
  clients: structuredClone(D.clients),
  media: structuredClone(D.media),
  posts: structuredClone(D.posts),
  agenda: structuredClone(D.agenda),
  activity: structuredClone(D.activity),
  currentUser: 'u2',
  toasts: [] as Toast[],
})

const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const statusLabel: Record<D.PostStatus, string> = {
  borrador: 'Borrador', revisión: 'En revisión', aprobado: 'Aprobado', publicado: 'Publicado', rechazado: 'Rechazado',
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),

      toast: (text, tone = 'ok') => {
        const id = Date.now() + Math.random()
        set((s) => ({ toasts: [...s.toasts, { id, text, tone }] }))
        setTimeout(() => get().dismiss(id), 3200)
      },
      dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      setUser: (id) => set({ currentUser: id }),
      log: (text, tone = 'ink', who) => {
        const me = D.users.find((u) => u.id === get().currentUser)?.name ?? 'Studio Hub'
        set((s) => ({ activity: [{ id: uid('ac'), text, who: who ?? me, at: 'Justo ahora', tone }, ...s.activity].slice(0, 30) }))
      },

      updateProject: (id, patch) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: D.TODAY } : p)) })),
      setPublicStatus: (id, st) => {
        const p = get().projects.find((x) => x.id === id)
        if (!p) return
        get().updateProject(id, { publicStatus: st })
        const msg: Record<D.PublicStatus, string> = {
          publicado: `publicó ${p.name} en el sitio web`,
          pendiente: `marcó ${p.name} como pendiente de publicar`,
          privado: `ocultó ${p.name} del sitio web`,
          archivado: `archivó ${p.name}`,
        }
        get().log(msg[st], st === 'publicado' ? 'sage' : 'ink')
        get().toast(st === 'publicado' ? `${p.name} ya aparece en el portafolio público` : `${p.name}: ${st}`)
      },
      addProject: (p) => {
        const id = uid('p')
        set((s) => ({ projects: [{ ...p, id, slug: slugify(p.name) + '-' + id.slice(-3), updatedAt: D.TODAY }, ...s.projects] }))
        get().log(`creó el proyecto ${p.name}`, 'clay')
        get().toast('Proyecto creado y carpeta de Drive preparada')
        return id
      },

      addClient: (c) => {
        const id = uid('c')
        set((s) => ({ clients: [{ ...c, id }, ...s.clients] }))
        get().log(`registró al cliente ${c.name}`, 'clay')
        return id
      },
      updateClient: (id, patch) => set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      addMedia: (projectId, count) => {
        const pool = Object.values(D.P)
        const me = D.users.find((u) => u.id === get().currentUser)?.name ?? 'Equipo'
        const now = Array.from({ length: count }, (_, i) => ({
          id: uid('m'),
          projectId,
          name: `IMG_${Math.floor(4000 + Math.random() * 5000)}.jpg`,
          url: pool[Math.floor(Math.random() * pool.length)],
          kind: 'foto' as const,
          status: 'original' as const,
          uploadedBy: me,
          date: D.TODAY,
          size: `${(2 + Math.random() * 4).toFixed(1)} MB`,
        }))
        set((s) => ({ media: [...now, ...s.media] }))
        const p = get().projects.find((x) => x.id === projectId)
        get().log(`subió ${count} fotografías a ${p?.name}`, 'gold')
        get().toast(`${count} fotografías guardadas en Drive · ${p?.name}`)
      },
      setMediaStatus: (id, st) => set((s) => ({ media: s.media.map((m) => (m.id === id ? { ...m, status: st } : m)) })),

      addPost: (p) => {
        const id = uid('po')
        set((s) => ({ posts: [{ ...p, id }, ...s.posts] }))
        return id
      },
      updatePost: (id, patch) => set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      movePost: (id, st) => {
        const p = get().posts.find((x) => x.id === id)
        if (!p) return
        get().updatePost(id, { status: st, date: D.TODAY })
        const tone = st === 'aprobado' || st === 'publicado' ? 'sage' : st === 'rechazado' ? 'clay' : 'ink'
        get().log(`movió “${p.title}” a ${statusLabel[st]}`, tone)
        get().toast(
          st === 'publicado' ? `Publicado en ${p.channel} (simulado)` : `“${p.title}” → ${statusLabel[st]}`,
          st === 'rechazado' ? 'warn' : 'ok',
        )
      },

      addAgenda: (a) => {
        set((s) => ({ agenda: [...s.agenda, { ...a, id: uid('a') }] }))
        get().toast('Seguimiento agendado')
      },
      toggleAgenda: (id) => set((s) => ({ agenda: s.agenda.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) })),

      submitLead: (lead) => {
        const id = get().addClient({
          name: lead.name, company: 'Particular', phone: lead.phone, email: lead.email, type: 'Residencial', status: 'Prospecto',
          lastContact: D.TODAY, nextAction: `Responder solicitud de ${lead.service}`, nextDate: '2026-11-15', owner: 'Abril Navarro',
          source: 'Sitio web', notes: lead.message,
        })
        set((s) => ({
          agenda: [...s.agenda, { id: uid('a'), clientId: id, title: `Responder solicitud web — ${lead.name}`, date: '2026-11-15', time: '10:00', owner: 'Abril Navarro', kind: 'Llamada', done: false }],
        }))
        get().log(`registró a ${lead.name} desde el sitio web`, 'clay', 'Formulario web')
      },

      reset: () => {
        set({ ...initial() })
        get().toast('Demo reiniciada con los datos originales', 'info')
      },
    }),
    {
      name: 'adcom-studio-hub-demo',
      version: 1,
      partialize: (s) => ({
        projects: s.projects, clients: s.clients, media: s.media, posts: s.posts, agenda: s.agenda, activity: s.activity, currentUser: s.currentUser,
      }),
    },
  ),
)

export const can = (userId: string, p: D.Perm) => (D.rolePerms[userId] ?? []).includes(p)

export const useMe = () => {
  const id = useStore((s) => s.currentUser)
  return D.users.find((u) => u.id === id) ?? D.users[0]
}

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', opts)
