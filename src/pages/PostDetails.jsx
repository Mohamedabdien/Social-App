import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPosts, getComments, createComment } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import PostCard from '../components/PostCard.jsx'
import CommentItem from '../components/CommentItem.jsx'

export default function PostDetails() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [posting, setPosting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      // The docs don't list a "GET /posts/:id" single-post route, so we pull the
      // post's own data from the general posts list — swap this for a dedicated
      // GET /posts/:postId call if/when you confirm one exists in Postman.
      const [postsRes, commentsRes] = await Promise.all([
        getPosts({ page: 1, limit: 50 }),
        getComments(postId, { page: 1, limit: 50 }),
      ])
      const list = postsRes.data?.data?.posts || postsRes.data?.data || []
      const found = (Array.isArray(list) ? list : []).find(
        (p) => (p._id || p.id) === postId
      )
      setPost(found || null)

      const commentList = commentsRes.data?.data?.comments || commentsRes.data?.data || []
      setComments(Array.isArray(commentList) ? commentList : [])
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load this post'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  async function handleAddComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    setPosting(true)
    try {
      const { data } = await createComment(postId, { text: commentText.trim() })
      const newComment = data?.data?.comment || data?.data
      if (newComment) setComments((c) => [newComment, ...c])
      else load()
      setCommentText('')
    } catch {
      alert('Something went wrong while adding the comment')
    } finally {
      setPosting(false)
    }
  }

  function handleCommentDeleted(commentId) {
    setComments((c) => c.filter((cm) => (cm._id || cm.id) !== commentId))
  }

  function handleCommentUpdated(commentId, newText) {
    setComments((c) =>
      c.map((cm) => ((cm._id || cm.id) === commentId ? { ...cm, text: newText } : cm))
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="center-state">
          <span className="loader-dot" /> Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {error && <div className="error-box">{error}</div>}

      {post ? (
        <PostCard
          post={post}
          linkToDetails={false}
          onDeleted={() => navigate('/')}
        />
      ) : (
        !error && <div className="center-state">This post doesn't exist</div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <h2 className="page-title" style={{ fontSize: '1.05rem' }}>
          Comments ({comments.length})
        </h2>

        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            style={{
              flex: 1,
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: '8px 12px',
            }}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="btn" type="submit" disabled={posting}>
            Post
          </button>
        </form>

        {comments.length === 0 ? (
          <div className="muted">No comments yet — write the first one!</div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id || comment.id}
              postId={postId}
              comment={comment}
              onDeleted={handleCommentDeleted}
              onUpdated={handleCommentUpdated}
            />
          ))
        )}
      </div>
    </div>
  )
}
