import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

// components
import CampaignDetails from '../../components/start/campaignDetails/CampaignDetails'
import CampaignStart from '../../components/start/campaignStart/CampaignStart'
import CampaignJoin from '../../components/start/campaignJoin/CampaignJoin'

const Start = () => {
    const [loading, setLoading] = useState(false)
    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()


    useEffect(() => {
        // Fetch the campaigns which this user is a DM or Player for
        const fetchDMCampaignList = async () => {
            setLoading(true);
            const response = await fetch('/api/campaign/', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const list = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGNS', payload: list})
                setLoading(false)
            }
        }

        if (user) {
            fetchDMCampaignList()
        }
    }, [user])


    return (
        <div className="start">
            <div className="start__add">
                <CampaignStart />
                <CampaignJoin />
            </div>
        <h3>Campaigns you DM:</h3>
            <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                // Filter the campaigns to show only the ones where the user is the DM
                :   campaigns && campaigns.filter(campaign => campaign.dmID === user.id).map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div>
        <h3>Campaigns you play in:</h3>
        <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                // Filter the campaigns to show only the ones where the user is a player
                :   campaigns && campaigns.filter(campaign => campaign.playerIDs.includes(user.id)).map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div>
        </div>
    )
}

export default Start