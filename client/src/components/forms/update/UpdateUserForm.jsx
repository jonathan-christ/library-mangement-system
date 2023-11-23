import React from 'react'
import validator from 'validator'
import axios from 'axios'
import ls from 'localstorage-slim'
import { ttl } from '../../../assets/constants'
import StatusHandler from '../../misc/StatusHandler'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { DevTool } from '@hookform/devtools'

import { Banner, Button, Label, TextInput, Alert } from 'flowbite-react'
import { maxNameLen, maxSuffixLen, minPassLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, notEmail, passNotMatch, charOnly, belowMinChar } from '../../../assets/formErrorMsg'

import { getSession, updateSession } from '../../SessionContext'

function UpdateUserForm({ user, profile }) {
    const [formStatus, setFormStatus] = useState(0)
    const session = getSession()
    const setSession = updateSession()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, isDirty, isValid, dirtyFields },
    } = useForm({
        defaultValues: {
            fname: user.firstName,
            lname: user.lastName,
            mname: user.middleName,
            suffix: user.suffix,
            sex: user.sex,
            email: user.email
        }
    })

    const updateUser = async (data) => {
        const dirtyValues = getDirtyValues(data)
        await axios.put("/api/users/update", { user: { ...dirtyValues }, id: user.id })
            .then(() => {
                if (profile) {
                    ls.clear()
                    ls.set("userData", { ...session, ...dirtyValues }, { ttl: ttl, encrypt: true })
                    setSession(ls.get("userData", { decrypt: true }))
                }
                reset()
                setFormStatus(200)
            }).catch((err) => {
                console.log(err)
                setFormStatus(404)
            })
    }

    const getDirtyValues = (data) => {
        return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, data[key]]))
    }

    const userExists = async (email) => {
        let exists = false
        await axios.post("/api/users/find", { email: email })
            .then(res => {
                if (res.data.status === 'found') {
                    exists = true
                }
            }).catch(() => {
                setFormStatus(402)
            })

        return exists
    }

    return (
        <div>
            <StatusHandler subject={"User"} action={"updated"} code={formStatus} dismiss={setFormStatus} />
            <form onSubmit={handleSubmit(updateUser)} className="flex max-w-md flex-col gap-4" noValidate>
                <div>
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
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Sex</h3>
                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                            <div className="flex items-center ps-3">
                                <input id="male" type="radio" value="male" {...register('sex', {
                                    required: emptyMsg('sex')
                                })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                <label htmlFor="male" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male </label>
                            </div>
                        </li>
                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                            <div className="flex items-center ps-3">
                                <input id="female" type="radio" value="female" {...register('sex', {
                                    required: emptyMsg('sex')
                                })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                <label htmlFor="female" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                            </div>
                        </li>
                    </ul>
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.sex?.message}</p>
                </div>

                <div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput id="email2" type="email" placeholder="name@flowbite.com" {...register('email', {
                            required: emptyMsg('email'),
                            validate: {
                                format: val => validator.isEmail(val) || notEmail(),
                                exists: async (val) => ((dirtyFields.email ?? true) || await userExists(val) == false) || "User exists!"
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.email?.message}</p>
                    </div>
                </div>
                <Button type="submit" disabled={!isDirty}>Update Accout</Button>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default UpdateUserForm