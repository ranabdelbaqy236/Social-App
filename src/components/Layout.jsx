import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { avatarOf, nameOf } from '../utils/helpers'
import { HomeIcon, LockIcon, LogoutIcon, UserIcon } from './Icons'

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="app-shell">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <header className="topbar">
        <NavLink to="/" className="brand"><span className="brand-mark">R</span><span>route <em>social</em></span></NavLink>
        <nav className="topnav" aria-label="Main navigation">
          <NavLink to="/" end><HomeIcon /><span>Home</span></NavLink>
          <NavLink to="/profile"><UserIcon /><span>Profile</span></NavLink>
        </nav>
        <NavLink to="/profile" className="mini-profile">
          <img src={avatarOf(user)} alt="" />
          <span><b>{nameOf(user)}</b><small>@{user?.username || 'member'}</small></span>
        </NavLink>
      </header>

      <div className="page-grid">
        <main className="main-content"><Outlet /></main>
        <aside className="side-card desktop-only">
          <div className="side-cover" />
          <img className="side-avatar" src={avatarOf(user)} alt="Profile" />
          <h3>{nameOf(user)}</h3>
          <p>@{user?.username || 'member'}</p>
          <div className="side-links">
            <NavLink to="/profile"><UserIcon /> Profile</NavLink>
            <NavLink to="/change-password"><LockIcon /> Change password</NavLink>
            <button onClick={logout}><LogoutIcon /> Log out</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
