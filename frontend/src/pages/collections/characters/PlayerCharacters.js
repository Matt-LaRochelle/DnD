import './characters.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Hooks
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { usePcsContext } from '../../../hooks/usePcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

// Components
import Loading from '../../../components/loading/Loading'
import Card from '../../../components/card/Card'

const PlayerCharacters = () => {
    const { user } = useAuthContext()
    const {campaigns } = useCampaignsContext()
    const { pcs, dispatch } = usePcsContext()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const deletePC = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`https://dnd-kukm.onrender.com/api/pc/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_PC', payload: json})
            setLoading(false)
            
        }
    }

    const morePcInfo = (id) => {
        navigate(`/pc/${id}`);
    }

    const handlePcClick = () => {
        navigate(`/pc/add`);
    }

    return (
        <div className="characters__container glass">
            {loading
            ?   <Loading />
            :   <div>
                    <h2>Player Characters</h2>
                    <div className="characters__flexy">
                        {pcs.filter((pc) => {
                            if (user.id === campaigns.dmID || pc.userID === user.id) {
                                return true; // Include all PCs
                            } else {
                                return !pc.hidden; // Exclude PCs with hidden=true
                            }
                        }).map((pc) => (
                            <Card 
                                key={pc._id}
                                name={pc.name}
                                image={pc.image}
                                type="pc"
                                id={pc._id}
                                hidden={pc.hidden}
                            />
                            ))}
                        <div id="card__container" >
                            <h3>Add PC</h3>
                            <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add PC" />
                            <p onClick={handlePcClick} className='add'>+</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PlayerCharacters