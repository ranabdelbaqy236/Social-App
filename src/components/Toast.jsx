export default function Toast({ message, title, type = 'success', onClose }) {
  if (!message) return null
  return <div className={`toast ${type}`} role="status"><span className="toast-icon">{type === 'success' ? '✓' : '!'}</span><div className="toast-copy"><b>{title || (type === 'success' ? 'Success!' : 'Error')}</b><p>{message}</p></div><button className="toast-close" onClick={onClose} aria-label="Close">×</button><span className="toast-progress" /></div>
}
