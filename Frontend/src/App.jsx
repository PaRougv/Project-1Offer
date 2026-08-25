import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LoginPage from './pages/Login.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import DataEntryOperatorPage from './pages/DataEntryOperator.jsx'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage  />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/admin' element={<DataEntryOperatorPage />} />
      </Routes>
    </div>
  )
}

export default App
