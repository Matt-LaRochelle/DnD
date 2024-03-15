import './campaign.css'
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";

// Components
import Loading from '../../components/loading/Loading';
import Bento from './Bento';

// Hooks
import { useCampaign } from '../../hooks/useCampaign'
import { useCampaignUsers } from '../../hooks/useCampaignUsers';
import { useFetch } from '../../hooks/useFetch';
import CharacterRow from '../../components/characterRow/CharacterRow';



const Campaign = () => {
    const [loading, setLoading] = useState(true)

    const location = useLocation();
    const path = location.pathname.split("/")[2];
    console.log("path", path)

    // Load the campaign
    const { isLoading, error } = useCampaign(path)
    const { dmInfo, playerInfo, isLoading: isLoadingUsers, error: errorUsers } = useCampaignUsers(path)
    const { isLoading: isLoadingNpcs, error: errorNpcs } = useFetch(`npc/${path}`, 'npc')
    const { isLoading: isLoadingPcs, error: errorPcs } = useFetch(`pc/${path}`, 'pc')
    const { isLoading: isLoadingCreatures, error: errorCreatures } = useFetch(`creature/${path}`, 'creature')
    const { isLoading: isLoadingQuests, error: errorQuests } = useFetch(`quest/${path}`, 'quest')
    const { isLoading: isLoadingMaps, error: errorMaps } = useFetch(`map/${path}`, 'map')
    

    useEffect(() => {
        if (!isLoading &&
            !isLoadingUsers &&
            !isLoadingNpcs &&
            !isLoadingPcs &&
            !isLoadingCreatures &&
            !isLoadingQuests &&
            !isLoadingMaps) {
            setLoading(false)
        }
    }, [
        isLoading, 
        isLoadingUsers, 
        isLoadingNpcs, 
        isLoadingPcs, 
        isLoadingCreatures, 
        isLoadingQuests, 
        isLoadingMaps
    ])

    return (
        <div className="campaign__Container">
            {loading 
            ? <Loading /> 
            : <div className="bento-characterRow-separation">
                <Bento dmInfo={dmInfo} playerInfo={playerInfo} />
                <CharacterRow dmInfo={dmInfo} playerInfo={playerInfo} />
            </div>}
        </div>
    )
}

export default Campaign