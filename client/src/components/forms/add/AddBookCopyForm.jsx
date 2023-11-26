import axios from 'axios'
import PropTypes from 'prop-types'
import StatusHandler from '../../misc/StatusHandler'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import Select from 'react-select'
import { Button, Label } from 'flowbite-react'
import { emptyMsg } from '../../../assets/formErrorMsg'

AddBookCopyForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddBookCopyForm({ refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const [books, setBooks] = useState([])
    const {
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, },
    } = useForm({ mode: 'onTouched' })

    useEffect(() => {
        getBooks()
    }, [])

    const getBooks = async () => {
        await axios.get("/api/library/books").then((res) => {
            setBooks(res.data.map((book) => {
                return { value: book.id, label: book.title }
            }))
        }).catch((err) => {
            console.log(err)
        })
    }

    const addCopy = async (data) => {
        let exists = await copyExists(data)
        if (!exists) {
            await axios.post("/api/copies/create", data)
                .then(() => {
                    reset()
                    setFormStatus(200)
                    refreshDependency ? refreshDependency(true) : ''
                }).catch((err) => {
                    console.log(err)
                    setFormStatus(500)
                })
        } else {
            setFormStatus(402)
        }

    }

    const copyExists = async (data) => {
        let retVal
        await axios.post("/api/copies/find", { name: data.name })
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
            <StatusHandler subject={"Book copy"} code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(addCopy)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="books" value="What is the book's identity?" />
                            </div>
                            <Controller
                                id="books"
                                name="bookID"
                                control={control}
                                render={({ field: { onChange }, value }) => (
                                    <Select
                                        options={books}
                                        value={books.find((c) => c.value === value) || watch('bookID') ? value : []}
                                        onChange={(elem) => onChange(elem.value)}
                                    />
                                )}
                                rules={{ required: emptyMsg('book copy\'s identity') }}
                            />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.bookID?.message}</p>
                        </div>
                    </div>
                    <Button type="submit">Add New Copy</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddBookCopyForm