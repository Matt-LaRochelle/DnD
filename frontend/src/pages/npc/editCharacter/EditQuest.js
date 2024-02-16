import './edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useQuestsContext } from '../../../hooks/useQuestsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const EditQuest = () => {
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        image: '',
        type: '',
        givenBy: '',
        returnTo: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])
    const [loading, setLoading] = useState(true)

    const { campaigns } = useCampaignsContext()
    const { quests, dispatch } = useQuestsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const location = useLocation()
    const path = location.pathname.split("/")[3]

    const handleChange = (event) => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormState({
            ...formState,
            [event.target.id]: isCheckbox ? event.target.checked : event.target.value
        });
    }


    useEffect(() => {
        // Fetch a Quest's information
        const fetchQuestInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/quest/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const questInfo = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_QUEST', payload: questInfo })
                setLoading(false)
                setFormState({
                    title: '',
                    description: '',
                    image: '',
                    type: '',
                    givenBy: '',
                    returnTo: '',
                    hidden: questInfo.hidden
                })
            }
        }

        if (user) {
            fetchQuestInfo()
        }
    }, [user])


    const submit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in.")
            return
        }

        // Only add things that were updated
        const updatedData = {};

        // for each item in formState, if it's not empty, add it to updatedData
        for (const [key, value] of Object.entries(formState)) {
            if (value !== undefined && value !== "") {
                updatedData[key] = value
            }
        }

        const response = await fetch('/api/quest/' + quests._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedData)
        })
        const json = await response.json()

        if (response.ok) {
            navigate(`/campaign/${campaigns._id}`)
        }


    }


    return (
        <form className='editCharacter__form glass'>
           <h2>Edit Quest</h2>
            <label>Title</label>
            <div>
                <input 
                    className="edit-input" 
                    type="text" 
                    id="title" 
                    onChange={handleChange} 
                    placeholder={quests.title}>
                </input>
                {/* if the input with id="name" is onFocus, then show this button */}
                {formState.title && <button onClick={submit} className="button-primary">Save</button>}
            </div>

            <label>Description</label>
            <input 
                className="edit-input"  
                type="text" 
                id="description" 
                onChange={handleChange}
                placeholder={quests.description}>
            </input>
            {formState.description && <button onClick={submit} className="button-primary">Save</button>}

            <label>Image</label>
            <img src={quests.image} alt={quests.name}/>
            <input 
                className="edit-input"  
                type="text" 
                id="image" 
                onChange={handleChange}
                placeholder={quests.image}></input>
                {formState.image && <button onClick={submit} className="button-primary">Save</button>}

            <label>Type</label>
            <select id="type" onChange={handleChange}>
                <option value="Main" selected={quests.alignment === "Main" ? true : false}>Main Quest</option>
                <option value="Side" selected={quests.alignment === "Side" ? true : false}>Side Quest</option>
                <option value="Personal" selected={quests.alignment === "Personal" ? true : false}>Personal Quest</option>
            </select>
            {formState.type && <button onClick={submit} className="button-primary">Save</button>}
            
            <label>Given by</label>
            <input 
                className="edit-input"
                type="text" 
                id="givenBy" 
                onChange={handleChange}
                placeholder={quests.givenBy}></input>
            {formState.givenBy && <button onClick={submit} className="button-primary">Save</button>}
           
            <label>Return to</label>
            <input 
                className="edit-input"
                type="text" 
                id="returnTo" 
                onChange={handleChange}
                placeholder={quests.returnTo}></input>
            {formState.returnTo && <button onClick={submit} className="button-primary">Save</button>}
           
            <label>Hide Character</label>
            <input 
                type="checkbox" 
                id="hidden" 
                onChange={handleChange}
                checked={formState.hidden}></input>
                {formState.hidden !== quests.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditQuest