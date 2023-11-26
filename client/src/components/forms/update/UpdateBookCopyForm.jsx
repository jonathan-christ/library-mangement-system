import axios from 'axios'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, Radio } from 'flowbite-react'
import { emptyMsg } from '../../../assets/formErrorMsg'
import StatusHandler from '../../misc/StatusHandler'

UpdateBookCopy.propTypes = {
    copy: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateBookCopy({ copy, refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            status: copy.status,
            available: copy.available
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateCopy = async (data) => {
        const dirtyValues = getDirtyValues(data)

        await axios.put("/api/copies/update", { copy: { ...dirtyValues }, id: copy.id })
            .then(() => {
                const newData = { ...copy, ...dirtyValues }
                reset(newData)

                refreshDependency ? refreshDependency(true) : ''
                setFormStatus(200)
            }).catch((err) => {
                console.log(err)
                setFormStatus(404)
            })
    }

    return (
        <div>
            <StatusHandler subject={"Copy"} action='updated' code={formStatus} dismiss={setFormStatus} />
            <form onSubmit={handleSubmit(updateCopy)} className="flex max-w-md flex-col gap-4" noValidate>
                <div>
                    <div>
                        <div className="mb-[0.4rem] block">
                            <Label htmlFor="status" value="Copy Status" />
                        </div>
                        <ul id='status' className="items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <Radio id="good" value="good" {...register('status', {
                                        required: emptyMsg('status')
                                    })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                    <Label htmlFor="good" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Good </Label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <Radio id="lost" value="lost" {...register('status', {
                                        required: emptyMsg('status')
                                    })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                    <Label htmlFor="lost" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Lost</Label>
                                </div>
                            </li>
                        </ul>
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.status?.message}</p>
                    </div>
                    <div>
                        <div className="mb-[0.4rem] block">
                            <Label htmlFor="available" value="Availability" />
                        </div>
                        <ul id='available' className="items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <Radio id="yes" value="yes" {...register('available', {
                                        required: emptyMsg('availability')
                                    })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                    <Label htmlFor="yes" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Available </Label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <Radio id="no" value="no" {...register('available', {
                                        required: emptyMsg('availability')
                                    })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                    <Label htmlFor="no" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Unavailable</Label>
                                </div>
                            </li>
                        </ul>
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.available?.message}</p>
                    </div>
                </div>
                <Button type="submit" disabled={!isDirty}>Update Copy</Button>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default UpdateBookCopy