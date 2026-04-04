import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import DataEntryOperatorPage from './pages/DataEntryOperator.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage  />} />
        <Route path='/dashboard' element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }  />
        <Route path='/admin' element={
          <ProtectedRoute>
            <DataEntryOperatorPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
