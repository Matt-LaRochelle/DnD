import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../hooks/useCampaignsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import CampaignDetails from '../components/CampaignDetails'
import CampaignForm from '../components/CampaignForm'

const Home = () => {
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
        <div className="home">
            <div className='campaigns'>
            {loading ?
                campaigns.map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                ))
                : <p>Loading...</p>
                }
            </div>
            <CampaignForm />
        </div>
    )
}

export default Home