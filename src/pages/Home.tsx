import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useGeolocation } from '@/hooks/useGeolocation'
import ProductGrid from '@/components/products/ProductGrid'
import ProductDetail from '@/components/products/ProductDetail'

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

export default function Home() {
  const { user } = useAuth()
  const { lat, lng } = useGeolocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (lat !== null && lng !== null) {
      fetchProducts()
    }
  }, [lat, lng])

  async function fetchProducts() {
    if (lat === null || lng === null) return

    setLoading(true)

    const { data, error } = await supabase
      .from('products')
      .select(`
        id, titulo, descripcion, precio, imagenes, lat, lng,
        profiles(nombre, whatsapp)
      `)
      .eq('vendido', false)
      .order('created_at', { ascending: false })

    if (!error && data) {
      const typedData = data as unknown as Product[]
      const filtered = typedData.filter((p: Product) => {
        const dist = getDistanceKm(lat, lng, p.lat, p.lng)
        return dist <= 30
      })
      setProducts(filtered)
    }

    setLoading(false)
  }

  function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.titulo.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(search.toLowerCase())

    const matchMin = !priceMin || p.precio >= Number(priceMin)
    const matchMax = !priceMax || p.precio <= Number(priceMax)

    return matchSearch && matchMin && matchMax
  })

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-14 pb-20 px-4 max-w-4xl mx-auto"
    >
      {/* Search */}
      <div className="sticky top-14 z-40 bg-[#0f0f0f] py-4 -mx-4 px-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-xl border text-sm transition-colors ${showFilters ? 'bg-accent/10 border-accent text-accent' : 'bg-surface border-border text-text-muted hover:text-accent'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="10" cy="12" r="2" fill="currentColor" />
              <circle cx="14" cy="18" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 bg-surface border border-border rounded-xl p-4 flex gap-3"
          >
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1 block">Precio mín</label>
              <input
                type="number"
                placeholder="$0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1 block">Precio máx</label>
              <input
                type="number"
                placeholder="$99999"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ProductGrid
          products={filtered}
          userLat={lat}
          userLng={lng}
          onProductClick={setSelectedProduct}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          userLat={lat}
          userLng={lng}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </motion.div>
  )
}
