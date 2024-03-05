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


import { useCampaignsContext } from '../../hooks/useCampaignsContext';
import { usePcsContext } from '../../hooks/usePcsContext';
import { useNpcsContext } from '../../hooks/useNpcsContext';




const Campaign = () => {
    const [loading, setLoading] = useState(true)

    const location = useLocation();
    const path = location.pathname.split("/")[2];

    // Load 7 sets of data?
    const [loadData, setLoadData] = useState([])

    // Load the campaign
    const { isLoading, error } = useCampaign(path)
    const { dmInfo, playerInfo, isLoading: isLoadingUsers, error: errorUsers } = useCampaignUsers(path)
    const { isLoading: isLoadingNpcs, error: errorNpcs } = useNpcs(path)
    const { isLoading: isLoadingPcs, error: errorPcs } = usePcs(path)

    const { campaigns } = useCampaignsContext() 
    const { pcs } = usePcsContext()
    const { npcs } = useNpcsContext()

    useEffect(() => {
        console.log("loadData", loadData)
        if (loadData.length >= 7) {
            setLoading(false)
        }
    }, [loadData])

    useEffect(() => {
        if (!isLoading) {
            console.log("campaign", campaigns)
            setLoadData(prevLoadData => [...prevLoadData, "campaign"])
        }
        if (!isLoadingUsers) {
            console.log("campaign users", playerInfo)
            setLoadData(prevLoadData => [...prevLoadData, "users"])
        }
        if (!isLoadingNpcs) {
            console.log("npcs", npcs)
            setLoadData(prevLoadData => [...prevLoadData, "npcs"])
        }
        if (!isLoadingPcs) {
            console.log("pcs", pcs)
            setLoadData(prevLoadData => [...prevLoadData, "pcs"])
        }
    }, [isLoading, isLoadingUsers, isLoadingNpcs, isLoadingPcs])

    return (
        <div className="campaign__Container">
            {loading ? <Loading /> : <Bento setLoading={setLoading} />}
        </div>
    )
}

export default Campaign