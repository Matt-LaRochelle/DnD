import './characters.css'
import { useNavigate } from "react-router-dom"

// Context
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

// Components
import Card from '../../../components/card/Card'

const NonPlayerCharacters = () => {
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { npcs } = useNpcsContext()

    const navigate = useNavigate()

    const handleNpcClick = () => {
        navigate(`/npc/add`);
    }


    return (
        <div className="characters__container glass">
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
                    </div>
                }
            </div>
        </div>
    )
}

export default NonPlayerCharacters