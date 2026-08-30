import axios from 'axios'

// Base URL for the route-posts API (see https://route-posts.routemisr.com)
export const BASE_URL = 'https://route-posts.routemisr.com'

const axiosClient = axios.create({
  baseURL: BASE_URL,
})

// Attach the saved token (if any) to every request automatically.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token becomes invalid/expired, clear it so the app falls back to the login page.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// Helper to read a consistent error message out of the API's response contract:
// { success: false, message: "...", errors: [...] }
export function getApiErrorMessage(error, fallback = 'Something went wrong, please try again') {
  const data = error?.response?.data
  if (!data) return fallback
  if (Array.isArray(data.errors) && data.errors.length) return data.errors.join(' - ')
  if (data.message) return data.message
  return fallback
}

export default axiosClient
