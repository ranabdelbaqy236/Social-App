import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { saveSession } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const response = await apiRequest('/users/signin', { method: 'POST', body: JSON.stringify(form) })
      saveSession(response); navigate('/')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand"><span className="brand-mark">R</span> route social</div>
        <div className="visual-copy"><span className="eyebrow">Your space, your people</span><h1>Every moment is<br />worth sharing.</h1><p>Connect with friends, share your ideas, and build a community that feels like home.</p></div>
        <div className="floating-card one">💜 <span><b>Your people, closer</b><small>Stay connected every day</small></span></div>
        <div className="floating-card two">✦ <span><b>Real stories</b><small>From real people</small></span></div>
      </section>
      <main className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="mobile-brand"><span className="brand-mark">R</span> route social</div>
          <span className="eyebrow purple">Welcome back</span><h2>Sign in</h2><p className="muted">Pick up where you left off.</p>
          {error && <div className="alert error">{error}</div>}
          <label>Email or username<input type="text" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label>
          <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>
          <button className="primary-button wide" disabled={loading}>{loading ? <><span className="spinner small" /> Signing in...</> : 'Sign in'}</button>
          <p className="auth-switch">New to Route Social? <Link to="/signup">Create an account</Link></p>
        </form>
      </main>
    </div>
  )
}
