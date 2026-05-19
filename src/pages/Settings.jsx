import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'

export default function SettingsPage() {
  const [settings, setSettings] = useState({ company: 'Northstar', timezone: 'Europe/London', emails: true, density: 'Comfortable' })
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function update(field) {
    return (e) => setSettings((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Settings" description="Company preferences." />
      <section className="panel settings-form">
        <label>
          Company name
          {/* FIX: was defaultValue (uncontrolled) — now value + onChange */}
          <input value={settings.company} onChange={update('company')} />
        </label>
        <label>
          Timezone
          {/* FIX: was defaultValue (uncontrolled, ignored state changes) — now controlled */}
          <select value={settings.timezone} onChange={update('timezone')}>
            <option>Europe/London</option>
            <option>America/New_York</option>
            <option>Asia/Tokyo</option>
          </select>
        </label>
        <label className="checkbox-line">
          {/* FIX: checkbox was missing onChange — React warned and value was stuck */}
          <input type="checkbox" checked={settings.emails} onChange={update('emails')} />
          Send email reports
        </label>
        <label>
          Density
          <select value={settings.density} onChange={update('density')}>
            <option>Compact</option><option>Comfortable</option><option>Spacious</option>
          </select>
        </label>
        <button className="primary-btn" onClick={save}>Save settings</button>
        {saved && <p className="toast">Settings saved.</p>}
      </section>
    </>
  )
}
