import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPosts, updatePost } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import PostForm from '../components/PostForm.jsx'

export default function EditPost() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getPosts({ page: 1, limit: 50 })
        const list = data?.data?.posts || data?.data || []
        const found = (Array.isArray(list) ? list : []).find((p) => (p._id || p.id) === postId)
        setPost(found || null)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Could not load this post'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId])

  async function handleSubmit({ body, image }) {
    let payload
    if (image) {
      payload = new FormData()
      payload.append('body', body)
      payload.append('image', image)
    } else {
      payload = { body }
    }
    await updatePost(postId, payload)
    navigate(`/posts/${postId}`)
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

  if (!post) {
    return (
      <div className="page">
        {error && <div className="error-box">{error}</div>}
        <div className="center-state">This post doesn't exist</div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">Edit post</h1>
      <PostForm initialBody={post.body || ''} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  )
}
