import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ttl } from '../../assets/constants'

import ls from 'localstorage-slim'

// import AdminNavigation from './AdminNavigation'
import UserNavigation from './UserNavigation'
import StaffNavigation from './StaffNavigation'

import { useSession, useSessionUpdate } from '../context-hooks/session/SessionUtils'

function NavigationBar() {
    const data = useSession()
    const updateData = useSessionUpdate()
    const navigate = useNavigate()

    useEffect(() => {
        if (data) {
            const intervalId = setInterval(() => {
                checkTTL();
            }, ttl * 1000)

            return () => clearInterval(intervalId)
        }
    }) //might be problem (removed dependency array)

    const getInitials = (fname, lname) => {
        let firstNameIn = fname[0].charAt(0).toUpperCase()
        let lastNameIn = lname.charAt(0).toUpperCase()
        return firstNameIn + lastNameIn
    }

    const checkTTL = () => {
        if (!JSON.parse(ls.get('userData', { decrypt: true }))) {
            signOut()
        }
    }

    const signOut = () => {
        ls.clear()
        updateData(undefined)
        navigate('/')
    }

    const translateUserType = (type) => {
        switch (type) {
            case 2:
                return "STUDENT"
            case 3:
                return "TEACHER"
            case 4:
                return "STAFF"
            case 5:
                return "ADMIN"
            default:
                return "GUEST"
        }
    }

    const permsVal = () => {
        return data ? data.typeID : 1
    }

    const commonFunctions = {
        navigate,
        getInitials,
        signOut,
        translateUserType
    }

    switch (permsVal()) {
        case 4:
            return <StaffNavigation functions={commonFunctions} />
        case 5:
            return <UserNavigation functions={commonFunctions} />
        default:
            return <UserNavigation functions={commonFunctions} />
    }
}

export default NavigationBar