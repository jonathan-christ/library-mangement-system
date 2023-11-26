import axios from 'axios';
import Select from 'react-select'
import validator from 'validator'

import { imageProxy } from '../../../assets/constants';
import { DevTool } from '@hookform/devtools'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { maxBookLen, maxISBNLen, minISBNLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, belowMinChar } from '../../../assets/formErrorMsg'
import { Button, Label, Textarea, TextInput, Datepicker, Radio, FileInput } from 'flowbite-react'
import StatusHandler from '../../misc/StatusHandler'

function AddBookForm() {
    const [formStatus, setFormStatus] = useState(0)
    const [file, setFile] = useState()
    const [images, setImages] = useState([])
    const [authors, setAuthors] = useState([])
    const [genres, setGenres] = useState([])
    const [subjects, setSubjects] = useState([])
    const [publishers, setPublishers] = useState([])
    const [classifications, setClassifications] = useState([])
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
        getImages()
        getClasses()
    }, [])

    const getClasses = async () => {
        await axios.get("api/class/")
            .then(res => {
                setClassifications(res.data.map((classif) => {
                    return { value: classif.id, label: classif.name }
                }))
            }).catch(() => {
                setFormStatus(400)
            })
    }

    const getImages = async () => {
        await axios.get("api/images/")
            .then(res => {
                setImages(res.data.map((img) => {
                    return { value: { value: img.id, link: img.imgLink }, label: img.title }
                }))
            }).catch(() => {
                setFormStatus(400)
            })
    }

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
                    return { value: subject.id, label: subject.name }
                }))
            })
    }

    const addBook = async (data) => {
        let submitData
        if (data.select === 'select') {
            submitData = data
        } else {
            submitData = new FormData()
            submitData.append()
        }
        await axios.post("api/library/books/add", { submitData })
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

    const filePreview = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
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
                        <Label htmlFor="pages" value="Book Pages" />
                    </div>
                    <TextInput id="pages" type="number" {...register('book.pages', {
                        required: emptyMsg('book\'s page count'),
                    })} shadow />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.pages?.message}</p>
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
                        <Label htmlFor="class" value="Book Classification" />
                    </div>
                    <Controller
                        id="class"
                        name="book.classification"
                        control={control}
                        render={({ field: { onChange }, value }) => (
                            <Select
                                options={classifications}
                                value={classifications.find((c) => c.value === value) || watch('book.classification') ? value : []}
                                onChange={(elem) => onChange(elem.value)}
                            />
                        )}
                    />
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

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="imgSelection" value="Image Source" />
                    </div>
                    <fieldset id="imgSelection">
                        <ul className="items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <Radio id="upl" value="upl" {...register('select', {
                                        required: emptyMsg('selection')
                                    })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" selected />
                                    <Label htmlFor="upl" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Upload </Label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <Radio id="select" value="select" {...register('select', {
                                        required: emptyMsg('selection')
                                    })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                                    <Label htmlFor="select" className="w-full py-3 ms-2 text-sm font-medium text-gray-900">Select</Label>
                                </div>
                            </li>
                        </ul>
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.select?.message}</p>
                        <div>
                            {watch('select') === 'select' &&
                                <>
                                    <div className="mb-2 block">
                                        <Label htmlFor="bookImage" value="Select Image" />
                                    </div>
                                    <Controller
                                        id="bookImage"
                                        name="image.select"
                                        control={control}
                                        render={({ field: { onChange }, value }) => (
                                            <Select
                                                options={images}
                                                value={images.find((c) => c.value === value) || watch('image.select') ? value : []}
                                                onChange={(elem) => {
                                                    onChange(elem.value.value)
                                                    setFile(imageProxy + elem.value.link)
                                                }}
                                                isDisabled={watch('select') === 'select' ? null : true}
                                            />
                                        )}
                                    />
                                </>
                            }
                            {watch('select') === 'upl' &&
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="file" value="Upload File" />
                                    </div>
                                    <FileInput id="file" {...register("image.upload")} onChange={filePreview} />
                                </div>
                            }
                            <img src={file} />
                        </div>
                    </fieldset>
                </div>
                <Button type="submit">Add New Book</Button>
            </form >
            <DevTool control={control} />
        </div >
    )
}

export default AddBookForm