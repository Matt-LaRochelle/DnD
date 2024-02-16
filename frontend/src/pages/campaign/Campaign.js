import './campaign.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

import Maps from '../../components/maps/Maps';
import Npcs from '../../components/npcs/Npcs';
import Pcs from '../../components/pcs/Pcs';
import Creatures from '../../components/creatures/Creatures';
import Quests from '../../components/quests/Quests';
import Loading from '../../components/loading/Loading';
import CharacterRow from '../../components/characterRow/CharacterRow';


const Campaign = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)
    const [npcs, setNpcs] = useState(null)

    const [playerInfo, setPlayerInfo] = useState([]);
    const [dmInfo, setDmInfo] = useState({});

    const [settings, setSettings] = useState(null)

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
                setSettings(json.playerSettings.find(setting => setting.id === user.id).settings);
                console.log("settings", settings)
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
    console.log("dm", dm)

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
                        {settings.description && <p>{campaigns.description}</p>}
                        {settings.image && campaigns.image && <img src={campaigns.image} alt={campaigns.title} />}
                    </div>
                    <div className='campaign__users'>
                        {dm && <button className="button-primary" onClick={editCampaign}>Edit this Campaign</button>}
                        {settings.players && 
                            <div className="campaign__players">
                                <CharacterRow 
                                    dmInfo={dmInfo}
                                    playerInfo={playerInfo}
                                />
                            </div>
                        }
                    </div>
                    <div style={
                        (dm  && !settings.maps) ? {display: "block"} :
                        (campaigns.maps.length === 0 ||
                        !settings.maps || 
                        campaigns.maps.every(map => map.hidden)) ? 
                        {display: "none"} : {}
                    }>
                        <h2 className="campaign__heading">Maps</h2>
                        <Maps dm={campaigns.dmID} />
                    </div>

                    <div style={settings.playerCharacters ? {} : {display: "none"}}>
                        <h2 className="campaign__heading">PCs</h2>
                        <Pcs dm={campaigns.dmID} />
                    </div>

                    <div style={
                        (dm  && settings.nonPlayerCharacters) ? {display: "block"} :
                        (campaigns.nonPlayerCharacters.length === 0 ||
                        !settings.nonPlayerCharacters || 
                        campaigns.nonPlayerCharacters.every(npc => npc.hidden)) ? 
                        {display: "none"} : {}
                    }>
                        <h2 className="campaign__heading">NPCs</h2>
                        <Npcs dm={campaigns.dmID} />                    
                    </div>

                    <div style={
                        (dm  && settings.creatures) ? {display: "block"} :
                        (campaigns.creatures.length === 0 ||
                        !settings.creatures || 
                        campaigns.creatures.every(creature => creature.hidden)) ? 
                        {display: "none"} : {}
                    }>
                        <h2 className="campaign__heading">Creatures</h2>
                        <Creatures dm={campaigns.dmID} />                    
                    </div>

                    <div style={
                        (dm  && settings.quests) ? {display: "block"} :
                        (campaigns.quests.length === 0 ||
                        !settings.quests || 
                        campaigns.quests.every(quest => quest.hidden)) ? 
                        {display: "none"} : {}
                    }>
                        <h2 className="campaign__heading">Quests</h2>
                        <Quests dm={campaigns.dmID} />                    
                    </div>
                </div>  
            }
        </div>
    )
}

export default Campaign