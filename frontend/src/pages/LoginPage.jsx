import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4"
      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-full bg-[#FF4500] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#FF4500]/30">B</div>
          <span className="font-black text-[#D7DADC] text-xl tracking-tight">
            Blog <span className="text-[#FF4500]">2.0</span>
          </span>
        </div>

        <div className="bg-[#1A1A1B] border border-[#343536] rounded-xl p-8">
          <h1 className="text-[#D7DADC] font-bold text-xl mb-1">{title}</h1>
          <p className="text-[#818384] text-sm mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to Blog 2.0">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#818384] font-semibold uppercase tracking-wider mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            className="w-full bg-[#272729] border border-[#343536] focus:border-[#FF4500] rounded-lg px-4 py-2.5 text-[#D7DADC] outline-none text-sm transition-colors placeholder-[#818384]"
            placeholder="your_username"
          />
        </div>
        <div>
          <label className="block text-xs text-[#818384] font-semibold uppercase tracking-wider mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-[#272729] border border-[#343536] focus:border-[#FF4500] rounded-lg px-4 py-2.5 text-[#D7DADC] outline-none text-sm transition-colors placeholder-[#818384]"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-[#FF4500] hover:bg-[#E03D00] disabled:opacity-50 text-white font-bold text-sm transition-colors mt-2"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-center text-sm text-[#818384] pt-2">
          New to Blog 2.0?{' '}
          <Link to="/register" className="text-[#FF4500] font-bold hover:underline">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Join Blog 2.0" subtitle="Create your account to start posting">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#818384] font-semibold uppercase tracking-wider mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={30}
            autoFocus
            className="w-full bg-[#272729] border border-[#343536] focus:border-[#FF4500] rounded-lg px-4 py-2.5 text-[#D7DADC] outline-none text-sm transition-colors placeholder-[#818384]"
            placeholder="choose_a_username"
          />
        </div>
        <div>
          <label className="block text-xs text-[#818384] font-semibold uppercase tracking-wider mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-[#272729] border border-[#343536] focus:border-[#FF4500] rounded-lg px-4 py-2.5 text-[#D7DADC] outline-none text-sm transition-colors placeholder-[#818384]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-[#818384] font-semibold uppercase tracking-wider mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-[#272729] border border-[#343536] focus:border-[#FF4500] rounded-lg px-4 py-2.5 text-[#D7DADC] outline-none text-sm transition-colors placeholder-[#818384]"
            placeholder="min. 6 characters"
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-[#FF4500] hover:bg-[#E03D00] disabled:opacity-50 text-white font-bold text-sm transition-colors mt-2"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-[#818384] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF4500] font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage