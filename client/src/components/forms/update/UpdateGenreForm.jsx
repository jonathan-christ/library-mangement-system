import axios from 'axios'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

import { toast } from 'react-toastify'


UpdateGenreForm.propTypes = {
    genre: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateGenreForm({ genre, refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            name: genre.name,
            description: genre.description
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateGenre = async (data) => {
        let exists = genre.name !== data.name ? await genreExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/genres/update", { genre: { ...dirtyValues }, id: genre.id })
                .then(() => {
                    const newData = { ...genre, ...dirtyValues }
                    reset(newData)

                    refreshDependency ? refreshDependency(true) : ''
                    toast.success('Genre has been updated!')
                }).catch((err) => {
                    toast.error('Unable to update genre! Server Error')
                    console.log(err)
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
                toast.error('Unable to retrieve genres! Server Error')
            })
        return retVal
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(updateGenre)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Name" />
                            </div>
                            <TextInput id="name" type="text" {...register('name', {
                                required: emptyMsg('Genre name'),
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
                    <Button type="submit" disabled={!isDirty}>Update Genre</Button>
                </form>
            </div>
        </>
    )
}

export default UpdateGenreForm