"use client";

import axios from 'axios'

import { Table, Button, Badge, Modal } from 'flowbite-react'
import { useState, useEffect, useMemo } from 'react'
import { MdEdit, MdDelete } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"

import StatusHandler from '../../../misc/StatusHandler'
import UpdateUserForm from '../../update/UpdateUserForm'
import SignUpForm from '../../add/SignUpForm'

function UserTable() {
    const [userList, setUserList] = useState([])
    const [action, setAction] = useState("retrieved")
    const [status, setStatus] = useState(0)

    const [deleteShow, setDeleteShow] = useState(false)
    const [addShow, setAddShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [modalData, setModalData] = useState({})


    useEffect(() => {
        getUsers()
    }, [updateShow, addShow])

    const getUsers = () => {
        axios.get("api/users/").then((res) => {
            setUserList(res.data)
        }).catch((err) => {
            console.log(err)
            setStatus(200)
        })
    }

    const deleteUser = (id) => {
        axios.post("api/users/delete", { id: id })
            .then(() => {
                getUsers()
                setAction("deleted")
                setStatus(200)
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

    const getType = (id) => {
        switch (id) {
            case 1:
                return <Badge color={"gray"} size="x9l" className='flex justify-center'>Guest</Badge>
            case 2:
                return <Badge color={"info"} size="x9l" className='flex justify-center'>Student</Badge>
            case 3:
                return <Badge color={"indigo"} size="x9l" className='flex justify-center'>Teacher</Badge>
            case 4:
                return <Badge color={"yellow"} size="x9l" className='flex justify-center'>Staff</Badge>
            case 5:
                return <Badge color={"failure"} size="x9l" className='flex justify-center'>Admin</Badge>
        }
    }

    const userCells = useMemo(() =>
        userList.map((user, idx) => {
            return (
                <Table.Row key={idx} className={"hover:bg-slate-200 border h-full truncate" + ((idx % 2 == 0) ? "bg-slate-100" : "bg-gray")}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {user.lastName}
                    </Table.Cell>
                    <Table.Cell>{user.firstName}</Table.Cell>
                    <Table.Cell>{user.middleName ?? user.middleName[0] + "."}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell className='mx-5'>{getType(user.typeID)}</Table.Cell>
                    <Table.Cell>
                        <Button.Group>
                            <Button color='warning' size='sm' onClick={() => { callUpdate(user) }}>
                                <MdEdit size={20} />
                            </Button>
                            <Button color='failure' size='sm' onClick={() => { callDelete(user) }}>
                                <MdDelete size={20} />
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )
        })
        , [userList])


    return (
        <div>
            {/* MODALS */}
            <Modal show={addShow} onClose={() => setAddShow(false)}>
                <Modal.Header>ADD USER</Modal.Header>
                <Modal.Body className='p-5'>
                    <SignUpForm />
                </Modal.Body>
            </Modal>
            <Modal show={updateShow} onClose={() => setUpdateShow(false)}>
                <Modal.Header>UPDATE USER</Modal.Header>
                <Modal.Body className='p-5'>
                    <UpdateUserForm user={modalData} />
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

            <StatusHandler subject={"User/s"} action={action} code={status} dismiss={setStatus} />
            <div className="p-10">
                <Button color='info' size="xl" onClick={() => setAddShow(1)}>Add User</Button>
                <Table className='bg-white shadow-lg'>
                    <Table.Head className='shadow-lg text-md text-black'>
                        <Table.HeadCell className='p-5'>Last Name</Table.HeadCell>
                        <Table.HeadCell >First Name</Table.HeadCell>
                        <Table.HeadCell >Middle Name</Table.HeadCell>
                        <Table.HeadCell >Email</Table.HeadCell>
                        <Table.HeadCell className=' p-5 flex justify-center'>Type</Table.HeadCell>
                        <Table.HeadCell >Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="gap-1">
                        {userCells}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default UserTable