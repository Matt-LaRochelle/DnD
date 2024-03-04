import './bento.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

// Context
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { usePcsContext } from '../../hooks/usePcsContext';
import { useNpcsContext } from '../../hooks/useNpcsContext';
import { useCreaturesContext } from '../../hooks/useCreaturesContext';
import { useQuestsContext } from '../../hooks/useQuestsContext';
import { useMapsContext } from '../../hooks/useMapsContext';

// 3rd Party
import DOMPurify from 'dompurify'

// Components
import Maps from '../../components/maps/Maps';
import Npcs from '../../components/npcs/Npcs';
import Pcs from '../../components/pcs/Pcs';
import Creatures from '../../components/creatures/Creatures';
import Quests from '../../components/quests/Quests';
import Loading from '../../components/loading/Loading';
import CharacterRow from '../../components/characterRow/CharacterRow';

// Utils
import { cleanHTML } from '../../utils/CleanHtml'

// Icons
import { FaRegUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { LiaMapSolid } from "react-icons/lia";
import { GiOpenTreasureChest } from "react-icons/gi";
import { FaRobot } from "react-icons/fa6";
import { IoIosImages } from "react-icons/io";
import { FaBookAtlas } from "react-icons/fa6";
import { GiNewspaper } from "react-icons/gi";
import { GiSeaCreature } from "react-icons/gi";


const Bento = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const [loading, setLoading] = useState(true)

    // This sets once we receive all campaign info, then we can
    // fetch the user and dm info from inside the campaign.
    const [stepOne, setStepOne] = useState(false)
    const [loadData, setLoadData] = useState([])


    const [playerInfo, setPlayerInfo] = useState([]);
    const [dmInfo, setDmInfo] = useState({});
    const [settings, setSettings] = useState(null)

    // This variable says whether the current client is DM of this campaign
    const [dm, setDm] = useState(false)

    const [campaignDescription, setCampaignDescription] = useState("")

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
        console.log("loadData", loadData)
        if (loadData.length >= 7) {
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
            const response = await fetch(`https://dnd-kukm.onrender.com/api/campaign/${path}`, {
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
            }
        }

        if (user) {
            fetchCampaign()
        }
    }, [path, user, dispatch])


        // Get all users and dm info for the campaign
        useEffect(() => {
            const fetchUsers = async () => {
                const response = await fetch('https://dnd-kukm.onrender.com/api/user/campaign/' + campaigns._id, {
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
        
        }, [stepOne])

    // Get all npcs for the campaign
    useEffect(() => {
        const fetchNpcs = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/npc/' + campaigns._id, {
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
    
    }, [stepOne])

    // Get all pcs for the campaign
    useEffect(() => {
        const fetchPcs = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/pc/' + campaigns._id, {
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
    
    }, [stepOne])

    // Get all creatures for the campaign
    useEffect(() => {
        const fetchCreatures = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/creature/' + campaigns._id, {
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
    
    }, [stepOne])

    // Get all maps info for the campaign
    useEffect(() => {
        const fetchMaps = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/map/' + campaigns._id, {
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
    
    }, [stepOne])

    // Get all quests info for the campaign
    useEffect(() => {
        const fetchQuests = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/quest/' + campaigns._id, {
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
    
    }, [stepOne])



// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------




    const editCampaign = () => {
        navigate(`/campaign/edit/${campaigns._id}`)
    }

    const moreInfo = (id) => {
        navigate(`/npc/${id}`);
    }



    // For handling inner HTML
    useEffect(() => {
        if (campaigns && stepOne) {
            cleanHTML(campaigns.description, setCampaignDescription);
        }
    }, [campaigns, stepOne]);


    return (
        <div className="bento-wrapper" style={{backgroundImage: `url(${campaigns.image})`}}>
            <div className="bento-item1">
                <h2>{campaigns.title}</h2>
                <p dangerouslySetInnerHTML={{__html: campaignDescription}}></p>
            </div>
            <div className="bento-item2">
                <h2>Campaign Artwork</h2>
                <IoIosImages className="bento-icon" />
            </div>
            <div className="bento-item3" onClick={() => navigate('/maps')}>
                <h2>Maps</h2>
                <LiaMapSolid className="bento-icon" />
            </div>
            <div className="bento-item4" onClick={() => navigate('/quests')}>
            <h2>Quests</h2>
                <GiOpenTreasureChest className="bento-icon" />
            </div>
            <div className="bento-item5" onClick={() => navigate('/creatures')}>
                <h2>Creatures</h2>
                <GiSeaCreature className="bento-icon" />
            </div>
            <div className="bento-item6" onClick={() => navigate('/player-characters')}>
                <h2>Player Characters</h2>
                <FaPeopleGroup className="bento-icon" />
            </div>
            <div className="bento-item7" onClick={() => navigate('/non-player-characters')}>
                <h2>Non Player Characters</h2>
                <FaRobot className="bento-icon" />
            </div>
            <div className="bento-item8">
                <CharacterRow 
                    dmInfo={dmInfo}
                    playerInfo={playerInfo}
                />
            </div>
        </div>
    )
}

export default Bento