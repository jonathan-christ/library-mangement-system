import axios from 'axios'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'

import { Button, Label, TextInput } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'
import { toast } from 'react-toastify'

AddPublisherForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddPublisherForm({ refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onTouched' });

    const addPublisher = async (data) => {
        let exists = await publisherExists(data)
        if (!exists) {
            await axios.post("/api/publishers/create", { data })
                .then(() => {
                    refreshDependency ? refreshDependency(true) : ''
                    reset()
                }).catch((err) => {
                    console.log(err)
                    toast.error('Unable to add publisher! Server error')
                })
        } else {
            toast.error('Publisher already exists!')
        }

    }

    const publisherExists = async (data) => {
        let retVal
        await axios.post("/api/publishers/find", { name: data.name })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                toast.error('Unable to retrieve publishers! Server error')
            })
        return retVal
    }

    return (
        <div>
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
        </div>
    )
}

export default AddPublisherForm