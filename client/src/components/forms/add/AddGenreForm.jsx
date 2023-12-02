import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

AddGenreForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddGenreForm({ refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addGenre = async (data) => {
        let exists = await genreExists(data)
        if (!exists) {
            await axios.post("/api/genres/create", data)
                .then(() => {
                    reset()
                    toast.success('Genre has been added!')
                    refreshDependency ? refreshDependency(true) : ''
                }).catch((err) => {
                    console.log(err)
                    toast.error('Unable to add genre! Server error')
                })
        } else {
            toast.error('Genre already exists!')
        }

    }

    const genreExists = async (data) => {
        let retVal
        await axios.post("/api/genres/find", { name: data.name })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                toast.error('Unable to retrieve genres! Server error')
            })
        return retVal
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(addGenre)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="First Name" />
                            </div>
                            <TextInput id="name" type="text" {...register('name', {
                                required: emptyMsg('Genre Name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.name?.message}</p>
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="desc" value="Genre Description" />
                            </div>
                            <Textarea id="desc" placeholder="Enter description" required rows={4}  {...register('description')} />
                        </div>
                    </div>
                    <Button type="submit">Add New Genre</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddGenreForm