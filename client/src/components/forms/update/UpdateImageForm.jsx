import axios from 'axios'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

import StatusHandler from '../../misc/StatusHandler'


UpdateImageForm.propTypes = {
    image: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateImageForm({ image, refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            title: image.title,
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateImage = async (data) => {
        let exists = image.title !== data.title ? await imageExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/images/update", { title: dirtyValues.title, id: image.id })
                .then(() => {
                    const newData = { ...image, ...dirtyValues }
                    reset(newData)

                    refreshDependency ? refreshDependency(true) : ''
                    setFormStatus(200)
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            setFormStatus(402)
        }

    }

    const imageExists = async (data) => {
        let retVal
        await axios.post("/api/images/find", { title: data.title })
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
            <StatusHandler subject={"Image"} action='updated' code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(updateImage)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="title" value="Name" />
                        </div>
                        <TextInput id="title" type="text" {...register('title', {
                            required: emptyMsg('Image title'),
                            maxLength: {
                                value: maxNameLen,
                                message: exceedCharLimit(maxNameLen)
                            }
                        })} shadow />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.title?.message}</p>
                    </div>
                    <Button type="submit" disabled={!isDirty}>Update Image</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default UpdateImageForm