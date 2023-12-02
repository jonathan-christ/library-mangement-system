"use client";

import axios from 'axios'
import validator from 'validator'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { DevTool } from '@hookform/devtools'

import { Button, Label, Radio, TextInput } from 'flowbite-react'
import { maxNameLen, maxSuffixLen, minPassLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, notEmail, passNotMatch, belowMinChar } from '../../../assets/formErrorMsg'
import { toast } from 'react-toastify'

SignUpForm.propTypes = {
    refreshDependency: PropTypes.func
}
function SignUpForm({refreshDependency}) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const signupUser = async (data) => {
        delete data.rePass
        await axios.post("/api/users/create", { data })
            .then(() => {
                refreshDependency ? refreshDependency(true) : ''
                reset()
                toast.success('User has been registered!')
            }).catch(() => {
                toast.error('User cannot be created! Server error')
            })
    }

    async function userExists(email) {
        let exists = false
        await axios.post("/api/users/find", { email: email })
            .then(res => {
                if (res.data.status === 'found') {
                    exists = true
                }
            }).catch(() => {
                toast.error('User cannot be created! Server error')
            })

        return exists
    }

    return (
        <div>
            <form onSubmit={handleSubmit(signupUser)} className="flex max-w-md flex-col gap-4" noValidate>
                <div className='flex flex-col gap-3'>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="fname" value="First Name" />
                        </div>
                        <TextInput id="fname" type="text" {...register('fname', {
                            required: emptyMsg('first name'),
                            maxLength: {
                                value: maxNameLen,
                                message: exceedCharLimit(maxNameLen)
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.fname?.message}</p>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="mname" value="Middle Name" />
                        </div>
                        <TextInput id="mname" type="text" {...register('mname', {
                            maxLength: {
                                value: maxNameLen,
                                message: exceedCharLimit(maxNameLen)
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.mname?.message}</p>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="lname" value="Last Name" />
                        </div>
                        <TextInput id="lname" type="text" {...register('lname', {
                            required: emptyMsg('last name'),
                            maxLength: {
                                value: maxNameLen,
                                message: exceedCharLimit(maxNameLen)
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.lname?.message}</p>
                    </div>
                    <div className='grid grid-cols-2 gap-5'>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="suffix" value="Suffix" />
                            </div>
                            <TextInput id="suffix" type="text" {...register('suffix', {
                                maxLength: {
                                    value: maxSuffixLen,
                                    message: exceedCharLimit(maxSuffixLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.suffix?.message}</p>
                        </div>
                        <div>
                            <h3 className="mb-[6px] text-gray-900 dark:text-white">Sex</h3>
                            <ul className="items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <Radio id="male" value="male" {...register('sex', {
                                            required: emptyMsg('sex')
                                        })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                        <Label htmlFor="male" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Male </Label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <Radio id="female" value="female" {...register('sex', {
                                            required: emptyMsg('sex')
                                        })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                        <Label htmlFor="female" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Female</Label>
                                    </div>
                                </li>
                            </ul>
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.sex?.message}</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput id="email2" type="email" placeholder="name@flowbite.com" {...register('email', {
                            required: emptyMsg('email'),
                            validate: {
                                format: val => validator.isEmail(val) || notEmail(),
                                exists: async (val) => await userExists(val) == false || "User exists!"
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.email?.message}</p>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password2" value="Your password" />
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
                </div>
                <Button type="submit">Register new account</Button>
                <span className='text-sm'>
                    Already have an account? <Link to="/login"><u>Login here</u></Link><br />
                    <Link to="/home"><u>Browse as Guest</u></Link>
                </span>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default SignUpForm