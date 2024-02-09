import './character.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

import Loading from '../../../components/loading/Loading'

const Quest = () => {
    const [loading, setLoading] = useState(true)
    const [quest, setQuest] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch a Quest's information
        const fetchQuestInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/quest/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const questInfo = await response.json()

            if (response.ok) {
                setQuest(questInfo)
                setLoading(false)
            }
        }

        if (user) {
            fetchQuestInfo()
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
                    <h1>{quest.title}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className='character__grid'>
                    <img src={quest.image} alt={quest.title} />
                        <div>
                            <p><strong>Description</strong></p>
                            <p>{quest.description}</p>
                            <p><strong>Type</strong></p>
                            <p>{quest.type}</p>
                            {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Given by</strong></p>
                                <p>{quest.givenBy}</p>
                                <p><strong>Return to</strong></p>
                                <p>{quest.returnTo}</p>
                            </div>
                            }
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