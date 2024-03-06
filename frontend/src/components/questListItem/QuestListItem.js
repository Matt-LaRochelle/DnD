import './questListItem.css'

// Hooks
import { useDeleteItem } from '../../hooks/useDeleteItem';

// Icons
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const QuestListItem = (props) => {
    const { deleteItem } = useDeleteItem()

    const deleteQuest = async (id) => {
        await deleteItem("quest", id)
    }

    return (
        <li className="quest-list-item" onClick={props.select}>
            <h3>
                {props.title}
                {(props.dm || props.personal) && <span className="material-symbols-outlined button-secondary trash" onClick={() => deleteQuest(props.id)}>delete</span>}
            </h3>
            {props.complete ? <FaStar className="quest-star" /> : <FaRegStar className="quest-star" />}
            {props.hidden && <span className="quest-hidden">Hidden</span>}
        </li>
    )
}

export default QuestListItem;