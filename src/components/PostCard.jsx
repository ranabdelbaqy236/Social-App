import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, toFormData } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useFeedback } from '../context/FeedbackContext'
import { avatarOf, countOf, idOf, imageOf, nameOf, ownerOf, postText, sameUser, timeAgo } from '../utils/helpers'
import { CommentIcon, HeartIcon, MoreIcon } from './Icons'

export default function PostCard({ post, onChanged, onDeleted, detail = false }) {
  const { user } = useAuth()
  const { confirmAction, notify } = useFeedback()
  const postId = idOf(post)
  const owner = ownerOf(post)
  const canEdit = sameUser(owner, user) || String(post?.user?._id || post?.user) === idOf(user)
  const [menu, setMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(postText(post))
  const [liked, setLiked] = useState(Boolean(post?.isLiked || post?.liked))
  const [likes, setLikes] = useState(countOf(post?.likesCount ?? post?.likes))
  const [busy, setBusy] = useState(false)

  const update = async () => {
    if (!text.trim()) return
    setBusy(true)
    try {
      const response = await apiRequest(`/posts/${postId}`, { method: 'PUT', body: toFormData({ body: text.trim() }) })
      setEditing(false); onChanged?.(response?.data?.post || { ...post, body: text.trim() })
    } catch (err) { alert(err.message) }
    finally { setBusy(false) }
  }

  const remove = async () => {
    setMenu(false)
    const confirmed = await confirmAction({
      title: 'Delete this post?',
      message: "This action can't be undone. Your post and all its comments will be permanently removed.",
    })
    if (!confirmed) return
    setBusy(true)
    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' })
      onDeleted?.(postId)
      notify('Your post has been deleted successfully.', 'success', 'Post deleted')
    } catch (err) {
      notify(err.message, 'error', 'Could not delete post')
      setBusy(false)
    }
  }

  const toggleLike = async () => {
    const previous = liked
    setLiked(!previous); setLikes((n) => Math.max(0, n + (previous ? -1 : 1)))
    try { await apiRequest(`/posts/${postId}/like`, { method: 'PUT' }) }
    catch { setLiked(previous); setLikes((n) => Math.max(0, n + (previous ? 1 : -1))) }
  }

  return (
    <article className="post-card card">
      <div className="post-head">
        <img className="avatar" src={avatarOf(canEdit ? user : owner)} alt="" />
        <div><b>{nameOf(owner)}</b><span>@{owner?.username || 'member'} · {timeAgo(post?.createdAt)}</span></div>
        {canEdit && <div className="menu-wrap"><button className="icon-button" onClick={() => setMenu(!menu)}><MoreIcon /></button>{menu && <div className="popup-menu"><button onClick={() => { setEditing(true); setMenu(false) }}>Edit post</button><button className="danger" onClick={remove}>Delete post</button></div>}</div>}
      </div>

      {editing ? <div className="inline-edit"><textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} /><div><button className="text-button" onClick={() => { setEditing(false); setText(postText(post)) }}>Cancel</button><button className="primary-button compact" onClick={update} disabled={busy}>Save</button></div></div> : <p className="post-body">{postText(post)}</p>}
      {imageOf(post) && <Link to={`/posts/${postId}`} className="post-media"><img src={imageOf(post)} alt="Post" /></Link>}

      <div className="post-stats"><span>{likes} likes</span><span>{countOf(post?.commentsCount ?? post?.comments)} comments</span></div>
      <div className="post-actions">
        <button className={liked ? 'liked' : ''} onClick={toggleLike}><HeartIcon filled={liked} /> {liked ? 'Liked' : 'Like'}</button>
        <Link to={`/posts/${postId}`}><CommentIcon /> {detail ? 'Comments' : 'View comments'}</Link>
      </div>
    </article>
  )
}
