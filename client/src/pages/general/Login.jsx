import LogoPage from '../../components/misc/bookDiv/LogoPage'
import LoginWrapper from '../../components/misc/bookDiv/LoginWrapper'
import BookDiv from '../../components/misc/bookDiv/BookDiv'

function Login() {
    return (
        <div className='bg-primary-700 h-screen flex justify-center md:p-10 py-10'>
            <BookDiv leftChild={<LogoPage lines={7} />} rightChild={<LoginWrapper />}/>
        </div>
    )
}

export default Login