import '../characters/characters.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Hooks
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'

// Components
import Card from '../../../components/card/Card'
import Loading from '../../../components/loading/Loading'

const Creatures = () => {
    const { user } = useAuthContext()
    const {campaigns } = useCampaignsContext()
    const { creatures, dispatch } = useCreaturesContext()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)


    const handleClick = () => {
        navigate(`/creature/add`);
    }

    return (
        <div className="characters__container glass">
            {loading
            ?   <Loading />
            :   <div>
                    <h1>Creatures</h1>
                    <div className="characters__flexy">
                    {creatures.map((creature) => (
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
                        </div>}
                    </div>
                </div>
            }
        </div>
    )
}

export default Creatures