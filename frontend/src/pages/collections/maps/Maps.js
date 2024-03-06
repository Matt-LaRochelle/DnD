import '../characters/characters.css'
import { useNavigate } from "react-router-dom"

// Hooks
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useMapsContext } from '../../../hooks/useMapsContext'

// Components
import Card from '../../../components/card/Card'

const Maps = () => {
    const { user } = useAuthContext()
    const {campaigns } = useCampaignsContext()
    const { maps } = useMapsContext()

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/map/add`);
    }

    return (
        <div className="characters__container glass">
            <h1>Maps</h1>
            <div className="characters__flexy">
                {maps.map((map) => (
                    <Card 
                        key={map._id}
                        name={map.name}
                        image={map.image}
                        type="map"
                        id={map._id}
                        hidden={map.hidden}
                    />
                ))}

                {campaigns.dmID === user.id && 
                    <div id="card__container" >
                        <h3>Add Map</h3>
                        <img src="https://garden.spoonflower.com/c/14409649/p/f/m/7ymlkg-hbhMsJgmHbo_kFYPOIs3PddAIZ-Jsp793-WT9emAe4cmy/Grid%20wallpaper%20-%20cloud%20grey%20grid%20jumbo%20scale%20.jpg" alt="Add Map" />
                        <p onClick={handleClick} className='add'>+</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Maps