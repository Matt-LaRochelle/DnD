import { useState } from 'react'
import { useCampaignsContext } from './useCampaignsContext'
import { useAuthContext } from './useAuthContext'

export const useCampaign = (path) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

const campaign = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    const response = await fetch(`https://dnd-kukm.onrender.com/api/campaign/${path}`, {
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
            dispatch({type: 'SET_CAMPAIGN', payload: json})
            setIsLoading(false)
        }
    }

return { campaign, isLoading, error }
}