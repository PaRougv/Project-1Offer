import { useEffect, useState } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import API_URL from './config/api.js'
import Home from './pages/Home.jsx'
import LoginPage from './pages/Login.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import DataEntryOperatorPage from './pages/DataEntryOperator.jsx'
import PlantHeadPage from './pages/PlantHead.jsx'
import HODManagementPage from './pages/HODManagement.jsx'

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation()
  const [status, setStatus] = useState('checking')
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true

    axios.get(`${API_URL}/auth/me`, { withCredentials: true })
      .then(({ data }) => {
        if (active) {
          setUser(data.user)
          setStatus('authenticated')
        }
      })
      .catch(() => {
        if (active) setStatus('unauthenticated')
      })

    return () => { active = false }
  }, [])

  if (status === 'checking') {
    return <div style={{ minHeight: '100vh', background: '#101316' }} />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const destination = user.role === 'PLANT_HEAD' ? '/plant-head' : user.role === 'HOD' ? '/dashboard' : '/admin'
    return <Navigate to={destination} replace />
  }

  return children
}

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage  />} />
        <Route path='/dashboard' element={
          <ProtectedRoute allowedRoles={['HOD', 'PLANT_HEAD']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path='/plant-head' element={<ProtectedRoute allowedRoles={['PLANT_HEAD']}><PlantHeadPage /></ProtectedRoute>} />
        <Route path='/hod/manage' element={<ProtectedRoute allowedRoles={['HOD']}><HODManagementPage /></ProtectedRoute>} />
        <Route path='/admin' element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DataEntryOperatorPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
