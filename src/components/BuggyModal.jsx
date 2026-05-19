import { useEffect, useRef } from 'react'

export default function Modal({ title, children, open, onClose }) {
  const cardRef = useRef(null)

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    if (open) {
      window.addEventListener('keydown', closeOnEscape)
      // Focus the modal card so keyboard users land inside it
      cardRef.current?.focus()
    }
    // FIX: always remove the listener so it doesn't accumulate on re-renders
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* FIX: stop propagation so clicks inside the card don't bubble to the backdrop */}
      <section
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  )
}
