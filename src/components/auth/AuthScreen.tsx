import { useState } from 'react'
import { Target, Lock, Mail, Key } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function AuthScreen({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        // If auto-confirm is enabled in Supabase, we log in automatically.
        // Otherwise, they need to check email. For MVP, we assume auto-confirm or successful login.
      }
      onAuthSuccess()
    } catch (err: any) {
      setError(err.message || 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">KAIZEN</h1>
          <p className="text-muted-foreground">Sistema Operativo Personal</p>
        </div>

        <form onSubmit={handleAuth} className="bg-card border border-border p-6 rounded-2xl shadow-xl space-y-6">
          <div className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-bold p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Mail className="w-4 h-4" /> Correo Electrónico
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary border border-border p-3 rounded-xl outline-none focus:border-primary transition-colors"
                placeholder="ceo@kaizen.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Key className="w-4 h-4" /> Contraseña
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border p-3 rounded-xl outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Procesando...</span>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                {isLogin ? 'Desbloquear Sistema' : 'Crear Acceso Maestro'}
              </>
            )}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes acceso? Inicia Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
