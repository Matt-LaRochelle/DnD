import './card.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Context
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../hooks/useNpcsContext'
import { usePcsContext } from '../../hooks/usePcsContext'
import { useCreaturesContext } from '../../hooks/useCreaturesContext'
import { useMapsContext } from '../../hooks/useMapsContext'

// Hooks
import { useDeleteItem } from '../../hooks/useDeleteItem'

const Card = (props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { dispatch } = useNpcsContext()
    const { dispatch: dispatchPc } = usePcsContext()
    const { dispatch: dispatchCreature } = useCreaturesContext()
    const { dispatch: dispatchMap } = useMapsContext()
    
    const { deleteItem, error, isLoading } = useDeleteItem()

    const moreInfo = (type, id) => {
        navigate(`/${type}/${id}`);
    }


    const handleDelete = async (type, id) => {
        await deleteItem(type, id)
        // if (!user) {
        //     return
        // }
        // setLoading(true);
        // const response = await fetch(`https://dnd-kukm.onrender.com/api/${type}/${id}`, {
        //     method: 'DELETE', // Specify the method here
        //     headers: {
        //         'Authorization': `Bearer ${user.token}`
        //     }
        // })
        // const json = await response.json()

        // if (response.ok) {
        //     if (type === 'npc') {
        //         dispatch({type: 'DELETE_NPC', payload: json})
        //     }
        //     if (type === 'pc') {
        //         dispatchPc({type: 'DELETE_PC', payload: json})
        //     }
        //     if (type === 'creature') {
        //         dispatchCreature({type: 'DELETE_CREATURE', payload: json})
        //     }
        //     if (type === 'map') {
        //         dispatchMap({type: 'DELETE_MAP', payload: json})
        //     }
        //     setLoading(false)
            
        // }
    }


    return (
        <div id="card__container">
            <h3>{props.name}</h3>
            <img src={props.image} alt={props.name}></img>
            <button className="button-primary" onClick={() => moreInfo(props.type, props.id)}>More Info</button>
            {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => handleDelete(props.type, props.id)}>Delete</button>}
            {props.hidden && <span className="card-hidden">Hidden</span>}
        </div>
    )
}

export default Card