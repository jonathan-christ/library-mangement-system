import axios from 'axios'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

import { toast } from 'react-toastify'


UpdateClassForm.propTypes = {
    classification: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateClassForm({ classification, refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            name: classification.name,
            description: classification.description
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateClass = async (data) => {
        let exists = classification.name !== data.name ? await classExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/class/update", { classification: { ...dirtyValues }, id: classification.id })
                .then(() => {
                    const newData = { ...classification, ...dirtyValues }
                    reset(newData)

                    refreshDependency ? refreshDependency(true) : ''
                    toast.success('Classification has been updated!')
                }).catch((err) => {
                    toast.error('Unable to update classification! Server Error')
                    console.log(err)
                })
        } else {
            toast.error('Classification already exists!')
        }

    }

    const classExists = async (data) => {
        let retVal
        await axios.post("/api/class/find", { name: data.name })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                toast.error('Unable to retrieve classifications! Server Error')
            })
        return retVal
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(updateClass)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Class Name" />
                            </div>
                            <TextInput id="name" type="text" {...register('name', {
                                required: emptyMsg('Class name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.name?.message}</p>
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="desc" value="Class Description" />
                            </div>
                            <Textarea id="desc" placeholder="Enter description" required rows={4}  {...register('description')} />
                        </div>
                    </div>
                    <Button type="submit" disabled={!isDirty}>Update Class</Button>
                </form>
            </div>
        </>
    )
}

export default UpdateClassForm