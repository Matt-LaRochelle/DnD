import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link } from 'react-router-dom'
import './campaignDetails.css'
// date fns
// import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'

import CharacterRow from '../../characterRow/CharacterRow'

const CampaignDetails = ({ campaign }) => {
    const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()
    const [showID, setShowID] = useState('')
    const [dmRole, setDmRole] = useState(false);

    const [playerInfo, setPlayerInfo] = useState([]);
    const [dmInfo, setDmInfo] = useState({});

    useEffect(() => {
        if (user.id === campaign.dmID) {
            setDmRole(true);
        }
    }, [])

    // Get all users and dm info for the campaign
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/user/campaign/' + campaign._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                setPlayerInfo(json.users)
                setDmInfo(json.dm)
            }
        }
        fetchUsers()
    
    }, [])

    // This deletes the DM's campaign - only available for DMs
    const handleClick = async () => {
        if (!user) {
            return
        }
        const response = await fetch('/api/campaign/' + campaign._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_CAMPAIGN', payload: json})
        }
    }

    // Removes the player from the campaign - only available for players
    const leaveCampaign = async () => {
        const leavingPlayer = {
            campaignID: campaign._id,
            playerID: user.id,
            playerUsername: user.username
        }

        const response = await fetch("/api/campaign/leave", {
            method: 'PATCH',
            body: JSON.stringify(leavingPlayer),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            // Deletes campaign from frontend context
            dispatch({type: 'DELETE_CAMPAIGN', payload: json})
        }
    }

    // This shows the campaign ID so the user can send it to other players
    const giveID = () => {
        setShowID(prevValue => !prevValue)
    }
    
    // We can use this link later to go to the actual campaign
    const path = `/campaign/${campaign._id}`

    return (
        <div key={campaign._id} className="campaignDetails__container">
            <h2>{campaign.title}</h2>
            <h3>Description:</h3> 
            <p>{campaign.description}</p>
            <div className="campaignDetails__list">
                <CharacterRow 
                    playerInfo={playerInfo}
                    dmInfo={dmInfo}
                />
            </div>
            {/* <p>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</p> */}
            <Link to={path} className="button-primary campaignDetails__enter">Enter</Link>

            {dmRole 
                ?   <div>
                        <span className="material-symbols-outlined button-secondary trash" onClick={handleClick}>delete</span>
                        <p className="button-primary campaignDetails__id-checker" onClick={giveID}>Check Campaign Room Number</p>
                        <p className="campaign-details__id" style={{display: showID ? "inline" : "none"}}>{campaign._id}</p>
                    </div>
                :   <span className="button-secondary" onClick={leaveCampaign}>Leave Campaign</span>
                }
        </div>
    )
}

export default CampaignDetails