import { Link, useLocation } from 'wouter'

export default function BottomNav() {
  const [location] = useLocation()

  if (location === '/login' || location === '/register' || location === '/reset-password') {
    return null
  }

  const navItems = [
    { href: '/', label: 'Inicio', icon: HomeIcon },
    { href: '/create', label: 'Publicar', icon: PlusIcon },
    { href: '/my-products', label: 'Mis productos', icon: UserIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = location === href
          return (
            <Link key={href} href={href}>
              <button className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                <Icon active={isActive} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#22c55e' : 'none'} stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="2">
      <circle cx="12" cy="12" r="10" fill={active ? '#22c55e' : 'none'} />
      <line x1="12" y1="8" x2="12" y2="16" stroke={active ? '#0f0f0f' : 'currentColor'} />
      <line x1="8" y1="12" x2="16" y2="12" stroke={active ? '#0f0f0f' : 'currentColor'} />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#22c55e' : 'none'} stroke={active ? '#22c55e' : 'currentColor'} strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
