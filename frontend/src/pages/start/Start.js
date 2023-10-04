import { useEffect, useState } from 'react'
// import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

// components
import CampaignDetails from '../../components/start/campaignDetails/CampaignDetails'
import CampaignStart from '../../components/start/campaignStart/CampaignStart'
import CampaignJoin from '../../components/start/campaignJoin/CampaignJoin'

const Start = () => {
    const [loading, setLoading] = useState(false)
    const [fullList, setFullList] = useState([])
    // const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()


    useEffect(() => {
        // Fetch the campaigns which this user DMs for
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
                <CampaignStart />
                <CampaignJoin />
            </div>
        <h3>Campaigns you DM:</h3>
            <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                :   fullList.map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div>
        <h3>Campaigns you play in:</h3>
            
        </div>
    )
}

export default Start