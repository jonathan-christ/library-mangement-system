import axios from 'axios'
import PropTypes from 'prop-types'
import StatusHandler from '../../misc/StatusHandler'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { Button, Label, FileInput, TextInput } from 'flowbite-react'
import { useSession } from '../../context-hooks/session/SessionUtils'

AddImageForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddImageForm({ refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const formData = new FormData()
    const id = useSession().id
    const {
        register,
        handleSubmit,
        reset,
        control,
    } = useForm({ mode: 'onTouched' })

    const addImage = async (data) => {
        formData.append('bookImg', data.image[0])
        formData.append('title', data.title)
        formData.append('uploaderID', id)
        console.log(formData)
        await axios.post("/api/images/create", formData, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        })
            .then(() => {
                new FormData()
                reset()
                setFormStatus(200)
                refreshDependency ? refreshDependency(true) : ''
            }).catch((err) => {
                console.log(err)
                setFormStatus(500)
            })

    }

    return (
        <>
            <StatusHandler subject={"Image"} code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(addImage)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="file" value="Upload File" />
                        </div>
                        <FileInput id="file" {...register('image')} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="title" value="Enter Title" />
                        </div>
                        <TextInput id="title" {...register('title')} />
                    </div>
                    <Button type="submit">Upload Book Image</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddImageForm