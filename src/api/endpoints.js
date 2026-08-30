import axiosClient from './axiosClient'

/*
 * Endpoint map taken from https://route-posts.routemisr.com (public docs table).
 * The docs page lists the routes and the response contract:
 *   success -> { success: true, message, data, meta }
 *   error   -> { success: false, message, errors: [] }
 * but it does NOT show the exact body field names for signup/signin/change-password
 * (that detail lives in the linked Postman collection, which is JS-rendered).
 *
 * ⚠️ IMPORTANT before you submit: open the Postman docs link from the course post,
 * run "POST /users/signup" once with your own test data, and check the exact field
 * names it expects. If they differ from the guesses below (name/email/password/
 * rePassword), you only need to edit the two functions signUp() and signIn() here —
 * every page in the app already calls these functions, so the fix is one place.
 */

// ---------- Auth & Users ----------
export const signUp = (payload) =>
  // payload: { name, email, password, rePassword, dateOfBirth, gender }
  // Confirmed via the live API's validation error: dateOfBirth and gender are
  // also required (gender expects "male" / "female").
  axiosClient.post('/users/signup', payload)

export const signIn = (payload) =>
  // payload: { email, password }  (docs say sign-in works by login/email/username)
  axiosClient.post('/users/signin', payload)

export const changePassword = (payload) =>
  // payload: { oldPassword, newPassword } — double-check field names in Postman
  axiosClient.patch('/users/change-password', payload)

export const getProfile = () => axiosClient.get('/users/profile-data')

export const uploadPhoto = (formData) =>
  axiosClient.put('/users/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ---------- Posts & Feed ----------
export const getPosts = (params = {}) => axiosClient.get('/posts', { params })

export const getFeed = (params = {}) => axiosClient.get('/posts/feed', { params })

export const createPost = (payload) => axiosClient.post('/posts', payload)

export const updatePost = (postId, payload) => axiosClient.put(`/posts/${postId}`, payload)

// The public endpoint table doesn't list a DELETE route for posts explicitly —
// this follows standard REST convention. Confirm it in the Postman docs; if the
// real route differs, this is the only line to change.
export const deletePost = (postId) => axiosClient.delete(`/posts/${postId}`)

export const toggleLikePost = (postId) => axiosClient.put(`/posts/${postId}/like`)

export const togglePostBookmark = (postId) => axiosClient.put(`/posts/${postId}/bookmark`)

// ---------- Comments & Replies ----------
export const getComments = (postId, params = {}) =>
  axiosClient.get(`/posts/${postId}/comments`, { params })

export const createComment = (postId, payload) =>
  axiosClient.post(`/posts/${postId}/comments`, payload)

export const updateComment = (postId, commentId, payload) =>
  axiosClient.put(`/posts/${postId}/comments/${commentId}`, payload)

export const deleteComment = (postId, commentId) =>
  axiosClient.delete(`/posts/${postId}/comments/${commentId}`)

export const toggleLikeComment = (postId, commentId) =>
  axiosClient.put(`/posts/${postId}/comments/${commentId}/like`)
