import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { useQuestsContext } from './useQuestsContext'

export const useQuests = (campaignID) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()
    const { dispatch } = useQuestsContext()

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchQuests = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/quest/' + campaignID, {
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
                dispatch({type: 'SET_QUESTS', payload: json})
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchQuests()
        }
    
    }, [user])

    return { isLoading, error }

}