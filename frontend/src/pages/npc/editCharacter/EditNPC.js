import './edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const EditNPC = () => {
    const [formState, setFormState] = useState({
        description: '',
        image: '',
        secrets: '',
        lastSeen: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])
    const [loading, setLoading] = useState(true)

    const { campaigns } = useCampaignsContext()
    const { npcs, dispatch } = useNpcsContext()
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
        // Fetch an NPC's information
        const fetchNPCinfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/npc/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const npcInfo = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_NPC', payload: npcInfo })
                setLoading(false)
                setFormState({
                    description: '',
                    image: '',
                    secrets: '',
                    lastSeen: '',
                    hidden: npcInfo.hidden
                })
            }
        }

        if (user) {
            fetchNPCinfo()
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

        const response = await fetch('/api/npc/' + npcs._id, {
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
           <h2>Edit NPC</h2>
            <label>Name</label>
            <div>
                <input 
                    className="edit-input" 
                    type="text" 
                    id="name" 
                    onChange={handleChange} 
                    placeholder={npcs.name}>
                </input>
                {/* if the input with id="name" is onFocus, then show this button */}
                {formState.name && <button onClick={submit} className="button-primary">Save</button>}
            </div>

            <label>Description</label>
            <input 
                className="edit-input"  
                type="text" 
                id="description" 
                onChange={handleChange}
                placeholder={npcs.description}>
            </input>
            {formState.description && <button onClick={submit} className="button-primary">Save</button>}

            <label>Image</label>
            <img src={npcs.image} alt={npcs.name}/>
            <input 
                className="edit-input"  
                type="text" 
                id="image" 
                onChange={handleChange}
                placeholder={npcs.image}></input>
                {formState.image && <button onClick={submit} className="button-primary">Save</button>}

            <label>Secrets</label>
            <input 
                className="edit-input" 
                type="text" 
                id="secrets" 
                onChange={handleChange}
                placeholder={npcs.secrets}></input>
            {formState.secrets && <button onClick={submit} className="button-primary">Save</button>}

            <label>Last Seen</label>
            <input 
                className="edit-input" 
                type="text" 
                id="lastSeen" 
                onChange={handleChange}
                placeholder={npcs.lastSeen}></input>
                {formState.lastSeen && <button onClick={submit} className="button-primary">Save</button>}

            <label>Hide Character</label>
            <input 
                type="checkbox" 
                id="hidden" 
                onChange={handleChange}
                checked={formState.hidden}></input>
                {formState.hidden !== npcs.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditNPC