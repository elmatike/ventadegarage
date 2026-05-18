import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useGeolocation } from '@/hooks/useGeolocation'
import ImageCarousel from '@/components/products/ImageCarousel'

interface Product {
  id: string
  titulo: string
  descripcion: string
  precio: number
  imagenes: string[]
  created_at: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)
}

function timeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `hace ${days}d`
  if (hours > 0) return `hace ${hours}h`
  return 'hace poco'
}

export default function MyProducts() {
  const { user, profile, signOut } = useAuth()
  const { lat: _lat, lng: _lng } = useGeolocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (user) fetchProducts()
  }, [user])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('id, titulo, descripcion, precio, imagenes, created_at')
      .eq('user_id', user?.id)
      .eq('vendido', false)
      .order('created_at', { ascending: false })

    if (!error && data) setProducts(data)
    setLoading(false)
  }

  async function markAsSold(id: string) {
    if (!confirm('¿Marcar como vendido? Se eliminará del catálogo.')) return

    setDeleting(id)
    const { error } = await supabase
      .from('products')
      .update({ vendido: true })
      .eq('id', id)

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
    setDeleting(null)
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-14 pb-20 px-4 max-w-lg mx-auto"
    >
      {/* Profile header */}
      <div className="mt-6 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{profile?.nombre || 'Mi perfil'}</h1>
          <p className="text-text-muted text-sm">{products.length} producto{products.length !== 1 ? 's' : ''} publicado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={signOut}
          className="text-text-muted text-sm hover:text-danger transition-colors"
        >
          Salir
        </button>
      </div>

      {/* Products list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5" className="mb-4">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a4 4 0 00-8 0v2" />
          </svg>
          <p className="text-text-secondary text-sm">No tenés productos publicados</p>
          <p className="text-text-muted text-xs mt-1">Publicá algo que ya no uses</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              className="bg-surface border border-border rounded-2xl overflow-hidden"
            >
              <div className="flex gap-3 p-3">
                {product.imagenes && product.imagenes.length > 0 && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <ImageCarousel images={product.imagenes} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-text-primary truncate">{product.titulo}</h3>
                  <p className="text-accent font-semibold text-sm mt-1">{formatPrice(product.precio)}</p>
                  <p className="text-text-muted text-xs mt-1">{timeAgo(product.created_at)}</p>
                </div>
              </div>
              <div className="px-3 pb-3">
                <button
                  onClick={() => markAsSold(product.id)}
                  disabled={deleting === product.id}
                  className="w-full bg-danger/10 hover:bg-danger text-danger hover:text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleting === product.id ? 'Eliminando...' : 'Marcar como vendido'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
