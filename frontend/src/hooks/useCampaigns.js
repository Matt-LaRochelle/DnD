import { useState } from 'react'
import { useCampaignsContext } from './useCampaignsContext'
import { useAuthContext } from './useAuthContext'

export const useCampaigns = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

    const campaigns = async () => {
        if (!user) return

        setIsLoading(true)
        setError(null)

        const response = await fetch('https://dnd-kukm.onrender.com/api/campaign/', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            // This is what happens if the request is bad
            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGNS', payload: json})
                setIsLoading(false)
            }
        }

    return { campaigns, isLoading, error }
}