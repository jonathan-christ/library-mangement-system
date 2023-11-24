import { Navigate } from 'react-router-dom'

function NotFound() {

  return (
    <span>
      <h1>404</h1>
      {"Looks like your page isn't found"}
      <br /><br />
      <Navigate to={"/catalog"}/>
    </span>
  )
}

export default NotFound