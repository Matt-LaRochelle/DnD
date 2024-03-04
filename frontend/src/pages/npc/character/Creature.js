import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

import DOMPurify from 'dompurify'

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'

const Creature = () => {
    const [loading, setLoading] = useState(true)
    const [creature, setCreature] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()

    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')

    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch a Creature's information
        const fetchCreatureInfo = async () => {
            setLoading(true);
            const response = await fetch(`https://dnd-kukm.onrender.com/api/creature/${campaigns._id}/${path}`, {
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
    useEffect(() => {
        if (creature) {
            cleanHTML(creature.description, setDescription);
            cleanHTML(creature.secrets, setSecrets);
        }
    }, [creature]);

    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='character__container glass'>
                    <h1>{creature.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={creature.image} alt={creature.name} />
                        <div>
                            <label>Description</label>
                            <p dangerouslySetInnerHTML={{__html: description}}></p>
                            <label>Alignment</label>
                            <p>{creature.alignment}</p>
                            {campaigns.dmID === user.id && 
                            <div>
                                <label>Secrets</label>
                                <p dangerouslySetInnerHTML={{__html: secrets}}></p>
                            </div>
                            }
                            <label>Native to</label>
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