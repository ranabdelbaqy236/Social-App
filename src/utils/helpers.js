export const idOf = (item) => item?._id || item?.id || ''
export const ownerOf = (item) => item?.user || item?.creator || item?.createdBy || item?.commentCreator || item?.author || {}
export const sameUser = (a, b) => Boolean(idOf(a) && idOf(a) === idOf(b))
export const nameOf = (user) => user?.name || user?.username || 'Route Member'
const defaultAvatar = '/profile-woman.png'
export const avatarOf = (user) => {
  const source = user?.photo || user?.profilePhoto || user?.image || defaultAvatar
  if (!user?.__avatarVersion || source === defaultAvatar || source.startsWith('data:')) return source
  const separator = source.includes('?') ? '&' : '?'
  return `${source}${separator}v=${user.__avatarVersion}`
}
export const imageOf = (item) => item?.image || item?.photo || item?.imageUrl || ''
export const postText = (post) => post?.body || post?.content || post?.text || ''
export const commentText = (comment) => comment?.content || comment?.body || comment?.text || ''
export const countOf = (value) => Array.isArray(value) ? value.length : Number(value || 0)

export function timeAgo(value) {
  if (!value) return 'Now'
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
