import './card.css'
import { useNavigate } from "react-router-dom"

// Context
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'

// Hooks
import { useDeleteItem } from '../../hooks/useDeleteItem'

// Utilities
import { checkDm } from '../../utils/CheckDm'

const Card = (props) => {
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const dm = checkDm(campaigns.dmID, user.id)
    const { deleteItem, error, isLoading } = useDeleteItem()

    const moreInfo = (type, id) => {
        navigate(`/${type}/${id}`);
    }

    const handleDelete = async (type, id) => {
        await deleteItem(type, id)
    }


    return (
        <div id="card__container">
            <h3>{props.name}</h3>
            <img src={props.image} alt={props.name}></img>
            <button className="button-primary" onClick={() => moreInfo(props.type, props.id)}>More Info</button>
            {dm && <button className="button-secondary" onClick={() => handleDelete(props.type, props.id)}>Delete</button>}
            {props.hidden && <span className="card-hidden">Hidden</span>}
        </div>
    )
}

export default Card