import './joinCampaign.css'
import { useState } from 'react'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const JoinCampaign = () => {
    const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleClick = () => {
        setShowForm(showForm => !showForm);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const campaign = {title}

        const response = await fetch('/api/campaigns', {
            method: 'POST',
            body: JSON.stringify(campaign),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setTitle('')
            setError(null)
            setEmptyFields([])
            console.log('new campaign added', json)
            dispatch({type: 'CREATE_CAMPAIGN', payload: json})
        }
    }

    return (
        <div className='joinCampaign__container' onSubmit={handleSubmit}>
            <h3>Join campaign as a player</h3>
            <p className="add" onClick={handleClick}>{showForm ? "-" : "+"}</p>
            {showForm &&
                <form>
                    <label>Campaign room number:</label>
                    <input 
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className={emptyFields.includes('title') ? 'error' : ''}
                    />
                    <button>Join</button>
                    {error && <div className='error'>{error}</div>}
                </form>
            }
        </div>
    )
}

export default JoinCampaign