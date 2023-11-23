import React from 'react'
import validator from 'validator'
import axios from 'axios'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { DevTool } from '@hookform/devtools'

import { Banner, Button, Label, TextInput, Alert, Textarea } from 'flowbite-react'
import { maxNameLen, maxSuffixLen, minPassLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, notEmail, passNotMatch, charOnly, belowMinChar } from '../../../assets/formErrorMsg'
import StatusHandler from '../../misc/StatusHandler'

function AddAuthorForm() {
    const [formStatus, setFormStatus] = useState(0)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addAuthor = async (data) => {
        let exists = await authorExists(data)
        if (!exists) {
            await axios.post("/api/authors/create", { data })
                .then(() => {
                    reset()
                    setFormStatus(200)
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            setFormStatus(402)
        }

    }

    const authorExists = async (data) => {
        let retVal
        await axios.post("/api/authors/find", { fname: data.fname, lname: data.lname })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                setFormStatus(404)
            })
        return retVal
    }

    return (
        <>
            <StatusHandler subject={"Author"} code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(addAuthor)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fname" value="First Name" />
                            </div>
                            <TextInput id="fname" type="text" {...register('fname', {
                                required: emptyMsg('author\'s first name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.fname?.message}</p>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="lname" value="Last Name" />
                            </div>
                            <TextInput id="lname" type="text" {...register('lname', {
                                required: emptyMsg('author\'s last name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.lname?.message}</p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="comment" value="Your message" />
                        </div>
                        <Textarea id="comment" placeholder="Leave a comment..." required rows={4}  {...register('bio')} />
                    </div>
                    <Button type="submit">Add New Author</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddAuthorForm