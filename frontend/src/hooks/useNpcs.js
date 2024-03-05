import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

export const useNpcs = (campaignID) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchNpcs = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/npc/' + campaignID, {
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
                dispatchNpcs({type: 'SET_NPCS', payload: json})
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchNpcs()
        }
    
    }, [user])

    return { isLoading, error }

}