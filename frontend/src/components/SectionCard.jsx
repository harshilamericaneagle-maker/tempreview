export function SectionCard({ title, children, actions }) {
  return (
    <section className="card">
      <div className="section-header">
        <h2>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}
