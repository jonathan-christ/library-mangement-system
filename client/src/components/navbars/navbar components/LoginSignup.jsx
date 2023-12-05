import PropTypes from "prop-types"
import { Button } from "flowbite-react"

function LoginSignup({functions}) {
    return (
        <div className="bg-transparent  flex flex-row">
            <Button color="none" className="hover:text-text-100 duration-75" onClick={() => functions.navigate('/login')}>Login</Button>
            <Button className="bg-primary-200 duration-75 text-text hover:bg-primary-500" color="none" onClick={() => functions.navigate('/signup')}>Signup</Button>
        </div>
    )
}

LoginSignup.propTypes = {
  functions: PropTypes.shape({
    navigate: PropTypes.func
  })
}

export default LoginSignup