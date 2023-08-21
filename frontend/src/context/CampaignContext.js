import { createContext, useReducer } from 'react'

export const CampaignsContext = createContext()

export const campaignsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CAMPAIGNS':
            return {
                campaigns: action.payload
            }
        case 'CREATE_CAMPAIGN':
            return {
                campaigns: [action.payload, ...state.campaigns]
            }
        case 'DELETE_CAMPAIGN':
            return {
                campaigns: state.campaigns.filter((C) => C._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const CampaignsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(campaignsReducer, {
        campaigns: null
    })

    return (
        <CampaignsContext.Provider value={{...state, dispatch}}>
            { children }
        </CampaignsContext.Provider>
    )
}