import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

export default function Login({ onSwitchToRegister, onSwitchToReset }: {
  onSwitchToRegister: () => void
  onSwitchToReset: () => void
}) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      if (error.includes('Email not confirmed')) {
        setError('Confirmá tu email antes de iniciar sesión. Revisá tu bandeja de entrada.')
      } else {
        setError('Email o contraseña incorrectos')
      }
    }

    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <LogoIcon />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">Venta de Garage</h1>
        <p className="text-text-secondary text-center text-sm mb-8">Iniciá sesión para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-black font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <button onClick={onSwitchToReset} className="text-text-secondary text-sm hover:text-accent transition-colors">
            Olvidé mi contraseña
          </button>
          <p className="text-text-secondary text-sm">
            ¿No tenés cuenta?{' '}
            <button onClick={onSwitchToRegister} className="text-accent hover:underline font-medium">
              Registrate
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function LogoIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="20" width="40" height="24" rx="3" stroke="#22c55e" strokeWidth="2.5" fill="none"/>
      <path d="M8 20V16C8 12 12 8 24 8C36 8 40 12 40 16V20" stroke="#22c55e" strokeWidth="2.5" fill="none"/>
      <rect x="18" y="30" width="12" height="14" rx="1" stroke="#22c55e" strokeWidth="2" fill="none"/>
      <circle cx="24" cy="18" r="3" fill="#22c55e"/>
    </svg>
  )
}
