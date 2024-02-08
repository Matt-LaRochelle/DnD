import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

const Creature = () => {
    const [loading, setLoading] = useState(true)
    const [creature, setCreature] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch a Creature's information
        const fetchCreatureInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/creature/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const creatureInfo = await response.json()

            if (response.ok) {
                setCreature(creatureInfo)
                setLoading(false)
            }
        }

        if (user) {
            fetchCreatureInfo()
        }
    }, [user])

    const goBack = () => {
        navigate(`/campaign/${campaigns._id}`)
    }


    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='character__container'>
                    <h1>{creature.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={creature.image} alt={creature.name} />
                        <div>
                            <p><strong>Description</strong></p>
                            <p>{creature.description}</p>
                            <p><strong>Alignment</strong></p>
                            <p>{creature.alignment}</p>
                            {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p>{creature.secrets}</p>
                            </div>
                            }
                            <p><strong>Native to</strong></p>
                            <p>{creature.nativeTo}</p>
                            {campaigns.dmID === user.id && 
                        <button className="button-primary" onClick={() => navigate(`/creature/edit/${creature._id}`)}>Edit</button>
                            }
                        </div>
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default Creature