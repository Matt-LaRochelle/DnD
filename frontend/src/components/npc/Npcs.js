import './npcs.css'

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

import AddNPC from '../campaign/addNPC/AddNPC';

const Npcs = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)
    const [npcs, setNpcs] = useState(null)

    const {campaigns, dispatch} = useCampaignsContext() 
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNpcs = async () => {
            setLoading(true);
            const response = await fetch(`/api/npc/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log("Step 1: json data from server:", json);

            if (response.ok) {
                setNpcs(json)
                setLoading(false)
            }
        }

        if (user) {
            fetchNpcs()
        }
    }, [path, user, dispatch])

    const moreInfo = (id) => {
        navigate(`/npc/${id}`);
    }

    const handleClick = () => {
        navigate(`/npc/add`);
    }

    return (
        <div className="npcs__container">
            {!loading && npcs.map((npc) => (
                <div className="npc" key={npc._id}>
                    <h3>{npc.name}</h3>
                    <img src={npc.image} alt={npc.name} />
                    <button className='button-primary' onClick={() => moreInfo(npc._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary">Delete</button>}
                </div>
            ))}
            {campaigns.dmID === user.id && 
                <div className="npc" >
                    <h3>Add NPC</h3>
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
        </div>
    )
}

export default Npcs