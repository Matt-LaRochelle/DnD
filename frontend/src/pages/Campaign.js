import { useEffect } from "react"
import { useLocation } from "react-router-dom";
import { useCampaignsContext } from '../hooks/useCampaignsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const Campaign = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchCampaign = async () => {
            const response = await fetch(`/api/campaigns/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGN', payload: json})
            }
        }

        if (user) {
            fetchCampaign()
        }
    }, [dispatch, user, path])


    return (
        <div>
            <h1>Campaign {campaigns.title}</h1>
            <p>Description</p>
            <p>Maps</p>
            <p>Player Characters</p>
            <p>NPC's</p>
            <p>Quests</p>
            <p>News</p>
            <p>Lore</p>
            <p>Treasure</p>
            <p>Items</p>
            <p>Creatures</p>
        </div>
    )
}

export default Campaign