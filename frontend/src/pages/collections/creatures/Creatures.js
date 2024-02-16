import '../characters/characters.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

const Creatures = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { creatures, dispatch: creaturesDispatch } = useCreaturesContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCreatures = async () => {
            setLoading(true);
            const response = await fetch(`/api/creature/${campaigns._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                creaturesDispatch({type: 'SET_CREATURES', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchCreatures()
        }
    }, [campaigns, user, creaturesDispatch])

    return (
        <div className="characters__container glass">
            <h1>Creatures</h1>
        </div>
    )
}

export default Creatures