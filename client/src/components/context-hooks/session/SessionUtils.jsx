import { useContext } from "react"
import { SessionContext, SessionUpdateContext } from './SessionContext'

export function useSession() {
    return useContext(SessionContext)
}

export function useSessionUpdate() {
    return useContext(SessionUpdateContext)
}