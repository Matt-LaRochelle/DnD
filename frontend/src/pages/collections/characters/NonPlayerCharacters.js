import './characters.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Context
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

// Components
import Card from '../../../components/card/Card'
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
                        <Card 
                                key={npc._id}
                                name={npc.name}
                                image={npc.image}
                                type="npc"
                                id={npc._id}
                                hidden={npc.hidden}
                            />
                        ))}
                    {campaigns.dmID === user.id && 
                        <div id="card__container" >
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