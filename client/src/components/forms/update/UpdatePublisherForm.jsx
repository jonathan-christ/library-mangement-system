import axios from 'axios'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'
import StatusHandler from '../../misc/StatusHandler'

UpdatePublisherForm.propTypes = {
    publisher: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdatePublisherForm({ publisher, refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            name: publisher.name,
            address: publisher.address
        }
    });

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updatePublisher = async (data) => {
        let exists = data.name !== publisher.name ? await publisherExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/publishers/update", { publisher: { ...dirtyValues }, id: publisher.id })
                .then(() => {
                    const newData = { ...publisher, ...dirtyValues }
                    reset(newData)

                    refreshDependency ? refreshDependency(true) : ''
                    setFormStatus(200)
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
            <StatusHandler subject={"Publisher"} action='updated' code={formStatus} dismiss={setFormStatus} />
            <form onSubmit={handleSubmit(updatePublisher)} className="flex max-w-md flex-col gap-4" noValidate>
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
                <Button type="submit" disabled={!isDirty}>Update Publisher</Button>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default UpdatePublisherForm