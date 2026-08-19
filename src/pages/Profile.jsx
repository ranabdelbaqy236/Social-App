import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, extractList } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { avatarOf, nameOf } from '../utils/helpers'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import { ImageIcon, LockIcon } from '../components/Icons'

export default function Profile() {
  const { user, refreshProfile } = useAuth()
  const fileRef = useRef()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')

  const loadPosts = async () => {
    try { setPosts(extractList(await apiRequest('/posts/feed?only=me&page=1&limit=50'), 'posts')) }
    catch { setPosts([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { loadPosts() }, [])

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const body = new FormData(); body.append('photo', file)
      await apiRequest('/users/upload-photo', { method: 'PUT', body })
      await refreshProfile(); setToast('Your profile photo was updated.')
    } catch (err) { setToast(err.message) }
    finally { setUploading(false) }
  }

  return (
    <div className="profile-page">
      <Toast message={toast} onClose={() => setToast('')} />
      <section className="profile-hero card">
        <div className="profile-cover"><span>✦</span><span>✦</span><span>✦</span></div>
        <div className="profile-info">
          <div className="profile-avatar-wrap"><img src={avatarOf(user)} alt="Profile" /><button onClick={() => fileRef.current.click()} disabled={uploading}><ImageIcon /></button><input hidden ref={fileRef} type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} /></div>
          <div><h1>{nameOf(user)}</h1><p>@{user?.username || 'member'}</p><small>{user?.email}</small></div>
          <Link className="soft-button profile-password" to="/change-password"><LockIcon /> Change password</Link>
        </div>
        <div className="profile-stats"><div><b>{posts.length}</b><span>Posts</span></div><div><b>{user?.followersCount || user?.followers?.length || 0}</b><span>Followers</span></div><div><b>{user?.followingCount || user?.following?.length || 0}</b><span>Following</span></div></div>
      </section>
      <div className="feed-title"><h2>My posts</h2></div>
      {loading ? <div className="skeleton card" /> : posts.length ? posts.map((post) => <PostCard key={post._id || post.id} post={post} onChanged={loadPosts} onDeleted={loadPosts} />) : <EmptyState title="No posts yet" text="Your new posts will appear here." />}
    </div>
  )
}
