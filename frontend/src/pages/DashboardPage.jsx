import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { StatCard } from '../components/StatCard'
import { SectionCard } from '../components/SectionCard'
import { ReviewTable } from '../components/ReviewTable'
import { ReviewDetail } from '../components/ReviewDetail'
import { SimpleForm } from '../components/SimpleForm'

export function DashboardPage({ user, onLogout }) {
  const [stats, setStats] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)
  const [activity, setActivity] = useState([])
  const [settings, setSettings] = useState(null)
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const reviewPlatforms = useMemo(() => [...new Set(reviews.map((review) => review.platform))], [reviews])

  async function loadAll() {
    const [statsData, reviewsData, activityData, settingsData] = await Promise.all([
      api.getStats(),
      api.getReviews({ search, platform: platformFilter }),
      api.getActivity(),
      api.getSettings(),
    ])
    setStats(statsData)
    setReviews(reviewsData)
    setActivity(activityData)
    setSettings(settingsData)
    if (reviewsData.length && !selectedId) {
      setSelectedId(reviewsData[0].id)
    }
  }

  useEffect(() => {
    loadAll().catch((error) => setStatusMessage(error.message))
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setSelectedReview(null)
      return
    }
    api.getReview(selectedId).then(setSelectedReview).catch((error) => setStatusMessage(error.message))
  }, [selectedId])

  async function refreshReviews() {
    const data = await api.getReviews({ search, platform: platformFilter })
    setReviews(data)
    if (selectedId) {
      const current = data.find((item) => item.id === selectedId)
      if (!current && data.length) setSelectedId(data[0].id)
    }
    setStats(await api.getStats())
    setActivity(await api.getActivity())
  }

  async function handleSearch() {
    await refreshReviews()
  }

  async function handleCreateReview(payload) {
    await api.createReview({ ...payload, rating: Number(payload.rating) })
    setStatusMessage('Review created')
    await refreshReviews()
  }

  async function handleGenerateDraft(review) {
    const result = await api.createAiDraft(review)
    return result.draft
  }

  async function handleSubmitResponse(id, response) {
    await api.respondToReview(id, { response })
    setStatusMessage('Response saved')
    await refreshReviews()
    setSelectedReview(await api.getReview(id))
  }

  async function handleCreateRequest(payload) {
    await api.createRequest({ ...payload, delayHours: Number(payload.delayHours || 2) })
    setStatusMessage('Review request queued')
    setStats(await api.getStats())
    setActivity(await api.getActivity())
  }

  async function handleCreateFeedback(payload) {
    await api.createFeedback({ ...payload, score: Number(payload.score) })
    setStatusMessage('Feedback saved')
    setStats(await api.getStats())
    setActivity(await api.getActivity())
  }

  async function handleUpdateSettings(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const payload = {
      companyName: formData.get('companyName'),
      brandVoice: formData.get('brandVoice'),
      npsThreshold: Number(formData.get('npsThreshold')),
      defaultReviewPlatform: formData.get('defaultReviewPlatform'),
    }
    const data = await api.updateSettings(payload)
    setSettings(data)
    setStatusMessage('Settings updated')
    setActivity(await api.getActivity())
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Review Management Dashboard</h1>
          <div className="muted">Signed in as {user.fullName}</div>
        </div>
        <div className="button-row">
          <button className="secondary" onClick={loadAll}>Refresh</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      {statusMessage ? <div className="status-banner">{statusMessage}</div> : null}

      <div className="stat-grid">
        <StatCard label="Total Reviews" value={stats?.totalReviews ?? '-'} />
        <StatCard label="Responded" value={stats?.respondedReviews ?? '-'} />
        <StatCard label="Negative Reviews" value={stats?.negativeReviews ?? '-'} />
        <StatCard label="Average Rating" value={stats?.averageRating ?? '-'} />
        <StatCard label="Review Requests" value={stats?.reviewRequests ?? '-'} />
        <StatCard label="Private Feedback" value={stats?.privateFeedbackCount ?? '-'} />
      </div>

      <div className="layout-grid">
        <div className="main-column">
          <SectionCard
            title="Reviews"
            actions={
              <div className="button-row compact-row">
                <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                  <option value="">All Platforms</option>
                  {reviewPlatforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
                </select>
                <button onClick={handleSearch}>Apply</button>
              </div>
            }
          >
            <ReviewTable reviews={reviews} onSelect={setSelectedId} />
          </SectionCard>

          <SimpleForm
            title="Add Review"
            submitLabel="Create Review"
            onSubmit={handleCreateReview}
            fields={[
              { name: 'platform', label: 'Platform', defaultValue: settings?.defaultReviewPlatform || 'Google' },
              { name: 'customerName', label: 'Customer Name' },
              { name: 'customerEmail', label: 'Customer Email', type: 'email' },
              { name: 'location', label: 'Location' },
              { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
              { name: 'sourceUrl', label: 'Source URL' },
              { name: 'reviewText', label: 'Review Text', type: 'textarea' },
            ]}
          />

          <SimpleForm
            title="Queue Review Request"
            submitLabel="Queue Request"
            onSubmit={handleCreateRequest}
            fields={[
              { name: 'customerName', label: 'Customer Name' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Phone' },
              { name: 'channel', label: 'Channel', defaultValue: 'email' },
              { name: 'delayHours', label: 'Delay Hours', type: 'number', min: 0, defaultValue: 2 },
              { name: 'platform', label: 'Platform', defaultValue: settings?.defaultReviewPlatform || 'Google' },
            ]}
          />

          <SimpleForm
            title="NPS / Private Feedback"
            submitLabel="Save Feedback"
            onSubmit={handleCreateFeedback}
            fields={[
              { name: 'customerName', label: 'Customer Name' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'score', label: 'Score (0-10)', type: 'number', min: 0, max: 10, defaultValue: settings?.npsThreshold || 7 },
              { name: 'issueCategory', label: 'Issue Category' },
              { name: 'details', label: 'Details', type: 'textarea' },
            ]}
          />

          {settings ? (
            <div className="card">
              <h2>Settings</h2>
              <form className="form-grid" onSubmit={handleUpdateSettings}>
                <label>
                  Company Name
                  <input name="companyName" defaultValue={settings.companyName} />
                </label>
                <label>
                  Brand Voice
                  <input name="brandVoice" defaultValue={settings.brandVoice} />
                </label>
                <label>
                  NPS Threshold
                  <input name="npsThreshold" type="number" min="0" max="10" defaultValue={settings.npsThreshold} />
                </label>
                <label>
                  Default Review Platform
                  <input name="defaultReviewPlatform" defaultValue={settings.defaultReviewPlatform} />
                </label>
                <div className="full-width">
                  <button type="submit">Update Settings</button>
                </div>
              </form>
            </div>
          ) : null}
        </div>

        <div className="side-column">
          <ReviewDetail
            review={selectedReview}
            onGenerateDraft={handleGenerateDraft}
            onSubmitResponse={handleSubmitResponse}
          />

          <SectionCard title="Recent Activity">
            <div className="activity-list">
              {activity.length === 0 ? <div className="muted">No activity yet</div> : activity.map((item) => (
                <div key={item.id} className="activity-item">
                  <strong>{item.action}</strong>
                  <div className="muted">{item.actor} • {new Date(item.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
