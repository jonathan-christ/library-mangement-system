import axios from 'axios'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'
import StatusHandler from '../../misc/StatusHandler'

UpdateAuthorForm.propTypes = {
    author: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateAuthorForm({ author, refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            firstName: author.firstName,
            lastName: author.lastName,
            bio: author.bio
        }
    })

    const getDirtyValues = (data) => {
        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => {
                return [key, data[key]]
            }))
    }

    const updateAuthor = async (data) => {
        let exists =
            (data.firstName !== author.firstName) &&
            (data.lastName !== author.lastName) ? await authorExists(data) : ''
        const dirtyValues = getDirtyValues(data)
        if (!exists) {
            await axios.put("/api/authors/update", { author: { ...dirtyValues }, id: author.id })
                .then(() => {
                    const newData = { ...author, ...dirtyValues }
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

    const authorExists = async (data) => {
        let retVal
        await axios.post("/api/authors/find", { fname: data.firstName, lname: data.lastName })
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
            <StatusHandler subject={"Author"} action='updated' code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(updateAuthor)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fname" value="First Name" />
                            </div>
                            <TextInput id="fname" type="text" {...register('firstName', {
                                required: emptyMsg('author\'s first name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.firstName?.message}</p>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="lname" value="Last Name" />
                            </div>
                            <TextInput id="lname" type="text" {...register('lastName', {
                                required: emptyMsg('author\'s last name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.lastName?.message}</p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="comment" value="Your message" />
                        </div>
                        <Textarea id="comment" placeholder="Leave a comment..." required rows={4}  {...register('bio')} />
                    </div>
                    <Button type="submit" disabled={!isDirty}>Update Author</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default UpdateAuthorForm