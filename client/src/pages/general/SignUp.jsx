import BookDiv from '../../components/misc/bookDiv/BookDiv'
import LogoPage from '../../components/misc/bookDiv/LogoPage'
import SignUpWrapper from '../../components/misc/bookDiv/SignUpWrapper'

function SignUp() {
    return (
        <div className='bg-primary-700 h-full flex justify-center md:p-10 py-10'>
            <BookDiv leftChild={<LogoPage lines={11} />} rightChild={<SignUpWrapper />} />
        </div>
    )
}

export default SignUp