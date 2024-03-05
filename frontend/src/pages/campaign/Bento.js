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

// Hooks
import { useCampaign } from '../../hooks/useCampaign'
import { useCampaignUsers } from '../../hooks/useCampaignUsers';

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


const Bento = ({ setLoading }) => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    // Load 7 sets of data?
    const [loadData, setLoadData] = useState([])


    // const [playerInfo, setPlayerInfo] = useState([]);
    // const [dmInfo, setDmInfo] = useState({});
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

    // Load the campaign
    const { campaign, isLoading } = useCampaign(path)
    const { dmInfo, playerInfo, isLoading: isLoadingUsers, error } = useCampaignUsers(path)
    

    const navigate = useNavigate()

    useEffect(() => {
        if (user.id === campaigns.dmID) {
            setDm(true);
        }
    }, [user, campaigns])


// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------


    // Get all npcs for the campaign
    useEffect(() => {
        const fetchNpcs = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/npc/' + path, {
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
        if (user) {
            fetchNpcs()
        }
    
    }, [user])

    // Get all pcs for the campaign
    useEffect(() => {
        const fetchPcs = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/pc/' + path, {
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
        if (user) {
            fetchPcs()
        }
    
    }, [user])

    // Get all creatures for the campaign
    useEffect(() => {
        const fetchCreatures = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/creature/' + path, {
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
        if (user) {
            fetchCreatures()
        }
    
    }, [user])

    // Get all maps info for the campaign
    useEffect(() => {
        const fetchMaps = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/map/' + path, {
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
        if (user) {
            fetchMaps()
        }
    
    }, [user])

    // Get all quests info for the campaign
    useEffect(() => {
        const fetchQuests = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/quest/' + path, {
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
        if (user) {
            fetchQuests()
        }
    
    }, [user])



// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------
// ------------------------Get all campaign info------------------------




    const editCampaign = () => {
        navigate(`/campaign/edit/${path}`)
    }

    const moreInfo = (id) => {
        navigate(`/npc/${id}`);
    }



    // For handling inner HTML
    // useEffect(() => {
    //     if (campaigns && stepOne) {
    //         cleanHTML(campaigns.description, setCampaignDescription);
    //     }
    // }, [campaigns, stepOne]);


    return (
        <div className="bento-wrapper" style={{background: `url(${campaigns.image}) center / cover no-repeat`}}>
            <div className="bento-item1" onClick={() => navigate('/campaign')}>
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