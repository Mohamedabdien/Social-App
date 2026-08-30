import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { updateComment, deleteComment, toggleLikeComment } from '../api/endpoints.js'

function initials(name = '') {
  return name.trim().slice(0, 1).toUpperCase() || '?'
}

export default function CommentItem({ postId, comment, onDeleted, onUpdated }) {
  const { user } = useAuth()
  const author = comment.user || comment.author || {}
  const isOwner = user && (author._id === user._id || author.id === user._id)

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.text || comment.body || '')
  const [busy, setBusy] = useState(false)
  const [liked, setLiked] = useState(Boolean(comment.isLiked || comment.liked))

  async function saveEdit() {
    if (!text.trim()) return
    setBusy(true)
    try {
      const commentId = comment._id || comment.id
      await updateComment(postId, commentId, { text: text.trim() })
      onUpdated?.(commentId, text.trim())
      setEditing(false)
    } catch {
      alert('Something went wrong while editing')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this comment?')) return
    setBusy(true)
    try {
      const commentId = comment._id || comment.id
      await deleteComment(postId, commentId)
      onDeleted?.(commentId)
    } catch {
      alert('Something went wrong while deleting')
    } finally {
      setBusy(false)
    }
  }

  async function handleLike() {
    setLiked((l) => !l)
    try {
      await toggleLikeComment(postId, comment._id || comment.id)
    } catch {
      setLiked((l) => !l)
    }
  }

  return (
    <div className="comment-item">
      <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
        {author.photo ? <img src={author.photo} alt="" /> : initials(author.name)}
      </div>
      <div className="comment-bubble">
        <div className="comment-author">{author.name || 'User'}</div>
        {editing ? (
          <div style={{ marginTop: 6 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: '100%', borderRadius: 8, border: '1px solid var(--line)', padding: 6 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button className="btn small" onClick={saveEdit} disabled={busy}>
                Save
              </button>
              <button className="btn small ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="comment-text">{text}</div>
        )}

        <div className="comment-row-actions">
          <button onClick={handleLike}>{liked ? '♥ Liked' : '♡ Like'}</button>
          {isOwner && !editing && (
            <>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete} disabled={busy}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
