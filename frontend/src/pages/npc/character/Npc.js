import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

import DOMPurify from 'dompurify'

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


    // For handling inner HTML
    useEffect(()=> {
        const cleanHtml = () => {
            if (npc.description) {
                let cleanNpcDescription = DOMPurify.sanitize(npc.description)
                setNpcDescription(cleanNpcDescription)
            }
            if (npc.voice) {
                let cleanNpcVoice = DOMPurify.sanitize(npc.voice)
                setNpcVoice(cleanNpcVoice)
            }
            if (npc.catchphrases) {
                let cleanNpcCatchphrases = DOMPurify.sanitize(npc.catchphrases)
                setNpcCatchphrases(cleanNpcCatchphrases)
            }
            if (npc.secrets) {
                let cleanNpcSecrets = DOMPurify.sanitize(npc.secrets)
                setNpcSecrets(cleanNpcSecrets)
            }
        }
        if (npc) {
            cleanHtml()
        }
    }, [npc])


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
                            <p><strong>Description</strong></p>
                            <p dangerouslySetInnerHTML={{__html: npcDescription}}></p>
                            {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Voice</strong></p>
                                <p dangerouslySetInnerHTML={{__html: npcVoice}}></p>
                                <p><strong>Catchphrases</strong></p>
                                <p dangerouslySetInnerHTML={{__html: npcCatchphrases}}></p>
                                <p><strong>Secrets</strong></p>
                                <p dangerouslySetInnerHTML={{__html: npcSecrets}}></p>
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