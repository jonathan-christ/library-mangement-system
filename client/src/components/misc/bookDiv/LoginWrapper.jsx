import LoginForm from "../../forms/LoginForm"

function LoginWrapper() {
    return (
        <div className="w-full h-full bg-secondary-50 rounded-r-lg rounded-l-3xl shadow-md overflow-hidden  p-10">
            <h2 className="text-2xl text-white font-semibold mb-4 text-center p-3 bg-primary-300 rounded-lg">Existing User?</h2>
            <LoginForm />
        </div>
    )
}

export default LoginWrapper