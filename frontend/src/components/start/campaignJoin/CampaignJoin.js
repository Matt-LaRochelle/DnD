import './campaignJoin.css'
import { useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

const CampaignJoin = () => {
    // const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()
    const { dispatch } = useCampaignsContext()
    const [showForm, setShowForm] = useState(false)
    const [campaignID, setCampaignID] = useState('')
    const [error, setError] = useState(null)

    const handleClick = () => {
        setShowForm(showForm => !showForm);
        console.log(user.id)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const campaign = {campaignID, playerID: user.id, playerUsername: user.username}

        const response = await fetch("/api/campaign/join", {
            method: 'PATCH',
            body: JSON.stringify(campaign),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setCampaignID('')
            setError(null)
            console.log('new campaign added', json)
            dispatch({type: 'CREATE_CAMPAIGN', payload: json})
        }
    }

    return (
        <div className='campaignJoin__container' onSubmit={handleSubmit}>
            <h3>Join campaign as a player</h3>
            <p className="add" onClick={handleClick}>{showForm ? "-" : "+"}</p>
            {showForm &&
                <form>
                    <label>Campaign room number:</label>
                    <input 
                        type="text"
                        onChange={(e) => setCampaignID(e.target.value)}
                        value={campaignID}
                        className={error ? 'error' : ''}
                    />
                    <button>Join</button>
                    {error && <div className='error'>{error}</div>}
                </form>
            }
        </div>
    )
}

export default CampaignJoin