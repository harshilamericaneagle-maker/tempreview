export function ReviewTable({ reviews, onSelect }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Platform</th>
            <th>Rating</th>
            <th>Sentiment</th>
            <th>Status</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-cell">No reviews found</td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review.id} onClick={() => onSelect(review.id)}>
                <td>
                  <strong>{review.customerName}</strong>
                  <div className="muted clamp-1">{review.reviewText}</div>
                </td>
                <td>{review.platform}</td>
                <td>{review.rating}/5</td>
                <td><span className={`pill ${review.sentiment}`}>{review.sentiment}</span></td>
                <td><span className={`pill ${review.status}`}>{review.status}</span></td>
                <td>{review.location}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
