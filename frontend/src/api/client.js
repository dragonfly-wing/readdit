const BASE = 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('obs_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

// Auth
export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  posts: {
    getAll: (tag) => request(`/posts${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`),
    getOne: (id) => request(`/posts/${id}`),
    getByUser: (userId) => request(`/posts/user/${userId}`),
    create: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  },
  comments: {
    getForPost: (postId) => request(`/comments/post/${postId}`),
    getReplies: (parentId) => request(`/comments/replies/${parentId}`),
    add: (postId, data) => request(`/comments/post/${postId}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (commentId, data) => request(`/comments/${commentId}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (commentId) => request(`/comments/${commentId}`, { method: 'DELETE' }),
  },
  likes: {
    toggle: (postId) => request(`/likes/${postId}/toggle`, { method: 'POST' }),
    status: (postId) => request(`/likes/${postId}/status`),
  },
  follow: {
    toggle: (targetUserId) => request(`/follow/${targetUserId}/toggle`, { method: 'POST' }),
    status: (targetUserId) => request(`/follow/${targetUserId}/status`),
    getFollowers: (userId) => request(`/follow/${userId}/followers`),
    getFollowing: (userId) => request(`/follow/${userId}/following`),
  },
  users: {
    getProfile: (userId) => request(`/users/${userId}`),
    update: (userId, data) => request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  reports: {
    create: (data) => request('/reports', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (status) => request(`/reports${status ? `?status=${status}` : ''}`),
    resolve: (reportId, action) => request(`/reports/${reportId}/resolve`, { method: 'PATCH', body: JSON.stringify({ action }) }),
  },
}