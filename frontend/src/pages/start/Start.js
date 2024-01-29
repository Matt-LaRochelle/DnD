import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

// components
import CampaignDetails from '../../components/start/campaignDetails/CampaignDetails'
import CampaignStart from '../../components/start/campaignStart/CampaignStart'
import CampaignJoin from '../../components/start/campaignJoin/CampaignJoin'

const Start = () => {
    // Can I make sure that loading is set to true when the component mounts?
    const [loading, setLoading] = useState(true)
    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()




    useEffect(() => {
        // Fetch the campaigns which this user is a DM or Player for
        const fetchUserCampaignList = async () => {
            console.log('useEffect is running'); // This will log to the console every time useEffect runs
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
            fetchUserCampaignList()
        }
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