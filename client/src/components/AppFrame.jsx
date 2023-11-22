import React from 'react'
import ls from 'localstorage-slim'

import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ttl, ttlCheck } from '../assets/constants'

import UserNavigation from './navbars/UserNavigation'
import StaffNavigation from './navbars/StaffNavigation'

function AppFrame() {
  const [sessionData, setSessionData] = useState(undefined)
  const navigate = useNavigate()
  let NavigationBar

  useEffect(() => {
    setSessionData(JSON.parse(ls.get('userData', { decrypt: true })))

    const intervalId = setInterval(() => {
      checkTTL();
    }, ttlCheck)

    return () => clearInterval(intervalId)
  }, [])

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
    setSessionData(undefined)
    navigate('/')
  }

  const translateUserType = (type) => {
    return type == 1 ? "GUEST" : type == 2 ? "STUDENT" : type == 3 ? "TEACHER" : type == 4 ? "STAFF" : "ADMIN"
  }

  const permsVal = () => {
    return sessionData ? sessionData.typeID : 1
  }

  const commonFunctions = {
    navigate,
    getInitials,
    signOut,
    translateUserType
  }

  switch (permsVal()) {
    case 4:
      NavigationBar = <StaffNavigation data={sessionData} functions={commonFunctions} />
      break
    case 5:
      NavigationBar = <UserNavigation data={sessionData} functions={commonFunctions} />
      break
    default:
      NavigationBar = <UserNavigation data={sessionData} functions={commonFunctions} />
  }

  return (
    <div className='bg-gray-100'>
      {NavigationBar}
      <Outlet />
    </div>
  )
}

export default AppFrame