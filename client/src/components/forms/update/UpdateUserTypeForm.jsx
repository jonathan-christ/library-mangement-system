import axios from 'axios'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

import { toast } from 'react-toastify'


UpdateUserTypeForm.propTypes = {
    userType: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateUserTypeForm({ userType, refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            title: userType.title,
            description: userType.description
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateUserType = async (data) => {
        let exists = data.title !== userType.title ? await userTypeExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/usertypes/update", { usertype: { ...dirtyValues }, id: userType.id })
                .then(() => {
                    const newData = { ...userType, ...dirtyValues }
                    reset(newData)

                    refreshDependency ? refreshDependency(true) : ''
                    toast.success('User type has been updated!')
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            toast.error('User type already exists!')
        }

    }

    const userTypeExists = async (data) => {
        let retVal
        await axios.post("/api/usertypes/find", { title: data.title })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                toast.error('Unable to retrieve user types! Server Error')
            })
        return retVal
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(updateUserType)} className="flex max-w-md flex-col gap-4" noValidate>
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
                    <Button type="submit" disabled={!isDirty}>Update User Type</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default UpdateUserTypeForm