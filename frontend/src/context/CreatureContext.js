import { createContext, useReducer } from 'react'

export const CreaturesContext = createContext()

export const creaturesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CREATURES':
            return {
                creatures: action.payload
            }
        case 'SET_CREATURE':
            return {
                creatures: action.payload
            }
        case 'CREATE_CREATURE':
            return {
                creatures: [action.payload, ...state.creatures]
            }
        case 'DELETE_CREATURE':
            return {
                creatures: state.creatures.filter((C) => C._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const CreaturesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(creaturesReducer, {
        creatures: null
    })

    return (
        <CreaturesContext.Provider value={{...state, dispatch}}>
            { children }
        </CreaturesContext.Provider>
    )
}