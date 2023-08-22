import './campaign.scss'
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const Campaign = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const [description, setDescription] = useState('')
    const [descriptionPage, setDescriptionPage] = useState(false)

    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchCampaign = async () => {
            const response = await fetch(`/api/campaigns/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_CAMPAIGN', payload: json})
            }
        }

        if (user) {
            fetchCampaign()
        }
    }, [dispatch, user, path])

    const editButton = () => {
        setDescriptionPage(() => !descriptionPage)
    }

    const handleClick = async (e) => {
        e.preventDefault()
        const response = await fetch(`/api/campaigns/${path}`, {
            method: 'PATCH',
            body: JSON.stringify({description: description}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log(json)
    }


    return (
        <div className="cContainer">
            <h1>{campaigns.title}</h1>
            <div className="cDescription">
                <h3>Description</h3>
                <p>{campaigns.description}</p>
                <button onClick={editButton}>Edit</button>
                {descriptionPage && 
                <div>
                    <input 
                        type="text" 
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}>
                    </input>
                    <button onClick={handleClick}>Submit</button>
                </div>}
            </div>
            <p>Maps</p>
            <p>Player Characters</p>
            <p>NPC's</p>
            <p>Quests</p>
            <p>News</p>
            <p>Lore</p>
            <p>Treasure</p>
            <p>Items</p>
            <p>Creatures</p>
        </div>
    )
}

export default Campaign