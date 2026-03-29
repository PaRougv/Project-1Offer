import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<h1>Login</h1>} />
      </Routes>
    </div>
  )
}

export default App
