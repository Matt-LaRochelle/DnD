import './edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const EditCreature = () => {
    const [formState, setFormState] = useState({
        description: '',
        image: '',
        nativeTo: '',
        alignment: '',
        secrets: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])
    const [loading, setLoading] = useState(true)

    const { campaigns } = useCampaignsContext()
    const { creatures, dispatch } = useCreaturesContext()
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
        // Fetch a Creature's information
        const fetchCreatureInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/creature/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const creatureInfo = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_CREATURE', payload: creatureInfo })
                setLoading(false)
                setFormState({
                    name: '',
                    description: '',
                    image: '',
                    nativeTo: '',
                    alignment: '',
                    secrets: '',
                    hidden: creatureInfo.hidden
                })
            }
        }

        if (user) {
            fetchCreatureInfo()
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

        const response = await fetch('/api/creature/' + creatures._id, {
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
           <h2>Edit Creature</h2>
            <label>Name</label>
            <div>
                <input 
                    className="edit-input" 
                    type="text" 
                    id="name" 
                    onChange={handleChange} 
                    placeholder={creatures.name}>
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
                placeholder={creatures.description}>
            </input>
            {formState.description && <button onClick={submit} className="button-primary">Save</button>}

            <label>Image</label>
            <img src={creatures.image} alt={creatures.name}/>
            <input 
                className="edit-input"  
                type="text" 
                id="image" 
                onChange={handleChange}
                placeholder={creatures.image}></input>
                {formState.image && <button onClick={submit} className="button-primary">Save</button>}

            <label>Native to</label>
            <input 
                className="edit-input"
                type="text" 
                id="nativeTo" 
                onChange={handleChange}
                placeholder={creatures.nativeTo}></input>
            {formState.nativeTo && <button onClick={submit} className="button-primary">Save</button>}
            <label>Alignment</label>
            <select id="alignment" onChange={handleChange}>
                <option value="Good" selected={creatures.alignment === "Good" ? true : false}>Good</option>
                <option value="Neutral" selected={creatures.alignment === "Neutral" ? true : false}>Neutral</option>
                <option value="Evil" selected={creatures.alignment === "Evil" ? true : false}>Evil</option>
                <option value="Unknown" selected={creatures.alignment === "Unknown" ? true : false}>Unknown</option>
            </select>
            {formState.alignment && <button onClick={submit} className="button-primary">Save</button>}
            
            <label>Secrets</label>
            <input 
                className="edit-input" 
                type="text" 
                id="secrets" 
                onChange={handleChange}
                placeholder={creatures.secrets}></input>
            {formState.secrets && <button onClick={submit} className="button-primary">Save</button>}

            <label>Hide Character</label>
            <input 
                type="checkbox" 
                id="hidden" 
                onChange={handleChange}
                checked={formState.hidden}></input>
                {formState.hidden !== creatures.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditCreature