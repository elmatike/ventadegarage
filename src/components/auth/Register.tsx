import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

export default function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, '')
    if (!cleanWhatsapp) {
      setError('Ingresá un número de WhatsApp válido')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, nombre, cleanWhatsapp)

    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-3">¡Casi listo!</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Te enviamos un email de confirmación a <strong className="text-white">{email}</strong>. Confirmalo para poder iniciar sesión.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="text-accent text-sm font-medium hover:underline"
          >
            Volver al login
          </button>
        </div>
      </motion.div>
    )
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

        <h1 className="text-2xl font-semibold text-center mb-2">Crear cuenta</h1>
        <p className="text-text-secondary text-center text-sm mb-8">Completá tus datos para registrarte</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />

          <input
            type="tel"
            placeholder="WhatsApp (ej: 5493515585614)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />

          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-black font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-text-secondary text-sm">
          ¿Ya tenés cuenta?{' '}
          <button onClick={onSwitchToLogin} className="text-accent hover:underline font-medium">
            Iniciá sesión
          </button>
        </p>
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
