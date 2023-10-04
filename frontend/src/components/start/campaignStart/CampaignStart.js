import { useState } from 'react'
// import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import './campaignStart.css'
import Toggle from '../../toggle/Toggle'

const CampaignStart = () => {
    // const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [hidden, setHidden] = useState(false);
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleClick = () => {
        setShowForm(showForm => !showForm);
        console.log(user);
    }

    const handleHidden = () => {
        setHidden(hidden => !hidden);
        console.log(user.id)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const campaign = {title, description, hidden, "dmID": user.id, "dmUsername": user.username}

        const response = await fetch('/api/campaign', {
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
            setDescription('')
            setError(null)
            setEmptyFields([])
            console.log('new campaign added', json)
            // dispatch({type: 'CREATE_CAMPAIGN', payload: json})
        }
    }

    return (
        <div className='campaignStart__container' onSubmit={handleSubmit}>
            <h3>DM for a campaign</h3>
            <p className="add" onClick={handleClick}>{showForm ? "-" : "+"}</p>
            {showForm &&
                <form>
                    <label>Campaign Title:</label>
                    <input 
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className={emptyFields.includes('title') ? 'error' : ''}
                    />
                    <label>Description:</label>
                    <textarea 
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className={emptyFields.includes('description') ? 'error' : ''}
                    />
                    <label>Hidden: {hidden ? "true" : "false"}</label>
                    <Toggle onClick={handleHidden} />
                    <button>Start</button>
                    {error && <div className='error'>{error}</div>}
                </form>
            }
        </div>
    )
}

export default CampaignStart