import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, type MotionStyle } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { img } from '../data/mock'
import { EASE } from './ui'

export type Slide = { photo: string; title?: string; sub?: string; to?: string }

/**
 * Carrusel de portada por tiempo: fundido cruzado + acercamiento lento (Ken Burns),
 * barras de progreso clicables y pie de foto opcional.
 */
export default function HeroSlides({
  slides,
  interval = 6000,
  running = true,
  captions = true,
  className = '',
  imageStyle,
  intro = false,
  overlayClass = '',
}: {
  slides: Slide[]
  interval?: number
  running?: boolean
  captions?: boolean
  className?: string
  /** estilo animado para las fotos (por ejemplo parallax) */
  imageStyle?: MotionStyle
  /** entrada inicial: de oscuro y cerca a la imagen normal */
  intro?: boolean
  /** degradado encima de las fotos y debajo de los controles */
  overlayClass?: string
}) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const cur = slides[i % Math.max(n, 1)]

  useEffect(() => {
    if (!running || paused || n < 2) return
    const t = setTimeout(() => setI((x) => (x + 1) % n), interval)
    return () => clearTimeout(t)
  }, [i, running, paused, n, interval])

  // pausar cuando la pestaña no está visible
  useEffect(() => {
    const v = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', v)
    return () => document.removeEventListener('visibilitychange', v)
  }, [])

  // precargar la siguiente foto para que el cambio no parpadee
  useEffect(() => {
    if (n < 2) return
    const im = new Image()
    im.src = img(slides[(i + 1) % n].photo, 2000)
  }, [i, n, slides])

  if (!n) return null

  return (
    <div className={`absolute inset-0 ${className}`}>
      <motion.div style={imageStyle} className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        initial={intro ? { scale: 1.2, filter: 'brightness(0.4)' } : false}
        animate={intro && running ? { scale: 1, filter: 'brightness(1)' } : undefined}
        transition={{ duration: 2.2, ease: EASE }}
      >
      <AnimatePresence initial={false}>
        <motion.div
          key={cur.photo + i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <motion.img
            src={img(cur.photo, 2000)}
            alt={cur.title ?? ''}
            className="h-full w-full object-cover"
            initial={{ scale: 1.14 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: interval / 1000 + 1.6, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>
      </motion.div>
      </motion.div>
      {overlayClass && <div className={`pointer-events-none absolute inset-0 ${overlayClass}`} />}

      {n > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 pb-5 sm:px-8 sm:pb-6">
          <div className="flex items-center gap-2" role="tablist" aria-label="Fotos de portada">
            {slides.map((s, k) => (
              <button
                key={s.photo + k}
                role="tab"
                aria-selected={k === i}
                aria-label={`Foto ${k + 1}${s.title ? `: ${s.title}` : ''}`}
                onClick={() => setI(k)}
                className="group relative h-6 w-8 sm:w-12"
              >
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-paper/25 transition group-hover:bg-paper/45">
                  {k === i && (
                    <motion.span
                      key={`bar-${i}`}
                      className="block h-full bg-paper"
                      initial={{ width: '0%' }}
                      animate={{ width: running && !paused ? '100%' : '0%' }}
                      transition={{ duration: interval / 1000, ease: 'linear' }}
                    />
                  )}
                  {k < i && <span className="block h-full w-full bg-paper/70" />}
                </span>
              </button>
            ))}
            <span className="ml-2 hidden font-display text-sm tabular-nums text-paper/70 sm:inline">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>

          {captions && cur.title && (
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.title + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="hidden text-right sm:block"
              >
                {cur.to ? (
                  <Link to={cur.to} className="group inline-flex items-center gap-2 text-sm text-paper/85 hover:text-paper">
                    <span>
                      <b className="font-semibold">{cur.title}</b>
                      {cur.sub && <span className="text-paper/60"> · {cur.sub}</span>}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <p className="text-sm text-paper/80">
                    <b className="font-semibold">{cur.title}</b>
                    {cur.sub && <span className="text-paper/60"> · {cur.sub}</span>}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  )
}
