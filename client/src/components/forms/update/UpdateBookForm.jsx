import axios from 'axios';
import Select from 'react-select'
import validator from 'validator'
import PropTypes from 'prop-types'

import { imageProxy, supportedImageExtensions } from '../../../assets/constants';
import { DevTool } from '@hookform/devtools'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { maxBookLen, maxISBNLen, minISBNLen } from '../../../assets/constants'
import { emptyMsg, exceedCharLimit, belowMinChar } from '../../../assets/formErrorMsg'
import { Button, Label, Textarea, TextInput, Datepicker, Radio, FileInput } from 'flowbite-react'
import { useSession } from '../../context-hooks/session/SessionUtils';
import StatusHandler from '../../misc/StatusHandler'

UpdateBookForm.propTypes = {
    book: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    refreshDependency: PropTypes.func
}
function UpdateBookForm({ book, components, refreshDependency }) {
    const userData = useSession()
    const [formStatus, setFormStatus] = useState(0)

    const authors = components.authors.map((author) => {
        return {
            value: author.id, label: author.firstName + ' ' + author.lastName
        }
    })
    const genres = components.genres.map((genre) => {
        return { value: genre.id, label: genre.name }
    })
    const subjects = components.subjects.map((subject) => {
        return { value: subject.id, label: subject.name }
    })
    const publishers = components.publishers.map((publisher) => {
        return { value: publisher.id, label: publisher.name }
    })
    const classifications = components.classifications.map((classif) => {
        return { value: classif.id, label: classif.name }
    })
    const images = components.images.map((image) => {
        return { value: image.id, label: image.title, link: image.imgLink }
    })
    const [file, setFile] = useState(imageProxy + images.find(c => c.value === book.imageID).link)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        defaultValues: {
            select: 'select',
            'book.isbn': book.isbn,
            'book.title': book.title,
            'book.description': book.description,
            'book.pages': book.pages,
            'book.classificationID': book.classificationID,
            'book.publisherID': book.publisherID,
            'book.publishDate': book.publishDate,

            'image.select': book.imageID,
            authors: book.authors.map((author) => author.id),
            genres: book.genres.map((genre) => genre.id),
            subjects: book.subjects.map((subject) => subject.id)
        }
    })

    const updateBook = async (data) => {
        let submitData, header
        const dirtyValues = getDirtyValues(data)
        if (data.select === 'select') {
            submitData = { data: { ...dirtyValues, id: book.id } }
        } else {
            submitData = new FormData()
            // dirtyValues.authors ? submitData.append('authors', dirtyValues.authors) : ''
            // dirtyValues.genres ? submitData.append('genres', dirtyValues.genres) : ''
            // dirtyValues.subjects ? submitData.append('subjects', dirtyValues.subjects) : ''
            // dirtyValues.classificationID ? submitData.append('classificationID', dirtyValues.classificationID) : ''
            submitData.append('uploaderID', userData.id)
            submitData.append('bookImg', dirtyValues.image.upload[0])
            submitData.append('title', dirtyValues.image.title)
            submitData.append('id', book.id)
            console.log(dirtyValues)
            for (var key in dirtyValues) {
                if (key == 'book' || key == 'image') continue
                submitData.append(key, dirtyValues[key])
            }
            for (var bkey in dirtyValues.book) {
                submitData.append('book.' + bkey, dirtyValues.book[bkey]);
            }
            header = {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            }
        }
        console.log(submitData)
        await axios.post("api/library/books/update", submitData, header)
            .then(() => {
                const newData = { ...data, ...dirtyValues }
                reset(newData)

                refreshDependency ? refreshDependency(true) : ''
                setFormStatus(200)
            }).catch((err) => {
                console.log(err)
                setFormStatus(404)
            })
    }

    const bookExists = async (isbn) => {
        if (isbn === book.isbn) return false
        const result = await axios.post("api/books/find", { isbn })
            .then(res => {
                return res.data.status === 'found' ? true : false
            }).catch(() => {
                setFormStatus(402)
            })

        return result
    }

    const getDirtyValues = (data, field = dirtyFields) => {
        return Object.fromEntries(
            Object.keys(field).map(key => {
                console.log(+"asad" + key)
                if (key === 'book') {
                    console.log('book keys')
                    return [key, getDirtyValues(data.book, dirtyFields.book)]
                } else {
                    return [key, data[key]]
                }
            }))
    }

    const filePreview = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const isImg = (val) => {
        const fileExtension = val[0].name.split('.').pop().toLowerCase()
        return supportedImageExtensions.includes(fileExtension);
    }

    return (
        <div>
            <StatusHandler subject={"Book"} code={formStatus} dismiss={setFormStatus} />
            <form onSubmit={handleSubmit(updateBook)} className="flex max-w-md flex-col gap-4">
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
                                defaultValue={book.authors.map((auth) => {
                                    return (authors.find((c) => c.value === auth.id))
                                })}
                                isMulti
                                options={authors}
                                value={authors.find((c) => c.value === value) || watch('authors') ? value : []}
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
                                defaultValue={book.genres.map((genre) => {
                                    return (genres.find((c) => c.value === genre.id))
                                })}
                                options={genres}
                                value={genres.find((c) => c.value === value) || watch('genres') ? value : []}
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
                                defaultValue={book.subjects.map((subj) => {
                                    return (subjects.find((c) => c.value === subj.id))
                                })}
                                options={subjects}
                                value={subjects.find((c) => c.value === value) || watch('subjects') ? value : []}
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
                                defaultValue={publishers.find(c => c.value === book.publisherID)}
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
                        name="book.classificationID"
                        control={control}
                        render={({ field: { onChange }, value }) => (
                            <Select
                                options={classifications}
                                defaultValue={classifications.find(c => c.value === book.classificationID)}
                                value={classifications.find((c) => c.value === value) || watch('book.classificationID') ? value : []}
                                onChange={(elem) => onChange(elem.value)}
                            />
                        )}
                        rules={{ required: emptyMsg('book\'s classification') }}
                    />
                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.book?.classificationID?.message}</p>
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
                                defaultDate={new Date(book.publishDate)}
                                onSelectedDateChanged={(date) => onChange(date)}
                                maxDate={new Date()}
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

                <div >
                    <fieldset id="imgSelection" className='flex flex-col gap-3'>
                        <div className="mb-2 block">
                            <Label htmlFor="imgSelection" value="Image Source" />
                        </div>
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
                        <div className='flex flex-col gap-3'>
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
                                                defaultValue={images.find(c => c.value === book.imageID)}
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
                                <div className='mb-3 flex flex-col gap-3'>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="file" value="Upload File" />
                                        </div>
                                        <FileInput id="file" {...register("image.upload", {
                                            required: emptyMsg('book\'s image'),
                                            validate: {
                                                fileType: val => isImg(val) || "File is not of image type!"
                                            }
                                        })} onChange={filePreview} />
                                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.image?.upload?.message}</p>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="title" value="Enter Title" />
                                        </div>
                                        <TextInput id="title" {...register('image.title', {
                                            required: emptyMsg('book\'s image title'),
                                        })} />
                                    </div>
                                    <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.image?.title?.message}</p>
                                </div>
                            }
                            <img src={file} />
                        </div>
                    </fieldset>
                </div>
                <Button type="submit" disabled={!isDirty}>Update Book</Button>
            </form >
            <DevTool control={control} />
        </div >
    )
}

export default UpdateBookForm