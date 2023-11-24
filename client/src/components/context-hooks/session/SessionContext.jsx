import ls from 'localstorage-slim'
import PropTypes from 'prop-types'

import React, { useState } from "react"

const SessionContext = React.createContext()
const SessionUpdateContext = React.createContext()

SessionProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ])
}
export function SessionProvider({ children }) {
    const [sessionData, setSessionData] = useState(() => {
        // ls.clear()
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