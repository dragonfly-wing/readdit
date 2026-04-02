import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#D7DADC]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#1A1A1B] border-b border-[#343536] h-12 flex items-center px-4 gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-[#FF4500]/20">B</div>
          <span className="font-black text-[#D7DADC] text-base tracking-tight hidden sm:block">
            Blog <span className="text-[#FF4500]">2.0</span>
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#818384]"><IconSearch /></div>
          <input
            placeholder="Search Blog 2.0"
            className="w-full bg-[#272729] border border-[#343536] hover:border-[#818384] focus:border-[#D7DADC] focus:bg-[#1A1A1B] rounded-full pl-9 pr-4 py-1.5 text-sm text-[#D7DADC] outline-none transition-colors"
          />
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link to="/create" className="hidden md:flex items-center gap-1.5 border border-[#343536] hover:border-[#818384] text-[#D7DADC] text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">
                <IconPlus /> Create
              </Link>
              {user.role === 'MODERATOR' && (
                <Link to="/mod" className="hidden md:flex items-center gap-1.5 border border-yellow-600 text-yellow-500 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-yellow-600/10 transition-colors">
                  <IconShield /> Mod
                </Link>
              )}
              <Link to={`/user/${user.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#343536] transition-colors text-sm font-semibold">
                <IconUser /> <span className="hidden md:block">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="text-[#818384] hover:text-[#D7DADC] text-sm px-3 py-1.5 rounded-full hover:bg-[#343536] transition-colors">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="border border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500] hover:text-white text-sm font-bold px-4 py-1.5 rounded-full transition-colors">
                Log In
              </Link>
              <Link to="/register" className="bg-[#FF4500] hover:bg-[#E03D00] text-white text-sm font-bold px-4 py-1.5 rounded-full transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}