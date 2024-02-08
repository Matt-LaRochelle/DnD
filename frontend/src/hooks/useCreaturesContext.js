import { CreaturesContext } from '../context/CreatureContext'
import { useContext } from 'react'

export const useCreaturesContext = () => {
    const context = useContext(CreaturesContext)

    if (!context) {
        throw Error('useCreaturesContext must be used inside a CreaturesContextProvider.')
    }

    return context
}