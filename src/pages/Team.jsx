import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { team } from '../data/mockData.js'

export default function Team() {
  const [members, setMembers] = useState(team)
  const [showInactive, setShowInactive] = useState(false)

  const visible = members.filter((member) => showInactive ? true : member.active)

  function removeMember(id) {
    // FIX: was mutating the array with splice() then passing the same reference to
    // setMembers — React saw no reference change and skipped the re-render
    setMembers((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <>
      <PageHeader eyebrow="People" title="Team capacity" description="Review active team members and workload balance." />
      <label className="toggle-row panel">
        <input type="checkbox" onChange={(e) => setShowInactive(e.target.checked)} />
        Show inactive members
      </label>
      <div className="card-grid">
        {visible.length === 0 && <p>No team members match the current filter.</p>}
        {visible.map((member) => (
          <article className="person-card" key={member.id}>
            <div className="avatar" aria-hidden="true">{member.name[0]}</div>
            <div>
              <h3>{member.name}</h3>
              <p>{member.role} · {member.location}</p>
              <div className="meter" role="progressbar" aria-valuenow={member.capacity} aria-valuemin={0} aria-valuemax={100} aria-label={`${member.name} allocation`}>
                <span style={{ width: `${Math.min(member.capacity, 100)}%` }} />
              </div>
              <small>{member.capacity}% allocated</small>
            </div>
            <button onClick={() => removeMember(member.id)} aria-label={`Remove ${member.name}`}>Remove</button>
          </article>
        ))}
      </div>
    </>
  )
}
