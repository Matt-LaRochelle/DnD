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
    const [dmList, setDmList] = useState([])
    const [playerList, setPlayerList] = useState([])
    // const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()


    useEffect(() => {
        // Fetch the campaigns which this user DMs for
        const fetchDMCampaignList = async () => {
            setLoading(true);
            const response = await fetch('/api/campaign/dm', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const list = await response.json()
            setDmList(list)
            console.log("DM list", list)
            setLoading(false);

            // if (response.ok) {
            //     dispatch({type: 'SET_CAMPAIGNS', payload: json})
            //     setLoading(true)
            // }
        }

        if (user) {
            fetchDMCampaignList()
        }
    }, [user])

    useEffect(() => {
        // Fetch the campaigns which this user is a player in
        const fetchPlayerCampaignList = async () => {
            setLoading(true);
            const response = await fetch('/api/campaign/player', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const list = await response.json()
            setPlayerList(list)
            console.log("DM list", list)
            setLoading(false);

            // if (response.ok) {
            //     dispatch({type: 'SET_CAMPAIGNS', payload: json})
            //     setLoading(true)
            // }
        }

        if (user) {
            fetchPlayerCampaignList()
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
                :   dmList.map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div>
        <h3>Campaigns you play in:</h3>
        <div className='campaigns'>
                {loading 
                ?   <p>Loading...</p>
                :   playerList.map((campaign) => (
                    <CampaignDetails key={campaign._id} campaign={campaign} />
                    ))
                }
            </div>
        </div>
    )
}

export default Start