import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

const initial = { name: '', username: '', email: '', dateOfBirth: '', gender: 'female', password: '', rePassword: '' }

export default function Signup() {
  const { saveSession } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const field = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.rePassword) return setError('Passwords do not match.')
    setLoading(true)
    try {
      const response = await apiRequest('/users/signup', { method: 'POST', body: JSON.stringify(form) })
      saveSession(response); navigate('/')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page signup-page">
      <section className="auth-visual"><div className="auth-brand"><span className="brand-mark">R</span> route social</div><div className="visual-copy"><span className="eyebrow">Join the conversation</span><h1>Your voice. Your story.<br />Your community.</h1><p>Start your journey today and discover a world of ideas, stories, and new connections.</p></div><div className="orbit orbit-a"/><div className="orbit orbit-b"/></section>
      <main className="auth-form-wrap scrollable">
        <form className="auth-form signup-form" onSubmit={submit}>
          <div className="mobile-brand"><span className="brand-mark">R</span> route social</div>
          <span className="eyebrow purple">Get started</span><h2>Create your account</h2><p className="muted">It only takes a minute.</p>
          {error && <div className="alert error">{error}</div>}
          <div className="form-grid">
            <label>Full name<input required value={form.name} onChange={field('name')} placeholder="Sarah Ahmed" /></label>
            <label>Username<input required value={form.username} onChange={field('username')} placeholder="sarah_ahmed" /></label>
            <label className="full">Email address<input type="email" required value={form.email} onChange={field('email')} placeholder="name@example.com" /></label>
            <label>Date of birth<input type="date" required value={form.dateOfBirth} onChange={field('dateOfBirth')} /></label>
            <label>Gender<select value={form.gender} onChange={field('gender')}><option value="female">Female</option><option value="male">Male</option></select></label>
            <label>Password<input type="password" required minLength="8" value={form.password} onChange={field('password')} placeholder="Aa@123456" /></label>
            <label>Confirm password<input type="password" required value={form.rePassword} onChange={field('rePassword')} placeholder="Aa@123456" /></label>
          </div>
          <small className="password-hint">Use at least 8 characters with uppercase, lowercase, a number, and a symbol.</small>
          <button className="primary-button wide" disabled={loading}>{loading ? <><span className="spinner small" /> Creating account...</> : 'Create account'}</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </main>
    </div>
  )
}
