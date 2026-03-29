import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login.jsx'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<LoginPage  />} />
      </Routes>
    </div>
  )
}

export default App
