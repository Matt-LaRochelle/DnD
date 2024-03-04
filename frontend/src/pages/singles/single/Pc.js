import './character.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Hooks
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

// Components
import Loading from '../../../components/loading/Loading'

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'

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
            const response = await fetch(`https://dnd-kukm.onrender.com/api/pc/${campaigns._id}/${path}`, {
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


    useEffect(() => {
        if (pc) {
            cleanHTML(pc.description, setPcDescription);
            cleanHTML(pc.secrets, setPcSecrets);
        }
    }, [pc]);


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
                            <label>Description</label>
                            <p dangerouslySetInnerHTML={{__html: pcDescription}}></p>
                            {pc.userID === user.id && 
                            <div>
                                <label>Secrets</label>
                                <p dangerouslySetInnerHTML={{__html: pcSecrets}}></p>
                            </div>
                            }
                            <label>Last Seen</label>
                            <p>{pc.lastSeen}</p>
                            <label>Played by</label>
                            <p>{pc.playedBy}</p>
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