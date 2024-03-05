import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { useMapsContext } from './useMapsContext'

export const useMaps = (campaignID) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()
    const { dispatch } = useMapsContext()

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchMaps = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/map/' + campaignID, {
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
                dispatch({type: 'SET_MAPS', payload: json})
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchMaps()
        }
    
    }, [user])

    return { isLoading, error }

}