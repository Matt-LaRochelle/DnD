import './map.css'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Context
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../../hooks/useCampaignsContext'
import { useMapsContext } from '../../../../hooks/useMapsContext'

// 3rd Party
import DOMPurify from 'dompurify';

const MapDescription = () => {
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { maps, dispatch } = useMapsContext()
    const navigate = useNavigate()

    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')

    // For handling inner HTML
    useEffect(()=> {
        const cleanHtml = () => {
            if (maps.description) {
                let cleanDescription = DOMPurify.sanitize(maps.description)
                setDescription(cleanDescription)
            }
            if (maps.secrets) {
                let cleanSecrets = DOMPurify.sanitize(maps.secrets)
                setSecrets(cleanSecrets)
            }
        }
        if (maps) {
            cleanHtml()
        }
    }, [maps])

    return (
        <div>
            <h2>Description</h2>
            <p dangerouslySetInnerHTML={{__html: description}}></p>
            {campaigns.dmID === user.id && 
                <div>
                    <p><strong>Secrets</strong></p>
                    <p dangerouslySetInnerHTML={{__html: secrets}}></p>
                </div>
            }
            {campaigns.dmID === user.id && 
                <button className="button-primary" onClick={() => navigate(`/map/edit/${maps._id}`)}>Edit</button>
            }
        </div>
    )
}

export default MapDescription;