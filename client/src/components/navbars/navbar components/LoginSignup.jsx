import PropTypes from "prop-types"
import { Button, Modal } from "flowbite-react"
import LoginForm from "../../forms/LoginForm"
import { useState } from "react"

function LoginSignup({ functions }) {
  const [loginShow, setLoginShow] = useState(false)

  return (
    <div className="bg-transparent  flex flex-row">
      <Modal show={loginShow} size='md' onClose={() => setLoginShow(false)}>
        <Modal.Header className='bg-primary-400 text-white z-10'><span className='text-white font-semibold'>Login</span></Modal.Header>
        <Modal.Body className='flex -mt-10 bg-background-50'>
          <LoginForm modal showModal={setLoginShow} />
        </Modal.Body>
      </Modal>

      <Button color="none" className="hover:text-text-100 duration-75" onClick={() => setLoginShow(true)}>Login</Button>
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