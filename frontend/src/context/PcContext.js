import { createContext, useReducer } from 'react'

export const PcsContext = createContext()

export const pcsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PCS':
            return {
                pcs: action.payload
            }
        case 'SET_PC':
            return {
                pcs: action.payload
            }
        case 'CREATE_PC':
            return {
                pcs: [action.payload, ...state.pcs]
            }
        case 'DELETE_PC':
            return {
                pcs: state.pcs.filter((C) => C._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const PcsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(pcsReducer, {
        pcs: null
    })

    return (
        <PcsContext.Provider value={{...state, dispatch}}>
            { children }
        </PcsContext.Provider>
    )
}