import axios from 'axios'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'

import StatusHandler from '../../misc/StatusHandler'


UpdateGenreForm.propTypes = {
    genre: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateGenreForm({ genre, refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
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
                    setFormStatus(200)
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            setFormStatus(402)
        }

    }

    const genreExists = async (data) => {
        let retVal
        await axios.post("/api/genres/find", { name: data.name })
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
            <StatusHandler subject={"Genre"} action='updated' code={formStatus} dismiss={setFormStatus} />
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
                <DevTool control={control} />
            </div>
        </>
    )
}

export default UpdateGenreForm