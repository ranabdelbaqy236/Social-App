import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ArrowIcon, LockIcon } from '../components/Icons'

export default function ChangePassword() {
  const { saveSession, user } = useAuth()
  const [form, setForm] = useState({ password: '', newPassword: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setMessage('')
    if (form.newPassword !== form.confirm) return setError('The new passwords do not match.')
    setLoading(true)
    try {
      const response = await apiRequest('/users/change-password', { method: 'PATCH', body: JSON.stringify({ password: form.password, newPassword: form.newPassword }) })
      const token = response?.data?.token || response?.token
      if (token) saveSession({ data: { ...response.data, token, user: response?.data?.user || user } })
      setMessage('Your password was changed successfully.'); setForm({ password: '', newPassword: '', confirm: '' })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="settings-page">
      <div className="details-head"><Link className="icon-button" to="/profile"><ArrowIcon /></Link><div><h1>Security & password</h1><p>Keep your account secure</p></div></div>
      <form className="settings-card card" onSubmit={submit}>
        <div className="settings-icon"><LockIcon /></div><h2>Change password</h2><p className="muted">Choose a strong password you do not use elsewhere.</p>
        {message && <div className="alert success">{message}</div>}{error && <div className="alert error">{error}</div>}
        <label>Current password<input type="password" required value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} /></label>
        <label>New password<input type="password" required minLength="8" value={form.newPassword} onChange={(e) => setForm({...form,newPassword:e.target.value})} placeholder="Aa@123456" /></label>
        <label>Confirm new password<input type="password" required value={form.confirm} onChange={(e) => setForm({...form,confirm:e.target.value})} /></label>
        <button className="primary-button wide" disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</button>
      </form>
    </div>
  )
}
