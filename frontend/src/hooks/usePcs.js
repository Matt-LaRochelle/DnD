import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { usePcsContext } from './usePcsContext'

export const usePcs = (campaignID) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()
    const { dispatch } = usePcsContext()

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchPcs = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/pc/' + campaignID, {
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
                dispatch({type: 'SET_PCS', payload: json})
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchPcs()
        }
    
    }, [user])

    return { isLoading, error }

}