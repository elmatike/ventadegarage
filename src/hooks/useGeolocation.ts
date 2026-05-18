import { useState, useEffect, useRef, useCallback } from 'react'

interface GeolocationState {
  lat: number | null
  lng: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  })

  const mountedRef = useRef(true)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocalización no soportada', loading: false }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (mountedRef.current) {
          setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
            loading: false,
          })
        }
      },
      (error) => {
        if (mountedRef.current) {
          setState({
            lat: null,
            lng: null,
            error: error.code === 1 ? 'Permiso de ubicación denegado' : 'No se pudo obtener la ubicación',
            loading: false,
          })
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  useEffect(() => {
    getLocation()
    return () => { mountedRef.current = false }
  }, [getLocation])

  return { ...state, requestLocation: getLocation }
}
