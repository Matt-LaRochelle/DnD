import { MapsContext } from '../context/MapContext'
import { useContext } from 'react'

export const useMapsContext = () => {
    const context = useContext(MapsContext)

    if (!context) {
        throw Error('useMapsContext must be used inside a MapsContextProvider.')
    }

    return context
}