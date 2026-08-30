import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { toggleLikePost, deletePost } from '../api/endpoints.js'

function timeAgo(dateString) {
  if (!dateString) return ''
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function initials(name = '') {
  return name.trim().slice(0, 1).toUpperCase() || '?'
}

export default function PostCard({ post, onChanged, onDeleted, linkToDetails = true }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(Boolean(post.isLiked || post.liked))
  const [likesCount, setLikesCount] = useState(post.likesCount ?? post.likes ?? 0)
  const [busy, setBusy] = useState(false)

  const author = post.user || post.author || {}
  const isOwner = user && (author._id === user._id || author.id === user._id)

  async function handleLike() {
    if (busy) return
    setBusy(true)
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikesCount((c) => c + (wasLiked ? -1 : 1))
    try {
      await toggleLikePost(post._id || post.id)
    } catch {
      // revert on failure
      setLiked(wasLiked)
      setLikesCount((c) => c + (wasLiked ? 1 : -1))
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return
    setBusy(true)
    try {
      await deletePost(post._id || post.id)
      onDeleted?.(post._id || post.id)
    } catch (err) {
      alert('Something went wrong while deleting, please try again')
    } finally {
      setBusy(false)
    }
  }

  const bodyContent = (
    <>
      <div className="post-head">
        <div className="avatar">
          {author.photo ? <img src={author.photo} alt="" /> : initials(author.name)}
        </div>
        <div>
          <div className="post-author">{author.name || 'User'}</div>
          <div className="post-meta">{timeAgo(post.createdAt)}</div>
        </div>
      </div>

      {post.body && <p className="post-body">{post.body}</p>}
      {post.image && <img className="post-image" src={post.image} alt="" />}
    </>
  )

  return (
    <article className="post-card">
      {linkToDetails ? (
        <Link to={`/posts/${post._id || post.id}`} style={{ display: 'block' }}>
          {bodyContent}
        </Link>
      ) : (
        bodyContent
      )}

      <div className="post-actions">
        <button className={`icon-btn ${liked ? 'liked' : ''}`} onClick={handleLike} disabled={busy}>
          {liked ? '♥' : '♡'} Like {likesCount > 0 ? `· ${likesCount}` : ''}
        </button>
        {linkToDetails && (
          <Link className="icon-btn" to={`/posts/${post._id || post.id}`}>
            💬 Comments {post.commentsCount ? `· ${post.commentsCount}` : ''}
          </Link>
        )}
        <span className="spacer" />
        {isOwner && (
          <>
            <Link className="icon-btn" to={`/posts/${post._id || post.id}/edit`}>
              Edit
            </Link>
            <button className="icon-btn" onClick={handleDelete} disabled={busy}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  )
}
