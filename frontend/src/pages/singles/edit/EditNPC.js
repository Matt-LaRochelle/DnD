import './edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

import Editor from '../../../components/editor/Editor'
import DOMPurify from 'dompurify'

import { FaEdit } from "react-icons/fa";

const EditNPC = () => {
    const [formState, setFormState] = useState({
        description: '',
        image: '',
        voice: '',
        catchphrases: '',
        secrets: '',
        lastSeen: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])
    const [loading, setLoading] = useState(true)

    const [eName, setEName] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [eVoice, setEVoice] = useState(false)
    const [eCatchphrases, setECatchphrases] = useState(false)
    const [eSecrets, setESecrets] = useState(false)
    const [eLastSeen, setELastSeen] = useState(false)

    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')
    const [voice, setVoice] = useState('')
    const [catchphrases, setCatchphrases] = useState('')

    const { campaigns } = useCampaignsContext()
    const { npcs, dispatch } = useNpcsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const location = useLocation()
    const path = location.pathname.split("/")[3]

    useEffect(() => {
        console.log(formState)
    }
    ,[formState])

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
            description: description,
            voice: voice,
            catchphrases: catchphrases
        }));
    }, [description, secrets, voice, catchphrases]);


    useEffect(() => {
        // Fetch an NPC's information
        const fetchNPCinfo = async () => {
            setLoading(true);
            const response = await fetch(`https://dnd-kukm.onrender.com/api/npc/${campaigns._id}/${path}`, {
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
                    voice: '',
                    catchphrases: '',
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

        const response = await fetch('https://dnd-kukm.onrender.com/api/npc/' + npcs._id, {
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
            <label>Name <FaEdit onClick={() => setEName(!eName)}/></label>
            <p>{npcs.name}</p>
            
            {eName &&
                <div>
                    <input 
                        className="edit-input" 
                        type="text" 
                        id="name" 
                        onChange={handleChange} >
                    </input>
                    {formState.name && <button onClick={submit} className="button-primary">Save</button>}
                </div>
            }

            <label>Description <FaEdit onClick={() => setEDescription(!eDescription)}/></label>
            <p dangerouslySetInnerHTML={{__html: npcs.description}}></p>
            {eDescription &&
                <div>
                    <Editor 
                        value={description}
                        onChange={setDescription}
                    />
                    {description && <button onClick={submit} className="button-primary">Save</button>}
                </div>
                }

            <label>Image <FaEdit onClick={() => setEImage(!eImage)}/></label>
            <img src={npcs.image} alt={npcs.name}/>
            {eImage &&
                <div>
                    <input 
                        className="edit-input"  
                        type="text" 
                        id="image" 
                        onChange={handleChange}></input>
                        {formState.image && <button onClick={submit} className="button-primary">Save</button>}
                </div>
            }

            <label>Voice <FaEdit onClick={() => setEVoice(!eVoice)}/></label>
            <p dangerouslySetInnerHTML={{__html: npcs.voice}}></p>
            {eVoice &&
                <div>
                    <Editor 
                        value={voice}
                        onChange={setVoice}
                    />
                    {voice && <button onClick={submit} className="button-primary">Save</button>}
                </div>
                }

            <label>Catchphrases <FaEdit onClick={() => setECatchphrases(!eCatchphrases)}/></label>
            <p dangerouslySetInnerHTML={{__html: npcs.catchphrases}}></p>
            {eCatchphrases &&
                <div>
                    <Editor 
                        value={catchphrases}
                        onChange={setCatchphrases}
                    />
                    {catchphrases && <button onClick={submit} className="button-primary">Save</button>}
                </div>
                }

            <label>Secrets <FaEdit onClick={() => setESecrets(!eSecrets)}/></label>
            <p dangerouslySetInnerHTML={{__html: npcs.secrets}}></p>
            {eSecrets &&
                <div>
                    <Editor 
                        value={secrets}
                        onChange={setSecrets}
                    />
                    {secrets && <button onClick={submit} className="button-primary">Save</button>}
                </div>
                }

            <label>Last Seen <FaEdit onClick={() => setELastSeen(!eLastSeen)}/></label>
            <p dangerouslySetInnerHTML={{__html: npcs.lastSeen}}></p>
            {eLastSeen &&
                <div>
                    <input 
                        type="text"
                        id="lastSeen"
                        onChange={handleChange}
                    />
                    {formState.lastSeen && <button onClick={submit} className="button-primary">Save</button>}
                </div>
                }
            <label>Hide Character</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>
            {formState.hidden !== npcs.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditNPC