import { useEffect, useState } from 'react'

// ─── Icons (Cleaned up for the Action Bar) ──────────────────────────────────
const IconArrowUp = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 4l8 8H4z" /></svg>);
const IconArrowDown = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 20l-8-8h16z" /></svg>);
const IconComment = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>);
const IconSearch = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const IconFire = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500"><path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z" /></svg>);
const IconBell = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>);
const IconUser = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconShare = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-5-6l-3-3-3 3m3-3v12"/></svg>);

export default function App() {
  const [posts, setPosts] = useState([])
  const [activeFilter, setActiveFilter] = useState("Hot")

  // 🛰️ CONNECT TO YOUR BACKEND
  useEffect(() => {
    fetch('http://localhost:8080/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Backend ded 😤", err))
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] text-[#D7DADC]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* IBM Plex Sans via Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      {/* 🧭 NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#1A1A1B] border-b border-[#343536] h-12 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-[#FF4500]/20">B</div>
          <span className="font-black text-[#D7DADC] text-base tracking-tight hidden sm:block">
            Blog <span className="text-[#FF4500]">2.0</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#818384]"><IconSearch /></div>
          <input placeholder="Search Blog 2.0" className="w-full bg-[#272729] border border-[#343536] hover:border-[#818384] focus:border-[#D7DADC] focus:bg-[#1A1A1B] rounded-full pl-9 pr-4 py-1.5 text-sm text-[#D7DADC] outline-none transition-colors" />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden md:flex items-center gap-1.5 border border-[#343536] hover:border-[#818384] text-[#D7DADC] text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"><IconPlus /> Create</button>
          <button className="p-2 rounded-full text-[#818384] hover:text-[#D7DADC] hover:bg-[#343536] transition-colors"><IconBell /></button>
          <button className="p-2 rounded-full text-[#818384] hover:text-[#D7DADC] hover:bg-[#343536] transition-colors"><IconUser /></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex gap-6 items-start">

        {/* 📜 FEED SECTION */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Filter Bar */}
          <div className="bg-[#1A1A1B] border border-[#343536] rounded-md px-4 py-2 flex items-center gap-1">
            {["Best", "Hot", "New", "Top", "Rising"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${activeFilter === f ? "bg-[#343536] text-[#D7DADC]" : "text-[#818384] hover:bg-[#343536]/60"}`}
              >
                {f === "Hot" && <IconFire />} {f}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {posts.length > 0 ? posts.map((post) => (
            <article key={post.id} className="bg-[#1A1A1B] border border-[#343536] rounded-md hover:border-[#818384] transition-all overflow-hidden flex flex-col cursor-pointer group">

              {/* Content Area */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-xs text-[#818384]">
                  <div className="w-5 h-5 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-[9px] font-black">B</div>
                  <span className="font-bold text-[#D7DADC] hover:underline">r/blog2.0</span>
                  <span>• Posted by u/frodo</span>
                </div>
                <h2 className="text-[18px] font-semibold text-[#D7DADC] mb-1 group-hover:text-white transition-colors">{post.title}</h2>
                <p className="text-[14px] text-[#818384] leading-relaxed mb-3 line-clamp-3">{post.content}</p>
              </div>

              {/* 📥 BOTTOM PILL ACTION BAR (Matches Screenshot) */}
              <div className="px-4 pb-4 flex items-center gap-2">
                {/* Vote Pill */}
                <div className="flex items-center bg-[#272729] rounded-full px-1 py-0.5 border border-transparent hover:bg-[#343536] transition-colors">
                  <button className="p-1.5 text-[#D7DADC] hover:text-[#FF4500]"><IconArrowUp /></button>
                  <span className="text-xs font-bold px-1">{post.likeCount || 0}</span>
                  <button className="p-1.5 text-[#D7DADC] hover:text-blue-400"><IconArrowDown /></button>
                </div>

                {/* Comment Pill */}
                <button className="flex items-center gap-2 bg-[#272729] rounded-full px-4 py-2 border border-transparent hover:bg-[#343536] text-[#D7DADC] text-xs font-bold transition-colors">
                  <IconComment />
                  {post.commentCount || 0}
                </button>

                {/* Remix/Extra Action Circle */}
                <button className="p-2 bg-[#272729] rounded-full border border-transparent hover:bg-[#343536] text-[#D7DADC] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                </button>

                {/* Share Pill */}
                <button className="flex items-center gap-2 bg-[#272729] rounded-full px-4 py-2 border border-transparent hover:bg-[#343536] text-[#D7DADC] text-xs font-bold transition-colors ml-auto md:ml-0">
                  <IconShare />
                  Share
                </button>
              </div>
            </article>
          )) : (
            <div className="text-center py-20 bg-[#1A1A1B] border border-[#343536] rounded-md text-[#818384] font-bold">
               Syncing with MongoDB... 😤
            </div>
          )}
        </div>

        {/* 🏰 SIDEBAR */}
        <aside className="w-80 hidden lg:block flex flex-col gap-4 shrink-0">
          <div className="bg-[#1A1A1B] border border-[#343536] rounded-md overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-[#FF4500] via-[#FF6534] to-[#FF8C69]" />
            <div className="p-4">
              <div className="w-14 h-14 rounded-full bg-[#FF4500] border-4 border-[#1A1A1B] flex items-center justify-center text-white font-black text-xl -mt-10 mb-2">B</div>
              <h3 className="text-[#D7DADC] font-bold text-sm mb-1">Home</h3>
              <p className="text-[#818384] text-xs leading-relaxed mb-4">Your personal Blog 2.0 frontpage. Built with Arch Linux and a whole lot of caffeine. 😤</p>
              <button className="w-full py-2 rounded-full bg-[#FF4500] hover:bg-[#E03D00] text-white text-sm font-bold transition-colors mb-2 shadow-lg shadow-[#FF4500]/20">Create Post</button>
              <button className="w-full py-2 rounded-full border border-[#343536] hover:border-[#818384] text-[#D7DADC] text-sm font-bold transition-colors">Create Community</button>
            </div>
          </div>

          <div className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4 text-[#818384] text-[11px]">
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              <span>Help</span><span>About</span><span>Careers</span><span>Privacy</span><span>Terms</span>
            </div>
            <p className="mt-4">Blog 2.0 Inc © 2026. 😤</p>
          </div>
        </aside>

      </main>
    </div>
  )
}