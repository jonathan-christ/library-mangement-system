import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ttl, ttlCheck } from '../../assets/constants'

import ls from 'localstorage-slim'

import AdminNavigation from './AdminNavigation'
import UserNavigation from './UserNavigation'
import StaffNavigation from './StaffNavigation'

import { getSession, updateSession } from '../SessionContext'

function NavigationBar() {
    const data = getSession()
    const updateData = updateSession()
    const navigate = useNavigate()

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         checkTTL();
    //     }, ttl)

    //     return () => clearInterval(intervalId)
    // }, [])

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
        let retVal
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