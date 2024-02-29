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

import DOMPurify from 'dompurify'

const Quests = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { quests, dispatch: questsDispatch } = useQuestsContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    const [quest, setQuest] = useState({})
    const [questDescription, setQuestDescription] = useState("")

    const [dmAccessQuest, setDmAccessQuest] = useState(false)




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


        // For handling inner HTML
        useEffect(()=> {
            const cleanHtml = () => {
                if (quest.description) {
                    let cleanQuestDescription = DOMPurify.sanitize(quest.description)
                    setQuestDescription(cleanQuestDescription)
                }
            }
            if (quest) {
                cleanHtml()
            }
        }, [quest])



    const moreInfo = (id) => {
        setQuest(quests.find(quest => quest._id === id))
    }

    useEffect(() => {
        if (quest.type === "Main" || quest.type === "Side") {
            if (user.id === campaigns.dmID) {
                setDmAccessQuest(true)
            }
        } else if (quest.type === "Personal") {
            if (user.id === quest.user) {
                setDmAccessQuest(true)
            }
        }
    }, [quest])

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
                    {quest && 
                    <div className="individual-quest">
                        <img src={quest.image} alt={quest.title} />
                        <div className="quest-content">
                            {quest.type === "Main" && <h2><GiStairsGoal className="quest-icon" /> {quest.title}</h2>}
                            {quest.type === "Side" && <h2><GoGoal className="quest-icon" /> {quest.title}</h2>}
                            {quest.type === "Personal" && <h2><GiAchievement className="quest-icon" /> {quest.title}</h2>}
                            <div className="given-return"><p>Given by <span>{quest.givenBy}</span></p><hr></hr><p className="returnTo">Return to <span>{quest.returnTo}</span></p></div>
                            <p dangerouslySetInnerHTML={{__html: questDescription}}></p>
                            {quest.complete && <h3 className="quest-complete">Complete</h3>}
                            {dmAccessQuest && 
                                <button className="button-primary" onClick={() => navigate(`/quest/edit/${quest._id}`)}>Edit</button>
                            }
                        </div>
                    </div>
                    }
                </div>
            </div>}
            
        </main>
    )
}

export default Quests