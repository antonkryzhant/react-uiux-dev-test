import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

export default function Support() {
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Client cannot export report', priority: 'High' },
    { id: 2, title: 'Invoice duplicate after refresh', priority: 'Medium' },
    { id: 3, title: 'Mobile menu overlaps content', priority: 'Low' }
  ])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  function addTicket() {
    // FIX: previously allowed adding blank tickets with no feedback to the user
    if (!title.trim()) {
      setError('Please enter a ticket title.')
      return
    }
    setError('')
    setTickets((prev) => [{ id: Date.now(), title: title.trim(), priority: 'Low' }, ...prev])
    setTitle('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTicket()
  }

  return (
    <>
      <PageHeader eyebrow="Helpdesk" title="Support" description="Ticket creation and filtering page." />
      <article className="info-block panel">
        <h2>How tickets work</h2>
        <p>
          Use the composer below to log a new issue. Each ticket is triaged by priority so the team can respond in the
          right order.
        </p>
        <ul>
          <li><strong>High</strong> — production outages or blocked revenue.</li>
          <li><strong>Medium</strong> — degraded experience with a workaround.</li>
          <li><strong>Low</strong> — polish, questions, or non-urgent improvements.</li>
        </ul>
      </article>
      <section className="panel ticket-composer">
        <label htmlFor="ticket-title" className="sr-only">New ticket title</label>
        <input
          id="ticket-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          placeholder="New ticket title"
          aria-describedby={error ? 'ticket-error' : undefined}
        />
        <button onClick={addTicket}>Add ticket</button>
        {error && <p id="ticket-error" className="toast" style={{ background: '#fee4e2', color: '#b42318' }}>{error}</p>}
      </section>
      <section className="ticket-list">
        {/* FIX: was using array index as key — now uses ticket.id which is stable */}
        {tickets.map((ticket) => (
          <article className="ticket" key={ticket.id}>
            <strong>{ticket.title}</strong>
            <span className={`pill ${ticket.priority === 'High' ? 'unpaid' : ticket.priority === 'Medium' ? '' : 'paid'}`}>
              {ticket.priority}
            </span>
          </article>
        ))}
      </section>
    </>
  )
}
