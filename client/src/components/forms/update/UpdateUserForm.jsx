import ls from 'localstorage-slim'
import axios from 'axios'
import validator from 'validator'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import { ttl } from '../../../assets/constants'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Radio, Select } from 'flowbite-react'
import { maxNameLen, maxSuffixLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, notEmail } from '../../../assets/formErrorMsg'

import { useSession, useSessionUpdate } from '../../context-hooks/session/SessionUtils'

UpdateUserForm.propTypes = {
    user: PropTypes.object.isRequired,
    modal: PropTypes.bool,
    profile: PropTypes.bool,
    userTypes: PropTypes.array,
    refreshDependency: PropTypes.func
}

function UpdateUserForm({ user, modal, profile, userTypes, refreshDependency }) {
    const session = useSession()
    const setSession = useSessionUpdate()
    const {
        register,
        handleSubmit,
        // watch,
        reset,
        control,
        formState: { errors, isDirty, dirtyFields },
    } = useForm({
        defaultValues: {
            fname: user.firstName,
            lname: user.lastName,
            mname: user.middleName,
            suffix: user.suffix,
            sex: user.sex,
            email: user.email,
            type: user.typeID
        }
    })

    const updateUser = async (data) => {
        const dirtyValues = getDirtyValues(data)
        await axios.put("/api/users/update", { user: { ...dirtyValues }, id: user.id })
            .then(() => {
                const userDat = profile ? { ...session, ...dirtyValues } : { ...user, ...dirtyValues }
                if (profile) {
                    ls.clear()
                    ls.set("userData", JSON.stringify(userDat), { ttl: ttl, encrypt: true })
                    setSession(JSON.parse(ls.get("userData", { decrypt: true })))
                } else {
                    refreshDependency(true)
                }
                reset(userDat)
                toast.success('User has been updated!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to update user! Server Error')
            })
    }


    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                const name = {
                    'fname': 'firstName',
                    'mname': 'middleName',
                    'lname': 'lastName',
                    'type': 'typeID'
                }
                return [name[key] || key, data[key]]
            }))
    }

    const userTypeOpts = useMemo(() => {
        if (!profile) {
            return userTypes.map((type, idx) => {
                return <option key={idx} value={type.id}>{type.title}</option>
            })
        }
    }, [userTypes, profile])

    const userExists = async (email) => {
        let exists = false
        if ((!profile) ? user.email === email : session.email === email) {
            await axios.post("/api/users/find", { email: email })
                .then(res => {
                    if (res.data.status === 'found') {
                        exists = true
                    }
                }).catch(() => {
                    toast.error('Unable to retrieve users! Server Error')
                })
        }
        return exists
    }

    return (
        <div>
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
                            <p className='mt-2 text-sm text-red-600 dark:text-red-500'>{errors.suffix?.message}</p>
                        </div>
                        <div>
                            <div className="mb-[0.4rem] block">
                                <Label htmlFor="sex" value="Sex" />
                            </div>
                            <ul id='sex' className="items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
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
                <div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput id="email2" type="email" placeholder="name@flowbite.com" {...register('email', {
                            required: emptyMsg('email'),
                            validate: {
                                format: val => validator.isEmail(val) || notEmail(),
                                exists: async (val) => !(dirtyFields.email ? await userExists(val) : false) || "User exists!"
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.email?.message}</p>
                    </div>
                    {!profile &&
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="countries" value="Select your country" />
                            </div>
                            <Select id="type" {...register("type")}>
                                {userTypeOpts}
                            </Select>
                        </div>
                    }
                </div>
                {!modal &&
                    <Button type="submit" disabled={!isDirty}>Update Accout</Button>
                }
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default UpdateUserForm