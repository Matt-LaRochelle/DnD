import './campaign.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import AddNPC from '../../components/campaign/addNPC/AddNPC';


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

    useEffect(() => {
        const fetchNpcs = async () => {
            setLoading(true);
            const response = await fetch(`/api/npc/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log("Step 1: json data from server:", json);

            if (response.ok) {
                setNpcs(json)
                setLoading(false)
            }
        }

        if (user) {
            fetchNpcs()
        }
    }, [path, user, dispatch])

    const campaignDetails = () => {
        console.log("Step end: campaign:", campaigns)
        console.log("playerUsernames", campaigns.playerUsernames)
    }


    const moreInfo = (id) => {
        console.log(`/npc/${id}`);
        navigate(`/npc/${id}`);
    }

    return (
        <div className="campaign__Container">
            {loading 
            ?   
                <div className='loading'>
                    <h1>Loading...</h1>
                    <button onClick={campaignDetails}>Campaign details</button>
                </div>             
            :   
                <div className='loaded'>
                    <h1>{campaigns.title}</h1>
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
                    <div className="campaign__Npcs">
                        {npcs && npcs.map((npc) => (
                            <div className="npc" key={npc._id}>
                                <h3>{npc.name}</h3>
                                <p><strong>Description:</strong> {npc.description}</p>
                                {campaigns.dmID === user.id && <p><strong>Secrets:</strong> {npc.secrets}</p>}
                                <p><strong>Last Seen:</strong> {npc.lastSeen}</p>
                                <p>{npc.hidden}</p>
                                <button onClick={() => moreInfo(npc._id)}>More Info</button>
                                {campaigns.dmID === user.id && <button>Delete</button>}
                                {campaigns.dmID === user.id && <button>Edit</button>}
                            </div>
                        ))}
                        {campaigns.dmID === user.id && <AddNPC />}
                    </div>
                    
                </div>  
            }
        </div>
    )
}

export default Campaign