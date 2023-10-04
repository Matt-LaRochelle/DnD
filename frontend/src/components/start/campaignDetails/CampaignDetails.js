// import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
// import { Link } from 'react-router-dom'
import './campaignDetails.css'
// date fns
// import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'

const CampaignDetails = ({ campaign }) => {
    // const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()
    const [dmUsername, setDmUsername] = useState('')
    const [playerList, setPlayerList] = useState([])
    const [showID, setShowID] = useState('')


    // This retrieves the DM's username, rather than a mongoID ... can we also get the player names in one function?
    useEffect(() => {
        const getDMusername = async () => {
            const id = campaign.dm;
            const response = await fetch(`/api/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            setDmUsername(json.username)
        }
    getDMusername()
    }, [])


    // This retrieves the Player's usernames, rather than a mongoIDs
    useEffect(() => {
        const getPlayerUsernames = async () => {

            // For each player in the players list: campaign.players

            // fetch that user's username
            // push it to a variable/list on this page

            // const id = campaign.dm;
            const response = await fetch(`/api/user/${campaign.players}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            setPlayerList(playerList + json)
        }
    getPlayerUsernames()
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

    // This shows the campaign ID so the user can send it to other players
    const giveID = () => {
        setShowID(prevValue => !prevValue)
    }
    
    // We can use this link later to go to the actual campaign
    // const path = `/campaign/${campaign._id}`

    return (
        <div className="campaignDetails__container">
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