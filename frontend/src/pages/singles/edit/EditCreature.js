import './edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

import DOMPurify from 'dompurify'
import Editor from '../../../components/editor/Editor'

import { FaEdit } from "react-icons/fa";

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

    const [eName, setEName] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [eNativeTo, setENativeTo] = useState(false)
    const [eAlignment, setEAlignment] = useState(false)
    const [eSecrets, setESecrets] = useState(false)


    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')

    const [dbDescription, setDbDescription] = useState('')
    const [dbSecrets, setDbSecrets] = useState('')

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
            const response = await fetch(`https://dnd-kukm.onrender.com/api/creature/${campaigns._id}/${path}`, {
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

        const response = await fetch('https://dnd-kukm.onrender.com/api/creature/' + creatures._id, {
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

    // For handling inner HTML
    useEffect(()=> {
        const cleanHtml = () => {
            if (creatures.description) {
                let cleanDescription = DOMPurify.sanitize(creatures.description)
                setDbDescription(cleanDescription)
            }
            if (creatures.secrets) {
                let cleanSecrets = DOMPurify.sanitize(creatures.secrets)
                setDbSecrets(cleanSecrets)
            }
        }
        if (creatures) {
            cleanHtml()
        }
    }, [creatures])

    useEffect(() => {
        setFormState(prevState => ({
            ...prevState,
            secrets: secrets,
            description: description
        }));
    }, [description, secrets]);



    return (
        <form className='editCharacter__form glass'>
           <h2>Edit Creature</h2>
            <label>Name <FaEdit onClick={() => setEName(!eName)}/></label>
            <p>{creatures.name}</p>
            {eName &&
            <div>
                <input 
                    className="edit-input" 
                    type="text" 
                    id="name" 
                    onChange={handleChange}>
                </input>
                {/* if the input with id="name" is onFocus, then show this button */}
                {formState.name && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Description <FaEdit onClick={() => setEDescription(!eDescription)}/></label>
            <p dangerouslySetInnerHTML={{__html: dbDescription}}></p>
            {eDescription &&
                <div>
                    <Editor 
                        id="description" 
                        onChange={setDescription} 
                        value={description} 
                        submit={submit}
                    />
                    {description && <button onClick={submit} className="button-primary">Save</button>}
                </div>
            }

            <label>Image  <FaEdit onClick={() => setEImage(!eImage)}/></label>
            <img src={creatures.image} alt={creatures.name}/>
            {eImage &&
            <div>
                <input 
                    className="edit-input"  
                    type="text" 
                    id="image" 
                    onChange={handleChange}>
                </input>
                {formState.image && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Native to <FaEdit onClick={() => setENativeTo(!eNativeTo)}/></label>
            <p>{creatures.nativeTo}</p>
            {eNativeTo &&
            <div>
                <input 
                    className="edit-input"
                    type="text" 
                    id="nativeTo" 
                    onChange={handleChange}>
                </input>
                {formState.nativeTo && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Alignment <FaEdit onClick={() => setENativeTo(!eNativeTo)}/></label>
            <p>{creatures.alignment}</p>
            {eAlignment &&
            <div>
                <select id="alignment" onChange={handleChange}>
                    <option value="Good" selected={creatures.alignment === "Good" ? true : false}>Good</option>
                    <option value="Neutral" selected={creatures.alignment === "Neutral" ? true : false}>Neutral</option>
                <option value="Evil" selected={creatures.alignment === "Evil" ? true : false}>Evil</option>
                <option value="Unknown" selected={creatures.alignment === "Unknown" ? true : false}>Unknown</option>
                </select>
                {formState.alignment && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }
            
            <label>Secrets <FaEdit onClick={() => setESecrets(!eSecrets)}/></label>
            <p dangerouslySetInnerHTML={{__html: dbSecrets}}></p>
            {eSecrets &&
                <div>
                    <Editor 
                        id="secrets" 
                        onChange={setSecrets} 
                        value={secrets} 
                        submit={submit}
                    />
                    {secrets && <button onClick={submit} className="button-primary">Save</button>}
                </div>
            }
            <label>Hide Creature</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>
                {formState.hidden !== creatures.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditCreature