import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { useCreaturesContext } from './useCreaturesContext'

export const useCreatures = (campaignID) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()
    const { dispatch } = useCreaturesContext()

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchCreatures = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/creature/' + campaignID, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                dispatch({type: 'SET_CREATURES', payload: json})
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchCreatures()
        }
    
    }, [user])

    return { isLoading, error }

}