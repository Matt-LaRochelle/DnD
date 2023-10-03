import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link } from 'react-router-dom'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect } from 'react'

const CampaignDetails = ({ campaign }) => {
    // const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

    useEffect(() => {
        const getDMusername = async () => {
        const dm = await fetch(`/api/user/${campaign.dm}`)
        console.log("dm object", dm);
        // const dmUsername = dm.username
        // console.log("dm Username:", dmUsername)
        }
    getDMusername()
    }, [])

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

    const giveID = () => {
        console.log(campaign._id)
    }
    
    const path = `/campaign/${campaign._id}`
    return (
        <div className="campaign-details">
            <h4>"Campaign Title" {campaign.title}</h4>
            <p>"DM": {campaign.dm}</p>
            <p>{campaign.hidden ? "hidden" : "visible" }</p>
            <p>"Description" {campaign.description}</p>
            <p>"List of players" {campaign.players}</p>
            {/* <p>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</p> */}
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            {/* <Link to={path}>Enter</Link> */}
            <button onClick={giveID}>Check ID</button>
        </div>
    )
}

export default CampaignDetails