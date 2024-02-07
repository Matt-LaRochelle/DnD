import { useEffect, createContext, useReducer } from 'react'


export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'UPDATE':
            // Keep all current information but just add whatever is in the action.payload
            return { user: { ...state.user, ...action.payload } }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // This fires when the react app loads in order to log out users
    // who have been logged in for more than 3 days.
    // We need to change this to something else - there is
    // backend middleware which can send back a message that
    // the token has expired. This must log out the person.
    // That is a TODO
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        const validateUser = async () => {
            if (user) {
                // Check if the token is valid or invalid
                const response = await fetch('/api/user/check/', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const json = await response.json()
                    if (response.ok) {
                        dispatch({ type: 'LOGIN', payload: user })
                    }
                    else {
                        dispatch({ type: 'LOGOUT', payload: null})
                    }
                }
            }
        validateUser()
        
    }, [])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}