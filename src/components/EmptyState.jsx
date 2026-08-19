export default function EmptyState({ title = 'Nothing here yet', text = 'New content will appear here.' }) {
  return <div className="empty-state"><div>✦</div><h3>{title}</h3><p>{text}</p></div>
}
