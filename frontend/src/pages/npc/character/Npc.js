import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

import DOMPurify from 'dompurify'

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'

const Npc = () => {
    const [loading, setLoading] = useState(true)
    const [npc, setNpc] = useState(null)

    const [npcDescription, setNpcDescription] = useState('')
    const [npcVoice, setNpcVoice] = useState('')
    const [npcCatchphrases, setNpcCatchphrases] = useState('')
    const [npcSecrets, setNpcSecrets] = useState('')

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch an NPC's information
        const fetchNPCinfo = async () => {
            setLoading(true);
            const response = await fetch(`https://dnd-kukm.onrender.com/api/npc/${campaigns._id}/${path}`, {
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


    useEffect(() => {
        if (npc) {
            cleanHTML(npc.description, setNpcDescription);
            cleanHTML(npc.voice, setNpcVoice);
            cleanHTML(npc.catchphrases, setNpcCatchphrases);
            cleanHTML(npc.secrets, setNpcSecrets);
        }
    }, [npc]);


    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='character__container glass'>
                    <h1>{npc.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                        <img src={npc.image} alt={npc.name} />
                        <div>
                            <label>Description</label>
                            <p dangerouslySetInnerHTML={{__html: npcDescription}}></p>
                            {campaigns.dmID === user.id && 
                            <div>
                                <label>Voice</label>
                                <p dangerouslySetInnerHTML={{__html: npcVoice}}></p>
                                <label>Catchphrases</label>
                                <p dangerouslySetInnerHTML={{__html: npcCatchphrases}}></p>
                                <label>Secrets</label>
                                <p dangerouslySetInnerHTML={{__html: npcSecrets}}></p>
                            </div>
                            }
                            <label>Last Seen</label>
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