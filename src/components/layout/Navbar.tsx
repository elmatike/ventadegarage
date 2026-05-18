import { Link, useLocation } from 'wouter'

export default function Navbar() {
  const [location] = useLocation()

  if (location === '/login' || location === '/register' || location === '/reset-password') {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="20" width="40" height="24" rx="3" stroke="#22c55e" strokeWidth="2.5" fill="none"/>
            <path d="M8 20V16C8 12 12 8 24 8C36 8 40 12 40 16V20" stroke="#22c55e" strokeWidth="2.5" fill="none"/>
            <rect x="18" y="30" width="12" height="14" rx="1" stroke="#22c55e" strokeWidth="2" fill="none"/>
            <circle cx="24" cy="18" r="3" fill="#22c55e"/>
          </svg>
          <span className="font-medium text-sm">Venta de Garage</span>
        </Link>

        <Link href="/create">
          <button className="bg-accent hover:bg-accent-hover text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors">
            + Publicar
          </button>
        </Link>
      </div>
    </header>
  )
}
