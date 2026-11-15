// Datos ficticios para la demo. Ningún nombre, cliente o proyecto es real.

export const img = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`

export type ProjectType = 'Residencial' | 'Comercial' | 'Remodelación' | 'Construcción'
export type Stage = 'Anteproyecto' | 'Permisos' | 'Obra' | 'Entregado'
export type PublicStatus = 'privado' | 'pendiente' | 'publicado' | 'archivado'

export interface Project {
  id: string
  slug: string
  name: string
  clientId: string
  type: ProjectType
  services: string[]
  location: string
  stage: Stage
  owner: string
  progress: number
  publicStatus: PublicStatus
  permission: boolean
  inah: boolean
  cover: string
  gallery: string[]
  year: number
  area: number
  tagline: string
  descInternal: string
  descPublic: string
  driveFolder: string
  updatedAt: string
}

export type ClientStatus = 'Prospecto' | 'Activo' | 'Cerrado'
export interface Client {
  id: string
  name: string
  company: string
  phone: string
  email: string
  type: 'Residencial' | 'Comercial' | 'Desarrollador' | 'Institución'
  status: ClientStatus
  lastContact: string
  nextAction: string
  nextDate: string
  owner: string
  source: string
  notes: string
}

export type MediaKind = 'foto' | 'plano' | 'documento' | 'video'
export type MediaStatus = 'original' | 'en revisión' | 'seleccionada'
export interface Media {
  id: string
  projectId: string
  name: string
  url: string
  kind: MediaKind
  status: MediaStatus
  uploadedBy: string
  date: string
  size: string
}

export type PostStatus = 'borrador' | 'revisión' | 'aprobado' | 'publicado' | 'rechazado'
export type Channel = 'Facebook' | 'Instagram' | 'Facebook + Instagram'
export interface Post {
  id: string
  projectId: string
  title: string
  body: string
  hashtags: string[]
  channel: Channel
  status: PostStatus
  image: string
  date: string
  aiGenerated: boolean
}

export interface AgendaItem {
  id: string
  clientId: string
  title: string
  date: string // YYYY-MM-DD
  time: string
  owner: string
  kind: 'Llamada' | 'Visita a obra' | 'Reunión' | 'Seguimiento'
  done: boolean
}

export interface Activity {
  id: string
  text: string
  who: string
  at: string
  tone: 'clay' | 'sage' | 'gold' | 'ink'
}

export interface User {
  id: string
  name: string
  role: string
  permissions: string
  initials: string
  color: string
}

export const users: User[] = [
  { id: 'u1', name: 'Arq. Daniel Herrera', role: 'Dirección', permissions: 'Todo el sistema', initials: 'DH', color: '#1c1a17' },
  { id: 'u2', name: 'Abril Navarro', role: 'Contenido y redes', permissions: 'Cargar, editar y aprobar publicaciones', initials: 'AN', color: '#b9562e' },
  { id: 'u3', name: 'Ing. Sofía Canul', role: 'Residente de obra', permissions: 'Cargar material y actualizar etapas', initials: 'SC', color: '#5f7360' },
  { id: 'u4', name: 'Luis Ek', role: 'Fotografía en sitio', permissions: 'Cargar fotografías', initials: 'LE', color: '#b48a3c' },
]

export type Perm = 'ver' | 'cargar' | 'editar' | 'aprobar' | 'publicarSitio' | 'config'
export const permLabels: { k: Perm; l: string }[] = [
  { k: 'ver', l: 'Ver proyectos' },
  { k: 'cargar', l: 'Cargar material' },
  { k: 'editar', l: 'Editar fichas' },
  { k: 'aprobar', l: 'Aprobar publicaciones' },
  { k: 'publicarSitio', l: 'Publicar en sitio' },
  { k: 'config', l: 'Configuración' },
]
export const rolePerms: Record<string, Perm[]> = {
  u1: ['ver', 'cargar', 'editar', 'aprobar', 'publicarSitio', 'config'],
  u2: ['ver', 'cargar', 'editar', 'aprobar', 'publicarSitio'],
  u3: ['ver', 'cargar', 'editar'],
  u4: ['ver', 'cargar'],
}

export const P = {
  villaPool: '1600585154340-be6161a56a0c',
  living: '1600607687939-ce8a6c25118c',
  kitchenOpen: '1600566753190-17f0baa2a6c3',
  luxuryPool: '1512917774080-9991f1c4c750',
  villa: '1613490493576-7fde63acd811',
  modernHouse: '1600047509807-ba8f99d2cdde',
  interior: '1618221195710-dd6b41faaea6',
  chair: '1586023492125-27b2c045efd7',
  office: '1497366216548-37526070297c',
  blueprint: '1503387762-592deb58ef4e',
  site: '1541888946425-d81bb19240f5',
  workers: '1504307651254-35680f356dfd',
  living2: '1600210492486-724fe5c67fb0',
  house2: '1564013799919-ab600027ffc6',
  facade: '1505843513577-22bb7d21e455',
  white: '1487958449943-2429e8be8625',
  interior3: '1600573472550-8090b5e0745e',
  house3: '1416331108676-a22ccb276e35',
  house4: '1449844908441-8829872d2607',
  house5: '1523217582562-09d0def993a6',
  hotel: '1582268611958-ebfd161ef9cf',
  bedroom: '1631679706909-1844bbd07221',
  kitchen: '1556909114-f6e7ad7d3136',
  glass: '1496307653780-42ee777d4833',
  casona: '1685461661138-bf506d38b89b',
  casonaFacade: '1613859638331-39168fcc2492',
}

export const services = [
  {
    key: 'Arquitectura',
    title: 'Diseño arquitectónico',
    text: 'Anteproyecto, proyecto ejecutivo y renders para vivienda y desarrollos, pensados para el clima y la luz de Yucatán.',
    photo: P.blueprint,
  },
  {
    key: 'Comercial',
    title: 'Diseño comercial',
    text: 'Locales, restaurantes y oficinas que comunican la marca y funcionan desde el primer día de operación.',
    photo: P.office,
  },
  {
    key: 'Construcción',
    title: 'Construcción',
    text: 'Obra llave en mano con residente, bitácora y reportes fotográficos semanales para el cliente.',
    photo: P.site,
  },
  {
    key: 'Casonas',
    title: 'Remodelación de casonas',
    text: 'Restauración de casonas del Centro Histórico con gestión de permisos ante el INAH y respeto al patrimonio.',
    photo: P.casonaFacade,
  },
]

export const clients: Client[] = [
  { id: 'c1', name: 'Mariana Peniche', company: 'Familia Peniche', phone: '999 214 5580', email: 'mariana.peniche@correo.mx', type: 'Residencial', status: 'Activo', lastContact: '2026-11-12', nextAction: 'Enviar avance de obra semana 14', nextDate: '2026-11-16', owner: 'Ing. Sofía Canul', source: 'Recomendación', notes: 'Prefiere reportes por WhatsApp los lunes.' },
  { id: 'c2', name: 'Roberto Cámara', company: 'Café Lucía S.A.', phone: '999 381 0042', email: 'rcamara@cafelucia.mx', type: 'Comercial', status: 'Activo', lastContact: '2026-11-10', nextAction: 'Validar paleta de acabados', nextDate: '2026-11-14', owner: 'Arq. Daniel Herrera', source: 'Facebook', notes: 'Apertura prevista para febrero.' },
  { id: 'c3', name: 'Grupo Inmobiliario Xcanatún', company: 'GIX Desarrollos', phone: '999 102 7731', email: 'proyectos@gix.mx', type: 'Desarrollador', status: 'Prospecto', lastContact: '2026-11-05', nextAction: 'Presentar propuesta de 12 viviendas', nextDate: '2026-11-18', owner: 'Arq. Daniel Herrera', source: 'Sitio web', notes: 'Interesados en prototipo de 3 recámaras.' },
  { id: 'c4', name: 'Fernanda Solís', company: 'Hotel Boutique Casa Ochenta', phone: '999 455 9120', email: 'fsolis@casaochenta.mx', type: 'Comercial', status: 'Activo', lastContact: '2026-11-11', nextAction: 'Ingresar expediente al INAH', nextDate: '2026-11-15', owner: 'Arq. Daniel Herrera', source: 'Recomendación', notes: 'Casona de 1890, fachada catalogada.' },
  { id: 'c5', name: 'Jorge Baeza', company: 'Particular', phone: '999 677 3318', email: 'jbaeza@correo.mx', type: 'Residencial', status: 'Prospecto', lastContact: '2026-11-08', nextAction: 'Agendar visita al terreno en Cholul', nextDate: '2026-11-17', owner: 'Ing. Sofía Canul', source: 'Instagram', notes: 'Terreno de 600 m².' },
  { id: 'c6', name: 'Clínica Dental Norte', company: 'Odonto Norte', phone: '999 300 1176', email: 'admin@odontonorte.mx', type: 'Comercial', status: 'Cerrado', lastContact: '2026-10-21', nextAction: 'Pedir testimonio y fotos finales', nextDate: '2026-11-20', owner: 'Abril Navarro', source: 'Sitio web', notes: 'Proyecto entregado en octubre.' },
  { id: 'c7', name: 'Patricia Medina', company: 'Particular', phone: '999 812 4407', email: 'paty.medina@correo.mx', type: 'Residencial', status: 'Activo', lastContact: '2026-11-13', nextAction: 'Revisión de planos de cocina', nextDate: '2026-11-19', owner: 'Arq. Daniel Herrera', source: 'Facebook', notes: '' },
  { id: 'c8', name: 'Ayuntamiento — Parque Itzimná', company: 'Dirección de Obras', phone: '999 930 2200', email: 'obras@institucion.mx', type: 'Institución', status: 'Prospecto', lastContact: '2026-11-03', nextAction: 'Enviar portafolio institucional', nextDate: '2026-11-21', owner: 'Abril Navarro', source: 'Licitación', notes: 'Convocatoria abierta hasta diciembre.' },
]

export const projects: Project[] = [
  {
    id: 'p1', slug: 'casona-calle-60', name: 'Casona Calle 60', clientId: 'c4', type: 'Remodelación',
    services: ['Casonas', 'Arquitectura'], location: 'Centro Histórico, Mérida', stage: 'Permisos', owner: 'Arq. Daniel Herrera',
    progress: 35, publicStatus: 'publicado', permission: true, inah: true,
    cover: P.casona, gallery: [P.casona, P.casonaFacade, P.living2, P.bedroom], year: 2026, area: 640,
    tagline: 'Una casona de 1890 que vuelve a recibir huéspedes.',
    descInternal: 'Expediente INAH en integración. Falta dictamen estructural del muro norte.',
    descPublic: 'Restauración integral de una casona de finales del siglo XIX para convertirla en hotel boutique de 9 habitaciones. Se conservan muros de mampostería, pasta original y vigas de madera, integrando instalaciones contemporáneas de forma discreta.',
    driveFolder: 'ADCOM / Proyectos / 2026 / Casona Calle 60', updatedAt: '2026-11-13',
  },
  {
    id: 'p2', slug: 'residencia-temozon', name: 'Residencia Temozón', clientId: 'c1', type: 'Residencial',
    services: ['Arquitectura', 'Construcción'], location: 'Temozón Norte, Mérida', stage: 'Obra', owner: 'Ing. Sofía Canul',
    progress: 68, publicStatus: 'publicado', permission: true, inah: false,
    cover: P.villaPool, gallery: [P.villaPool, P.living, P.kitchenOpen, P.interior], year: 2026, area: 420,
    tagline: 'Patios, sombra y una alberca que enfría la casa.',
    descInternal: 'Semana 14 de obra. Cancelería llega el 22 de noviembre.',
    descPublic: 'Vivienda unifamiliar de dos niveles organizada alrededor de un patio central. Volados profundos y celosías protegen del sol poniente; la alberca funciona como regulador térmico de las áreas sociales.',
    driveFolder: 'ADCOM / Proyectos / 2026 / Residencia Temozón', updatedAt: '2026-11-12',
  },
  {
    id: 'p3', slug: 'cafe-lucia', name: 'Café Lucía', clientId: 'c2', type: 'Comercial',
    services: ['Comercial'], location: 'Barrio de Santa Lucía, Mérida', stage: 'Anteproyecto', owner: 'Arq. Daniel Herrera',
    progress: 20, publicStatus: 'pendiente', permission: true, inah: false,
    cover: P.chair, gallery: [P.chair, P.kitchen, P.interior], year: 2026, area: 120,
    tagline: 'Un café de barrio con alma de cocina yucateca.',
    descInternal: 'Pendiente aprobar paleta de acabados con el cliente.',
    descPublic: 'Diseño interior de un café de especialidad en un local de 120 m². Barra de piedra local, piso de pasta recuperado y mobiliario de madera tropical para crear un espacio cálido y fácil de operar.',
    driveFolder: 'ADCOM / Proyectos / 2026 / Café Lucía', updatedAt: '2026-11-10',
  },
  {
    id: 'p4', slug: 'casa-chablekal', name: 'Casa Chablekal', clientId: 'c7', type: 'Residencial',
    services: ['Arquitectura', 'Construcción'], location: 'Chablekal, Yucatán', stage: 'Entregado', owner: 'Ing. Sofía Canul',
    progress: 100, publicStatus: 'publicado', permission: true, inah: false,
    cover: P.villa, gallery: [P.villa, P.living2, P.kitchen, P.bedroom], year: 2025, area: 310,
    tagline: 'Una casa de una planta abierta al jardín.',
    descInternal: 'Entregada. Cliente autorizó fotos y testimonio.',
    descPublic: 'Casa de una sola planta con muros de block aparente y techos altos que favorecen la ventilación cruzada. Cada espacio abre a un jardín de especies nativas de bajo mantenimiento.',
    driveFolder: 'ADCOM / Proyectos / 2025 / Casa Chablekal', updatedAt: '2026-10-30',
  },
  {
    id: 'p5', slug: 'oficinas-altabrisa', name: 'Oficinas Altabrisa', clientId: 'c3', type: 'Comercial',
    services: ['Comercial', 'Construcción'], location: 'Altabrisa, Mérida', stage: 'Entregado', owner: 'Arq. Daniel Herrera',
    progress: 100, publicStatus: 'publicado', permission: true, inah: false,
    cover: P.office, gallery: [P.office, P.glass, P.white], year: 2025, area: 860,
    tagline: 'Oficinas abiertas, luz natural y acústica controlada.',
    descInternal: 'Entregado. Se puede usar como referencia corporativa.',
    descPublic: 'Adecuación de un piso corporativo de 860 m² con áreas colaborativas, salas acústicas y luz natural controlada. Obra ejecutada en 11 semanas sin interrumpir la operación del edificio.',
    driveFolder: 'ADCOM / Proyectos / 2025 / Oficinas Altabrisa', updatedAt: '2026-09-18',
  },
  {
    id: 'p6', slug: 'clinica-dental-norte', name: 'Clínica Dental Norte', clientId: 'c6', type: 'Comercial',
    services: ['Comercial', 'Construcción'], location: 'Francisco de Montejo, Mérida', stage: 'Entregado', owner: 'Abril Navarro',
    progress: 100, publicStatus: 'pendiente', permission: false, inah: false,
    cover: P.interior3, gallery: [P.interior3, P.white, P.interior], year: 2026, area: 180,
    tagline: 'Una clínica que se siente como estar en casa.',
    descInternal: 'Fotos finales listas en Drive. Falta firma de autorización del cliente.',
    descPublic: 'Clínica de cuatro consultorios con circulaciones claras, materiales fáciles de sanitizar y una sala de espera con luz cálida que reduce la ansiedad del paciente.',
    driveFolder: 'ADCOM / Proyectos / 2026 / Clínica Dental Norte', updatedAt: '2026-11-08',
  },
  {
    id: 'p7', slug: 'casa-montebello', name: 'Casa Montebello', clientId: 'c1', type: 'Construcción',
    services: ['Construcción'], location: 'Montebello, Mérida', stage: 'Entregado', owner: 'Ing. Sofía Canul',
    progress: 100, publicStatus: 'publicado', permission: true, inah: false,
    cover: P.modernHouse, gallery: [P.modernHouse, P.house2, P.kitchenOpen], year: 2024, area: 280,
    tagline: 'Construcción precisa sobre un proyecto de terceros.',
    descInternal: 'Entregada en 2024.',
    descPublic: 'Construcción completa de una vivienda contemporánea de dos niveles, con estructura de concreto aparente y acabados de chukum en fachadas y baños.',
    driveFolder: 'ADCOM / Proyectos / 2024 / Casa Montebello', updatedAt: '2026-06-02',
  },
  {
    id: 'p8', slug: 'casona-itzimna', name: 'Casona Itzimná', clientId: 'c5', type: 'Remodelación',
    services: ['Casonas', 'Construcción'], location: 'Itzimná, Mérida', stage: 'Entregado', owner: 'Arq. Daniel Herrera',
    progress: 100, publicStatus: 'publicado', permission: true, inah: true,
    cover: P.living2, gallery: [P.living2, P.interior3, P.bedroom, P.hotel], year: 2025, area: 390,
    tagline: 'Pisos de pasta, techos altos y vida contemporánea.',
    descInternal: 'Entregada. Permiso INAH liberado en 2025.',
    descPublic: 'Remodelación de una casona de principios del siglo XX. Se restauraron pisos de pasta y viguería, y se integró una cocina abierta al patio trasero con una pequeña alberca.',
    driveFolder: 'ADCOM / Proyectos / 2025 / Casona Itzimná', updatedAt: '2026-08-14',
  },
  {
    id: 'p9', slug: 'prototipo-xcanatun', name: 'Prototipo Xcanatún', clientId: 'c3', type: 'Residencial',
    services: ['Arquitectura'], location: 'Xcanatún, Yucatán', stage: 'Anteproyecto', owner: 'Arq. Daniel Herrera',
    progress: 10, publicStatus: 'privado', permission: false, inah: false,
    cover: P.house5, gallery: [P.house5, P.blueprint], year: 2026, area: 165,
    tagline: 'Vivienda en serie que no se siente en serie.',
    descInternal: 'Propuesta en preparación para GIX. Confidencial hasta firma.',
    descPublic: 'Prototipo de vivienda de 3 recámaras para un desarrollo de 12 unidades.',
    driveFolder: 'ADCOM / Proyectos / 2026 / Prototipo Xcanatún', updatedAt: '2026-11-05',
  },
]

const m = (id: string, projectId: string, name: string, photo: string, kind: MediaKind, status: MediaStatus, uploadedBy: string, date: string, size: string): Media =>
  ({ id, projectId, name, url: photo, kind, status, uploadedBy, date, size })

export const media: Media[] = [
  m('m1', 'p2', 'Fachada_poniente_sem14.jpg', P.villaPool, 'foto', 'seleccionada', 'Luis Ek', '2026-11-12', '4.2 MB'),
  m('m2', 'p2', 'Estancia_avance.jpg', P.living, 'foto', 'en revisión', 'Ing. Sofía Canul', '2026-11-12', '3.8 MB'),
  m('m3', 'p2', 'Cocina_muebles.jpg', P.kitchenOpen, 'foto', 'original', 'Luis Ek', '2026-11-11', '5.1 MB'),
  m('m4', 'p2', 'Planta_arquitectonica_v3.pdf', P.blueprint, 'plano', 'seleccionada', 'Arq. Daniel Herrera', '2026-10-02', '1.4 MB'),
  m('m5', 'p1', 'Patio_central_levantamiento.jpg', P.casona, 'foto', 'seleccionada', 'Luis Ek', '2026-11-09', '6.0 MB'),
  m('m6', 'p1', 'Expediente_INAH_borrador.pdf', P.blueprint, 'documento', 'en revisión', 'Arq. Daniel Herrera', '2026-11-13', '8.7 MB'),
  m('m7', 'p1', 'Recorrido_casona.mp4', P.living2, 'video', 'original', 'Luis Ek', '2026-11-09', '212 MB'),
  m('m8', 'p3', 'Moodboard_acabados.jpg', P.chair, 'foto', 'en revisión', 'Abril Navarro', '2026-11-10', '2.2 MB'),
  m('m9', 'p6', 'Sala_espera_final.jpg', P.interior3, 'foto', 'seleccionada', 'Luis Ek', '2026-11-07', '4.9 MB'),
  m('m10', 'p6', 'Consultorio_2.jpg', P.white, 'foto', 'original', 'Luis Ek', '2026-11-07', '4.4 MB'),
  m('m11', 'p4', 'Exterior_atardecer.jpg', P.villa, 'foto', 'seleccionada', 'Luis Ek', '2026-10-28', '5.6 MB'),
  m('m12', 'p4', 'Recamara_principal.jpg', P.bedroom, 'foto', 'seleccionada', 'Luis Ek', '2026-10-28', '4.0 MB'),
  m('m13', 'p5', 'Area_colaborativa.jpg', P.office, 'foto', 'seleccionada', 'Luis Ek', '2026-09-15', '3.9 MB'),
  m('m14', 'p8', 'Pisos_pasta_detalle.jpg', P.interior3, 'foto', 'seleccionada', 'Luis Ek', '2026-08-10', '3.1 MB'),
  m('m15', 'p9', 'Croquis_prototipo.pdf', P.blueprint, 'plano', 'original', 'Arq. Daniel Herrera', '2026-11-05', '0.9 MB'),
]

export const posts: Post[] = [
  {
    id: 'po1', projectId: 'p2', title: 'Avance Residencia Temozón', status: 'revisión', channel: 'Facebook + Instagram', image: P.villaPool, date: '2026-11-13', aiGenerated: true,
    body: 'Semana 14 en Residencia Temozón ☀️ La fachada poniente ya muestra sus volados profundos: sombra natural para las tardes de Mérida. Pronto llega la cancelería.',
    hashtags: ['#ArquitecturaMérida', '#ConstrucciónYucatán', '#ADCOM'],
  },
  {
    id: 'po2', projectId: 'p4', title: 'Casa Chablekal · Entrega', status: 'aprobado', channel: 'Instagram', image: P.villa, date: '2026-11-11', aiGenerated: true,
    body: 'Entregamos Casa Chablekal: una sola planta, techos altos y un jardín nativo que la rodea. Gracias a la familia por confiar en ADCOM.',
    hashtags: ['#CasaYucateca', '#DiseñoArquitectónico', '#Mérida'],
  },
  {
    id: 'po3', projectId: 'p1', title: 'Casona Calle 60 · Levantamiento', status: 'borrador', channel: 'Facebook', image: P.casona, date: '2026-11-13', aiGenerated: true,
    body: 'Iniciamos el levantamiento de una casona de 1890 en el Centro Histórico. Cada muro cuenta una historia que vamos a conservar.',
    hashtags: ['#CasonasMérida', '#Patrimonio', '#CentroHistórico'],
  },
  {
    id: 'po4', projectId: 'p5', title: 'Oficinas Altabrisa', status: 'publicado', channel: 'Facebook + Instagram', image: P.office, date: '2026-10-29', aiGenerated: false,
    body: '860 m² de oficinas listas en 11 semanas, sin detener la operación del edificio.',
    hashtags: ['#DiseñoComercial', '#OficinasMérida'],
  },
  {
    id: 'po5', projectId: 'p8', title: 'Casona Itzimná · Pisos de pasta', status: 'publicado', channel: 'Instagram', image: P.living2, date: '2026-10-20', aiGenerated: true,
    body: 'Restaurar en lugar de reemplazar: los pisos de pasta originales de Casona Itzimná volvieron a brillar.',
    hashtags: ['#Restauración', '#PisosDePasta', '#Mérida'],
  },
  {
    id: 'po6', projectId: 'p6', title: 'Clínica Dental Norte', status: 'rechazado', channel: 'Facebook', image: P.interior3, date: '2026-11-08', aiGenerated: true,
    body: 'Así quedó la nueva Clínica Dental Norte…',
    hashtags: ['#DiseñoComercial'],
  },
]

export const agenda: AgendaItem[] = [
  { id: 'a1', clientId: 'c2', title: 'Validar paleta de acabados — Café Lucía', date: '2026-11-14', time: '10:00', owner: 'Arq. Daniel Herrera', kind: 'Reunión', done: false },
  { id: 'a2', clientId: 'c1', title: 'Recorrido semanal Residencia Temozón', date: '2026-11-14', time: '12:30', owner: 'Ing. Sofía Canul', kind: 'Visita a obra', done: true },
  { id: 'a3', clientId: 'c4', title: 'Ingresar expediente al INAH', date: '2026-11-15', time: '09:00', owner: 'Arq. Daniel Herrera', kind: 'Seguimiento', done: false },
  { id: 'a4', clientId: 'c1', title: 'Enviar avance de obra semana 14', date: '2026-11-16', time: '09:30', owner: 'Ing. Sofía Canul', kind: 'Seguimiento', done: false },
  { id: 'a5', clientId: 'c5', title: 'Visita al terreno en Cholul', date: '2026-11-17', time: '11:00', owner: 'Ing. Sofía Canul', kind: 'Visita a obra', done: false },
  { id: 'a6', clientId: 'c3', title: 'Presentar propuesta de 12 viviendas', date: '2026-11-18', time: '17:00', owner: 'Arq. Daniel Herrera', kind: 'Reunión', done: false },
  { id: 'a7', clientId: 'c7', title: 'Revisión de planos de cocina', date: '2026-11-19', time: '16:00', owner: 'Arq. Daniel Herrera', kind: 'Reunión', done: false },
  { id: 'a8', clientId: 'c6', title: 'Pedir testimonio y fotos finales', date: '2026-11-20', time: '13:00', owner: 'Abril Navarro', kind: 'Llamada', done: false },
  { id: 'a9', clientId: 'c8', title: 'Enviar portafolio institucional', date: '2026-11-21', time: '10:00', owner: 'Abril Navarro', kind: 'Seguimiento', done: false },
  { id: 'a10', clientId: 'c2', title: 'Llamada de seguimiento', date: '2026-11-12', time: '18:00', owner: 'Arq. Daniel Herrera', kind: 'Llamada', done: true },
]

export const activity: Activity[] = [
  { id: 'ac1', text: 'subió 3 fotografías a Residencia Temozón', who: 'Luis Ek', at: 'Hoy · 9:12', tone: 'gold' },
  { id: 'ac2', text: 'generó con IA un borrador para Casona Calle 60', who: 'Studio Hub', at: 'Hoy · 8:40', tone: 'clay' },
  { id: 'ac3', text: 'aprobó la publicación de Casa Chablekal', who: 'Abril Navarro', at: 'Ayer · 18:05', tone: 'sage' },
  { id: 'ac4', text: 'movió Residencia Temozón a etapa Obra (68%)', who: 'Ing. Sofía Canul', at: 'Ayer · 13:20', tone: 'ink' },
  { id: 'ac5', text: 'registró un prospecto desde el sitio web', who: 'Formulario web', at: '12 nov · 11:02', tone: 'clay' },
]

export const plans = [
  {
    n: 1, name: 'Portafolio organizado', goal: 'Resolver la presentación pública y el orden básico de proyectos.',
    impl: '$12,000 – $18,000', monthly: '$900 – $1,500',
    items: ['Sitio web y portafolio', 'Servicios y especialidades', 'Fichas de proyectos', 'Formulario de contacto', 'Estructura de carpetas en Drive', 'Registro básico de proyectos'],
  },
  {
    n: 2, name: 'Operación y contenido', goal: 'El sistema interno para dejar de depender de agendas y material disperso.', recommended: true,
    impl: '$22,000 – $32,000', monthly: '$1,800 – $3,000',
    items: ['Todo el Plan 1', 'Clientes y contactos', 'Estados y responsables por proyecto', 'Biblioteca vinculada con Drive', 'Agenda de seguimiento', 'Borradores de publicaciones', 'Flujo de revisión y aprobación', 'Panel de pendientes'],
  },
  {
    n: 3, name: 'Automatización y publicación', goal: 'Automatizar la preparación y publicación multicanal ya validado el proceso.',
    impl: '$35,000 – $50,000', monthly: '$3,000 – $5,000',
    items: ['Todo el Plan 2', 'Automatización Drive → IA → panel', 'Facebook e Instagram (sujeto a permisos de Meta)', 'Calendario de contenido', 'Notificaciones de aprobación', 'Publicación de prueba y monitoreo', 'Capacitación y documentación'],
  },
]

export const TODAY = '2026-11-14'
