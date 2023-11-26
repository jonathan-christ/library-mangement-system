import { SessionProvider } from './components/context-hooks/session/SessionContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource-variable/inter'

import UserFrame from './components/AppFrame'

// GENERAL
import SignUp from './pages/general/signup'
import Login from './pages/general/Login'
import NotFound from './pages/general/NotFound'
import Book from './pages/general/Book'
import Catalog from './pages/general/Catalog'

// USERS
import UserGuard from './pages/user/UserGuard'
import Profile from './pages/general/Profile'
import Reservations from './pages/user/Reservations'
import History from './pages/user/History'

// STAFF
import StaffGuard from './pages/staff/StaffGuard'
import StaffDashboard from './pages/staff/StaffDashboard'

// ADMIN
import AdminGuard from './pages/admin/AdminGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Users from './pages/admin/Users'
import UserTypes from './pages/admin/UserTypes'
import Authors from './pages/admin/Authors'
import Publishers from './pages/admin/Publishers'
import Books from './pages/admin/Books'
import Genres from './pages/admin/Genres'
import Subjects from './pages/admin/Subjects'
import Classifications from './pages/admin/Classifications'
import Images from './pages/admin/Images'
import Copies from './pages/admin/Copies'


function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          {/* GENERAL ACCESS */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route element={<UserFrame />}>
            <Route path="catalog" element={<Catalog />} />
            <Route path="catalog/:isbn" element={<Book />} />

            {/* USERS */}
            <Route path="profile" element={<UserGuard element={<Profile />} softlock />} />
            <Route path="history" element={<UserGuard element={<History />} />} />
            <Route path="reservations" element={<UserGuard element={<Reservations />} />} />

            {/* STAFF */}
            <Route path="dashboard" element={<StaffGuard element={<StaffDashboard />} />} />

            {/* ADMINS */}
            <Route path="admindash" element={<AdminGuard element={<AdminDashboard />} />} />
            <Route path="users" element={<AdminGuard element={<Users />} />} />
            <Route path="usertypes" element={<AdminGuard element={<UserTypes />} />} />
            <Route path="books" element={<AdminGuard element={<Books />} />} />
            <Route path="images" element={<AdminGuard element={<Images />} />} />
            <Route path="copies" element={<AdminGuard element={<Copies />} />} />
            <Route path="genres" element={<AdminGuard element={<Genres />} />} />
            <Route path="authors" element={<AdminGuard element={<Authors />} />} />
            <Route path="classes" element={<AdminGuard element={<Classifications />} />} />
            <Route path="subjects" element={<AdminGuard element={<Subjects />} />} />
            <Route path="publishers" element={<AdminGuard element={<Publishers />} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App