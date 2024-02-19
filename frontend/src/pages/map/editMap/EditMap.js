import '../../npc/editCharacter/edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useMapsContext } from '../../../hooks/useMapsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

import Editor from '../../../components/editor/Editor'
import DOMPurify from 'dompurify'

import { FaEdit } from "react-icons/fa";

const EditMap = () => {
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        image: '',
        secrets: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])
    const [loading, setLoading] = useState(true)

    const [eName, setEName] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [eSecrets, setESecrets] = useState(false)

    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')

    const { campaigns } = useCampaignsContext()
    const { maps, dispatch } = useMapsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const location = useLocation()
    const path = location.pathname.split("/")[3]
    console.log(path)

    const handleChange = (event) => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormState({
            ...formState,
            [event.target.id]: isCheckbox ? event.target.checked : event.target.value
        });
    }


    useEffect(() => {
        // Fetch a map's information
        const fetchMapinfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/map/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const mapInfo = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_MAP', payload: mapInfo })
                setLoading(false)
                setFormState({
                    name: '',
                    description: '',
                    image: '',
                    secrets: '',
                    hidden: mapInfo.hidden
                })
            }
        }

        if (user) {
            fetchMapinfo()
        }
    }, [user])

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

        const response = await fetch('/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedData)
        })
        const json = await response.json()

        if (response.ok) {
            console.log(json)
            navigate(`/campaign/${campaigns._id}`)
        }


    }


    return (
        <form className='editCharacter__form glass'>
           <h2>Edit Map</h2>
            <label>Name <FaEdit onClick={() => setEName(!eName)}/></label>
            <p>{maps.name}</p>
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
            <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(maps.description)}}></p>
            {eDescription &&
            <div>
                <Editor 
                    id="description" 
                    onChange={setDescription} 
                    value={description}
                />
                {description && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Image <FaEdit onClick={() => setEImage(!eImage)}/></label>
            <img src={maps.image} alt={maps.name}/>
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

            <label>Secrets <FaEdit onClick={() => setESecrets(!eSecrets)}/></label>
            <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(maps.secrets)}}></p>
            {eSecrets &&
            <div>
                <Editor 
                    value={secrets}
                    onChange={setSecrets}
                    />
                {secrets && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }
            <label>Hide Map</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>
            {formState.hidden !== maps.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditMap