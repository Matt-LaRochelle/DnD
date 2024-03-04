import './campaign.css'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

// Context
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

// Utils
import { cleanHTML } from '../../utils/CleanHtml'

// Components
import Loading from '../../components/loading/Loading';
import CharacterRow from '../../components/characterRow/CharacterRow';


const Campaign = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [playerInfo, setPlayerInfo] = useState([]);
    const [dmInfo, setDmInfo] = useState({});


    // This variable says whether the current client is DM of this campaign
    const [dm, setDm] = useState(false)

    const [campaignDescription, setCampaignDescription] = useState("")

    const {campaigns } = useCampaignsContext() 
    const { user } = useAuthContext()



    useEffect(() => {
        if (user.id === campaigns.dmID) {
            setDm(true);
        }
    }, [user, campaigns])


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
                setLoading(false)
            }
        }
        if (user) {
            fetchUsers()
        }
    
    }, [user])



    const editCampaign = () => {
        navigate(`/campaign/edit/${campaigns._id}`)
    }


    // For handling inner HTML
    useEffect(() => {
        if (campaigns) {
            cleanHTML(campaigns.description, setCampaignDescription);
        }
    }, [campaigns]);


    return (
        <div className="campaign__Container">
            {loading 
            ?   
                <Loading />             
            :   
                <div className='loaded'>
                    <h1>{campaigns.title}</h1>
                    <div className="campaign__Description">
                        <p dangerouslySetInnerHTML={{__html: campaignDescription}}></p>
                        {campaigns.image && <img src={campaigns.image} alt={campaigns.title} />}
                    </div>
                    <div className='campaign__users'>
                        {dm && <button className="button-primary" onClick={editCampaign}>Edit this Campaign</button>}
                        <div className="campaign__players">
                            <CharacterRow 
                                dmInfo={dmInfo}
                                playerInfo={playerInfo}
                            />
                        </div>
                    </div>
                </div>  
            }
        </div>
    )
}

export default Campaign