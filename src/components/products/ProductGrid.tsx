import ProductCard from './ProductCard'

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

interface ProductGridProps {
  products: Product[]
  userLat: number | null
  userLng: number | null
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ products, userLat, userLng, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5" className="mb-4">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <p className="text-text-secondary text-sm">No hay productos en tu zona</p>
        <p className="text-text-muted text-xs mt-1">Sé el primero en publicar algo</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          userLat={userLat}
          userLng={userLng}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  )
}
