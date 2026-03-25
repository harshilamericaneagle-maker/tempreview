import { useState } from 'react'

export function ReviewDetail({ review, onGenerateDraft, onSubmitResponse }) {
  const [response, setResponse] = useState(review?.latestResponse?.responseText || '')
  const [loading, setLoading] = useState(false)

  if (!review) {
    return <div className="card">Select a review to see details.</div>
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const draft = await onGenerateDraft(review)
      setResponse(draft)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await onSubmitResponse(review.id, response)
  }

  return (
    <div className="card sticky-card">
      <h2>{review.customerName}</h2>
      <div className="muted">{review.platform} • {review.location}</div>
      <div className="detail-rating">Rating: {review.rating}/5</div>
      <p>{review.reviewText}</p>
      <div className="detail-row">
        <span className={`pill ${review.sentiment}`}>{review.sentiment}</span>
        <span className={`pill ${review.status}`}>{review.status}</span>
      </div>
      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          Response
          <textarea rows="6" value={response} onChange={(e) => setResponse(e.target.value)} />
        </label>
        <div className="button-row">
          <button type="button" className="secondary" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate AI Draft'}
          </button>
          <button type="submit">Save Response</button>
        </div>
      </form>
    </div>
  )
}
