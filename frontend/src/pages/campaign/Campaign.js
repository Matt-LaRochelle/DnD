import './campaign.css'
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";

// Components
import Loading from '../../components/loading/Loading';
import Bento from './Bento';

// Hooks
import { useCampaign } from '../../hooks/useCampaign'
import { useCampaignUsers } from '../../hooks/useCampaignUsers';
import { useNpcs } from '../../hooks/useNpcs';
import { usePcs } from '../../hooks/usePcs';
import { useCreatures } from '../../hooks/useCreatures';
import { useQuests } from '../../hooks/useQuests';
import { useMaps } from '../../hooks/useMaps';
import CharacterRow from '../../components/characterRow/CharacterRow';



const Campaign = () => {
    const [loading, setLoading] = useState(true)

    const location = useLocation();
    const path = location.pathname.split("/")[2];

    // Load the campaign
    const { isLoading, error } = useCampaign(path)
    const { dmInfo, playerInfo, isLoading: isLoadingUsers, error: errorUsers } = useCampaignUsers(path)
    const { isLoading: isLoadingNpcs, error: errorNpcs } = useNpcs(path)
    const { isLoading: isLoadingPcs, error: errorPcs } = usePcs(path)
    const { isLoading: isLoadingCreatures, error: errorCreatures } = useCreatures(path)
    const { isLoading: isLoadingQuests, error: errorQuests } = useQuests(path)
    const { isLoading: isLoadingMaps, error: errorMaps } = useMaps(path)
    

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