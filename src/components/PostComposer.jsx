import { useRef, useState } from 'react'
import { apiRequest, toFormData } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { avatarOf } from '../utils/helpers'
import { CloseIcon, ImageIcon, SendIcon } from './Icons'

export default function PostComposer({ onCreated }) {
  const { user } = useAuth()
  const fileRef = useRef()
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const chooseImage = (file) => {
    setImage(file || null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!body.trim() && !image) return setError('Write something or choose an image.')
    setLoading(true); setError('')
    try {
      const response = await apiRequest('/posts', { method: 'POST', body: toFormData({ body: body.trim(), image }) })
      setBody(''); chooseImage(null); onCreated?.(response)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <form className="composer card" onSubmit={submit}>
      <div className="composer-row">
        <img className="avatar" src={avatarOf(user)} alt="" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What's on your mind?" rows="2" />
      </div>
      {preview && <div className="media-preview"><img src={preview} alt="Preview" /><button type="button" onClick={() => chooseImage(null)}><CloseIcon /></button></div>}
      {error && <p className="field-error">{error}</p>}
      <div className="composer-actions">
        <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => chooseImage(e.target.files[0])} />
        <button type="button" className="soft-button" onClick={() => fileRef.current.click()}><ImageIcon /> Photo</button>
        <button className="primary-button compact" disabled={loading}>{loading ? <span className="spinner small" /> : <SendIcon />}{loading ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  )
}
