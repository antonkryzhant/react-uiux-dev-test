import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import Modal from '../components/BuggyModal.jsx'
import { projects, invoices } from '../data/mockData.js'

export default function Dashboard({ search }) {
  const [open, setOpen] = useState(false)
  // FIX: textarea was uncontrolled (defaultValue) — state resets to default on re-render
  const [notes, setNotes] = useState('Notes for today...')

  const totalBudget = useMemo(() => projects.reduce((sum, project) => sum + project.budget, 0), [])
  const unpaid = invoices.filter((invoice) => !invoice.paid).reduce((sum, invoice) => sum + invoice.amount, 0)
  const filtered = projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Executive Dashboard"
        description="A compact operations dashboard."
        action={<button className="primary-btn" onClick={() => setOpen(true)}>Create summary</button>}
      />
      <div className="stats-grid">
        <StatCard label="Active projects" value={projects.length} trend={12} />
        <StatCard label="Total budget" value={`£${totalBudget.toLocaleString()}`} trend={-4} />
        <StatCard label="Unpaid invoices" value={`£${unpaid.toLocaleString()}`} trend={8} />
        <StatCard label="Avg health" value="62%" trend={-11} />
      </div>
      <div className="content-grid two-col">
        <section className="panel">
          <h2>Project health</h2>
          {filtered.length === 0
            ? <p style={{ color: '#667085' }}>No projects match your search.</p>
            : (
              <div className="health-list">
                {filtered.map((project) => (
                  <div className="health-row" key={project.id}>
                    <span>{project.name}</span>
                    <div className="health-bar" role="progressbar" aria-valuenow={project.health} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.name} health`}>
                      <i style={{ width: `${project.health}%` }} />
                    </div>
                    <b>{project.health}%</b>
                  </div>
                ))}
              </div>
            )}
        </section>
        <section className="panel notes-panel">
          <h2>Today</h2>
          <p>Review blocked work, confirm invoices, and update client-facing status.</p>
          <label htmlFor="today-notes" className="sr-only">Today's notes</label>
          <textarea
            id="today-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>
      </div>
      <Modal title="Generate summary" open={open} onClose={() => setOpen(false)}>
        <p>Enter a name for the summary report.</p>
        <input placeholder="Summary name" autoFocus />
        <button className="primary-btn">Generate</button>
      </Modal>
    </>
  )
}
