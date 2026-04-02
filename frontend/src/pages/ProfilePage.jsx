import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import PostCard from '../components/PostCard'

const IconUser = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)

export default function ProfilePage() {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [tab, setTab] = useState('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [prof, userPosts, followStatus, followerList, followingList] = await Promise.all([
          api.users.getProfile(userId),
          api.posts.getByUser(userId),
          currentUser ? api.follow.status(userId) : Promise.resolve({ following: false, followerCount: 0 }),
          api.follow.getFollowers(userId),
          api.follow.getFollowing(userId),
        ])
        setProfile(prof)
        setPosts(userPosts)
        setIsFollowing(followStatus.following)
        setFollowerCount(followStatus.followerCount)
        setFollowers(followerList)
        setFollowing(followingList)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [userId])

  const handleFollow = async () => {
    if (!currentUser) return
    try {
      const res = await api.follow.toggle(userId)
      setIsFollowing(res.following)
      setFollowerCount(res.followerCount)
    } catch {}
  }

  const handleDeletePost = (postId) => setPosts(prev => prev.filter(p => p.id !== postId))

  const isOwnProfile = currentUser && currentUser.id === userId

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md p-6 mb-4">
          <div className="w-16 h-16 rounded-full bg-[#343536] mb-4"/>
          <div className="h-5 bg-[#343536] rounded w-1/4 mb-2"/>
          <div className="h-3 bg-[#343536] rounded w-1/3"/>
        </div>
      </div>
    )
  }

  if (!profile) return (
    <div className="text-center py-20 text-[#818384]">User not found.</div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="bg-[#1A1A1B] border border-[#343536] rounded-md overflow-hidden mb-4">
        <div className="h-20 bg-gradient-to-r from-[#FF4500] via-[#FF6534] to-[#FF8C69]" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#272729] border-4 border-[#1A1A1B] flex items-center justify-center text-[#818384]">
              <IconUser />
            </div>
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollow}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  isFollowing
                    ? 'bg-[#343536] hover:bg-red-900/30 hover:text-red-400 text-[#D7DADC] border border-[#343536]'
                    : 'bg-[#FF4500] hover:bg-[#E03D00] text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            {isOwnProfile && (
              <Link
                to={`/user/${userId}/edit`}
                className="px-4 py-1.5 rounded-full text-sm font-bold border border-[#343536] hover:border-[#818384] text-[#D7DADC] transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <h1 className="text-[#D7DADC] font-bold text-xl mb-1">u/{profile.username}</h1>
          <p className="text-[#818384] text-xs mb-3">
            Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
            {profile.role === 'MODERATOR' && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-800/40 text-yellow-400 rounded text-[10px] font-bold">MOD</span>
            )}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-[#D7DADC]">{posts.length}</div>
              <div className="text-[#818384] text-xs">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#D7DADC]">{followerCount}</div>
              <div className="text-[#818384] text-xs">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#D7DADC]">{following.length}</div>
              <div className="text-[#818384] text-xs">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1A1A1B] border border-[#343536] rounded-md mb-4 flex">
        {['posts', 'followers', 'following'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
              tab === t
                ? 'border-[#FF4500] text-[#FF4500]'
                : 'border-transparent text-[#818384] hover:text-[#D7DADC]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'posts' && (
        <div className="space-y-3">
          {posts.length === 0 && (
            <div className="text-center py-12 bg-[#1A1A1B] border border-[#343536] rounded-md text-[#818384]">
              No posts yet.
            </div>
          )}
          {posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}

      {tab === 'followers' && (
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md divide-y divide-[#343536]">
          {followers.length === 0 && (
            <div className="text-center py-10 text-[#818384] text-sm">No followers yet.</div>
          )}
          {followers.map(u => u && (
            <Link key={u.id} to={`/user/${u.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#272729] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-xs font-black">
                {u.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-[#D7DADC] text-sm font-semibold">u/{u.username}</span>
              {u.role === 'MODERATOR' && (
                <span className="px-1.5 py-0.5 bg-yellow-800/40 text-yellow-400 rounded text-[10px] font-bold ml-auto">MOD</span>
              )}
            </Link>
          ))}
        </div>
      )}

      {tab === 'following' && (
        <div className="bg-[#1A1A1B] border border-[#343536] rounded-md divide-y divide-[#343536]">
          {following.length === 0 && (
            <div className="text-center py-10 text-[#818384] text-sm">Not following anyone yet.</div>
          )}
          {following.map(u => u && (
            <Link key={u.id} to={`/user/${u.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#272729] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-xs font-black">
                {u.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-[#D7DADC] text-sm font-semibold">u/{u.username}</span>
              {u.role === 'MODERATOR' && (
                <span className="px-1.5 py-0.5 bg-yellow-800/40 text-yellow-400 rounded text-[10px] font-bold ml-auto">MOD</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}