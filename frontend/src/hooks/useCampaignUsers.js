import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useCampaignUsers = (path) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()

    const [playerInfo, setPlayerInfo] = useState(null)
    const [dmInfo, setDmInfo] = useState(null)

    const campaignUsers = async () => {
        if (!user) return

        setIsLoading(true)
        setError(null)

        const response = await fetch(`https://dnd-kukm.onrender.com/api/user/campaign/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log(
                "Campaign users:", json
            )

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

    return { campaignUsers, playerInfo, dmInfo, isLoading, error }
}