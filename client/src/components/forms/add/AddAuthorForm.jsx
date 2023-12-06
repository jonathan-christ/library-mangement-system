import axios from 'axios'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'

import { Button, Label, TextInput, Textarea } from 'flowbite-react'
import { maxNameLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit } from '../../../assets/formErrorMsg'
import { toast } from 'react-toastify'

AddAuthorForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddAuthorForm({ refreshDependency }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    const addAuthor = async (data) => {
        let exists = await authorExists(data)
        if (!exists) {
            await axios.post("/api/authors/create", { data })
                .then(() => {
                    reset()
                    refreshDependency ? refreshDependency(true) : ''
                    toast.success('Author has been created!')
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            toast.error('Author cannot be created! Server error')
        }

    }

    const authorExists = async (data) => {
        let retVal
        await axios.post("/api/authors/find", { fname: data.fname, lname: data.lname })
            .then((res) => {
                retVal = res.data.status === 'found'
            }).catch(() => {
                retVal = false
                toast.error('Author cannot be created! Server error')
            })
        return retVal
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(addAuthor)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fname" value="First Name" />
                            </div>
                            <TextInput id="fname" type="text" {...register('fname', {
                                required: emptyMsg('author\'s first name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.fname?.message}</p>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="lname" value="Last Name" />
                            </div>
                            <TextInput id="lname" type="text" {...register('lname', {
                                required: emptyMsg('author\'s last name'),
                                maxLength: {
                                    value: maxNameLen,
                                    message: exceedCharLimit(maxNameLen)
                                }
                            })} shadow />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.lname?.message}</p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="comment" value="Your message" />
                        </div>
                        <Textarea id="comment" placeholder="Leave a comment..." required rows={4}  {...register('bio')} />
                    </div>
                    <Button type="submit">Add New Author</Button>
                </form>
            </div>
        </>
    )
}

export default AddAuthorForm