import axios from 'axios'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea, Select } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

import StatusHandler from '../../misc/StatusHandler'


UpdateFineCategForm.propTypes = {
    fineCateg: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateFineCategForm({ fineCateg, refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            name: fineCateg.name,
            amount: fineCateg.amount,
            frequency: fineCateg.frequency,
            description: fineCateg.description
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateFineCateg = async (data) => {
        let exists = fineCateg.name !== data.name ? await fineCategExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/finecategs/update", { fineCateg: { ...dirtyValues }, id: fineCateg.id })
                .then(() => {
                    const newData = { ...fineCateg, ...dirtyValues }
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

    const fineCategExists = async (data) => {
        let retVal
        await axios.post("/api/finecategs/find", { name: data.name })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                setFormStatus(404)
            })
        return retVal
    }

    const frequencyOpts = [
        <option key='0' value={'hourly'}>Hourly</option>,
        <option key='1' value={'daily'}>Daily</option >
    ]

    return (
        <>
            <StatusHandler subject={"Genre"} action='updated' code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(updateFineCateg)} className="flex max-w-md flex-col gap-4" noValidate>
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
                                <Label htmlFor="countries" value="Select your country" />
                            </div>
                            <Select id="type" {...register("frequency")}>
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
                    <Button type="submit" disabled={!isDirty}>Update Fine Category</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default UpdateFineCategForm