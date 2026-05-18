import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'

export default function ResetPassword({ onBack }: { onBack: () => void }) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await resetPassword(email)

    if (error) {
      setError('No se encontró una cuenta con ese email')
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
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-3">Email enviado</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Te enviamos un link para restablecer tu contraseña a <strong className="text-white">{email}</strong>.
          </p>
          <button onClick={onBack} className="text-accent text-sm font-medium hover:underline">
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

        <h1 className="text-2xl font-semibold text-center mb-2">Restablecer contraseña</h1>
        <p className="text-text-secondary text-center text-sm mb-8">Ingresá tu email y te enviamos un link</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-black font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <button onClick={onBack} className="text-text-secondary text-sm hover:text-accent transition-colors">
            ← Volver al login
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
