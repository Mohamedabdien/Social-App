import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    dateOfBirth: '',
    gender: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.rePassword) {
      setError('Password and confirmation do not match')
      return
    }

    setBusy(true)
    try {
      const { data } = await signUp(form)
      const token = data?.data?.token || data?.token
      const user = data?.data?.user || data?.user || data?.data
      if (token) {
        login(token, user)
        navigate('/')
      } else {
        // Some setups require signing in separately right after signup.
        navigate('/login')
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Something went wrong while creating your account'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="card auth-card">
        <h1 className="page-title">Create a new account</h1>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name</label>
            <input required value={form.name} onChange={update('name')} placeholder="Your name" />
          </div>
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
            <input
              required
              type="password"
              value={form.password}
              onChange={update('password')}
              minLength={6}
            />
          </div>
          <div className="form-field">
            <label>Confirm password</label>
            <input
              required
              type="password"
              value={form.rePassword}
              onChange={update('rePassword')}
              minLength={6}
            />
          </div>
          <div className="form-field">
            <label>Date of birth</label>
            <input required type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
          </div>
          <div className="form-field">
            <label>Gender</label>
            <select
              required
              value={form.gender}
              onChange={update('gender')}
              style={{
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: '0.95rem',
                background: 'var(--paper)',
                color: 'var(--ink)',
              }}
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button className="btn full" type="submit" disabled={busy}>
            {busy ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
