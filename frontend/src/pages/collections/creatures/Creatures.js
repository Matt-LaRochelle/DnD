import '../characters/characters.css'
import { useNavigate } from "react-router-dom"

// Hooks
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'

// Components
import Card from '../../../components/card/Card'

const Creatures = () => {
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { creatures } = useCreaturesContext()

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/creature/add`);
    }

    return (
        <div className="characters__container glass">
            <h1>Creatures</h1>
            <div className="characters__flexy">
            {creatures.filter((creature) => {
                    if (user.id === campaigns.dmID) {
                        return true; // Include all creatures
                    } else {
                        return !creature.hidden; // Exclude creatures with hidden=true
                    }
                }).map((creature) => (
                    <Card 
                        key={creature._id}
                        name={creature.name}
                        image={creature.image}
                        type="creature"
                        id={creature._id}
                        hidden={creature.hidden}
                    />
                ))}

                {campaigns.dmID === user.id && 
                    <div id="card__container" >
                        <h3>Add Creature</h3>
                        <img src="https://www.animal-symbols.com/pictures/animal-symbol_3.png" alt="Add Creature" />
                        <p onClick={handleClick} className='add'>+</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Creatures