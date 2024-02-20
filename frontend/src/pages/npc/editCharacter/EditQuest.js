import './edit.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useQuestsContext } from '../../../hooks/useQuestsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

import DOMPurify from 'dompurify'
import Editor from '../../../components/editor/Editor'

import { FaEdit } from "react-icons/fa";

const EditQuest = () => {
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        image: '',
        type: '',
        givenBy: '',
        returnTo: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])
    const [loading, setLoading] = useState(true)

    const [eTitle, setETitle] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [eType, setEType] = useState(false)
    const [eGivenBy, setEGivenBy] = useState(false)
    const [eReturnTo, setEReturnTo] = useState(false)


    const [description, setDescription] = useState('')
    const [dbDescription, setDbDescription] = useState('')

    const { campaigns } = useCampaignsContext()
    const { quests, dispatch } = useQuestsContext()
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
        // Fetch a Quest's information
        const fetchQuestInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/quest/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const questInfo = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_QUEST', payload: questInfo })
                setLoading(false)
                setFormState({
                    title: '',
                    description: '',
                    image: '',
                    type: '',
                    givenBy: '',
                    returnTo: '',
                    hidden: questInfo.hidden
                })
            }
        }

        if (user) {
            fetchQuestInfo()
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

        const response = await fetch('/api/quest/' + quests._id, {
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
            if (quests.description) {
                let cleanDescription = DOMPurify.sanitize(quests.description)
                setDbDescription(cleanDescription)
            }
        }
        if (quests) {
            cleanHtml()
        }
    }, [quests])

    useEffect(() => {
        setFormState(prevState => ({
            ...prevState,
            description: description
        }));
    }, [description]);


    return (
        <form className='editCharacter__form glass'>
           <h2>Edit Quest</h2>
            <label>Title <FaEdit onClick={() => setETitle(!eTitle)}/></label>
            <p>{quests.title}</p>
            {eTitle &&
            <div>
                <input 
                    className="edit-input" 
                    type="text" 
                    id="title" 
                    onChange={handleChange}>
                </input>
                {/* if the input with id="name" is onFocus, then show this button */}
                {formState.title && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Description <FaEdit onClick={() => setEDescription(!eDescription)}/></label>
            <p dangerouslySetInnerHTML={{__html: dbDescription}}></p>
            {eDescription &&
            <div>
                <Editor 
                    description={description}
                    setDescription={setDescription}
                />
                {formState.description && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }

            <label>Image <FaEdit onClick={() => setEImage(!eImage)}/></label>
            <img src={quests.image} alt={quests.name}/>
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

            <label>Type <FaEdit onClick={() => setEType(!eType)}/></label>
            <p>{quests.type}</p>
            {eType &&
            <div>
                <select id="type" onChange={handleChange}>
                    <option value="Main" selected={quests.type === "Main" ? true : false}>Main Quest</option>
                    <option value="Side" selected={quests.type === "Side" ? true : false}>Side Quest</option>
                    <option value="Personal" selected={quests.type === "Personal" ? true : false}>Personal Quest</option>
                </select>
                {formState.type && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }
            
            <label>Given by <FaEdit onClick={() => setEGivenBy(!eGivenBy)}/></label>
            <p>{quests.givenBy}</p>
            {eGivenBy &&
            <div>
                <input 
                    className="edit-input"
                    type="text" 
                    id="givenBy" 
                    onChange={handleChange}></input>
                {formState.givenBy && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }
           
            <label>Return to <FaEdit onClick={() => setEReturnTo(!eReturnTo)}/></label>
            <p>{quests.returnTo}</p>
            {eReturnTo &&
            <div>
                <input 
                    className="edit-input"
                    type="text" 
                    id="returnTo" 
                    onChange={handleChange}></input>
                {formState.returnTo && <button onClick={submit} className="button-primary">Save</button>}
            </div>
            }
            <label>Hide Quest</label>
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>
                {formState.hidden !== quests.hidden && <button onClick={submit} className="button-primary">Save</button>}

            
        </form>
    )
}

export default EditQuest