import { useState } from 'react'

export default function PostForm({ initialBody = '', onSubmit, submitLabel = 'Post' }) {
  const [body, setBody] = useState(initialBody)
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!body.trim() && !image) {
      setError('Write something or add an image first')
      return
    }
    setError('')
    setBusy(true)
    try {
      await onSubmit({ body: body.trim(), image })
      setBody('')
      setImage(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong, please try again')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      {error && <div className="error-box">{error}</div>}
      <div className="form-field">
        <textarea
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Posting...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
