import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

import Editor from '../../../components/editor/Editor'

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

    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')

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

    useEffect(() => {
        if (secrets) {
            setFormState({
                ...formState,
                secrets: secrets
            })
        }
        if (description) {
            setFormState({
                ...formState,
                description: description
            })
        }
    }, [description, secrets])


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
            <Editor value={description} onChange={setDescription} />

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            <label>Secrets</label>
            <Editor value={secrets} onChange={setSecrets} />

            <label>Last Seen</label>
            <input type="text" id="lastSeen" onChange={handleChange}></input>

            <label>Hide Character</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>

            <button className="button-primary" type="submit">Add PC</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddPC