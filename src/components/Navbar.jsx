import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="dot" />
        S-App
      </NavLink>
      <nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <span>Home</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/change-password"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span>Password</span>
            </NavLink>
            <button onClick={handleLogout}>
              <span>Log out</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Log in
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sign up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
