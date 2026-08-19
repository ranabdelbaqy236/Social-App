export const API_URL = import.meta.env.VITE_API_URL || 'https://route-posts.routemisr.com'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('route_social_token')
  const isFormData = options.body instanceof FormData
  const headers = { ...options.headers }

  if (!isFormData && options.body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const result = contentType.includes('application/json') ? await response.json() : {}

  if (!response.ok || result.success === false) {
    if (response.status === 401) window.dispatchEvent(new Event('auth-expired'))
    const details = Array.isArray(result.errors) ? result.errors.join(' - ') : result.errors
    throw new Error(details || result.message || 'Something went wrong. Please try again.')
  }
  return result
}

export const toFormData = (fields) => {
  const data = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') data.append(key, value)
  })
  return data
}

export const extractList = (response, key) => {
  const data = response?.data ?? response
  if (Array.isArray(data)) return data
  return data?.[key] || data?.posts || data?.comments || data?.results || []
}

export const extractOne = (response, key) => {
  const data = response?.data ?? response
  return data?.[key] || data?.post || data?.comment || data?.user || data
}
