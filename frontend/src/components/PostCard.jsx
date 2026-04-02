import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

const IconArrowUp = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4l8 8H4z"/></svg>)
const IconArrowDown = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 20l-8-8h16z"/></svg>)
const IconComment = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>)
const IconShare = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-5-6l-3-3-3 3m3-3v12"/></svg>)
const IconFlag = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>)

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)
  const [liked, setLiked] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reportReason, setReportReason] = useState('')

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

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    try {
      const res = await api.likes.toggle(post.id)
      setLiked(res.liked)
      setLikeCount(res.likeCount)
    } catch {}
  }

  const handleReport = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (!reporting) { setReporting(true); return }
    if (!reportReason.trim()) return
    try {
      await api.reports.create({ type: 'post', targetId: post.id, reason: reportReason })
      setReporting(false)
      setReportReason('')
      alert('Report submitted')
    } catch {}
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Delete this post?')) return
    try {
      await api.posts.delete(post.id)
      onDelete && onDelete(post.id)
    } catch (err) { alert(err.message) }
  }

  const isOwner = user && user.id === post.authorId
  const isMod = user && user.role === 'MODERATOR'

  return (
    <article className="bg-[#1A1A1B] border border-[#343536] rounded-md hover:border-[#818384] transition-all overflow-hidden group">
      <div className="p-4 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2 text-xs text-[#818384]">
          <div className="w-5 h-5 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-[9px] font-black">
            {post.authorUsername?.[0]?.toUpperCase() || 'U'}
          </div>
          <Link
            to={`/user/${post.authorId}`}
            className="font-bold text-[#D7DADC] hover:underline"
            onClick={e => e.stopPropagation()}
          >
            u/{post.authorUsername || 'unknown'}
          </Link>
          <span>• {timeAgo(post.createdAt)}</span>
          {post.status === 'draft' && (
            <span className="ml-1 px-1.5 py-0.5 bg-yellow-800/40 text-yellow-400 rounded text-[10px] font-bold">DRAFT</span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-[18px] font-semibold text-[#D7DADC] mb-1 group-hover:text-white transition-colors">
          {post.title}
        </h2>

        {/* Content preview */}
        <p className="text-[14px] text-[#818384] leading-relaxed mb-3 line-clamp-3">{post.content}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-[#272729] border border-[#343536] rounded-full text-[11px] text-[#818384]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
        {/* Like pill */}
        <div className="flex items-center bg-[#272729] rounded-full px-1 py-0.5 border border-transparent hover:bg-[#343536] transition-colors">
          <button onClick={handleLike} className={`p-1.5 transition-colors ${liked ? 'text-[#FF4500]' : 'text-[#D7DADC] hover:text-[#FF4500]'}`}>
            <IconArrowUp />
          </button>
          <span className="text-xs font-bold px-1">{likeCount}</span>
          <button className="p-1.5 text-[#D7DADC] hover:text-blue-400 transition-colors">
            <IconArrowDown />
          </button>
        </div>

        {/* Comment pill */}
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-2 bg-[#272729] rounded-full px-4 py-2 border border-transparent hover:bg-[#343536] text-[#D7DADC] text-xs font-bold transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <IconComment /> {post.commentCount || 0} Comments
        </Link>

        {/* Share */}
        <button
          className="flex items-center gap-2 bg-[#272729] rounded-full px-4 py-2 border border-transparent hover:bg-[#343536] text-[#D7DADC] text-xs font-bold transition-colors ml-auto"
          onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`) }}
        >
          <IconShare /> Share
        </button>

        {/* Report */}
        {user && !isOwner && (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {reporting ? (
              <>
                <input
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Reason..."
                  className="bg-[#272729] border border-[#343536] rounded-full px-3 py-1 text-xs text-[#D7DADC] outline-none w-32"
                  autoFocus
                />
                <button onClick={handleReport} className="text-xs text-red-400 hover:text-red-300 px-2">Submit</button>
                <button onClick={(e) => { e.stopPropagation(); setReporting(false) }} className="text-xs text-[#818384] hover:text-[#D7DADC] px-1">✕</button>
              </>
            ) : (
              <button onClick={handleReport} className="p-2 rounded-full text-[#818384] hover:text-red-400 hover:bg-[#343536] transition-colors">
                <IconFlag />
              </button>
            )}
          </div>
        )}

        {/* Edit / Delete for owner or mod */}
        {(isOwner || isMod) && (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {isOwner && (
              <Link to={`/create?edit=${post.id}`} className="text-xs text-[#818384] hover:text-[#D7DADC] px-2 py-1 rounded hover:bg-[#343536] transition-colors">
                Edit
              </Link>
            )}
            <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-400 px-2 py-1 rounded hover:bg-[#343536] transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}