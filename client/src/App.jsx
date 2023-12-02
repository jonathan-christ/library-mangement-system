import { SessionProvider } from './components/context-hooks/session/SessionContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
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
import UserFines from './pages/user/UserFines'

// STAFF
import StaffGuard from './pages/staff/StaffGuard'
import StaffDashboard from './pages/staff/StaffDashboard'
import ConfirmUsers from './pages/staff/ConfirmUsers'
import UpdateTicket from './pages/staff/UpdateTicket'
import FineList from './pages/staff/FineList'

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
import Copies from './pages/admin/Copies'
import FineCategs from './pages/admin/FineCategs'
import Tickets from './pages/admin/Tickets'
import Fines from './pages/admin/Fines'


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
            <Route path="userfines" element={<UserGuard element={<UserFines />} />} />
            <Route path="reservations" element={<UserGuard element={<Reservations />} />} />

            {/* STAFF */}
            <Route path="dashboard" element={<StaffGuard element={<StaffDashboard />} />} />
            <Route path="userconfirm" element={<StaffGuard element={<ConfirmUsers />} />} />
            <Route path="updateticket" element={<StaffGuard element={<UpdateTicket />} />} />
            <Route path="finelist" element={<StaffGuard element={<FineList />} />} />

            {/* ADMINS */}
            <Route path="admindash" element={<AdminGuard element={<AdminDashboard />} />} />
            <Route path="users" element={<AdminGuard element={<Users />} />} />

            <Route path="tickets" element={<AdminGuard element={<Tickets />} />} />
            <Route path="fines" element={<AdminGuard element={<Fines />} />} />

            <Route path="books" element={<AdminGuard element={<Books />} />} />
            <Route path="copies" element={<AdminGuard element={<Copies />} />} />

            <Route path="genres" element={<AdminGuard element={<Genres />} />} />
            <Route path="authors" element={<AdminGuard element={<Authors />} />} />
            <Route path="subjects" element={<AdminGuard element={<Subjects />} />} />
            <Route path="publishers" element={<AdminGuard element={<Publishers />} />} />

            <Route path="classes" element={<AdminGuard element={<Classifications />} />} />
            <Route path="usertypes" element={<AdminGuard element={<UserTypes />} />} />
            <Route path="finecategs" element={<AdminGuard element={<FineCategs />} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SessionProvider>
      <ToastContainer position='top-right' theme='colored'/>
    </BrowserRouter>
  )
}

export default App