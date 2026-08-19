import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import PostDetails from './pages/PostDetails'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import NotFound from './pages/NotFound'

function Protected({ children }) {
  const { token, checking } = useAuth()
  if (checking) return <div className="screen-loader"><span className="spinner" />Preparing your account...</div>
  return token ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }) {
  const { token } = useAuth()
  return token ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route index element={<Home />} />
        <Route path="posts/:postId" element={<PostDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
