import './campaign.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

import Maps from '../../components/maps/Maps';
import Npcs from '../../components/npcs/Npcs';
import Pcs from '../../components/pcs/Pcs';
import Loading from '../../components/loading/Loading';
import CharacterRow from '../../components/characterRow/CharacterRow';


const Campaign = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)
    const [npcs, setNpcs] = useState(null)

    const [playerInfo, setPlayerInfo] = useState([]);
    const [dmInfo, setDmInfo] = useState({});

    // This variable says whether the current client is DM of this campaign
    const [dm, setDm] = useState(false)

    // const [campaign, setCampaign] = useState({})
    // This sets once we receive all campaign info, then we can
    // fetch the user and dm info from inside the campaign.
    const [step1, setStep1] = useState(false)

    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (user.id === campaigns.dmID) {
            setDm(true);
        }
    }, [user, campaigns])

    useEffect(() => {
        const fetchCampaign = async () => {
            setLoading(true);
            const response = await fetch(`/api/campaign/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGN', payload: json})
                setStep1(true);
            }
        }

        if (user) {
            fetchCampaign()
        }
    }, [path, user, dispatch])


        // Get all users and dm info for the campaign
        useEffect(() => {
            const fetchUsers = async () => {
                const response = await fetch('/api/user/campaign/' + campaigns._id, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()
    
                if (response.ok) {
                    setPlayerInfo(json.users)
                    setDmInfo(json.dm)
                    setLoading(false)
                }
            }
            if (step1) {
                fetchUsers()
            }
        
        }, [step1])


    const campaignDetails = () => {
        console.log("Step end: campaign:", campaigns)
        console.log("playerUsernames", campaigns.playerUsernames)
    }

    const editCampaign = () => {
        navigate(`/campaign/edit/${campaigns._id}`)
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
                        <p>{campaigns.description}</p>
                        <img src={campaigns.image} alt={campaigns.title} />
                    </div>
                    <div className='campaign__users'>
                        <button onClick={campaignDetails}>Campaign details</button>
                        {dm && <button onClick={editCampaign}>Edit this Campaign</button>}
                        <div className="campaign__players">
                            <CharacterRow 
                                dmInfo={dmInfo}
                                playerInfo={playerInfo}
                            />
                        </div>
                    </div>
                    <h2 className="campaign__heading">Maps</h2>
                    <Maps dm={campaigns.dmID} />
                    <h2 className="campaign__heading">PCs</h2>
                    <Pcs dm={campaigns.dmID} />
                    <h2 className="campaign__heading">NPCs</h2>
                    <Npcs dm={campaigns.dmID} />                    
                </div>  
            }
        </div>
    )
}

export default Campaign