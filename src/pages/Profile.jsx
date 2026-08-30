import { useEffect, useState } from 'react'
import { getProfile, getPosts } from '../api/endpoints.js'
import { getApiErrorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import PostCard from '../components/PostCard.jsx'

function initials(name = '') {
  return name.trim().slice(0, 1).toUpperCase() || '?'
}

export default function Profile() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const { data } = await getProfile()
        const profileData = data?.data?.user || data?.data || data
        setProfile(profileData)
        updateUser(profileData)

        const postsRes = await getPosts({ page: 1, limit: 50 })
        const list = postsRes.data?.data?.posts || postsRes.data?.data || []
        const mine = (Array.isArray(list) ? list : []).filter((p) => {
          const author = p.user || p.author || {}
          return author._id === profileData?._id || author.id === profileData?._id
        })
        setMyPosts(mine)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Could not load your account data'))
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDeleted(postId) {
    setMyPosts((p) => p.filter((post) => (post._id || post.id) !== postId))
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

      {profile && (
        <div className="profile-header">
          <div className="avatar">
            {profile.photo ? <img src={profile.photo} alt="" /> : initials(profile.name)}
          </div>
          <div>
            <div className="profile-name">{profile.name}</div>
            <div className="muted">{profile.email}</div>
          </div>
        </div>
      )}

      <h2 className="page-title" style={{ fontSize: '1.05rem' }}>
        My posts ({myPosts.length})
      </h2>

      {myPosts.length === 0 ? (
        <div className="center-state">You haven't posted anything yet</div>
      ) : (
        <div className="route-feed">
          {myPosts.map((post) => (
            <div className="route-stop" key={post._id || post.id}>
              <PostCard post={post} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
