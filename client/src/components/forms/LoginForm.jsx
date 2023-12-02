import axios from 'axios'
import ls from 'localstorage-slim'

import { ttl } from '../../assets/constants'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { emptyMsg } from '../../assets/formErrorMsg'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react'

import { useSession, useSessionUpdate } from '../context-hooks/session/SessionUtils'
import { toast } from 'react-toastify'

function LoginForm() {
    const [formErr, setFormErr] = useState("")
    const session = useSession()
    const setSession = useSessionUpdate()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const loginUser = (data) => {

        axios.post("/api/users/login", { email: data.email, password: data.password })
            .then(res => {
                let status = res.data.status
                if (status === 'pass_match') {
                    delete res.data.data.password
                    delete res.data.data.createDate
                    delete res.data.data.lastLoginDate
                    ls.set("userData", JSON.stringify(res.data.data), { ttl: ttl, encrypt: true })
                    setSession(JSON.parse(ls.get('userData', { decrypt: true })))
                    toast.success('Logged in!')
                    reset()
                    setFormErr("")
                    navigate('../catalog')
                } else {
                    setFormErr('User not found or credential mismatch')
                }
            })

    }

    return (
        <div>
            {session &&
                <Navigate to="/catalog" />
            }
            <form onSubmit={handleSubmit(loginUser)} className="flex max-w-md flex-col gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" autoComplete='email' {...register('email', {
                        required: emptyMsg('email')
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.email?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput id="password1" type="password" autoComplete='current-password' {...register('password', {
                        required: emptyMsg('password')
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.password?.message}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                </div>
                <Button type="submit">Login</Button>
                <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{formErr}</p>
                <span className='text-sm'>
                    {`Aren't a member yet?`} <Link to="/signup"><u>Sign up here</u></Link><br />
                    <Link to="/home"><u>Browse as Guest</u></Link>
                </span>
            </form>
        </div>
    )
}

export default LoginForm