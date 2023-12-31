// import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link } from 'react-router-dom'
import './campaignDetails.css'
// date fns
// import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'

const CampaignDetails = ({ campaign }) => {
    // const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()
    const [showID, setShowID] = useState('')
    const [dmRole, setDmRole] = useState(false);

    useEffect(() => {
        if (user.id === campaign.dmID) {
            setDmRole(true);
        }
    }, [])

    // This deletes the DM's campaign
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
            // dispatch({type: 'DELETE_CAMPAIGN', payload: json})
        }
    }

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
            console.log('new campaign deleted', json)
            // dispatch({type: 'CREATE_CAMPAIGN', payload: json})
        }
    }

    // This shows the campaign ID so the user can send it to other players
    const giveID = () => {
        setShowID(prevValue => !prevValue)
    }
    
    // We can use this link later to go to the actual campaign
    const path = `/campaign/${campaign._id}`

    return (
        <div className="campaignDetails__container">
            <h4>Campaign Title {campaign.title}</h4>
            <p>DM {campaign.dmUsername}</p>
            <p>Description {campaign.description}</p>
            <p>List of players {campaign.playerUsernames.map((username) => (
                <p>{username}</p>
            ))}</p>
            <p>{campaign.hidden ? "This campaign is hidden." : "This campaign is visible." }</p>
            {/* <p>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</p> */}
            <Link to={path}>Enter</Link>

            {dmRole 
                ?   <div>
                        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
                        <p onClick={giveID}>Check ID</p>
                        <p className="campaign-details__id" style={{display: showID ? "inline" : "none"}}>{campaign._id}</p>
                    </div>
                :   <span onClick={leaveCampaign}>Leave Campaign</span>
                }
        </div>
    )
}

export default CampaignDetails