import './edit.css'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Contexts
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { usePcsContext } from '../../../hooks/usePcsContext'

// Components
import Editor from '../../../components/editor/Editor'

// Icons
import { FaEdit } from "react-icons/fa";

// Utils
import { cleanHTML } from '../../../utils/CleanHtml'

const EditPC = () => {
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        image: '',
        secrets: '',
        lastSeen: '',
        hidden: false
    });
    const [pcInfo, setPcInfo] = useState({})

    const [eName, setEName] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [eSecrets, setESecrets] = useState(false)
    const [eLastSeen, setELastSeen] = useState(false)

    const [description, setDescription] = useState('')
    const [dbDescription, setDbDescription] = useState('')
    const [secrets, setSecrets] = useState('')
    const [dbSecrets, setDbSecrets] = useState('')

    const { campaigns } = useCampaignsContext()
    const { pcs } = usePcsContext()
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
        // Fetch an PC's information
        const fetchPCinfo = async () => {
            const data = pcs.find(pc => pc._id === path);
            if (data) {
                setPcInfo(data)
                setFormState({
                    name: '',
                    description: '',
                    image: '',
                    secrets: '',
                    lastSeen: '',
                    hidden: data.hidden
                })
            }
        }

        if (user) {
            fetchPCinfo()
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

        for (const [key, value] of Object.entries(formState)) {
            if (value !== undefined && value !== "") {
                updatedData[key] = value
            }
        }

        const response = await fetch('https://dnd-kukm.onrender.com/api/pc/' + pcInfo._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedData)
        })
        const json = await response.json()
        console.log("JSON response:", json)

        if (response.ok) {
            console.log(json)
            navigate(`/campaign/${campaigns._id}`)
        }


    }

    // Clean HTML
    useEffect(() => {
        if (pcInfo) {
            cleanHTML(pcInfo.description, setDbDescription);
            cleanHTML(pcInfo.secrets, setDbSecrets);
        }
    }, [pcInfo]);

    useEffect(() => {
        setFormState(prevState => ({
            ...prevState,
            description: description,
            secrets: secrets
        }));
    }, [description, secrets]);



    return (
        <form className='editCharacter__form glass'>
           <h2>Edit PC</h2>
            <label>Name <FaEdit onClick={() => setEName(!eName)}/></label>
            <p>{pcInfo.name}</p>
            {eName &&
                <div>
                    <input 
                        className="edit-input" 
                        type="text" 
                        id="name" 
                        onChange={handleChange} 
                        placeholder={pcInfo.name}>
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
                    value={description}
                    onChange={setDescription}
                />
                {formState.description && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Image <FaEdit onClick={() => setEImage(!eImage)}/></label>
            <img src={pcInfo.image} alt={pcInfo.name}/>
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

            <label>Last Seen <FaEdit onClick={() => setELastSeen(!eLastSeen)}/></label>
            <p dangerouslySetInnerHTML={{__html: pcInfo.lastSeen}}></p>
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
                {formState.hidden !== pcInfo.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditPC