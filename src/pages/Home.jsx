import { useEffect, useState } from 'react'
import PostComposer from '../components/PostComposer'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { apiRequest, extractList } from '../services/api'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPosts = async () => {
    setLoading(true); setError('')
    try { setPosts(extractList(await apiRequest('/posts?page=1&limit=30'), 'posts')) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadPosts() }, [])
  return (
    <div className="feed-page">
      <div className="page-heading"><span className="eyebrow purple">Latest updates</span><h1>Stay curious. Stay <span className="gradient-text">connected.</span></h1><p>See what your community is sharing today.</p><div className="mood-chips"><span>✦ Fresh ideas</span><span>♥ Real people</span><span>⚡ New stories</span></div></div>
      <PostComposer onCreated={loadPosts} />
      <div className="feed-title"><h2>Latest posts</h2><button onClick={loadPosts}>Refresh</button></div>
      {error && <div className="alert error">{error}<button onClick={loadPosts}>Try again</button></div>}
      {loading ? <div className="posts-skeleton">{[1,2,3].map((n) => <div className="skeleton card" key={n} />)}</div> : posts.length ? posts.map((post) => <PostCard key={post._id || post.id} post={post} onChanged={(next) => setPosts(posts.map((p) => (p._id || p.id) === (next._id || next.id) ? next : p))} onDeleted={(id) => setPosts(posts.filter((p) => (p._id || p.id) !== id))} />) : <EmptyState title="Be the first to post" text="Write a new post and it will appear here." />}
    </div>
  )
}
