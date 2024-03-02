import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

import { useCampaigns } from '../../hooks/useCampaigns'

// components
import CampaignDetails from '../../components/home/campaignDetails/CampaignDetails'
import CampaignStart from '../../components/home/campaignStart/CampaignStart'
import CampaignJoin from '../../components/home/campaignJoin/CampaignJoin'

const Start = () => {
    const { campaigns } = useCampaignsContext() 
    const { user } = useAuthContext()
    const { campaigns: fetchCampaigns, loading } = useCampaigns()

    useEffect(() => {
        fetchCampaigns()
    }, [user])


    return (
        <div className="start">
            <div className="start__add">
                <CampaignStart />
                <CampaignJoin />
            </div>
            <h3 className='start-title'>Campaigns you DM:</h3>
            <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                // Filter the campaigns to show only the ones where the user is the DM
                :   campaigns && campaigns.filter(campaign => campaign.dmID === user.id).map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
                {!loading && campaigns && campaigns.filter(campaign => campaign.dmID === user.id).length === 0 && <p>You are not a DM for any campaigns</p>}
            </div>
            <h3 className='start-title'>Campaigns you play in:</h3>
            <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                // Filter the campaigns to show only the ones where the user is a player
                :   campaigns && campaigns.filter(campaign => campaign.playerIDs.includes(user.id)).map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
                {!loading && campaigns && campaigns.filter(campaign => campaign.playerIDs.includes(user.id)).length === 0 && <p>You are not a player in any campaigns</p>}
            </div>
        </div>
    )
}

export default Start