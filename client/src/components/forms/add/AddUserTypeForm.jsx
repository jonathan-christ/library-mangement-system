import axios from 'axios'
import PropTypes from 'prop-types'
import StatusHandler from '../../misc/StatusHandler'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

AddUserTypeForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddUserTypeForm({ refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addUserType = async (data) => {
        let exists = await userTypeExists(data)
        if (!exists) {
            await axios.post("/api/usertypes/create", data)
                .then(() => {
                    reset()
                    setFormStatus(200)
                    refreshDependency ? refreshDependency(true) : ''
                }).catch((err) => {
                    console.log(err)
                    setFormStatus(500)
                })
        } else {
            setFormStatus(402)
        }

    }

    const userTypeExists = async (data) => {
        let retVal
        await axios.post("/api/usertypes/find", { title: data.title })
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
            <StatusHandler subject={"User type"} code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(addUserType)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="title" value="User Type Title" />
                            </div>
                            <TextInput id="title" type="text" {...register('title', {
                                required: emptyMsg('User Type Title'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.title?.message}</p>
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="desc" value="Type Description" />
                            </div>
                            <Textarea id="desc" placeholder="Enter description" required rows={4}  {...register('description')} />
                        </div>
                    </div>
                    <Button type="submit">Add New User Type</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddUserTypeForm