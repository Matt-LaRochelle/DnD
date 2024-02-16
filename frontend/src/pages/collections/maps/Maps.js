import '../characters/characters.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useMapsContext } from '../../../hooks/useMapsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

const Maps = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { maps, dispatch: mapsDispatch } = useMapsContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMaps = async () => {
            setLoading(true);
            const response = await fetch(`/api/map/${campaigns._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                mapsDispatch({type: 'SET_MAPS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchMaps()
        }
    }, [campaigns, user, mapsDispatch])


    const deleteMap = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/map/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            mapsDispatch({type: 'DELETE_MAP', payload: json})
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
                    <img src="https://www.animal-symbols.com/pictures/animal-symbol_3.png" alt="Add Map" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
        </div>
    )
}

export default Maps