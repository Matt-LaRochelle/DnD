import './edit.css'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Contexts
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'

// Components
import Editor from '../../../components/editor/Editor'

// Icons
import { FaEdit } from "react-icons/fa";

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'


const EditCreature = () => {
    const [formState, setFormState] = useState({
        description: '',
        image: '',
        nativeTo: '',
        alignment: '',
        secrets: '',
        hidden: false
    });


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
    const { creatures } = useCreaturesContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const location = useLocation()
    const path = location.pathname.split("/")[3]

    const [creatureInfo, setCreatureInfo] = useState({})

    const handleChange = (event) => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormState({
            ...formState,
            [event.target.id]: isCheckbox ? event.target.checked : event.target.value
        });
    }


    useEffect(() => {
        // Fetch a Creature's information
        const fetchCreatureInfo = () => {
            const data = creatures.find(creature => creature._id === path);
    
            if (data) {
                setCreatureInfo(data)
                setFormState({
                    name: '',
                    description: '',
                    image: '',
                    nativeTo: '',
                    alignment: '',
                    secrets: '',
                    hidden: data.hidden
                })
            }
        }
    
        if (user) {
            fetchCreatureInfo()
        }
    }, [user, creatures, path])


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

    // Clean HTML
    useEffect(() => {
        if (creatureInfo) {
            cleanHTML(creatureInfo.description, setDbDescription);
            cleanHTML(creatureInfo.secrets, setDbSecrets);
        }
    }, [creatureInfo]);

    // Set formState to the creature's information
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
            <p>{creatureInfo.name}</p>
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
            <img src={creatureInfo.image} alt={creatureInfo.name}/>
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
            <p>{creatureInfo.nativeTo}</p>
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
            <p>{creatureInfo.alignment}</p>
            {eAlignment &&
            <div>
                <select id="alignment" onChange={handleChange}>
                    <option value="Good" selected={creatureInfo.alignment === "Good" ? true : false}>Good</option>
                    <option value="Neutral" selected={creatureInfo.alignment === "Neutral" ? true : false}>Neutral</option>
                <option value="Evil" selected={creatureInfo.alignment === "Evil" ? true : false}>Evil</option>
                <option value="Unknown" selected={creatureInfo.alignment === "Unknown" ? true : false}>Unknown</option>
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
                {formState.hidden !== creatureInfo.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditCreature