import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import './start.css'

// components
import CampaignDetails from '../../components/CampaignDetails'
import CampaignForm from '../../components/newCampaign/CampaignForm'
import JoinCampaign from '../../components/joinCampaign/JoinCampaign'

const Start = () => {
    const [loading, setLoading] = useState(false)
    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchCampaigns = async () => {
            const response = await fetch('/api/campaigns', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGNS', payload: json})
                setLoading(true)
            }
        }

        if (user) {
            fetchCampaigns()
        }
    }, [dispatch, user])

    return (
        <div className="start">
            <div className="start__add">
                <CampaignForm />
                <JoinCampaign />
            </div>

            <div className='campaigns'>
                {loading 
                ?   campaigns.map((campaign) => (
                        <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                :   <p>Loading...</p>
                }
            </div>
            
        </div>
    )
}

export default Start