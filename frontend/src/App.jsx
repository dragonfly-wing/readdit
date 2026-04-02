import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import FeedPage from './pages/FeedPage'
import PostPage from './pages/PostPage'
import CreatePostPage from './pages/CreatePostPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ModeratorPage from './pages/ModeratorPage'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireMod({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'MODERATOR') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/user/:userId" element={<ProfilePage />} />
        <Route path="/create" element={<RequireAuth><CreatePostPage /></RequireAuth>} />
        <Route path="/mod" element={<RequireMod><ModeratorPage /></RequireMod>} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}