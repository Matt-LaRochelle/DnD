import './characters.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Context
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import Loading from '../../../components/loading/Loading'

const NonPlayerCharacters = () => {
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { npcs, dispatch } = useNpcsContext()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)


    const deleteNPC = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`https://dnd-kukm.onrender.com/api/npc/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_NPC', payload: json})
            setLoading(false)
            
        }
    }

    const moreNpcInfo = (id) => {
        navigate(`/npc/${id}`);
    }

    const handleNpcClick = () => {
        navigate(`/npc/add`);
    }


    return (
        <div className="characters__container glass">
            {loading
            ?   <Loading />
            :   <div>
                    <h2>Non Player Characters</h2>
                    <div className="characters__flexy">
                    {npcs.map((npc) => (
                        <div className={npc.hidden ? "npc npc-hidden" : "npc"} key={npc._id} style={{ display: npc.hidden && user.id !== campaigns.dmID && "none"}}>
                        <h3>{npc.name}</h3>
                            <img src={npc.image} alt={npc.name} />
                            <button className='button-primary' onClick={() => moreNpcInfo(npc._id)}>More Info</button>
                            {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteNPC(npc._id)}>Delete</button>}
                        </div>
                        ))}
                    {campaigns.dmID === user.id && 
                        <div className="npc" >
                            <h3>Add NPC</h3>
                            <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add NPC" />
                            <p onClick={handleNpcClick} className='add'>+</p>
                        </div>}
                    </div>
                </div>
            }
        </div>
    )
}

export default NonPlayerCharacters