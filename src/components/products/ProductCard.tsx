import { motion } from 'framer-motion'
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

interface ProductCardProps {
  product: Product
  userLat: number | null
  userLng: number | null
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

export default function ProductCard({ product, userLat, userLng }: ProductCardProps) {
  const distance = userLat && userLng ? getDistanceKm(userLat, userLng, product.lat, product.lng) : null
  const whatsappMsg = encodeURIComponent(`Hola ${product.profiles.nombre}! Me interesa "${product.titulo}" que publicaste por ${formatPrice(product.precio)}. ¿Sigue disponible?`)
  const whatsappUrl = `https://wa.me/${product.profiles.whatsapp}?text=${whatsappMsg}`

  const mapsUrl = `https://www.google.com/maps?q=${product.lat},${product.lng}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden group hover:border-border-light transition-colors"
    >
      <ImageCarousel images={product.imagenes} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-sm text-text-primary line-clamp-1">{product.titulo}</h3>
          <span className="text-accent font-semibold text-sm whitespace-nowrap">{formatPrice(product.precio)}</span>
        </div>

        <p className="text-text-muted text-xs line-clamp-2 mb-3 leading-relaxed">{product.descripcion}</p>

        <div className="flex items-center justify-between">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-text-muted text-xs hover:text-accent transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {distance !== null ? `${distance.toFixed(1)} km` : 'Ver mapa'}
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent/10 hover:bg-accent text-accent hover:text-black text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Me interesa
          </a>
        </div>
      </div>
    </motion.div>
  )
}
