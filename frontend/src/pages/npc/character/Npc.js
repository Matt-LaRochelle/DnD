import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

const Npc = () => {
    const [loading, setLoading] = useState(true)
    const [npc, setNpc] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch an NPC's information
        const fetchNPCinfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/npc/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const npcInfo = await response.json()

            if (response.ok) {
                setNpc(npcInfo)
                setLoading(false)
            }
        }

        if (user) {
            fetchNPCinfo()
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
                    <h1>{npc.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={npc.image} alt={npc.name} />
                        <div>
                            <p><strong>Description</strong></p>
                            <p>{npc.description}</p>
                            {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p>{npc.secrets}</p>
                            </div>
                            }
                            <p><strong>Last Seen</strong></p>
                            <p>{npc.lastSeen}</p>
                            {campaigns.dmID === user.id && 
                        <button className="button-primary" onClick={() => navigate(`/npc/edit/${npc._id}`)}>Edit</button>
                            }
                        </div>
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default Npc