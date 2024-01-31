import { createContext, useReducer } from 'react'

export const NpcsContext = createContext()

export const npcsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NPCS':
            return {
                npcs: action.payload
            }
        case 'SET_NPC':
            return {
                npcs: action.payload
            }
        case 'CREATE_NPC':
            return {
                npcs: [action.payload, ...state.npcs]
            }
        case 'DELETE_NPC':
            return {
                npcs: state.npcs.filter((C) => C._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const NpcsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(npcsReducer, {
        npcs: null
    })

    return (
        <NpcsContext.Provider value={{...state, dispatch}}>
            { children }
        </NpcsContext.Provider>
    )
}