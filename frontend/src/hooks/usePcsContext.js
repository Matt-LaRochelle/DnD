import { PcsContext } from '../context/PcContext'
import { useContext } from 'react'

export const usePcsContext = () => {
    const context = useContext(PcsContext)

    if (!context) {
        throw Error('usePcsContext must be used inside a PcsContextProvider.')
    }

    return context
}