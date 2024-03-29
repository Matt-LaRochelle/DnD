import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

import Editor from '../../../components/editor/Editor'

const AddNPC = () => {
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        image: '',
        voice: '',
        catchphrases: '',
        secrets: '',
        lastSeen: '',
        hidden: false
    });
    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')
    const [voice, setVoice] = useState('')
    const [catchphrases, setCatchphrases] = useState('')

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

    useEffect(() => {
        console.log(formState)
    }
    ,[formState])
    
    useEffect(() => {
        setFormState(prevState => ({
            ...prevState,
            secrets: secrets,
            voice: voice,
            catchphrases: catchphrases,
            description: description
        }));
    }, [description, secrets, voice, catchphrases]);


    const submit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in')
            return
        }

        const npc = {...formState, "campaignID": campaigns._id}

        const response = await fetch('https://dnd-kukm.onrender.com/api/npc/', {
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
                voice: '',
                catchphrases: '',
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
            <Editor value={description} onChange={setDescription}/>

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            <label>Voice</label>
            <Editor value={voice} onChange={setVoice} />

            <label>Catchphrases</label>
            <Editor value={catchphrases} onChange={setCatchphrases} />

            <label>Secrets</label>
            <Editor value={secrets} onChange={setSecrets}/>

            <label>Last Seen</label>
            <input type="text" id="lastSeen" onChange={handleChange}></input>

            <label>Hide Character</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>

            <button className="button-primary" type="submit">Add NPC</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddNPC