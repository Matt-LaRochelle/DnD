import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import Editor from '../../../components/editor/Editor'

const AddCreature = () => {
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        image: '',
        nativeTo: '',
        alignment: 'Unknown',
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
        setFormState(prevState => ({
            ...prevState,
            secrets: secrets,
            description: description
        }));
    }, [description, secrets]);


    const submit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in')
            return
        }

        const creature = {...formState, "campaignID": campaigns._id}

        const response = await fetch('https://dnd-kukm.onrender.com/api/creature/', {
            method: 'POST',
            body: JSON.stringify(creature),
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
                nativeTo: '',
                alignment: '',
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
           <h2>Add Creature</h2>
            <label>Name</label>
            <input className={emptyFields.includes("name") && "error"} type="text" id="name" onChange={handleChange}></input>

            <label>Description</label>
            <Editor value={description} onChange={setDescription}/>

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            <label>Native to</label>
            <input type="text" id="nativeTo" onChange={handleChange}></input>

            <label>Alignment</label>
                <select id="alignment" onChange={handleChange}>
                    <option value="Good">Good</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Evil">Evil</option>
                    <option value="Unknown" selected >Unknown</option>
                </select>

            <label>Secrets</label>
            <Editor value={secrets} onChange={setSecrets} />

            <label>Last Seen</label>
            <input type="text" id="lastSeen" onChange={handleChange}></input>

            <label>Hide Creature</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>

            <button className="button-primary" type="submit">Add Creature</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddCreature