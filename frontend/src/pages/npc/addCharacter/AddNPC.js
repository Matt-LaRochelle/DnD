import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const AddNPC = () => {
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        image: '',
        secrets: '',
        lastSeen: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])

    const { campaigns } = useCampaignsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const handleChange = (event) => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormState({
            ...formState,
            [event.target.id]: isCheckbox ? event.target.checked : event.target.value
        });
    }


    const submit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in')
            return
        }

        const npc = {...formState, "campaignID": campaigns._id}

        const response = await fetch('/api/npc/', {
            method: 'POST',
            body: JSON.stringify(npc),
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
            setFormState({
                name: '',
                description: '',
                image: '',
                secrets: '',
                lastSeen: '',
                hidden: false
            })
            setError(null)
            setEmptyFields([])
            // dispatch({type: 'CREATE_CAMPAIGN', payload: json})
            navigate(`/campaign/${campaigns._id}`)
        }
    }





    return (
        <form className='Add__form glass' onSubmit={submit}>
           <h2>Add NPC</h2>
            <label>Name</label>
            <input className={emptyFields.includes("name") && "error"} type="text" id="name" onChange={handleChange}></input>

            <label>Description</label>
            <input type="text" id="description" onChange={handleChange}></input>

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            <label>Secretsssss</label>
            <input type="text" id="secrets" onChange={handleChange}></input>

            <label>Last Seen</label>
            <input type="text" id="lastSeen" onChange={handleChange}></input>

            <label>Hide Character</label>
            <input type="checkbox" id="hidden" onChange={handleChange}></input>

            <button className="button-primary" type="submit">Add NPC</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddNPC