import '../characters/characters.css'
import './quest.css'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// Context
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useQuestsContext } from '../../../hooks/useQuestsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

// Hooks
import { useCampaignUsers } from '../../../hooks/useCampaignUsers';

// Components
import QuestListItem from '../../../components/questListItem/QuestListItem'
import Quest from '../../../components/quest/Quest'

// Icons
import { GiStairsGoal } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { GiAchievement } from "react-icons/gi";

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'
import { checkDm } from '../../../utils/CheckDm'

const Quests = () => {
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { quests } = useQuestsContext()
    
    const navigate = useNavigate()
    
    const [quest, setQuest] = useState("")
    const [questDescription, setQuestDescription] = useState("")
    const [dmAccessQuest, setDmAccessQuest] = useState(false)
    
    const { playerInfo, isLoading, error } = useCampaignUsers(campaigns._id)
    const dm = checkDm(user.id, campaigns.dmID)


    // Clean HTML
    useEffect(() => {
        if (quest) {
            cleanHTML(quest.description, setQuestDescription);
        }
    }, [quest]);


    // Get information for individual quest
    const moreInfo = (id) => {
        setQuest(quests.find(quest => quest._id === id))
    }


    // Visibility of quests for DM and Players
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


    // Adding main, side, personal quests
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
            <div className="quest-grid">
                <div className="quest-column1">
                    <GiStairsGoal className="quest-icon" onClick={() => console.log(playerInfo)} />
                    <GoGoal className="quest-icon" />
                    <GiAchievement className="quest-icon" />
                </div>
                <div className="quest-column2">
                    
                    <h2><GiStairsGoal className="quest-icon" /> Main Quests <hr></hr></h2>
                    {quests
                        .filter(quest => quest.type === "Main")
                        .filter(quest => !(quest.hidden && !dm))
                        .map((quest) => (
                            <QuestListItem
                                key={quest._id}
                                title={quest.title}
                                dm={dm}
                                complete={quest.complete}
                                hidden={quest.hidden}
                                id={quest._id}
                                select={() => moreInfo(quest._id)}
                            />
                        ))}
                    {campaigns.dmID === user.id && 
                    <div className="quest" onClick={handleClickMain}>
                        <h3>Add Main Quest</h3>
                    </div>}
                   
                    <h2><GoGoal className="quest-icon" /> Side Quests <hr></hr></h2>
                    {quests
                        .filter(quest => quest.type === "Side")
                        .filter(quest => !(quest.hidden && !dm))
                        .map((quest) => (
                            <QuestListItem
                                key={quest._id}
                                title={quest.title}
                                dm={dm}
                                complete={quest.complete}
                                hidden={quest.hidden}
                                id={quest._id}
                                select={() => moreInfo(quest._id)}
                            />
                        ))}
                    {campaigns.dmID === user.id && 
                    <div className="quest" onClick={handleClickSide}>
                        <h3>Add Side Quest</h3>
                    </div>}
                    
                    <h2><GiAchievement className="quest-icon" /> Personal Quests <hr></hr></h2>
                    {quests.filter(quest => quest.type === "Personal" && (campaigns.dmID === user.id || user.id === quest.user)).map((quest) => (
                        <QuestListItem
                            key={quest._id}
                            title={quest.title}
                            dm={dm}
                            personal={user.id === quest.user}
                            complete={quest.complete}
                            hidden={quest.hidden}
                            id={quest._id}
                            select={() => moreInfo(quest._id)}
                            />
                    ))}
                    {campaigns.dmID !== user.id && 
                    <div className="quest" onClick={handleClickPersonal}>
                        <h3>Add Personal Quest</h3>
                    </div>}
                </div>

                <div className="quest-column3">
                    {quest
                    ?   <Quest
                            image={quest.image}
                            title={quest.title}
                            type={quest.type}
                            givenBy={quest.givenBy}
                            returnTo={quest.returnTo}
                            description={questDescription}
                            complete={quest.complete}
                            _id={quest._id}
                            user={quest.user}
                            dmAccessQuest={dmAccessQuest}
                            playerInfo={playerInfo}
                        />
                    : <h2>Select a quest to view more information</h2>
                    }
                </div>
            </div>
            
        </main>
    )
}

export default Quests