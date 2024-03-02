import { useEffect } from 'react'
import './home.css'

// Hooks
import { useCampaigns } from '../../hooks/useCampaigns'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

// Components
import CampaignDetails from '../../components/home/campaignDetails/CampaignDetails'
import CampaignStart from '../../components/home/campaignStart/CampaignStart'
import CampaignJoin from '../../components/home/campaignJoin/CampaignJoin'
import Loading from '../../components/loading/Loading'

const Home = () => {
    const { campaigns } = useCampaignsContext() 
    const { user } = useAuthContext()
    const { campaigns: fetchCampaigns, isLoading } = useCampaigns()

    useEffect(() => {
        fetchCampaigns()
    }, [])


    return (
        <div className="home__container">
            {isLoading
                ?   <Loading />
                :   <div>
                        <div className="home__add">
                            <CampaignStart />
                            <CampaignJoin />
                        </div>
                        <h3 className='home__title'>Campaigns you DM:</h3>
                        <div>
                            {campaigns.filter(campaign => campaign.dmID === user.id).map((campaign) => (
                                <CampaignDetails key={campaign._id} campaign={campaign} />
                                ))}
                            {campaigns.filter(campaign => campaign.dmID === user.id).length === 0 && <p>You are not a DM for any campaigns</p>}
                        </div>
                        <h3 className='home__title'>Campaigns you play in:</h3>
                        <div>
                            {campaigns.filter(campaign => campaign.playerIDs.includes(user.id)).map((campaign) => (
                                <CampaignDetails key={campaign._id} campaign={campaign} />
                                ))}
                            {campaigns.filter(campaign => campaign.playerIDs.includes(user.id)).length === 0 && <p>You are not a player in any campaigns</p>}
                        </div>
                    </div>
                }
        </div>
    )
}

export default Home