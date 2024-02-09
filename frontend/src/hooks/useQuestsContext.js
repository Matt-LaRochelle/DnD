import { QuestsContext } from '../context/QuestContext'
import { useContext } from 'react'

export const useQuestsContext = () => {
    const context = useContext(QuestsContext)

    if (!context) {
        throw Error('useQuestsContext must be used inside a QuestsContextProvider.')
    }

    return context
}