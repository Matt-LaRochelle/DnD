import './character.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Hooks
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'

// Components
import Loading from '../../../components/loading/Loading'

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
    const { npcs } = useNpcsContext()

    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    // Get individual NPC's information
    useEffect(() => {
        setLoading(true);
        const individualNpc = npcs.find(npc => npc._id === path);

        if (individualNpc) {
            setNpc(individualNpc);
        }

        setLoading(false);
    }, [])

    const goBack = () => {
        navigate(`/campaign/${campaigns._id}`)
    }

    // Clean HTML
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
                        <div className="character-information">
                            <label className="first-label">Description</label>
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