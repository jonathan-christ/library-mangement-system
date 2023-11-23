import React, { useState, useContext } from "react"
import ls from 'localstorage-slim'

const SessionContext = React.createContext()
const SessionUpdateContext = React.createContext()

export function getSession() {
    return useContext(SessionContext)
}

export function updateSession() {
    return useContext(SessionUpdateContext)
}

export function SessionProvider({ children }) {
    const [sessionData, setSessionData] = useState(() => {
        // ls.clear()
        console.log("ref")
        const storedData = ls.get("userData", { decrypt: true })
        return storedData ? JSON.parse(storedData) : undefined
    })

    function updateSessionData(data) {
        setSessionData(data)
    }

    return (
        <SessionContext.Provider value={sessionData}>
            <SessionUpdateContext.Provider value={updateSessionData}>
                {children}
            </SessionUpdateContext.Provider>
        </SessionContext.Provider>
    )
}