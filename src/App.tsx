import { useState } from 'react'
import { Route } from 'wouter'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import ResetPassword from '@/components/auth/ResetPassword'
import Home from '@/pages/Home'
import MyProducts from '@/pages/MyProducts'
import CreateProduct from '@/pages/CreateProduct'

function AuthRoutes() {
  const [view, setView] = useState<'login' | 'register' | 'reset'>('login')

  return (
    <>
      {view === 'login' && (
        <Login
          onSwitchToRegister={() => setView('register')}
          onSwitchToReset={() => setView('reset')}
        />
      )}
      {view === 'register' && <Register onSwitchToLogin={() => setView('login')} />}
      {view === 'reset' && <ResetPassword onBack={() => setView('login')} />}
    </>
  )
}

function ProtectedRoutes() {
  return (
    <>
      <Navbar />
      <Route path="/" component={Home} />
      <Route path="/my-products" component={MyProducts} />
      <Route path="/create" component={CreateProduct} />
      <BottomNav />
    </>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return user ? <ProtectedRoutes /> : <AuthRoutes />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
