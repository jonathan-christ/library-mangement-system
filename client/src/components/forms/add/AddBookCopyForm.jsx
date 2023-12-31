import axios from 'axios'
import PropTypes from 'prop-types'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import Select from 'react-select'
import { Button, Label } from 'flowbite-react'
import { emptyMsg } from '../../../assets/formErrorMsg'
import { toast } from 'react-toastify'

AddBookCopyForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddBookCopyForm({ refreshDependency }) {
    const [books, setBooks] = useState([])
    const [submitted, setSubmitted] = useState(false)
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
                return { value: { id: book.id, bcn: book.baseCallNumber }, label: book.title }
            }))
        }).catch((err) => {
            console.log(err)
        })
    }

    const addCopy = async (data) => {
        await axios.post("/api/copies/create", { bookID: data.book.id, callNumber: data.book.bcn })
            .then(() => {
                reset()
                toast.success('Book copy has been added!')
                setSubmitted(false)
                refreshDependency ? refreshDependency(true) : ''
            }).catch((err) => {
                console.log(err)
                toast.error('Book copy cannot be created! Server error')
            })

    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(addCopy)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="books" value="What is the book's identity?" />
                            </div>
                            <Controller
                                id="books"
                                name="book"
                                control={control}
                                render={({ field: { onChange }, value }) => (
                                    <Select
                                        options={books}
                                        value={books.find((c) => c.value === value) || watch('book') ? value : []}
                                        onChange={(elem) => onChange(elem.value)}
                                    />
                                )}
                                rules={{ required: emptyMsg('book copy\'s identity') }}
                            />
                            <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.message}</p>
                        </div>
                    </div>
                    <Button type="submit" onClick={()=>{
                    setSubmitted(true)
                }} disabled={submitted}>Add New Copy</Button>
                </form>
            </div>
        </>
    )
}

export default AddBookCopyForm