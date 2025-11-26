import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPages from './pages/LoginPages'
import RecoveryPages from './pages/RecoveryPages'
import RecoveryOTPPages from './pages/RecoveryOTPPages'
import RecoveryDonePages from './pages/RecoveryDonePages'
import DashboardAdminPages from './pages/DashboardAdminPages'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LoginPages/>}/>
        <Route path="/recovery" element={<RecoveryPages/>}/>
        <Route path="/recovery/OTP" element={<RecoveryOTPPages/>}/>
        <Route path="/recovery/done" element={<RecoveryDonePages/>}/>
        <Route path='/dashboard' element={<DashboardAdminPages/>}/>
        
      </Routes>
     </Router>
    </>
  )
}

export default App
