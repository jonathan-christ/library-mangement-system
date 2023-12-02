import axios from 'axios'

import { Table, Button, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import AddBookForm from '../../add/AddBookForm'
import UpdateBookForm from '../../update/UpdateBookForm'

function BookTable() {
    const [refresh, setRefresh] = useState(true)

    const [books, setBooks] = useState([])
    const [authors, setAuthors] = useState([])
    const [genres, setGenres] = useState([])
    const [subjects, setSubjects] = useState([])
    const [publishers, setPublishers] = useState([])
    const [classifications, setClasses] = useState([])
    const [images, setImages] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})

    const components = { authors, genres, subjects, publishers, classifications, images }

    useEffect(() => {
        getBooks()
        getAuthors()
        getGenres()
        getSubjects()
        getPublishers()
        getClasses()
        getImages()

        setRefresh(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])

    const getBooks = () => {
        axios.get("api/library/books")
            .then((res) => {
                setBooks(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve books! Server Error')
            })
    }

    const getClasses = () => {
        axios.get("api/class/")
            .then((res) => {
                setClasses(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve classes! Server Error')
            })
    }

    const getGenres = () => {
        axios.get("api/genres/")
            .then((res) => {
                setGenres(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve genres! Server Error')
            })
    }

    const getPublishers = () => {
        axios.get("api/publishers/")
            .then((res) => {
                setPublishers(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve publishers! Server Error')
            })
    }

    const getSubjects = () => {
        axios.get("api/subjects/")
            .then((res) => {
                setSubjects(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve subjects! Server Error')
            })
    }

    const getAuthors = () => {
        axios.get("api/authors/")
            .then((res) => {
                setAuthors(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve authors! Server Error')
            })
    }

    const getImages = async () => {
        await axios.get("api/images/")
            .then((res) => {
                setImages(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve images! Server Error')
            })
        console.log(images)
    }

    const deleteBook = (id) => {
        axios.post("api/books/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('Book has been deleted!')
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to delete book! Server Error')
            })
    }

    const callUpdate = (data) => {
        setModalData(data)
        setUpdateShow(true)
    }

    const callDelete = (data) => {
        setModalData(data)
        setDeleteShow(true)
    }

    const copyCells = useMemo(() =>
        books.map((book, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate " + ((idx % 2 == 0) ? "" : "bg-gray-200")}>
                    <Table.Cell>{book.title ?? book.bookID}</Table.Cell>
                    <Table.Cell>{book.baseCallNumber ?? book.id}</Table.Cell>
                    <Table.Cell>{book.pages}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(book) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(book) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [books])


    return (
        <div>
            {/* MODALS */}
            <>
                <Modal show={addShow} onClose={() => setAddShow(false)}>
                    <Modal.Header>ADD BOOK</Modal.Header>
                    <Modal.Body className='p-5'>
                        <AddBookForm refreshDependency={setRefresh} />
                    </Modal.Body>
                </Modal>
                <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                    <Modal.Header>UPDATE BOOK</Modal.Header>
                    <Modal.Body className='p-5'>
                        <UpdateBookForm book={modalData} components={components} refreshDependency={setRefresh} />
                    </Modal.Body>
                </Modal>
                <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                    <Modal.Body className='flex flex-col p-5 justify-center'>
                        <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                        <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete {modalData.title}?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {
                                deleteBook(modalData.id)
                                setDeleteShow(false)
                            }}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setDeleteShow(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
            <div className="p-10">
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add Copy</Button>
                <Table className='bg-white shadow-lg w-max'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Book Title</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Call Number</Table.HeadCell>
                        <Table.HeadCell className='p-5'>Pages</Table.HeadCell>
                        <Table.HeadCell className=' p-5 text-center'>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {copyCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default BookTable