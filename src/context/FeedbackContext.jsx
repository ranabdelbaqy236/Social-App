import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Toast from '../components/Toast'

const FeedbackContext = createContext(null)

export function FeedbackProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState(null)

  const confirmAction = useCallback((options) => new Promise((resolve) => {
    setDialog({
      title: 'Delete post?',
      message: "This action can't be undone. The post and all its comments will be permanently removed.",
      confirmLabel: 'Delete post',
      cancelLabel: 'Keep post',
      ...options,
      resolve,
    })
  }), [])

  const closeDialog = useCallback((confirmed = false) => {
    setDialog((current) => {
      current?.resolve(confirmed)
      return null
    })
  }, [])

  const notify = useCallback((message, type = 'success', title) => {
    setToast({ message, type, title: title || (type === 'success' ? 'Success!' : 'Something went wrong') })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!dialog) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && closeDialog(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [dialog, closeDialog])

  return (
    <FeedbackContext.Provider value={{ confirmAction, notify }}>
      {children}
      {dialog && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeDialog(false)}>
          <section className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
            <div className="confirm-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" /></svg>
            </div>
            <span className="confirm-kicker">Please confirm</span>
            <h2 id="confirm-title">{dialog.title}</h2>
            <p id="confirm-message">{dialog.message}</p>
            <div className="confirm-actions">
              <button className="modal-cancel" onClick={() => closeDialog(false)}>{dialog.cancelLabel}</button>
              <button className="modal-delete" autoFocus onClick={() => closeDialog(true)}>
                <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7" /></svg>
                {dialog.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
      <Toast {...toast} onClose={() => setToast(null)} />
    </FeedbackContext.Provider>
  )
}

export const useFeedback = () => useContext(FeedbackContext)
