import { motion, AnimatePresence } from 'framer-motion'
import ImageCarousel from './ImageCarousel'

interface Product {
  id: string
  titulo: string
  descripcion: string
  precio: number
  imagenes: string[]
  lat: number
  lng: number
  profiles: { nombre: string; whatsapp: string }
}

interface ProductDetailProps {
  product: Product
  userLat: number | null
  userLng: number | null
  onClose: () => void
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)
}

export default function ProductDetail({ product, userLat, userLng, onClose }: ProductDetailProps) {
  const distance = userLat && userLng ? getDistanceKm(userLat, userLng, product.lat, product.lng) : null
  const whatsappMsg = encodeURIComponent(`Hola ${product.profiles.nombre}! Me interesa "${product.titulo}" que publicaste por ${formatPrice(product.precio)}. ¿Sigue disponible?`)
  const whatsappUrl = `https://wa.me/${product.profiles.whatsapp}?text=${whatsappMsg}`
  const mapsUrl = `https://www.google.com/maps?q=${product.lat},${product.lng}`

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#141414] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="sticky top-0 z-10 flex justify-end p-4 bg-gradient-to-b from-[#141414] to-transparent pointer-events-none">
            <button
              onClick={onClose}
              className="pointer-events-auto w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Image */}
          <div className="px-4 -mt-8">
            {product.imagenes && product.imagenes.length > 0 ? (
              <div className="rounded-2xl overflow-hidden border border-border">
                <ImageCarousel images={product.imagenes} />
              </div>
            ) : (
              <div className="w-full aspect-square bg-surface rounded-2xl border border-border flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-semibold text-white">{product.titulo}</h2>
                <span className="text-2xl font-semibold text-accent whitespace-nowrap">{formatPrice(product.precio)}</span>
              </div>
            </div>

            {product.descripcion && (
              <p className="text-text-secondary text-sm leading-relaxed">{product.descripcion}</p>
            )}

            {/* Location */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4 hover:border-accent/40 transition-colors group"
            >
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white font-medium">Ver ubicación</p>
                <p className="text-xs text-text-muted">
                  {distance !== null ? `A ${distance.toFixed(1)} km de tu ubicación` : 'Abrir en Google Maps'}
                </p>
              </div>
            </a>

            {/* Seller info */}
            <div className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4">
              <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center text-text-muted font-medium text-sm shrink-0">
                {product.profiles.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-white font-medium">{product.profiles.nombre}</p>
                <p className="text-xs text-text-muted">Vendedor</p>
              </div>
            </div>

            {/* Me interesa button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold py-4 rounded-xl transition-colors text-base"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Me interesa
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
