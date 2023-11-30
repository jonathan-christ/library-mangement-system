import axios from 'axios'
import PropTypes from 'prop-types'
import StatusHandler from '../../misc/StatusHandler'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import Select from 'react-select'
import { Button, Label } from 'flowbite-react'
import { emptyMsg } from '../../../assets/formErrorMsg'

AddTicketForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddTicketForm({ refreshDependency }) {
    const [formStatus, setFormStatus] = useState(0)
    const [users, setUsers] = useState([])
    const [books, setBooks] = useState([])
    const {
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    useEffect(() => {
        getUsers()
        getBooks()
    }, [])

    const addTicket = async (data) => {
        await axios.post("/api/transactions/tickets/create", data)
            .then(() => {
                reset()
                setFormStatus(200)
                refreshDependency ? refreshDependency(true) : ''
            }).catch((err) => {
                console.log(err)
                setFormStatus(500)
            })

    }

    const getUsers = async () => {
        await axios.get("/api/users/")
            .then((res) => {
                setUsers(res.data)
            })
    }

    const getBooks = async () => {
        await axios.get("/api/books/hascopies")
            .then((res) => {
                setBooks(res.data)
            })
    }

    const userOpts = users.map((user) => {
        return (
            { value: user.id, label: user.firstName + ' ' + user.lastName }
        )
    })

    const bookOpts = books.map((book) => {
        return (
            { value: book.id, label: book.title }
        )
    })


    return (
        <>
            <StatusHandler subject={"Fine category"} code={formStatus} dismiss={setFormStatus} />
            <div>
                <form onSubmit={handleSubmit(addTicket)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="user" value="Select User" />
                        </div>
                        <Controller
                            id="user"
                            name="id"
                            control={control}
                            render={({ field: { onChange }, value }) => (
                                <Select
                                    options={userOpts}
                                    value={users.find((c) => c.value === value) || watch('id') ? value : []}
                                    onChange={(elem) => onChange(elem.value)}
                                />
                            )}
                            rules={{ required: emptyMsg('user') }}
                        />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.id?.message}</p>
                    </div>
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="book" value="Select Book" />
                        </div>
                        <Controller
                            id="book"
                            name="bookID"
                            control={control}
                            render={({ field: { onChange }, value }) => (
                                <Select
                                    options={bookOpts}
                                    value={books.find((c) => c.value === value) || watch('bookID') ? value : []}
                                    onChange={(elem) => onChange(elem.value)}
                                />
                            )}
                            rules={{ required: emptyMsg('book') }}
                        />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.bookID?.message}</p>
                    </div>
                    <Button type="submit">Add New Ticket</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddTicketForm