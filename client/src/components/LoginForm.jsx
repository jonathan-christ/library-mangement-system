import React from 'react'

import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from 'react'

function LoginForm() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [err, setErr] = useState("")

    const loginUser = (e) => {
        e.preventDefault()

        if (email.trim().length * pass.trim().length === 0) {
            setErr("Fields must not be left blank")
        }else{
            setErr("")
        }
        alert("["+ email.trim().length + "] " + pass + " " + err)
    }

    return (
        <form className="flex max-w-md flex-col gap-4">
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email1" value="Your email" />
                </div>
                <TextInput id="email1" type="email" placeholder="name@flowbite.com" onChange={(e) => { setEmail(e.target.value) }} required />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="password1" value="Your password" />
                </div>
                <TextInput id="password1" type="password" onChange={(e) => { setPass(e.target.value) }} required />
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit" onClick={loginUser}>Login</Button>
        </form>
    )
}

export default LoginForm