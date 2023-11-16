import React from 'react'
import ls from 'localstorage-slim'

import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import UserNavigation from './navbars/UserNavigation'

function AppFrame() {
  const [sessionData, setSessionData] = useState(undefined)
  useEffect(() => {
    setSessionData(JSON.parse(ls.get('userData', { decrypt: true })))
  }, [])

  const navigate = useNavigate()

  const getInitials = (fname, lname) => {
    let firstNameIn = fname[0].charAt(0).toUpperCase()
    let lastNameIn = lname.charAt(0).toUpperCase()
    return firstNameIn + lastNameIn
  }

  const signOut = () => {
    ls.clear()
    setSessionData(undefined)
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

  let NavigationBar
  switch (permsVal()) {
    case 1:
    case 2:
      NavigationBar = <UserNavigation data={sessionData} functions={commonFunctions} />
    case 3:
      NavigationBar = <UserNavigation data={sessionData} functions={commonFunctions} />
    case 4:
      NavigationBar = <UserNavigation data={sessionData} functions={commonFunctions} />
  }

  return (
    <>
      {NavigationBar}
      <Outlet />
    </>
  )
}

export default AppFrame