import { BrowserRouter, Routes, Route } from 'react-router-dom'

import SignUp from './pages/signup'
import Login from './pages/login'
import NotFound from './pages/NotFound'

// function App() {
//   const [users, setUsers] = useState([{}])

//   useEffect(() => {
//     axios("/api").then(
//       response => setUsers(response.data)
//     )
//   }, [])

//   return (
//     <div>
//       {typeof users.users === 'undefined'?(
//         <p>Loading...</p>
//       ) : (
//         users.users.map((user, i)=>{
//           return <p key={i}>{user}</p>
//         })
//       )}
//     </div>
//   )
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GENERAL ACCESS */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Route frame with children as homepage */}

        <Route path="*" element={<NotFound/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default App