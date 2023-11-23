import React from 'react'
import validator from 'validator'
import axios from 'axios'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { DevTool } from '@hookform/devtools'

import { Banner, Button, Label, TextInput, Alert, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'
import StatusHandler from '../../misc/StatusHandler'

function AddPublisherForm() {
    const [formStatus, setFormStatus] = useState(0)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' });

    const addPublisher = async (data) => {
        let exists = await publisherExists(data)
        console.log(exists)
        if (!exists) {
            await axios.post("/api/publishers/create", { data })
                .then(() => {
                    reset()
                }).catch((err) => {
                    console.log(err)
                    setFormStatus(404)
                })
        } else {
            setFormStatus(402)
        }

    }

    const publisherExists = async (data) => {
        let retVal
        await axios.post("/api/publishers/find", { name: data.name })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                setFormStatus(400)
            })
        return retVal
    }

    return (
        <div>
            <StatusHandler subject={"Publisher"} code={formStatus} dismiss={setFormStatus} />
            <form onSubmit={handleSubmit(addPublisher)} className="flex max-w-md flex-col gap-4" noValidate>
                <div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="pname" value="Publisher Name" />
                        </div>
                        <TextInput id="pname" type="text" {...register('name', {
                            required: emptyMsg('publisher\'s name'),
                            maxLength: {
                                value: maxNameLen,
                                message: exceedCharLimit(maxNameLen)
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.name?.message}</p>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="address" value="Publisher Address" />
                        </div>
                        <TextInput id="address" type="text" {...register('address', {
                            required: emptyMsg('publisher\'s address'),
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.address?.message}</p>
                    </div>
                </div>
                <Button type="submit">Add New Publisher</Button>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default AddPublisherForm