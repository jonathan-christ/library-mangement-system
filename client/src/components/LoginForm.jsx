import React from 'react'
import axios from 'axios';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { emptyMsg, notEmail } from '../assets/formErrorMsg'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

function LoginForm() {
    const [formErr, setFormErr] = useState("")
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
                if(status === 'pass_match'){
                    reset()
                    setFormErr("")
                }else{
                    setFormErr('User not found or credential mismatch')
                }
            })

    }

    return (
        <div>
            <form onSubmit={handleSubmit(loginUser)} className="flex max-w-md flex-col gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" {...register('email', {
                        required: emptyMsg('email')
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.email?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput id="password1" type="password"{...register('password', {
                        required: emptyMsg('email')
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.password?.message}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                </div>
                <Button type="submit">Login</Button>
            </form>
            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{formErr}</p>
        </div>
    )
}

export default LoginForm