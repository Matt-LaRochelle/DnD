import '../characters/characters.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Hooks
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useMapsContext } from '../../../hooks/useMapsContext'

// Components
import Loading from '../../../components/loading/Loading'

const Maps = () => {
    const { user } = useAuthContext()
    const {campaigns } = useCampaignsContext()
    const { maps, dispatch } = useMapsContext()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)


    const deleteMap = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`https://dnd-kukm.onrender.com/api/map/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_MAP', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/map/${id}`);
    }

    const handleClick = () => {
        navigate(`/map/add`);
    }

    return (
        <div className="characters__container glass">
            {loading
            ?   <Loading />
            :   <div>
                    <h1>Maps</h1>
                    <div className="characters__flexy">
                    {!loading && maps.map((map) => (
                        <div className={map.hidden ? "npc npc-hidden" : "npc"} key={map._id} style={{ display: map.hidden && user.id !== campaigns.dmID && "none"}}>
                        <h3>{map.name}</h3>
                            <img src={map.image} alt={map.name} />
                            <button className='button-primary' onClick={() => moreInfo(map._id)}>More Info</button>
                            {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteMap(map._id)}>Delete</button>}
                        </div>
                        ))}

                    {campaigns.dmID === user.id && 
                        <div className="npc" >
                            <h3>Add Map</h3>
                            <img src="https://garden.spoonflower.com/c/14409649/p/f/m/7ymlkg-hbhMsJgmHbo_kFYPOIs3PddAIZ-Jsp793-WT9emAe4cmy/Grid%20wallpaper%20-%20cloud%20grey%20grid%20jumbo%20scale%20.jpg" alt="Add Map" />
                            <p onClick={handleClick} className='add'>+</p>
                        </div>}
                    </div>
                </div>
            }
        </div>
    )
}

export default Maps