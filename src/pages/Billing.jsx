import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { invoices } from '../data/mockData.js'

export default function Billing() {
  const [rows, setRows] = useState(invoices)
  const [discount, setDiscount] = useState('')

  // FIX: discount was a string so `sum - discount` did implicit coercion → NaN when empty
  const discountValue = Number(discount) || 0
  const total = rows.reduce((sum, row) => sum + row.amount, 0) - discountValue

  function togglePaid(id) {
    setRows((prev) => prev.map((row) => row.id === id ? { ...row, paid: !row.paid } : row))
  }

  return (
    <>
      <PageHeader eyebrow="Finance" title="Billing" description="Invoices, payment state, and discount calculations." />
      <section className="panel billing-summary">
        <label>
          Discount (£)
          <input
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            placeholder="0"
            type="number"
            min="0"
          />
        </label>
        <strong>Total: £{total.toLocaleString()}</strong>
      </section>
      <div className="invoice-list">
        {rows.map((invoice) => (
          <article className="invoice-card" key={invoice.id}>
            <div><h3>{invoice.id}</h3><p>{invoice.client}</p></div>
            <strong>£{invoice.amount.toLocaleString()}</strong>
            <span className={invoice.paid ? 'pill paid' : 'pill unpaid'}>{invoice.paid ? 'Paid' : 'Due'}</span>
            <button onClick={() => togglePaid(invoice.id)} aria-label={`Mark ${invoice.id} as ${invoice.paid ? 'unpaid' : 'paid'}`}>
              {invoice.paid ? 'Mark unpaid' : 'Mark paid'}
            </button>
          </article>
        ))}
      </div>
    </>
  )
}
