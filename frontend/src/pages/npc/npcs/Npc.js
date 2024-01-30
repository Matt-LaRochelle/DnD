import './npc.css'

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

const Npc = () => {
    const [loading, setLoading] = useState(true)
    const [npc, setNpc] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]

    console.log("campaign id", campaigns._id)

    useEffect(() => {
        // Fetch the campaigns which this user is a DM or Player for
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


    return (
        <div>
            {loading
                ?
                <h1>Loading...</h1>
                :
                <div className='npc__container'>
                    <h1>{npc.name}</h1>
                    <div className='npc__grid'>
                    <img src={npc.image} alt={npc.name} />
                        <div>
                            <p><strong>Description</strong></p>
                            <p>{npc.description}</p>
                            <p><strong>Last Seen</strong></p>
                            <p>{npc.lastSeen}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Npc