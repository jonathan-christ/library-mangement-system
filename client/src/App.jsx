import { SessionProvider } from './components/SessionContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource-variable/inter'

import UserFrame from './components/AppFrame'

// GENERAL
import SignUp from './pages/general/signup'
import Login from './pages/general/Login'
import NotFound from './pages/general/NotFound'
import Home from './pages/user/Home'
import Book from './pages/user/Book'

// USERS
import UserGuard from './pages/user/UserGuard'
import Profile from './pages/general/Profile'
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


function App() {
  console.log("app")
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          {/* GENERAL ACCESS */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route element={<UserFrame />}>
            <Route path="catalog" element={<Home />} />
            <Route path="catalog/:isbn" element={<Book />} />

            {/* USERS */}
            <Route path="profile" element={<UserGuard element={<Profile />} softlock />} />
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
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App