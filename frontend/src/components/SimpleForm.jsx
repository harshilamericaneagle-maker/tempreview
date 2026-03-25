import { useState } from 'react'

export function SimpleForm({ title, fields, onSubmit, submitLabel = 'Save' }) {
  const initialState = fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
      setForm(initialState)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        {fields.map((field) => (
          <label key={field.name} className={field.type === 'textarea' ? 'full-width' : ''}>
            {field.label}
            {field.type === 'textarea' ? (
              <textarea
                rows="4"
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                min={field.min}
                max={field.max}
              />
            )}
          </label>
        ))}
        <div className="full-width">
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : submitLabel}</button>
        </div>
      </form>
    </div>
  )
}
