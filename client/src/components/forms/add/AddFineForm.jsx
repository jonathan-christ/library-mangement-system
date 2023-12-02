import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import Select from 'react-select'
import { Button, Label } from 'flowbite-react'
import { emptyMsg } from '../../../assets/formErrorMsg'

AddFineForm.propTypes = {
    refreshDependency: PropTypes.func
}
function AddFineForm({ refreshDependency }) {
    const [tickets, setTickets] = useState([])
    const [finecategs, setFineCategs] = useState([])

    const showOnly = {
        'borrowed': true,
        'overdue': true
    }
    const {
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm({ mode: 'onTouched' })

    useEffect(() => {
        getTickets()
        getFineCategs()
    }, [])

    const addTicket = async (data) => {
        await axios.post("/api/fines/create", data)
            .then(() => {
                reset()
                toast.success('Ticket has been created!')
                refreshDependency ? refreshDependency(true) : ''
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to create ticket! Server error')
            })

    }

    const getTickets = async () => {
        await axios.post("/api/transactions/tickets")
            .then((res) => {
                setTickets(res.data)
            })
    }

    const getFineCategs = async () => {
        await axios.get("/api/finecategs")
            .then((res) => {
                setFineCategs(res.data)
            })
    }

    const ticketOpts = tickets
        .filter(ticket => showOnly[ticket.status] === true)
        .map(ticket => ({
            value: ticket.id,
            label: ticket.user.userName + ' - ' + ticket.book.title
        }))

    const categOpts = finecategs.map((category) => {
        return (
            { value: category.id, label: category.name }
        )
    })


    return (
        <>
            <div>
                <form onSubmit={handleSubmit(addTicket)} className="flex max-w-md flex-col gap-4" noValidate>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="ticket" value="Select Ticket" />
                        </div>
                        <Controller
                            id="ticket"
                            name="ticketID"
                            control={control}
                            render={({ field: { onChange }, value }) => (
                                <Select
                                    options={ticketOpts}
                                    value={tickets.find((c) => c.value === value) || watch('ticketID') ? value : []}
                                    onChange={(elem) => onChange(elem.value)}
                                    isDisabled={!ticketOpts.length}
                                />
                            )}
                            rules={{ required: emptyMsg('ticket') }}
                        />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.ticketID?.message}</p>
                    </div>
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="finecateg" value="Fine Category" />
                        </div>
                        <Controller
                            id="finecateg"
                            name="categID"
                            control={control}
                            render={({ field: { onChange }, value }) => (
                                <Select
                                    options={categOpts}
                                    value={finecategs.find((c) => c.value === value) || watch('categID') ? value : []}
                                    onChange={(elem) => onChange(elem.value)}
                                />
                            )}
                            rules={{ required: emptyMsg('finecateg') }}
                        />
                        <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.categID?.message}</p>
                    </div>
                    <Button type="submit">Add New Ticket</Button>
                </form>
                <DevTool control={control} />
            </div>
        </>
    )
}

export default AddFineForm