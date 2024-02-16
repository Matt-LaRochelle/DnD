import '../characters/characters.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

const Creatures = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { creatures, dispatch: creaturesDispatch } = useCreaturesContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCreatures = async () => {
            setLoading(true);
            const response = await fetch(`/api/creature/${campaigns._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                creaturesDispatch({type: 'SET_CREATURES', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchCreatures()
        }
    }, [campaigns, user, creaturesDispatch])


    const deleteCreature = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/creature/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            creaturesDispatch({type: 'DELETE_CREATURE', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/creature/${id}`);
    }

    const handleClick = () => {
        navigate(`/creature/add`);
    }

    return (
        <div className="characters__container glass">
            <h1>Creatures</h1>
            <div className="characters__flexy">
            {!loading && creatures.map((creature) => (
                <div className={creature.hidden ? "npc npc-hidden" : "npc"} key={creature._id} style={{ display: creature.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{creature.name}</h3>
                    <img src={creature.image} alt={creature.name} />
                    <button className='button-primary' onClick={() => moreInfo(creature._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteCreature(creature._id)}>Delete</button>}
                </div>
                ))}

            {campaigns.dmID === user.id && 
                <div className="npc" >
                    <h3>Add Creature</h3>
                    <img src="https://www.animal-symbols.com/pictures/animal-symbol_3.png" alt="Add Map" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
        </div>
    )
}

export default Creatures