import axios from 'axios';
import Select from 'react-select'
import validator from 'validator'

import { DevTool } from '@hookform/devtools'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { maxBookLen, maxISBNLen, minISBNLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, belowMinChar } from '../../../assets/formErrorMsg'
import { Button, Label, Textarea, TextInput, Datepicker } from 'flowbite-react'
import StatusHandler from '../../misc/StatusHandler';

function AddBookForm() {
    const [formStatus, setFormStatus] = useState(0)

    const [authors, setAuthors] = useState([])
    const [genres, setGenres] = useState([])
    const [subjects, setSubjects] = useState([])
    const [publishers, setPublishers] = useState([])
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' });


    useEffect(() => {
        getPublishers()
        getAuthors()
        getGenres()
        getSubjects()
    }, [])


    const getAuthors = async () => {
        await axios.get("api/authors/")
            .then(res => {
                setAuthors(res.data.map((auth) => {
                    let name = auth.firstName + " " + auth.lastName
                    return { value: auth.id, label: name }
                }))
            }).catch(() => {
                setFormStatus(400)
            })
    }

    const getPublishers = async () => {
        await axios.get("api/publishers")
            .then(res => {
                setPublishers(res.data.map((pub) => {
                    return { value: pub.id, label: pub.name }
                }))
            }).catch(() => {
                setFormStatus(400)
            })
    }

    const getGenres = async () => {
        await axios.get("api/genres")
            .then(res => {
                setGenres(res.data.map((genre) => {
                    return { value: genre.id, label: genre.name }
                }))
            }).catch(() => {
                setFormStatus(404)
            })
    }

    const getSubjects = async () => {
        await axios.get("api/subjects")
            .then(res => {
                setSubjects(res.data.map((subject) => {
                    return { value: subject.id, label: subject.title }
                }))
            })
    }

    const addBook = async (data) => {
        await axios.post("api/library/books/add", { data })
            .then(() => {
                reset()
                setFormStatus(200)
            }).catch((err) => {
                console.log(err)
                setFormStatus(404)
            })
    }

    const bookExists = async (isbn) => {
        const result = await axios.post("api/books/find", { isbn })
            .then(res => {
                return res.data.status === 'found' ? true : false
            }).catch(() => {
                setFormStatus(402)
            })

        return result
    }

    return (
        <div>
            <StatusHandler subject={"Book"} code={formStatus} dismiss={setFormStatus} />
            <form onSubmit={handleSubmit(addBook)} className="flex max-w-md flex-col gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="isbn" value="Book ISBN" />
                    </div>
                    <TextInput id="isbn" type="text" {...register('book.isbn', {
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
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.isbn?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="title" value="Book Title" />
                    </div>
                    <TextInput id="title" type="text" {...register('book.title', {
                        required: emptyMsg('book\'s title'),
                        maxLength: {
                            value: maxBookLen,
                            message: exceedCharLimit(maxBookLen)
                        }
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.title?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bauth" value="Book Authors" />
                    </div>
                    <Controller
                        id="bauth"
                        name="authors"
                        control={control}
                        render={({ field: { onChange }, value }) => (
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
                        rules={{ required: emptyMsg('book\'s authors') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.authors?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="genres" value="Book Genres" />
                    </div>
                    <Controller
                        id="genres"
                        name="genres"
                        control={control}
                        render={({ field: { onChange }, value }) => (
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
                        rules={{ required: emptyMsg('book\'s genres') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.genres?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="subjects" value="Book Subjects" />
                    </div>
                    <Controller
                        id="subjects"
                        name="subjects"
                        control={control}
                        render={({ field: { onChange }, value }) => (
                            <Select
                                isMulti
                                options={subjects}
                                value={value || watch('subjects') ? value : []}
                                onChange={(subjects) => onChange(subjects.map((subject) => {
                                    return subject.value
                                }))}
                                isClearable
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s subjects/s') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.subjects?.message}</p>
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="bpub" value="Book Publisher" />
                    </div>
                    <Controller
                        id="bpub"
                        name="book.publisherID"
                        control={control}
                        render={({ field: { onChange }, value }) => (
                            <Select
                                options={publishers}
                                value={publishers.find((c) => c.value === value) || watch('book.publisherID') ? value : []}
                                onChange={(elem) => onChange(elem.value)}
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s publisher') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.publisherID?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="pdate" value="Publish Date" />
                    </div>
                    <Controller
                        id="pdate"
                        name="book.publishDate"
                        control={control}
                        render={({ field: { onChange }, value }) => (
                            <Datepicker
                                placeholder='Select Date'
                                selected={value}
                                onSelectedDateChanged={(date) => onChange(date)}
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s publish date') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.publishDate?.message}</p>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="desc" value="Book Description" />
                    </div>
                    <Textarea id="desc" {...register('book.description')} shadow />
                </div>
                <Button type="submit">Add New Book</Button>
            </form>
            <DevTool control={control} />
        </div>
    )
}

export default AddBookForm