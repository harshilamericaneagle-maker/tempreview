import { useEffect, useState } from 'react'
import { api } from './api'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'

export default function App() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    return token && user ? { token, user: JSON.parse(user) } : null
  })

  useEffect(() => {
    if (!session) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }, [session])

  async function handleLogin(credentials) {
    const data = await api.login(credentials)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    setSession({ token: data.accessToken, user: data.user })
  }

  function handleLogout() {
    setSession(null)
  }

  if (!session) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardPage user={session.user} onLogout={handleLogout} />
}
