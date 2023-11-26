import axios from 'axios'
import PropTypes from 'prop-types'
import StatusHandler from '../../misc/StatusHandler'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

AddClassificationForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddClassificationForm({ refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addClass = async (data) => {
        let exists = await classExists(data)
        if (!exists) {
            await axios.post("/api/class/create", data)
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

    const classExists = async (data) => {
        let retVal
        await axios.post("/api/class/find", { name: data.name })
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
                <form onSubmit={handleSubmit(addClass)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Classification Name" />
                            </div>
                            <TextInput id="name" type="text" {...register('name', {
                                required: emptyMsg('Classification name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.name?.message}</p>
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="desc" value="Classification Description" />
                            </div>
                            <Textarea id="desc" placeholder="Enter description" required rows={4}  {...register('description')} />
                        </div>
                    </div>
                    <Button type="submit">Add New Classification</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddClassificationForm