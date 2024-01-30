import './campaign.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import AddNPC from '../npc/addNPC/AddNPC';
import Npcs from '../../components/npc/Npcs';
import Loading from '../../components/loading/Loading';


const Campaign = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)
    const [npcs, setNpcs] = useState(null)

    // const [campaign, setCampaign] = useState({})

    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCampaign = async () => {
            setLoading(true);
            const response = await fetch(`/api/campaign/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log("Step 1: json data from server:", json);

            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGN', payload: json})
                // setCampaign(json)
                setLoading(false)
            }
        }

        if (user) {
            fetchCampaign()
        }
    }, [path, user, dispatch])


    const campaignDetails = () => {
        console.log("Step end: campaign:", campaigns)
        console.log("playerUsernames", campaigns.playerUsernames)
    }


    const moreInfo = (id) => {
        navigate(`/npc/${id}`);
    }

    return (
        <div className="campaign__Container">
            {loading 
            ?   
                <Loading />             
            :   
                <div className='loaded'>
                    <h1 onClick={campaignDetails}>{campaigns.title}</h1>
                    <div className="campaign__Description">
                        <h3>Description</h3>
                        <p>{campaigns.description}</p>
                    </div>
                    <div className='campaign__users'>
                    <button onClick={campaignDetails}>Campaign details</button>
                        <h4>DM for this campaign: {campaigns.dmUsername}</h4>
                        <p>Players: </p>
                        {campaigns.playerUsernames.map((username) => (
                            <p>{username}</p>
                        ))}
                    </div>
                    <div className="campaign__Maps">
                        <h3>Maps</h3>
                        <ul>
                            <li><strong>Make this dynamic at some point</strong></li>
                            <li>Current map</li>
                            <li>Recent map</li>
                            <li>Recent map</li>
                            <li>Recent map</li>
                        </ul>
                        {/* <Link to="/map">Maps Page</Link> */}
                    </div>
                    
                    <h2>PCs</h2>
                    <h2>NPCs</h2>
                    <Npcs 
                        dm={campaigns.dmID}
                    />
                    
                </div>  
            }
        </div>
    )
}

export default Campaign