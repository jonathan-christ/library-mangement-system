import React from 'react'
import axios from 'axios';
import Select from 'react-select'
import validator from 'validator'

import { DevTool } from '@hookform/devtools'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { maxBookLen, maxISBNLen, maxNameLen, minISBNLen } from '../../assets/constants'
import { emptyMsg, exceedCharLimit, notEmail, passNotMatch, charOnly, belowMinChar } from '../../assets/formErrorMsg'
import { Button, Label, Textarea, TextInput, Datepicker } from 'flowbite-react'

function AddBookForm() {
    const [formStatus, setFormStatus] = useState(0)
    const [authors, setAuthors] = useState([])
    const [genres, setGenres] = useState([])
    const [publishers, setPublishers] = useState([])
    const {
        register,
        handleSubmit,
        watch,
        reset,
        resetField,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' });


    useEffect(() => {
        getPublishers()
        getAuthors()
        getGenres()
    }, [])

    const getAuthors = async () => {
        await axios.get("api/authors/find")
            .then(res => {
                setAuthors(res.data.map((auth) => {
                    let name = auth.firstName + " " + auth.lastName
                    return { value: auth.id, label: name }
                }))
            })
    }

    const getPublishers = async () => {
        await axios.get("api/publishers/find")
            .then(res => {
                setPublishers(res.data.map((pub) => {
                    return { value: pub.id, label: pub.name }
                }))
            }).catch(() => {
                setFormStatus(402)
            })
    }

    const getGenres = async () => {
        await axios.get("api/genres/find")
            .then(res => {
                setGenres(res.data.map((genre) => {
                    return { value: genre.id, label: genre.name }
                }))
            }).catch(() => {
                setFormStatus(402)
            })
    }

    const addBook = async (data) => {
        await axios.post("api/library/books/add", { data })
            .then(res => {
                reset()
                resetField("publisherID")
            })
    }

    const bookExists = async (isbn) => {
        const result = await axios.post("api/books/find", { isbn })
            .then(res => {
                return res.data.status === 'found' ? true : false
            }).catch(() => {
                setStatus(402)
            })

        return result
    }

    return (
        <div>
            <form onSubmit={handleSubmit(addBook)} className="flex max-w-md flex-col gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="isbn" value="Book ISBN" />
                    </div>
                    <TextInput id="isbn" type="text" {...register('isbn', {
                        required: emptyMsg('book\'s ISBN'),
                        minLength: {
                            value: minISBNLen,
                            message: belowMinChar('book\'s ISBN', minISBNLen)
                        },
                        maxLength: {
                            value: maxISBNLen,
                            message: exceedCharLimit(maxISBNLen)
                        },
                        validate: {
                            format: val => validator.isNumeric(val) || "ISBN should be digits",
                            exists: async (val) => await bookExists(val) === false || "Book exists!",
                        },
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.isbn?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="title" value="Book Title" />
                    </div>
                    <TextInput id="title" type="text" {...register('title', {
                        required: emptyMsg('book\'s title'),
                        maxLength: {
                            value: maxBookLen,
                            message: exceedCharLimit(maxBookLen)
                        }
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.title?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bauth" value="Book Author/s" />
                    </div>
                    <Controller
                        id="bauth"
                        name="authors"
                        control={control}
                        render={({ field: { onChange }, value, reset }) => (
                            <Select
                                isMulti
                                options={authors}
                                value={value || watch('authors') ? value : []}
                                onChange={(authors) => onChange(authors.map((author) => {
                                    return author.value
                                }))}
                                isClearable
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s author/s') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.authors?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="genres" value="Book Genre/s" />
                    </div>
                    <Controller
                        id="genres"
                        name="genres"
                        control={control}
                        render={({ field: { onChange }, value, ref }) => (
                            <Select
                                isMulti
                                options={genres}
                                value={value || watch('genres') ? value : []}
                                onChange={(genres) => onChange(genres.map((genre) => {
                                    return genre.value
                                }))}
                                isClearable
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s genres/s') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.genres?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bpub" value="Book Publisher" />
                    </div>
                    <Controller
                        id="bpub"
                        name="publisherID"
                        control={control}
                        render={({ field: { onChange }, value, ref }) => (
                            <Select
                                options={publishers}
                                value={publishers.find((c) => c.value === value) || watch('publisherID') ? value : []}
                                onChange={(elem) => onChange(elem.value)}
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s publisher') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.publisherID?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="pdate" value="Publish Date" />
                    </div>
                    <Controller
                        id="pdate"
                        name="publishDate"
                        control={control}
                        render={({ field: { onChange }, value, ref }) => (
                            <Datepicker
                                placeholder='Select Date'
                                selected={value}
                                onSelectedDateChanged={(date) => onChange(date)}
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s publish date') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.publishDate?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="desc" value="Book Description" />
                    </div>
                    <Textarea id="desc" {...register('desc')} shadow />
                </div>
                <Button type="submit">Add New Book</Button>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default AddBookForm