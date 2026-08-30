import { useEffect, useState } from 'react'
import { getPosts, createPost } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import PostCard from '../components/PostCard.jsx'
import PostForm from '../components/PostForm.jsx'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadPosts() {
    setLoading(true)
    setError('')
    try {
      const { data } = await getPosts({ page: 1, limit: 20 })
      const list = data?.data?.posts || data?.data || []
      setPosts(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load posts'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleCreate({ body, image }) {
    let payload
    if (image) {
      payload = new FormData()
      payload.append('body', body)
      payload.append('image', image)
    } else {
      payload = { body }
    }
    const { data } = await createPost(payload)
    const newPost = data?.data?.post || data?.data
    if (newPost) setPosts((p) => [newPost, ...p])
    else loadPosts()
  }

  function handleDeleted(postId) {
    setPosts((p) => p.filter((post) => (post._id || post.id) !== postId))
  }

  return (
    <div className="page">
      <h1 className="page-title">Latest posts</h1>
      <PostForm onSubmit={handleCreate} />

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="center-state">
          <span className="loader-dot" /> Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="center-state">No posts yet — write the first one! ✍️</div>
      ) : (
        <div className="route-feed">
          {posts.map((post) => (
            <div className="route-stop" key={post._id || post.id}>
              <PostCard post={post} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
