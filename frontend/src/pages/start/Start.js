import { useEffect, useState } from 'react'
// import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

// components
import CampaignDetails from '../../components/start/campaignDetails/CampaignDetails'
import CampaignForm from '../../components/start/campaignStart/CampaignStart'
import JoinCampaign from '../../components/start/campaignJoin/CampaignJoin'

const Start = () => {
    const [loading, setLoading] = useState(false)
    const [campaignList, setCampaignList] = useState(null)
    const [fullList, setFullList] = useState(null)
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
            // console.log(list)
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

    useEffect(() => {
        const fetchCampaignList = async () => {
            setLoading(true);
            const response = await fetch('/api/campaign', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const list = await response.json()
            setFullList(list)
            console.log("full list", list)
            setLoading(false);

            // if (response.ok) {
            //     dispatch({type: 'SET_CAMPAIGNS', payload: json})
            //     setLoading(true)
            // }
        }

        if (user) {
            fetchCampaignList()
        }
    }, [user])

    return (
        <div className="start">
            <div className="start__add">
                <CampaignForm />
                <JoinCampaign />
            </div>
{/* <p key={campaign._id}>{campaign.campaignID}</p>   this line belongs 4 lines down if this doesn't work out. */}
        <h3>Nested List:</h3>
            {/* <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                :   campaignList.map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div> */}
        <h3>Campaigns you DM:</h3>
            {/* <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                :   fullList.map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div> */}
            
        </div>
    )
}

export default Start