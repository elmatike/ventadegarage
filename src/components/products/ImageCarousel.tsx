import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageCarouselProps {
  images: string[]
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) return null

  const goNext = () => setCurrent(prev => (prev + 1) % images.length)
  const goPrev = () => setCurrent(prev => (prev - 1 + images.length) % images.length)

  return (
    <div className="relative w-full aspect-square overflow-hidden bg-surface rounded-t-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt="Producto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Imagen anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Siguiente imagen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
