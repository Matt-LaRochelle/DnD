import { createContext, useReducer } from 'react'

export const MapsContext = createContext()

export const mapsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MAPS':
            return {
                maps: action.payload
            }
        case 'SET_MAP':
            return {
                maps: action.payload
            }
        case 'CREATE_MAP':
            return {
                maps: [action.payload, ...state.maps]
            }
        case 'DELETE_MAP':
            return {
                maps: state.maps.filter((C) => C._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const MapsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(mapsReducer, {
        maps: null
    })

    return (
        <MapsContext.Provider value={{...state, dispatch}}>
            { children }
        </MapsContext.Provider>
    )
}