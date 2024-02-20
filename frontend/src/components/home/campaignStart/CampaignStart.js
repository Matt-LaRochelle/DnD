import { useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import './campaignStart.css'

import Editor from '../../editor/Editor'

import { IoCloseOutline } from "react-icons/io5";

const CampaignStart = () => {
    const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
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

        const campaign = {title, description, "dmID": user.id, "dmUsername": user.username}

        const response = await fetch('https://dnd-kukm.onrender.com/api/campaign', {
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
            dispatch({type: 'CREATE_CAMPAIGN', payload: json})
        }
    }

    return (
        <div className='campaignStart__container' onSubmit={handleSubmit}>
            <h3>DM for a campaign</h3>
            <p className="add" onClick={handleClick}>{showForm ? "-" : "+"}</p>
            {showForm &&
                <div className="fullpage-popup">
                    <form>
                        <label>Campaign Title:</label>
                        <input 
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            className={emptyFields.includes('title') ? 'error' : ''}
                        />
                        <label>Description:</label>
                        <div className="campaignDescription">

                        {/* <textarea 
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className={emptyFields.includes('description') ? 'error' : ''}
                        /> */}
                        <Editor 
                            value={description} 
                            onChange={setDescription}
                            className={emptyFields.includes('description') ? 'error campaignDescription' : 'campaignDescription'}  />
                        </div>
                        <button className="button-primary">Start</button>
                        {error && <div className='error'>{error}</div>}
                        <button className="button-secondary close" onClick={() => setShowForm(false)}><IoCloseOutline /></button>
                    </form>
                </div>
            }
        </div>
    )
}

export default CampaignStart