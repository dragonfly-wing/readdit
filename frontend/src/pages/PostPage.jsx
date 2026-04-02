import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import CommentThread from '../components/CommentThread'

const IconArrowUp = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 4l8 8H4z"/></svg>)
const IconArrowDown = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 20l-8-8h16z"/></svg>)
const IconBack = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>)

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const fetchPost = async () => {
    try {
      const result = await api.posts.getOne(id)
      setData(result)
      setLiked(result.liked || false)
      setLikeCount(result.post?.likeCount || 0)
    } catch {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPost() }, [id])

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await api.likes.toggle(id)
      setLiked(res.liked)
      setLikeCount(res.likeCount)
    } catch {}
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr)
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md p-6">
          <div className="h-4 bg-[#343536] rounded w-1/3 mb-4"/>
          <div className="h-7 bg-[#343536] rounded w-2/3 mb-4"/>
          <div className="h-4 bg-[#343536] rounded w-full mb-2"/>
          <div className="h-4 bg-[#343536] rounded w-4/5"/>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { post, comments } = data

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#818384] hover:text-[#D7DADC] text-sm mb-4 transition-colors">
        <IconBack /> Back to feed
      </button>

      {/* Post */}
      <div className="bg-[#1A1A1B] border border-[#343536] rounded-md overflow-hidden mb-4">
        <div className="flex">
          {/* Vote sidebar */}
          <div className="w-10 bg-[#161617] flex flex-col items-center py-3 gap-1">
            <button onClick={handleLike} className={`p-1 rounded transition-colors ${liked ? 'text-[#FF4500]' : 'text-[#818384] hover:text-[#FF4500]'}`}>
              <IconArrowUp />
            </button>
            <span className="text-xs font-bold text-[#D7DADC]">{likeCount}</span>
            <button className="p-1 rounded text-[#818384] hover:text-blue-400 transition-colors">
              <IconArrowDown />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-[#818384] mb-3">
              <div className="w-5 h-5 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-[9px] font-black">
                {post.authorUsername?.[0]?.toUpperCase() || 'U'}
              </div>
              <Link to={`/user/${post.authorId}`} className="font-bold text-[#D7DADC] hover:underline">
                u/{post.authorUsername || 'unknown'}
              </Link>
              <span>• {timeAgo(post.createdAt)}</span>
              {post.status === 'draft' && (
                <span className="px-1.5 py-0.5 bg-yellow-800/40 text-yellow-400 rounded text-[10px] font-bold">DRAFT</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[#D7DADC] mb-3">{post.title}</h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map(tag => (
                  <Link key={tag} to={`/?tag=${tag}`} className="px-2 py-0.5 bg-[#272729] border border-[#343536] rounded-full text-[11px] text-[#818384] hover:border-[#818384] transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="text-[15px] text-[#D7DADC] leading-relaxed whitespace-pre-wrap mb-4">
              {post.content}
            </div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="space-y-2 mb-4">
                {post.media.map((m, i) => (
                  m.type === 'image' ? (
                    <img key={i} src={m.url} alt={m.caption || ''} className="rounded-md max-w-full border border-[#343536]" />
                  ) : (
                    <video key={i} src={m.url} controls className="rounded-md max-w-full border border-[#343536]" />
                  )
                ))}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center gap-3 text-xs text-[#818384] border-t border-[#343536] pt-3">
              <span className="font-bold">{post.commentCount || 0} Comments</span>
              {user && (user.id === post.authorId || user.role === 'MODERATOR') && (
                <>
                  {user.id === post.authorId && (
                    <Link to={`/create?edit=${post.id}`} className="hover:text-[#D7DADC] font-bold transition-colors">Edit</Link>
                  )}
                  <button
                    onClick={async () => {
                      if (!confirm('Delete post?')) return
                      await api.posts.delete(post.id)
                      navigate('/')
                    }}
                    className="hover:text-red-400 font-bold transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentThread comments={comments || []} postId={id} onRefresh={fetchPost} />
    </div>
  )
}
