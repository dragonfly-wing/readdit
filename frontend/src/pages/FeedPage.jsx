import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import PostCard from '../components/PostCard'

const IconFire = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500"><path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z"/></svg>)

const POPULAR_TAGS = ['technology', 'science', 'gaming', 'news', 'programming', 'design', 'art', 'music']

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Hot')
  const [activeTag, setActiveTag] = useState(null)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.posts.getAll(activeTag)
      // Apply client-side filter sorting
      let sorted = [...data]
      if (activeFilter === 'Hot' || activeFilter === 'Best') {
        sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      } else if (activeFilter === 'New') {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } else if (activeFilter === 'Top') {
        sorted.sort((a, b) => ((b.likeCount || 0) + (b.commentCount || 0)) - ((a.likeCount || 0) + (a.commentCount || 0)))
      }
      setPosts(sorted)
    } catch (e) {
      setError('Could not connect to backend. Make sure the server is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [activeTag, activeFilter])

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Feed */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* Filter bar */}
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md px-4 py-2 flex items-center gap-1 flex-wrap">
          {['Best', 'Hot', 'New', 'Top'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f ? 'bg-[#343536] text-[#D7DADC]' : 'text-[#818384] hover:bg-[#343536]/60'
              }`}
            >
              {f === 'Hot' && <IconFire />} {f}
            </button>
          ))}

          {activeTag && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[#818384]">Filtering by:</span>
              <span className="px-2 py-0.5 bg-[#FF4500]/20 border border-[#FF4500]/40 text-[#FF4500] rounded-full text-xs font-bold">
                #{activeTag}
              </span>
              <button onClick={() => setActiveTag(null)} className="text-[#818384] hover:text-[#D7DADC] text-xs">✕ Clear</button>
            </div>
          )}
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4 animate-pulse">
                <div className="h-3 bg-[#343536] rounded w-1/3 mb-3"/>
                <div className="h-5 bg-[#343536] rounded w-2/3 mb-2"/>
                <div className="h-3 bg-[#343536] rounded w-full mb-1"/>
                <div className="h-3 bg-[#343536] rounded w-4/5"/>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-md p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20 bg-[#1A1A1B] border border-[#343536] rounded-md text-[#818384]">
            <p className="text-lg font-bold mb-2">Nothing here yet</p>
            <p className="text-sm mb-4">Be the first to post something!</p>
            {user && <Link to="/create" className="bg-[#FF4500] hover:bg-[#E03D00] text-white text-sm font-bold px-6 py-2 rounded-full transition-colors">Create Post</Link>}
          </div>
        )}

        {!loading && !error && posts.map(post => (
          <PostCard key={post.id} post={post} onDelete={handleDelete} />
        ))}
      </div>

      {/* Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col gap-4 shrink-0">
        {/* Home card */}
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-[#FF4500] via-[#FF6534] to-[#FF8C69]" />
          <div className="p-4">
            <div className="w-14 h-14 rounded-full bg-[#FF4500] border-4 border-[#1A1A1B] flex items-center justify-center text-white font-black text-xl -mt-10 mb-2">B</div>
            <h3 className="text-[#D7DADC] font-bold text-sm mb-1">Home</h3>
            <p className="text-[#818384] text-xs leading-relaxed mb-4">
              Your personal Blog 2.0 front page. The best posts, sorted your way.
            </p>
            {user ? (
              <Link to="/create" className="block w-full py-2 rounded-full bg-[#FF4500] hover:bg-[#E03D00] text-white text-sm font-bold text-center transition-colors shadow-lg shadow-[#FF4500]/20">
                Create Post
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/register" className="block w-full py-2 rounded-full bg-[#FF4500] hover:bg-[#E03D00] text-white text-sm font-bold text-center transition-colors">
                  Sign Up
                </Link>
                <Link to="/login" className="block w-full py-2 rounded-full border border-[#343536] hover:border-[#818384] text-[#D7DADC] text-sm font-bold text-center transition-colors">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4">
          <h3 className="text-[#D7DADC] font-bold text-sm mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  activeTag === tag
                    ? 'bg-[#FF4500]/20 border-[#FF4500]/50 text-[#FF4500]'
                    : 'border-[#343536] text-[#818384] hover:border-[#818384] hover:text-[#D7DADC]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4 text-[#818384] text-[11px]">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {['Help', 'About', 'Careers', 'Privacy', 'Terms'].map(l => (
              <span key={l} className="hover:underline cursor-pointer">{l}</span>
            ))}
          </div>
          <p className="mt-3">Blog 2.0 Inc © 2026.</p>
        </div>
      </aside>
    </div>
  )
}