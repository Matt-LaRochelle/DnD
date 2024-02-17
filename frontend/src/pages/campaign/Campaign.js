import './campaign.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { usePcsContext } from '../../hooks/usePcsContext';
import { useNpcsContext } from '../../hooks/useNpcsContext';
import { useCreaturesContext } from '../../hooks/useCreaturesContext';
import { useQuestsContext } from '../../hooks/useQuestsContext';
import { useMapsContext } from '../../hooks/useMapsContext';
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


    const [playerInfo, setPlayerInfo] = useState([]);
    const [dmInfo, setDmInfo] = useState({});

    const [settings, setSettings] = useState(null)

    // This variable says whether the current client is DM of this campaign
    const [dm, setDm] = useState(false)

    // const [campaign, setCampaign] = useState({})
    // This sets once we receive all campaign info, then we can
    // fetch the user and dm info from inside the campaign.
    const [stepOne, setStepOne] = useState(false)
    const [loadData, setLoadData] = useState([])

    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()
    const { pcs, dispatch: dispatchPcs } = usePcsContext()
    const { npcs, dispatch: dispatchNpcs } = useNpcsContext()
    const { creatures, dispatch: dispatchCreatures } = useCreaturesContext()
    const { quests, dispatch: dispatchQuests } = useQuestsContext()
    const { maps, dispatch: dispatchMaps } = useMapsContext()

    const navigate = useNavigate()

    useEffect(() => {
        if (user.id === campaigns.dmID) {
            setDm(true);
        }
    }, [user, campaigns])

    useEffect(() => {
        if (loadData.length === 7) {
            setLoading(false)
        }
    }, [loadData])


// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------

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
                setLoadData(prevLoadData => [...prevLoadData, "campaign"])
                setStepOne(true);
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
                    setLoadData(prevLoadData => [...prevLoadData, "users"])
                }
            }
            if (user && stepOne) {
                fetchUsers()
            }
        
        }, [user, stepOne])

    // Get all npcs for the campaign
    useEffect(() => {
        const fetchNpcs = async () => {
            const response = await fetch('/api/npc/' + campaigns._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatchNpcs({type: 'SET_NPCS', payload: json})
                setLoadData(prevLoadData => [...prevLoadData, "npcs"])
            }
        }
        if (user && stepOne) {
            fetchNpcs()
        }
    
    }, [user, stepOne])

    // Get all pcs for the campaign
    useEffect(() => {
        const fetchPcs = async () => {
            const response = await fetch('/api/pc/' + campaigns._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatchPcs({type: 'SET_PCS', payload: json})
                setLoadData(prevLoadData => [...prevLoadData, "pcs"])
            }
        }
        if (user && stepOne) {
            fetchPcs()
        }
    
    }, [user, stepOne])

    // Get all creatures for the campaign
    useEffect(() => {
        const fetchCreatures = async () => {
            const response = await fetch('/api/creature/' + campaigns._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatchCreatures({type: 'SET_CREATURES', payload: json})
                setLoadData(prevLoadData => [...prevLoadData, "creatures"])
            }
        }
        if (user && stepOne) {
            fetchCreatures()
        }
    
    }, [user, stepOne])

    // Get all maps info for the campaign
    useEffect(() => {
        const fetchMaps = async () => {
            const response = await fetch('/api/map/' + campaigns._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatchMaps({type: 'SET_MAPS', payload: json})
                setLoadData(prevLoadData => [...prevLoadData, "maps"])
            }
        }
        if (user && stepOne) {
            fetchMaps()
        }
    
    }, [user, stepOne])

    // Get all quests info for the campaign
    useEffect(() => {
        const fetchQuests = async () => {
            const response = await fetch('/api/quest/' + campaigns._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatchQuests({type: 'SET_QUESTS', payload: json})
                setLoadData(prevLoadData => [...prevLoadData, "quests"])
            }
        }
        if (user && stepOne) {
            fetchQuests()
        }
    
    }, [user, stepOne])



// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------




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
                        (dm  && settings.maps) ? {display: "block"} :
                        (maps.length === 0 ||
                        !settings.maps || 
                        maps.every(map => map.hidden)) ? 
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
                        (npcs.length === 0 ||
                        !settings.nonPlayerCharacters || 
                        npcs.every(npc => npc.hidden)) ? 
                        {display: "none"} : {}
                    }>
                        <h2 className="campaign__heading">NPCs</h2>
                        <Npcs dm={campaigns.dmID} />                    
                    </div>

                    <div style={
                        (dm  && settings.creatures) ? {display: "block"} :
                        (creatures.length === 0 ||
                        !settings.creatures || 
                        creatures.every(creature => creature.hidden)) ? 
                        {display: "none"} : {}
                    }>
                        <h2 className="campaign__heading">Creatures</h2>
                        <Creatures dm={campaigns.dmID} />                    
                    </div>

                    <div style={
                        (dm  && settings.quests) ? {display: "block"} :
                        (quests.length === 0 ||
                        !settings.quests || 
                        quests.every(quest => quest.hidden)) ? 
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