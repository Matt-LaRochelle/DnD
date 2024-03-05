import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

export const useCampaignUsers = (campaignID) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()

    const [playerInfo, setPlayerInfo] = useState(null)
    const [dmInfo, setDmInfo] = useState(null)

    useEffect(() => {
        const fetchCampaignUsers = async () => {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`https://dnd-kukm.onrender.com/api/user/campaign/${campaignID}`, {
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
                    setPlayerInfo(json.users)
                    setDmInfo(json.dm)
                    setIsLoading(false)
                }
            }
        if (user) {
            fetchCampaignUsers()
        }
    }, [user])
    return { playerInfo, dmInfo, isLoading, error }
}