import './quest.css'
import { useNavigate } from "react-router-dom"

// Components
import Avatar from '../../components/avatar/Avatar'

// Icons
import { GiStairsGoal } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { GiAchievement } from "react-icons/gi";

const Quest = (props) => {
    const navigate = useNavigate()

    return (
        <div className="individual-quest">
            <img src={props.image} alt={props.title} />
            <div className="quest-content">
                {props.type === "Main" && <h2><GiStairsGoal className="quest-icon" /> {props.title}</h2>}
                {props.type === "Side" && <h2><GoGoal className="quest-icon" /> {props.title}</h2>}
                {props.type === "Personal" && <h2><GiAchievement className="quest-icon" /> {props.title}</h2>}
                <div className="given-return">
                    <p>Given by <span>{props.givenBy}</span></p>
                    <hr></hr>
                    <p className="returnTo">Return to <span>{props.returnTo}</span></p>
                </div>
                <p dangerouslySetInnerHTML={{__html: props.description}}></p>
                {props.complete && <h3 className="quest-complete">Complete</h3>}
                {props.dmAccessQuest && 
                    <button className="button-primary" onClick={() => navigate(`/quest/edit/${props._id}`)}>Edit</button>
                }
                {
                    props.playerInfo.find(player => player.id === props.user) &&
                    <Avatar
                        image={props.playerInfo.find(player => player.id === props.user).image}
                        name={props.playerInfo.find(player => player.id === props.user).username}
                        hideName={false} 
                    />
                }
            </div>
        </div>
    )
}

export default Quest