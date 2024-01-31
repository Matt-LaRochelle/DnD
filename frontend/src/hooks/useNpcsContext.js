import { NpcsContext } from '../context/NpcContext'
import { useContext } from 'react'

export const useNpcsContext = () => {
    const context = useContext(NpcsContext)

    if (!context) {
        throw Error('useNpcsContext must be used inside a NpcsContextProvider.')
    }

    return context
}