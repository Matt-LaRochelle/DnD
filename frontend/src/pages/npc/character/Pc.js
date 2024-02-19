import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

import DOMPurify from 'dompurify'

const Pc = () => {
    const [loading, setLoading] = useState(true)
    const [pc, setPc] = useState(null)

    const [pcDescription, setPcDescription] = useState('')
    const [pcSecrets, setPcSecrets] = useState('')

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

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


 // For handling inner HTML
 useEffect(()=> {
    const cleanHtml = () => {
        if (pc.description) {
            let cleanPcDescription = DOMPurify.sanitize(pc.description)
            setPcDescription(cleanPcDescription)
        }

        if (pc.secrets) {
            let cleanPcSecrets = DOMPurify.sanitize(pc.secrets)
            setPcSecrets(cleanPcSecrets)
        }
    }
    if (pc) {
        cleanHtml()
    }
}, [pc])


    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='character__container glass'>
                    <h1>{pc.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={pc.image} alt={pc.name} />
                        <div>
                            <p><strong>Description</strong></p>
                            <p dangerouslySetInnerHTML={{__html: pcDescription}}></p>
                            {pc.userID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p dangerouslySetInnerHTML={{__html: pcSecrets}}></p>
                            </div>
                            }
                            <p><strong>Last Seen</strong></p>
                            <p>{pc.lastSeen}</p>
                            <p><strong>Played by: </strong>{pc.username}</p>
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