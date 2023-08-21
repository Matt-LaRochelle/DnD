import { useEffect, createContext, useReducer } from 'react'


export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // This fires when the react app loads
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        const validateUser = async () => {
            if (user) {
                // Check if the token is valid or invalid
                const response = await fetch('/api/workouts/', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    const json = await response.json()
                    console.log(json)

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