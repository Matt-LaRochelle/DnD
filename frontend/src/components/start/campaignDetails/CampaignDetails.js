import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link } from 'react-router-dom'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'

const CampaignDetails = ({ campaign }) => {
    // const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()
    const [dmUsername, setDmUsername] = useState('')
    const [showID, setShowID] = useState('')

    useEffect(() => {
        const getDMusername = async () => {
            const id = campaign.dm;
            // console.log(id);
            const response = await fetch(`/api/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log(json.username)
            setDmUsername(json.username)
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
        setShowID(prevValue => !prevValue)
    }
    
    const path = `/campaign/${campaign._id}`
    return (
        <div className="campaign-details">
            <h4>"Campaign Title" {campaign.title}</h4>
            <p>"DM": {dmUsername}</p>
            <p>"Description" {campaign.description}</p>
            <p>"List of players" {campaign.players}</p>
            <p>{campaign.hidden ? "This campaign is hidden." : "This campaign is visible." }</p>
            {/* <p>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</p> */}
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            {/* <Link to={path}>Enter</Link> */}
            <p onClick={giveID}>Check ID <p className="campaign-details__id" style={{display: showID ? "inline" : "none"}}>{campaign._id}</p></p>
        </div>
    )
}

export default CampaignDetails