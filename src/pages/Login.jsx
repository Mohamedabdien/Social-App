import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { data } = await signIn(form)
      const token = data?.data?.token || data?.token
      const user = data?.data?.user || data?.user || data?.data
      if (!token) throw new Error('no-token')
      login(token, user)
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Incorrect email or password'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="card auth-card">
        <h1 className="page-title">Log in</h1>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input required type="password" value={form.password} onChange={update('password')} />
          </div>
          <button className="btn full" type="submit" disabled={busy}>
            {busy ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <div className="auth-switch">
          Don't have an account yet? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
