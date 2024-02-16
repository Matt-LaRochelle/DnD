import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const AddPC = () => {
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

        const pc = {
            ...formState, 
            "campaignID": campaigns._id, 
            "userID": user.id,
            "username": user.username
        }

        const response = await fetch('/api/pc/', {
            method: 'POST',
            body: JSON.stringify(pc),
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
           <h2>Add PC</h2>
            <label>Name</label>
            <input className={emptyFields.includes("name") && "error"} type="text" id="name" onChange={handleChange}></input>

            <label>Description</label>
            <input type="text" id="description" onChange={handleChange}></input>

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            <label>Secrets</label>
            <input type="text" id="secrets" onChange={handleChange}></input>

            <label>Last Seen</label>
            <input type="text" id="lastSeen" onChange={handleChange}></input>

            <label>Hide Character</label>
            <input type="checkbox" id="hidden" onChange={handleChange}></input>

            <button className="button-primary" type="submit">Add PC</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddPC