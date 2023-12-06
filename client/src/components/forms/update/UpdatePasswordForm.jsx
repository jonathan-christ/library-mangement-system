import axios from 'axios'
import validator from 'validator'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../context-hooks/session/SessionUtils'

import { Button, Label, TextInput } from 'flowbite-react'
import { minPassLen } from '../../../assets/constants'
import { emptyMsg, passNotMatch, belowMinChar } from '../../../assets/formErrorMsg'


function UpdatePasswordForm() {
    const session = useSession()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        // reset,
        formState: { errors, isValid },
    } = useForm({ mode: 'onTouched' })

    const changePass = (data) => {
        delete data.rePass
        axios.put("/api/users/changepass", { id: session.id, password: data.password })
            .then(() => {
                toast.success('Password has been updated!')
                navigate('/profile')
            })
            .catch(() => {
                toast.error('Unable to update password! Server Error')
            })
    }

    const isOldPass = async (pass) => {
        const result = await axios.post("/api/users/verifypass", { id: session.id, password: pass })
            .then((res) => {
                console.log((res.data.status === 'pass_match') == false)
                return res.data.status === 'pass_match'
            })
            .catch((err) => {
                console.log(err)
                return 0
            })

        return result
    }

    return (
        <div>
            <form onSubmit={handleSubmit(changePass)} className="flex max-w-md flex-col gap-4" noValidate>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password2" value="Old Password" />
                    </div>
                    <TextInput id="password2" type="password" {...register('oldPass', {
                        required: emptyMsg('password'),
                        validate: {
                            isNotPassword: async (val) => await isOldPass(val) == true || "Incorrect password."
                        }
                    })} required shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.oldPass?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password2" value="New password" />
                    </div>
                    <TextInput id="password2" type="password" {...register('password', {
                        required: emptyMsg('password'),
                        minLength: {
                            value: minPassLen,
                            message: belowMinChar('Password', minPassLen),
                        },
                        validate: {
                            format: val => validator.isStrongPassword(val, { returnScore: true }) > 30 || "Password needs 1 of each: uppercase, lowercase, symbol"
                        }
                    })} required shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.password?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="repeat-password" value="Repeat password" />
                    </div>
                    <TextInput id="repeat-password" type="password" {...register('rePass', {
                        required: "You need to retype password",
                        validate: {
                            unmatching: val => validator.equals(val, watch('password')) || passNotMatch()
                        }
                    })} required shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.rePass?.message}</p>
                </div>
                <Button type="submit" color='failure' disabled={!isValid}>Reset Password</Button>
            </form >
        </div >
    )
}

export default UpdatePasswordForm