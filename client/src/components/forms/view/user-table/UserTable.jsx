"use client";

import PropTypes from "prop-types"
import axios from 'axios'

import { Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import { toast } from 'react-toastify'
import UpdateUserForm from '../../update/UpdateUserForm'
import SignUpForm from '../../add/SignUpForm'
import TableLayout from "../table/TableLayout";

function UserTable({ staff }) {
    const [refresh, setRefresh] = useState(true)

    const [userList, setUserList] = useState([])
    const [userTypes, setUserTypes] = useState([])

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getUsers()
        getUserTypes()
        setRefresh(false)
    }, [refresh])

    const getUsers = () => {
        axios.get("api/users/").then((res) => {
            const unfiltered = res.data.filter(obj => obj.typeID !== 4 && obj.typeID !== 5);
            setUserList(unfiltered)
        }).catch((err) => {
            console.log(err)
            toast.error('Unable to retrieve users! Server Error')
        })
    }

    const getUserTypes = () => {
        axios.get("api/usertypes/")
            .then((res) => {
                setUserTypes(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to retrieve user types! Server Error')
            })
    }

    const deleteUser = (id) => {
        axios.post("api/users/delete", { id: id })
            .then(() => {
                setRefresh(true)
                toast.success('User has been deleted!')
            })
    }

    const updateType = async (id, type) => {
        await axios.put("api/users/update", { user: { typeID: type }, id: id })
            .then(() => {
                setRefresh(true)
                toast.success('User type has been updated!')
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

    const getType = (id) => ({
        1: <Badge color="gray" size="sm" className="flex justify-center bg-gray-300">Guest</Badge>,
        2: <Badge color="info" size="sm" className="flex justify-center bg-teal-200">Student</Badge>,
        3: <Badge color="indigo" size="sm" className="flex justify-center bg-violet-200">Teacher</Badge>,
        4: <Badge color="yellow" size="sm" className="flex justify-center">Staff</Badge>,
        5: <Badge color="failure" size="sm" className="flex justify-center bg-red-200 text-red-700">Admin</Badge>,
    }[id])

    const columns = [
        { header: 'Last Name', accessorKey: 'lastName' },
        { header: 'First Name', accessorKey: 'firstName' },
        { header: 'Middle Name', accessorKey: 'middleName', cell: row => row.getValue() ? row.getValue() : '' },
        { header: 'E-mail', accessorKey: 'email' },
        { header: 'Type', accessorKey: 'typeID', cell: row => getType(row.getValue()) },
        {
            id: 'actions',
            header: 'Actions',
            accessorKey: 'status',
            cell: row => {
                const user = row.row.original
                return (
                    <div className="flex flex-row gap-2 justify-center items-center">
                        {staff ?
                            <>
                                <Button color='dark' size='xs' className="disabled:hidden" disabled={user.typeID == 1} onClick={() => { updateType(user.id, 1) }}>
                                    Guest
                                </Button>
                                <Button color='info' size='xs' className="disabled:hidden" disabled={user.typeID == 2} onClick={() => { updateType(user.id, 2) }}>
                                    Student
                                </Button>
                                <Button color='purple' size='xs' className="disabled:hidden" disabled={user.typeID == 3} onClick={() => { updateType(user.id, 3) }}>
                                    Teacher
                                </Button>
                            </>
                            :
                            <div className='flex flex-row gap-2 justify-center'>
                                <button className='text-orange-400 hover:text-orange-400 hover:bg-background-100 rounded-lg p-1' onClick={() => { callUpdate(row.row.original) }}>
                                    <MdEdit size={20} />
                                </button>
                                <button className='text-orange-400 hover:text-orange-400 hover:bg-background-100 rounded-lg p-1' onClick={() => { callDelete(row.row.original) }}>
                                    <MdDelete size={20} color='red' />
                                </button>
                            </div>
                        }
                    </div>
                )
            }
        }
    ]

    return (
        <div className="w-full">
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD USER</Modal.Header>
                <Modal.Body className='p-5'>
                    <SignUpForm refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE USER</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateUserForm user={modalData} userTypes={userTypes} refreshDependency={setRefresh} />
                </Modal.Body>
            </Modal>
            <Modal show={deleteShow} size="sm" onClose={() => setDeleteShow(false)}>
                <Modal.Body className='flex flex-col p-5 justify-center'>
                    <RiErrorWarningFill className="mx-auto mb-4 h-20 w-20 text-red-600" />
                    <h3 className="mb-5 flex justify-center text-center text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {modalData.firstName}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            deleteUser(modalData.id)
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

            <TableLayout data={userList} columns={columns} addShow={!(staff) ? setAddShow : null} />
        </div>
    )
}

UserTable.propTypes = {
    staff: PropTypes.bool
}

export default UserTable