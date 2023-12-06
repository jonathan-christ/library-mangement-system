import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

AddClassificationForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddClassificationForm({ refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addClass = async (data) => {
        let exists = await classExists(data)
        if (!exists) {
            await axios.post("/api/class/create", data)
                .then(() => {
                    reset()
                    toast.success('Classification has been added!')
                    refreshDependency ? refreshDependency(true) : ''
                }).catch((err) => {
                    console.log(err)
                    toast.error('Unable to add classification! Server error')
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
                toast.error('Unable to retrieve classes! Server error')
            })
        return retVal
    }

    return (
        <>
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
            </div>
        </>
    )
}

export default AddClassificationForm