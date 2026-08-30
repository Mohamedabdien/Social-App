import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }

    setBusy(true)
    try {
      const { data } = await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })
      // Some APIs rotate the token on password change — pick it up if present.
      const newToken = data?.data?.token || data?.token
      if (newToken) login(newToken)
      setSuccess('Password changed successfully ✅')
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => navigate('/profile'), 1200)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Something went wrong while changing your password'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="card auth-card">
        <h1 className="page-title">Change password</h1>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Current password</label>
            <input
              required
              type="password"
              value={form.oldPassword}
              onChange={update('oldPassword')}
            />
          </div>
          <div className="form-field">
            <label>New password</label>
            <input
              required
              type="password"
              minLength={6}
              value={form.newPassword}
              onChange={update('newPassword')}
            />
          </div>
          <div className="form-field">
            <label>Confirm new password</label>
            <input
              required
              type="password"
              minLength={6}
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
            />
          </div>
          <button className="btn full" type="submit" disabled={busy}>
            {busy ? 'Saving...' : 'Save new password'}
          </button>
        </form>
      </div>
    </div>
  )
}
