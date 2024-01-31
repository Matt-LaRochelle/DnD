import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

const Pc = () => {
    const [loading, setLoading] = useState(true)
    const [pc, setPc] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    console.log("campaign id", campaigns._id)

    useEffect(() => {
        // Fetch an NPC's information
        const fetchPCinfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/pc/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const pcInfo = await response.json()

            if (response.ok) {
                setPc(pcInfo)
                setLoading(false)
            }
        }

        if (user) {
            fetchPCinfo()
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
                    <h1>{pc.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={pc.image} alt={pc.name} />
                        <div>
                            <p><strong>Description</strong></p>
                            <p>{pc.description}</p>
                            {pc.userID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p>{pc.secrets}</p>
                            </div>
                            }
                            <p><strong>Last Seen</strong></p>
                            <p>{pc.lastSeen}</p>
                            <p><strong>Played by: </strong>{pc.userID}</p>
                            {pc.userID === user.id && 
                        <button className="button-primary" onClick={() => navigate(`/pc/edit/${pc._id}`)}>Edit</button>
                            }
                        </div>
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default Pc