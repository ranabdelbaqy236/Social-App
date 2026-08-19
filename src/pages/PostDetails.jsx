import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { apiRequest, extractList, extractOne, toFormData } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useFeedback } from '../context/FeedbackContext'
import { avatarOf, commentText, idOf, imageOf, nameOf, ownerOf, sameUser, timeAgo } from '../utils/helpers'
import { ArrowIcon, ImageIcon, MoreIcon, SendIcon } from '../components/Icons'

export default function PostDetails() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileRef = useRef()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [postRes, commentsRes] = await Promise.all([apiRequest(`/posts/${postId}`), apiRequest(`/posts/${postId}/comments?page=1&limit=50`)])
      setPost(extractOne(postRes, 'post')); setComments(extractList(commentsRes, 'comments'))
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [postId])

  const addComment = async (e) => {
    e.preventDefault(); if (!content.trim() && !image) return
    setSending(true)
    try {
      await apiRequest(`/posts/${postId}/comments`, { method: 'POST', body: toFormData({ content: content.trim(), image }) })
      setContent(''); setImage(null); await load()
    } catch (err) { setError(err.message) }
    finally { setSending(false) }
  }

  if (loading) return <div className="screen-loader inline"><span className="spinner" />Loading post...</div>
  if (error && !post) return <div className="alert error">{error}<button onClick={load}>Try again</button></div>
  return (
    <div className="details-page">
      <div className="details-head"><button className="icon-button" onClick={() => navigate(-1)}><ArrowIcon /></button><div><h1>Post details</h1><p>The post and all its comments</p></div></div>
      <PostCard post={post} detail onChanged={setPost} onDeleted={() => navigate('/')} />
      <section className="comments-card card">
        <h2>Comments <span>{comments.length}</span></h2>
        <form className="comment-form" onSubmit={addComment}>
          <img className="avatar" src={avatarOf(user)} alt="" />
          <div><textarea rows="2" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a thoughtful comment..." />{image && <small className="selected-file">Selected: {image.name}</small>}<div className="comment-form-actions"><input hidden ref={fileRef} type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /><button type="button" className="icon-button" onClick={() => fileRef.current.click()}><ImageIcon /></button><button className="primary-button compact" disabled={sending}><SendIcon />{sending ? 'Sending...' : 'Send'}</button></div></div>
        </form>
        <div className="comments-list">{comments.length ? comments.map((comment) => <Comment key={idOf(comment)} comment={comment} postId={postId} currentUser={user} onRefresh={load} />) : <EmptyState title="No comments yet" text="Be the first to leave a comment." />}</div>
      </section>
    </div>
  )
}

function Comment({ comment, postId, currentUser, onRefresh }) {
  const owner = ownerOf(comment)
  const { confirmAction, notify } = useFeedback()
  const [menu, setMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(commentText(comment))
  const canEdit = sameUser(owner, currentUser)

  const update = async () => {
    try { await apiRequest(`/posts/${postId}/comments/${idOf(comment)}`, { method: 'PUT', body: toFormData({ content: text.trim() }) }); setEditing(false); onRefresh() }
    catch (err) { notify(err.message, 'error', 'Could not update comment') }
  }
  const remove = async () => {
    setMenu(false)
    const confirmed = await confirmAction({
      title: 'Delete this comment?',
      message: "This comment will be permanently removed. You can't undo this action.",
      confirmLabel: 'Delete comment',
      cancelLabel: 'Keep comment',
    })
    if (!confirmed) return
    try {
      await apiRequest(`/posts/${postId}/comments/${idOf(comment)}`, { method: 'DELETE' })
      notify('Your comment has been deleted successfully.', 'success', 'Comment deleted')
      onRefresh()
    } catch (err) {
      notify(err.message, 'error', 'Could not delete comment')
    }
  }

  return <div className="comment">
    <img className="avatar" src={avatarOf(canEdit ? currentUser : owner)} alt="" />
    <div className="comment-content"><div className="comment-bubble"><div className="comment-meta"><b>{nameOf(owner)}</b><span>{timeAgo(comment.createdAt)}</span>{canEdit && <div className="menu-wrap"><button className="icon-button tiny" onClick={() => setMenu(!menu)}><MoreIcon /></button>{menu && <div className="popup-menu"><button onClick={() => {setEditing(true);setMenu(false)}}>Edit</button><button className="danger" onClick={remove}>Delete</button></div>}</div>}</div>{editing ? <div className="inline-edit comment-edit"><textarea value={text} onChange={(e) => setText(e.target.value)} /><div><button className="text-button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button compact" onClick={update}>Save</button></div></div> : <p>{commentText(comment)}</p>}{imageOf(comment) && <img className="comment-image" src={imageOf(comment)} alt="Comment attachment" />}</div></div>
  </div>
}
