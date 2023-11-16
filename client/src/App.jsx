import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource-variable/inter'

import UserFrame from './components/AppFrame'

// GENERAL
import SignUp from './pages/general/signup'
import Login from './pages/general/Login'
import NotFound from './pages/general/NotFound'

// USERS
import UserGuard from './pages/user/UserGuard'
import Home from './pages/user/Home'
import Reservations from './pages/user/Reservations'
import History from './pages/user/History'

// STAFF
import StaffGuard from './pages/staff/StaffGuard'
import StaffDashboard from './pages/staff/StaffDashboard'

// ADMIN
import AdminGuard from './pages/admin/AdminGuard'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GENERAL ACCESS */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<UserFrame />}>
          {/* USERS */}
          <Route path="home" element={<UserGuard element={<Home />} />} />
          <Route path="reservations" element={<UserGuard element={<Reservations />} />} />
          <Route path="history" element={<UserGuard element={<History />} />} />
          {/* STAFF */}
          <Route path="dashboard" element={<StaffGuard element={<StaffDashboard />} />} />
          {/* ADMINS */}
          <Route path="admindash" element={<AdminGuard element={<AdminDashboard />} />} />
        </Route>
        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App