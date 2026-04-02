import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

function Comment({ comment, replies, postId, onRefresh, depth = 0 }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [collapsed, setCollapsed] = useState(false)

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

  const handleReply = async () => {
    if (!user) { navigate('/login'); return }
    if (!replyText.trim()) return
    try {
      await api.comments.add(postId, { content: replyText, parentCommentId: comment.id })
      setReplyText('')
      setShowReply(false)
      onRefresh()
    } catch (err) { alert(err.message) }
  }

  const handleEdit = async () => {
    try {
      await api.comments.update(comment.id, { content: editText })
      setEditing(false)
      onRefresh()
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete comment?')) return
    try {
      await api.comments.delete(comment.id)
      onRefresh()
    } catch (err) { alert(err.message) }
  }

  const isOwner = user && user.id === comment.userId
  const isMod = user && user.role === 'MODERATOR'

  return (
    <div className={`relative ${depth > 0 ? 'ml-4 pl-4 border-l border-[#343536]' : ''}`}>
      <div className="py-2">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-[#818384] mb-1">
          <button onClick={() => setCollapsed(!collapsed)} className="text-[#818384] hover:text-[#D7DADC] font-bold mr-1">
            {collapsed ? '[+]' : '[–]'}
          </button>
          <span className="font-bold text-[#D7DADC]">u/{comment.authorUsername || 'unknown'}</span>
          <span>• {timeAgo(comment.createdAt)}</span>
        </div>

        {!collapsed && (
          <>
            {/* Body */}
            {editing ? (
              <div className="mb-2">
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="w-full bg-[#272729] border border-[#343536] focus:border-[#818384] rounded p-2 text-sm text-[#D7DADC] outline-none resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-1">
                  <button onClick={handleEdit} className="text-xs bg-[#FF4500] hover:bg-[#E03D00] text-white px-3 py-1 rounded-full font-bold transition-colors">Save</button>
                  <button onClick={() => setEditing(false)} className="text-xs text-[#818384] hover:text-[#D7DADC] px-3 py-1 rounded-full border border-[#343536] transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#D7DADC] leading-relaxed mb-2">{comment.content}</p>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-3 text-xs text-[#818384]">
              {depth < 6 && (
                <button
                  onClick={() => { if (!user) navigate('/login'); else setShowReply(!showReply) }}
                  className="hover:text-[#D7DADC] font-bold transition-colors"
                >
                  Reply
                </button>
              )}
              {(isOwner || isMod) && (
                <>
                  {isOwner && !editing && (
                    <button onClick={() => setEditing(true)} className="hover:text-[#D7DADC] transition-colors">Edit</button>
                  )}
                  <button onClick={handleDelete} className="hover:text-red-400 transition-colors">Delete</button>
                </>
              )}
            </div>

            {/* Reply box */}
            {showReply && (
              <div className="mt-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-[#272729] border border-[#343536] focus:border-[#818384] rounded p-2 text-sm text-[#D7DADC] outline-none resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-1">
                  <button onClick={handleReply} className="text-xs bg-[#FF4500] hover:bg-[#E03D00] text-white px-3 py-1 rounded-full font-bold transition-colors">Reply</button>
                  <button onClick={() => setShowReply(false)} className="text-xs text-[#818384] hover:text-[#D7DADC] px-3 py-1 rounded-full border border-[#343536] transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {/* Nested replies */}
            {replies && replies.length > 0 && (
              <div className="mt-2">
                {replies.map(reply => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    replies={[]}
                    postId={postId}
                    onRefresh={onRefresh}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function CommentThread({ comments, postId, onRefresh }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return }
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      await api.comments.add(postId, { content: newComment })
      setNewComment('')
      onRefresh()
    } catch (err) { alert(err.message) }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      {/* New comment box */}
      <div className="mb-6 bg-[#1A1A1B] border border-[#343536] rounded-md p-4">
        {user ? (
          <>
            <p className="text-xs text-[#818384] mb-2">
              Comment as <span className="text-[#D7DADC] font-bold">{user.username}</span>
            </p>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full bg-[#272729] border border-[#343536] focus:border-[#818384] rounded p-3 text-sm text-[#D7DADC] outline-none resize-none min-h-[100px]"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting || !newComment.trim()}
                className="bg-[#FF4500] hover:bg-[#E03D00] disabled:opacity-40 text-white text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
              >
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#818384] text-center">
            <button onClick={() => navigate('/login')} className="text-[#FF4500] hover:underline font-bold">Log in</button>
            {' '}or{' '}
            <button onClick={() => navigate('/register')} className="text-[#FF4500] hover:underline font-bold">sign up</button>
            {' '}to leave a comment
          </p>
        )}
      </div>

      {/* Comment list */}
      <div className="space-y-1">
        {comments.length === 0 && (
          <div className="text-center py-8 text-[#818384] text-sm">No comments yet. Be the first!</div>
        )}
        {comments.map(node => (
          <div key={node.comment?.id || node.id} className="bg-[#1A1A1B] border border-[#343536] rounded-md px-4">
            <Comment
              comment={node.comment || node}
              replies={node.replies || []}
              postId={postId}
              onRefresh={onRefresh}
              depth={0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}