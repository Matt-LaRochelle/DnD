import '../characters/characters.css'
import './quest.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useQuestsContext } from '../../../hooks/useQuestsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

import Loading from '../../../components/loading/Loading'

import { GiStairsGoal } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { GiAchievement } from "react-icons/gi";

const Quests = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { quests, dispatch: questsDispatch } = useQuestsContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuests = async () => {
            setLoading(true);
            const response = await fetch(`https://dnd-kukm.onrender.com/api/quest/${campaigns._id}`, {
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
        const response = await fetch(`https://dnd-kukm.onrender.com/api/quest/${id}`, {
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

    const handleClickMain = () => {
        navigate(`/quest/add-main`);
    }
    const handleClickSide = () => {
        navigate(`/quest/add-side`);
    }
    const handleClickPersonal = () => {
        navigate(`/quest/add/${user.id}`);
    }

    return (
        <main className="characters__container glass">
            {loading ? <Loading /> : 
            <div className="quest-grid">
                <div className="quest-column1">
                    <GiStairsGoal className="quest-icon" />
                    <GoGoal className="quest-icon" />
                    <GiAchievement className="quest-icon" />
                </div>
                <div className="quest-column2">
                    <h2><GiStairsGoal className="quest-icon" /> Main Quests</h2>
                    {quests.filter(quest => quest.type === "Main").map((quest) => (
                        <div className={quest.hidden ? "quest quest-hidden" : "quest"} onClick={() => moreInfo(quest._id)} key={quest._id} style={{ display: quest.hidden && user.id !== campaigns.dmID && "none"}}>
                            <h3>
                                {quest.title}
                                {campaigns.dmID === user.id && <span className="material-symbols-outlined button-secondary trash" onClick={() => deleteQuest(quest._id)}>delete</span>}
                            </h3>
                        </div>
                    ))}
                    {campaigns.dmID === user.id && 
                    <div className="quest" onClick={handleClickMain}>
                        <h3>Add Main Quest</h3>
                    </div>}
                    <h2><GoGoal className="quest-icon" /> Side Quests</h2>
                    {quests.filter(quest => quest.type === "Side").map((quest) => (
                        <div className={quest.hidden ? "quest quest-hidden" : "quest"} onClick={() => moreInfo(quest._id)} key={quest._id} style={{ display: quest.hidden && user.id !== campaigns.dmID && "none"}}>
                            <h3>{quest.title}</h3>
                            {campaigns.dmID === user.id && <span className="material-symbols-outlined button-secondary trash" onClick={() => deleteQuest(quest._id)}>delete</span>}
                        </div>
                    ))}
                    {campaigns.dmID === user.id && 
                    <div className="quest" onClick={handleClickSide}>
                        <h3>Add Side Quest</h3>
                    </div>}
                    <h2><GiAchievement className="quest-icon" /> Personal Quests</h2>
                    {quests.filter(quest => quest.type === "Personal").map((quest) => (
                        <div className={quest.hidden ? "quest quest-hidden" : "quest"} onClick={() => moreInfo(quest._id)} key={quest._id} style={{ display: quest.hidden && user.id !== campaigns.dmID && "none"}}>
                            <h3>{quest.title}</h3>
                            {campaigns.dmID === user.id && <span className="material-symbols-outlined button-secondary trash" onClick={() => deleteQuest(quest._id)}>delete</span>}
                        </div>
                    ))}
                    {campaigns.dmID !== user.id && 
                    <div className="quest" onClick={handleClickPersonal}>
                        <h3>Add Personal Quest</h3>
                    </div>}
                </div>
                <div className="quest-column3">
                    
                </div>
            </div>}
            
        </main>
    )
}

export default Quests








{/* <h1>Quests</h1>
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
                </div> */}