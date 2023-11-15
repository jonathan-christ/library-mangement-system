import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource-variable/inter'

import AppLayout from './components/AppLayout'

// GENERAL
import SignUp from './pages/general/signup'
import Login from './pages/general/Login'
import NotFound from './pages/general/NotFound'

// USERS
import Home from './pages/user/Home'
import Reservations from './pages/user/Reservations'
import History from './pages/user/History'

function App() {
  return (
    <BrowserRouter basename='/app'>
      <Routes>
        {/* GENERAL ACCESS DAPAT PAGES!!!*/}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Route frame with children as homepage */}
        <Route path='/' element={<AppLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="reservation" element={<Reservations />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App