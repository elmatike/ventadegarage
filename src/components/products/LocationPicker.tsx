import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon paths in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([-31.4, -64.2], 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng)
      } else {
        markerRef.current = L.marker(e.latlng, { draggable: true }).addTo(map)
        markerRef.current.on('dragend', (ev: L.DragEndEvent) => {
          const pos = ev.target.getLatLng()
          setSelected({ lat: pos.lat, lng: pos.lng })
        })
      }

      setSelected({ lat, lng })
    })

    leafletMap.current = map

    return () => {
      map.remove()
      leafletMap.current = null
      markerRef.current = null
    }
  }, [])

  function handleConfirm() {
    if (selected) {
      onLocationSelect(selected.lat, selected.lng)
    }
  }

  return (
    <div className="space-y-3">
      <div ref={mapRef} className="w-full h-64 rounded-xl border border-border overflow-hidden z-0" />
      <p className="text-xs text-text-muted text-center">
        {selected
          ? `Ubicación seleccionada: ${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`
          : 'Hacé click en el mapa para elegir tu ubicación'}
      </p>
      <button
        onClick={handleConfirm}
        disabled={!selected}
        className="w-full bg-accent hover:bg-accent-hover text-black font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Usar esta ubicación
      </button>
    </div>
  )
}
