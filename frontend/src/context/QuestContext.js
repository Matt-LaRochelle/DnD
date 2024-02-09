import { createContext, useReducer } from 'react'

export const QuestsContext = createContext()

export const questsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUESTS':
            return {
                quests: action.payload
            }
        case 'SET_QUEST':
            return {
                quests: action.payload
            }
        case 'CREATE_QUEST':
            return {
                quests: [action.payload, ...state.quests]
            }
        case 'DELETE_QUEST':
            return {
                quests: state.quests.filter((Q) => Q._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const QuestsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(questsReducer, {
        quests: null
    })

    return (
        <QuestsContext.Provider value={{...state, dispatch}}>
            { children }
        </QuestsContext.Provider>
    )
}