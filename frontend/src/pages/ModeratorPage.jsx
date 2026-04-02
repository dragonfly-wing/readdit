import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

const IconShield = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>)

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  resolved: 'text-green-400 bg-green-900/30 border-green-800',
  rejected: 'text-red-400 bg-red-900/30 border-red-800',
}

export default function ModeratorPage() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    setLoading(true)
    try {
      const data = await api.reports.getAll(filter === 'all' ? '' : filter)
      setReports(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReports() }, [filter])

  const handleResolve = async (reportId, action) => {
    try {
      await api.reports.resolve(reportId, action)
      fetchReports()
    } catch (err) { alert(err.message) }
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-[#1A1A1B] border border-yellow-800/50 rounded-md p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-900/40 border border-yellow-700 flex items-center justify-center text-yellow-400">
          <IconShield />
        </div>
        <div>
          <h1 className="text-[#D7DADC] font-bold text-lg">Moderator Panel</h1>
          <p className="text-[#818384] text-xs">Review and action reported content</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-[#1A1A1B] border border-[#343536] rounded-md mb-4 flex">
        {['pending', 'resolved', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
              filter === f
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-[#818384] hover:text-[#D7DADC]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reports */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4 animate-pulse">
              <div className="h-4 bg-[#343536] rounded w-1/2 mb-3"/>
              <div className="h-3 bg-[#343536] rounded w-3/4"/>
            </div>
          ))}
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="text-center py-16 bg-[#1A1A1B] border border-[#343536] rounded-md text-[#818384]">
          <IconShield />
          <p className="mt-3 font-bold">No {filter} reports</p>
          <p className="text-xs mt-1">The platform is clean 🎉</p>
        </div>
      )}

      <div className="space-y-3">
        {reports.map(report => (
          <div key={report.id} className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                {/* Report meta */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${STATUS_COLORS[report.status] || 'text-[#818384] border-[#343536]'}`}>
                    {report.status}
                  </span>
                  <span className="px-2 py-0.5 bg-[#272729] border border-[#343536] rounded-full text-[11px] text-[#818384] font-semibold">
                    {report.type}
                  </span>
                  <span className="text-xs text-[#818384]">
                    by <strong className="text-[#D7DADC]">u/{report.reporterUsername}</strong> • {timeAgo(report.createdAt)}
                  </span>
                </div>

                {/* Target link */}
                <div className="mb-2">
                  {report.type === 'post' ? (
                    <Link to={`/post/${report.targetId}`} className="text-sm text-[#FF4500] hover:underline">
                      → View reported post
                    </Link>
                  ) : (
                    <span className="text-sm text-[#818384]">Comment ID: {report.targetId}</span>
                  )}
                </div>

                {/* Reason */}
                <div className="text-sm text-[#D7DADC] font-semibold mb-1">
                  Reason: <span className="font-normal text-[#818384]">{report.reason}</span>
                </div>
                {report.description && (
                  <p className="text-xs text-[#818384] bg-[#272729] rounded p-2 mt-1">{report.description}</p>
                )}

                {/* Resolved info */}
                {report.resolvedAt && (
                  <p className="text-xs text-[#818384] mt-2">
                    Actioned {timeAgo(report.resolvedAt)}
                    {report.moderatorId && ` by moderator`}
                  </p>
                )}
              </div>

              {/* Actions */}
              {report.status === 'pending' && (
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleResolve(report.id, 'resolved')}
                    className="px-4 py-1.5 bg-green-900/30 border border-green-700 hover:bg-green-800/50 text-green-400 text-xs font-bold rounded-full transition-colors"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, 'rejected')}
                    className="px-4 py-1.5 bg-[#272729] border border-[#343536] hover:border-[#818384] text-[#818384] text-xs font-bold rounded-full transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}