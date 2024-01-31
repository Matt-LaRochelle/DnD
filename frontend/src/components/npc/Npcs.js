import './npcs.css'

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNpcsContext } from '../../hooks/useNpcsContext'

const Npcs = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const {campaigns, dispatch} = useCampaignsContext()
    const { npcs, dispatch: npcsDispatch } = useNpcsContext()
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
                npcsDispatch({type: 'SET_NPCS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchNpcs()
        }
    }, [path, user, dispatch])


    const deleteNPC = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/npc/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log("Step 1: json data from server:", json);

        if (response.ok) {
            npcsDispatch({type: 'DELETE_NPC', payload: json})
            setLoading(false)
            
        }
    }

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
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteNPC(npc._id)}>Delete</button>}
                </div>
            ))}
            {campaigns.dmID === user.id && 
                <div className="npc" >
                    <h3>Add NPC</h3>
                    <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add NPC" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
        </div>
    )
}

export default Npcs