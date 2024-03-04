import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'
import DOMPurify from 'dompurify'

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'

const Quest = () => {
    const [loading, setLoading] = useState(true)
    const [quest, setQuest] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()

    const [description, setDescription] = useState('')
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch a Quest's information
        const fetchQuestInfo = async () => {
            setLoading(true);
            const response = await fetch(`https://dnd-kukm.onrender.com/api/quest/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const questInfo = await response.json()

            if (response.ok) {
                setQuest(questInfo)
                setLoading(false)
                console.log(quest)
            }
        }

        if (user) {
            fetchQuestInfo()
        }
    }, [user])

    const goBack = () => {
        navigate(`/campaign/${campaigns._id}`)
    }

    // For handling inner HTML
    useEffect(() => {
        if (quest) {
            cleanHTML(quest.description, setDescription);
        }
    }, [quest]);

    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='character__container glass'>
                    <h1>{quest.title}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={quest.image} alt={quest.title} />
                        <div>
                            <label>Description</label>
                            <p dangerouslySetInnerHTML={{__html: description}}></p>
                            <label>Type</label>
                            <p>{quest.type}</p>
                            <div>
                                <label>Given by</label>
                                <p>{quest.givenBy}</p>
                                <label>Return to</label>
                                <p>{quest.returnTo}</p>
                            </div>
                            {campaigns.dmID === user.id && 
                        <button className="button-primary" onClick={() => navigate(`/quest/edit/${quest._id}`)}>Edit</button>
                            }
                        </div>
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default Quest