import { useEffect, useState } from 'react'
// import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

// components
import CampaignDetails from '../../components/CampaignDetails'
import CampaignForm from '../../components/start/campaignStart/CampaignStart'
import JoinCampaign from '../../components/start/campaignJoin/CampaignJoin'

const Start = () => {
    const [loading, setLoading] = useState(true)
    const [campaignList, setCampaignList] = useState(null)
    // const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()


    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            const response = await fetch('/api/user/getCampaigns', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const list = await response.json()
            setCampaignList(list)
            console.log(list)
            setLoading(false);

            // if (response.ok) {
            //     dispatch({type: 'SET_CAMPAIGNS', payload: json})
            //     setLoading(true)
            // }
        }

        if (user) {
            fetchCampaigns()
        }
    }, [user])

    return (
        <div className="start">
            <div className="start__add">
                <CampaignForm />
                <JoinCampaign />
            </div>
{/* <CampaignDetails key={campaign._id} campaign={campaign} /> this line belongs 4 lines down if this doesn't work out. */}
            <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                :   campaignList.map((campaign) => (
                    <p key={campaign._id}>{campaign.campaignID}</p>        
                    ))
                }
            </div>
            
        </div>
    )
}

export default Start