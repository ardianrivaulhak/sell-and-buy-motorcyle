import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'penjual' | 'pembeli'>('penjual')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password, role)
      }
      navigate(redirect)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</h1>
        <p className="muted">
          {mode === 'login'
            ? 'Masuk untuk mengelola listing dan menerima chat.'
            : 'Buat akun untuk mulai menjual motor dan mobil.'}
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' ? (
            <label className="field">
              <span>Nama</span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          ) : null}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {mode === 'register' ? (
            <label className="field">
              <span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="penjual">Penjual</option>
                <option value="pembeli">Pembeli</option>
              </select>
            </label>
          ) : null}

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>
        <button
          className="btn ghost"
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
    </section>
  )
}
