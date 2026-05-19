import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { projects } from '../data/mockData.js'

export default function Projects({ search }) {
  const [status, setStatus] = useState('All')
  const [sortAsc, setSortAsc] = useState(true)
  const [selected, setSelected] = useState([])

  // FIX: added `search` to deps — previously filtered rows ignored search changes
  const visible = useMemo(() => {
    let rows = projects
    if (status !== 'All') rows = rows.filter((project) => project.status === status)
    rows = rows.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
    return [...rows].sort((a, b) => sortAsc ? a.budget - b.budget : b.budget - a.budget)
  }, [status, sortAsc, search])

  function toggle(id) {
    // FIX: use functional update and toggle — previously only ever added IDs (no removal)
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <>
      <PageHeader eyebrow="Work" title="Projects" description="Manage project status, ownership, deadlines, and budget." />
      <section className="toolbar panel">
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option><option>Active</option><option>Blocked</option><option>Paused</option>
        </select>
        <button onClick={() => setSortAsc(!sortAsc)}>Sort by budget {sortAsc ? '↑' : '↓'}</button>
        <span>{selected.length} selected</span>
      </section>
      <section className="panel table-wrap">
        <table className="data-table">
          <thead><tr><th></th><th>Name</th><th>Owner</th><th>Status</th><th>Budget</th><th>Due</th></tr></thead>
          <tbody>
            {/* FIX: use project.id as key instead of array index */}
            {visible.map((project) => (
              <tr key={project.id} className={project.status === 'Blocked' ? 'danger-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${project.name}`}
                    checked={selected.includes(project.id)}
                    onChange={() => toggle(project.id)}
                  />
                </td>
                <td>{project.name}</td><td>{project.owner}</td><td>{project.status}</td><td>£{project.budget.toLocaleString()}</td><td>{project.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
