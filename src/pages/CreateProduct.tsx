import { useState, useRef } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/context/AuthContext'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'
import { compressImages } from '@/utils/compressImage'
import { useGeolocation } from '@/hooks/useGeolocation'
import { motion } from 'framer-motion'

export default function CreateProduct() {
  const [, navigate] = useLocation()
  const { user } = useAuth()
  const { lat, lng, error: geoError, loading: geoLoading } = useGeolocation()

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const remaining = 4 - images.length
    const newFiles = files.slice(0, remaining)

    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...newFiles])
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index])
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (images.length === 0) {
      setError('Agregá al menos una foto')
      return
    }

    if (!titulo.trim()) {
      setError('Poné un título al producto')
      return
    }

    if (!precio || Number(precio) <= 0) {
      setError('Ingresá un precio válido')
      return
    }

    if (lat === null || lng === null) {
      setError('No se pudo obtener tu ubicación. Activá los permisos de ubicación.')
      return
    }

    setLoading(true)

    try {
      const compressed = await compressImages(images)

      const imageUrls: string[] = []
      for (let i = 0; i < compressed.length; i++) {
        const file = compressed[i]
        const fileName = `${user?.id}/${Date.now()}-${i}.jpg`
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file, { contentType: 'image/jpeg' })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName)

        imageUrls.push(publicUrl)
      }

      const { error: dbError } = await supabase
        .from('products')
        .insert({
          user_id: user?.id,
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          precio: Math.round(Number(precio)),
          lat,
          lng,
          imagenes: imageUrls,
        })

      if (dbError) throw dbError

      navigate('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al publicar'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-14 pb-20 px-4 max-w-lg mx-auto"
    >
      <h1 className="text-xl font-semibold mt-6 mb-6">Publicar producto</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {geoLoading && (
          <div className="bg-accent-muted border border-accent/20 text-accent text-sm p-3 rounded-xl">
            Obteniendo tu ubicación...
          </div>
        )}

        {geoError && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-xl">
            {geoError}
          </div>
        )}

        {/* Image upload */}
        <div>
          <label className="text-sm text-text-secondary mb-2 block">
            Fotos ({images.length}/4)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-surface">
                <img src={preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-[10px] mt-1">Agregar</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Título del producto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={80}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            placeholder="Precio ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            min="0"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || geoLoading}
          className="w-full bg-accent hover:bg-accent-hover text-black font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </motion.div>
  )
}
