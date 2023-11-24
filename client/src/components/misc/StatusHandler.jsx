import { Alert } from 'flowbite-react'
import { HiInformationCircle, HiCheckCircle } from 'react-icons/hi'
import PropTypes from 'prop-types'

StatusHandler.propTypes = {
    subject: PropTypes.string.isRequired,
    action: PropTypes.string,
    code: PropTypes.number.isRequired,
    dismiss: PropTypes.func.isRequired
}
function StatusHandler({ subject, action, code, dismiss }) {
    action = action ? action : "added"
    let msg, icon, color
    switch (code) {
        case 200:
            msg = `${subject} has been ${action}!`
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
            msg = "Server response not found!"
            color = "failure"
            icon = HiInformationCircle
            break
        default:
            msg = "Server Error!"
            color = "failure"
            icon = HiInformationCircle
            break
    }

    window.scrollTo(0, 0)
    return (
        <>
            {!!code &&
                <Alert color={color} icon={icon} onDismiss={() => dismiss(0)}> {msg} </Alert >
            }
        </>
    )
}

export default StatusHandler