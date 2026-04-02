import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('published')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Load existing post if editing
  useEffect(() => {
    if (!editId) return
    api.posts.getOne(editId).then(data => {
      const post = data.post || data
      setTitle(post.title || '')
      setContent(post.content || '')
      setStatus(post.status || 'published')
      setTags(post.tags || [])
    }).catch(() => navigate('/'))
  }, [editId])

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (submitStatus) => {
    if (!title.trim()) { setError('Title is required'); return }
    setSubmitting(true)
    setError(null)
    try {
      const payload = { title, content, status: submitStatus || status, tags }
      if (editId) {
        await api.posts.update(editId, payload)
        navigate(`/post/${editId}`)
      } else {
        const post = await api.posts.create(payload)
        navigate(`/post/${post.id}`)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1A1A1B] border border-[#343536] rounded-md overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#343536] px-6 py-4">
          <h1 className="text-[#D7DADC] font-bold text-lg">
            {editId ? 'Edit Post' : 'Create Post'}
          </h1>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              maxLength={300}
              className="w-full bg-[#272729] border border-[#343536] focus:border-[#818384] rounded p-3 text-[#D7DADC] outline-none text-base placeholder-[#818384]"
            />
            <div className="text-right text-xs text-[#818384] mt-1">{title.length}/300</div>
          </div>

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Text (optional)"
              className="w-full bg-[#272729] border border-[#343536] focus:border-[#818384] rounded p-3 text-[#D7DADC] outline-none resize-none min-h-[200px] placeholder-[#818384]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-[#818384] mb-1 font-semibold uppercase tracking-wider">
              Tags (up to 5)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 bg-[#FF4500]/20 border border-[#FF4500]/40 text-[#FF4500] rounded-full text-xs font-semibold">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-300 transition-colors">×</button>
                </span>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 bg-[#272729] border border-[#343536] focus:border-[#818384] rounded p-2 text-sm text-[#D7DADC] outline-none placeholder-[#818384]"
                />
                <button onClick={addTag} className="px-3 py-2 bg-[#343536] hover:bg-[#424344] text-[#D7DADC] text-sm rounded transition-colors">
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#818384] font-semibold uppercase tracking-wider">Post as:</span>
            {['published', 'draft'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors border ${
                  status === s
                    ? s === 'published'
                      ? 'bg-[#FF4500] border-[#FF4500] text-white'
                      : 'bg-[#343536] border-[#343536] text-[#D7DADC]'
                    : 'border-[#343536] text-[#818384] hover:border-[#818384]'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[#343536]">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-full border border-[#343536] hover:border-[#818384] text-[#D7DADC] text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(status)}
              disabled={submitting || !title.trim()}
              className="px-5 py-2 rounded-full bg-[#FF4500] hover:bg-[#E03D00] disabled:opacity-40 text-white text-sm font-bold transition-colors"
            >
              {submitting ? 'Saving...' : editId ? 'Save Changes' : status === 'draft' ? 'Save Draft' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}