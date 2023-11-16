import React from 'react'
import axios from 'axios';

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { emptyMsg } from '../../assets/formErrorMsg';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

function AddBookForm() {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' });

    const addBook = async (data) => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit(addBook)} className="flex max-w-md flex-col gap-4">
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
                    Aren't a member yet? <Link to="/signup"><u>Sign up here</u></Link><br />
                    <Link to="/home"><u>Browse as Guest</u></Link>
                </span>
            </form>
        </div>
    )
}

export default AddBookForm