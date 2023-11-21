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
import Authors from './pages/staff/Authors'
import Publishers from './pages/staff/Publishers'
import BookOverseer from './pages/staff/BookOverseer'

// ADMIN
import AdminGuard from './pages/admin/AdminGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Book from './pages/user/Book'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GENERAL ACCESS */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route element={<UserFrame />}>
          {/* USERS */}
          <Route path="catalog" element={<UserGuard element={<Home />} />} />
          <Route path="catalog/:isbn" element={<UserGuard element={<Book />} />} />
          <Route path="history" element={<UserGuard element={<History />} />} />
          <Route path="reservations" element={<UserGuard element={<Reservations />} />} />

          {/* STAFF */}
          <Route path="dashboard" element={<StaffGuard element={<StaffDashboard />} />} />
          <Route path="authors" element={<StaffGuard element={<Authors />} />} />
          <Route path="publishers" element={<StaffGuard element={<Publishers />} />} />
          <Route path="books" element={<StaffGuard element={<BookOverseer />} />} />

          {/* ADMINS */}
          <Route path="admindash" element={<AdminGuard element={<AdminDashboard />} />} />
        </Route>
        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App