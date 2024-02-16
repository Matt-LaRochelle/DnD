import '../characters/characters.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useQuestsContext } from '../../../hooks/useQuestsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

const Quests = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { quests, dispatch: questsDispatch } = useQuestsContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuests = async () => {
            setLoading(true);
            const response = await fetch(`/api/quest/${campaigns._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                questsDispatch({type: 'SET_QUESTS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchQuests()
        }
    }, [campaigns, user, questsDispatch])


    const deleteQuest = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/quest/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            questsDispatch({type: 'DELETE_QUEST', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/quest/${id}`);
    }

    const handleClick = () => {
        navigate(`/quest/add`);
    }

    return (
        <div className="characters__container glass">
            <h1>Quests</h1>
            <div className="characters__flexy">
            {!loading && quests.map((quest) => (
                <div className={quest.hidden ? "npc npc-hidden" : "npc"} key={quest._id} style={{ display: quest.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{quest.title}</h3>
                    <img src={quest.image} alt={quest.title} />
                    <button className='button-primary' onClick={() => moreInfo(quest._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteQuest(quest._id)}>Delete</button>}
                </div>
                ))}

            {campaigns.dmID === user.id && 
                <div className="npc" >
                    <h3>Add Quest</h3>
                    <img src="https://static.vecteezy.com/system/resources/previews/002/766/904/non_2x/quest-linear-icons-set-search-for-missing-piece-keys-for-unlocking-map-for-treasure-part-of-quest-customizable-thin-line-contour-symbols-isolated-outline-illustrations-editable-stroke-vector.jpg" alt="Add Quest" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
        </div>
    )
}

export default Quests