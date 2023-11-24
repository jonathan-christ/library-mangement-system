import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ttl } from '../../assets/constants'

import ls from 'localstorage-slim'

import AdminNavigation from './AdminNavigation'
import UserNavigation from './UserNavigation'
import StaffNavigation from './StaffNavigation'

import { useSession, useSessionUpdate } from '../context-hooks/session/SessionUtils'


function NavigationBar() {
    const data = useSession()
    const updateData = useSessionUpdate()
    const navigate = useNavigate()

    const initializeSession = useCallback(() => {
        if (data) {
            const intervalId = setInterval(() => {
                if (!JSON.parse(ls.get('userData', { decrypt: true }))) {
                    ls.clear()
                    updateData(undefined)
                    navigate('/')
                }
            }, ttl * 1000)

            return () => clearInterval(intervalId)
        }
    }, [data, updateData, navigate])

    useEffect(() => {
        initializeSession()
    }, [initializeSession]) //might be problem (removed dependency array)


    const getInitials = (fname, lname) => {
        let firstNameIn = fname[0].charAt(0).toUpperCase()
        let lastNameIn = lname.charAt(0).toUpperCase()
        return firstNameIn + lastNameIn
    }

    const signOut = () => {
        ls.clear()
        updateData(undefined)
        navigate('/')
    }

    const translateUserType = (type) => {
        const roles = {
            2: "STUDENT",
            3: "TEACHER",
            4: "STAFF",
            5: "ADMIN",
        }

        return roles[type] || "GUEST"
    }

    const commonFunctions = {
        navigate,
        getInitials,
        signOut,
        translateUserType
    }

    const Navs = {
        4: <StaffNavigation functions={commonFunctions} />,
        5: <AdminNavigation functions={commonFunctions} />
    }

    return Navs[data ? data.typeID : 1] || <UserNavigation functions={commonFunctions} />
}

export default NavigationBar