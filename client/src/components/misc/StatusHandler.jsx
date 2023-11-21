import React from 'react'
import { Alert } from 'flowbite-react'
import { useState } from 'react'
import { HiInformationCircle, HiCheckCircle } from 'react-icons/hi'

function StatusHandler({ subject, code, dismiss }) {
    let msg, icon, color
    switch (code) {
        case 200:
            msg = `${subject} has been added!`
            color = "success"
            icon = HiCheckCircle
            break
        case 400:
            msg = "Cannot retrieve data!"
            color = "failure"
            icon = HiInformationCircle
            break
        case 402:
            msg = `${subject} already exists!`
            color = "failure"
            icon = HiInformationCircle
            break
        case 404:
            msg = "Server Error!"
            color = "failure"
            icon = HiInformationCircle
            break
        default:
            break
    }

    window.scrollTo(0,0)
    return (
        <>
            <p>
                {!!code &&
                    <Alert color={color} icon={icon} onDismiss={() => dismiss(0)}> {msg} </Alert >
                }
            </p>
        </>
    )
}

export default StatusHandler