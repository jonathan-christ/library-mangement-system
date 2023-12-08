import PropTypes from "prop-types"
import { Modal } from 'flowbite-react'
import LoginForm from './forms/LoginForm'

function LoginModal({show, setShow}) {
    return (
        <Modal show={show} size='md' onClose={() => setShow(false)}>
            <Modal.Header className='bg-primary-400 text-white z-10 rounded-t-md'><span className='text-white font-semibold'>Login To Reserve!</span></Modal.Header>
            <Modal.Body className='flex -mt-10 bg-background-50  rounded-lg'>
                <LoginForm modal showModal={setShow} />
            </Modal.Body>
        </Modal>
    )
}

LoginModal.propTypes = {
  setShow: PropTypes.func,
  show: PropTypes.bool
}

export default LoginModal