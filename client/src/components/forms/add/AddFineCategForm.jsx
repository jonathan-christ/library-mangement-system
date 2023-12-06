import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'

import { Button, Label, TextInput, Textarea, Select } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

AddFineCategForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddFineCategForm({ refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addFineCateg = async (data) => {
        let exists = await fineCategExists(data)
        if (!exists) {
            await axios.post("/api/finecategs/create", data)
                .then(() => {
                    reset()
                    toast.success('Fine category has been added!')
                    refreshDependency ? refreshDependency(true) : ''
                }).catch((err) => {
                    console.log(err)
                    toast.error('Unable to add fine category! Server error')
                })
        } else {
            toast.error('Fine category already exists!')
        }

    }

    const fineCategExists = async (data) => {
        let retVal
        await axios.post("/api/finecategs/find", { name: data.name })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                toast.error('Unable to retrieve fine categories! Server error')
            })
        return retVal
    }

    const frequencyOpts = [
        <option key='0' value={'hourly'}>Hourly</option>,
        <option key='1' value={'daily'}>Daily</option >
    ]


    return (
        <>
            <div>
                <form onSubmit={handleSubmit(addFineCateg)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Fine Category" />
                            </div>
                            <TextInput id="name" type="text" {...register('name', {
                                required: emptyMsg('category name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.name?.message}</p>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="amount" value="Fine amount" />
                            </div>
                            <TextInput id="amount" {...register('amount', {
                                required: emptyMsg('fine amount'),
                                min: {
                                    value: 0.01,
                                    message: 'Fee is below minimum amount of 0.01'
                                },
                                max: {
                                    value: 10000,
                                    message: 'Fee is above maximum amount of 10,000'
                                },
                                valueAsNumber: true
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.amount?.message}</p>
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="frequency" value="Additive Frequency" />
                            </div>
                            <Select id="frequency" {...register("frequency", {
                                required: emptyMsg('frequency'),
                            })}>
                                {frequencyOpts}
                            </Select>
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.frequency?.message}</p>
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="desc" value="Fine Description" />
                            </div>
                            <Textarea id="desc" placeholder="Fine description" required rows={4}  {...register('description')} />
                        </div>
                    </div>
                    <Button type="submit">Add New Category</Button>
                </form>
            </div>
        </>
    )
}

export default AddFineCategForm