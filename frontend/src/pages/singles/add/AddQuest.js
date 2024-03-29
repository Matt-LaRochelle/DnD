import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

import Editor from '../../../components/editor/Editor'

const AddQuest = () => {
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        image: '',
        type: 'Main',
        user: '',
        givenBy: '',
        returnTo: '',
        hidden: false
    });
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields ] = useState([])

    const [description, setDescription] = useState('')

    const { campaigns } = useCampaignsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname;
    const slashCount = (path.match(/\//g) || []).length;


    console.log(location)
    // for personal: location.pathname = "/quest/add/651d9c4be4bd437164752a68"
    // for side: location.pathname = "quest/add-side"
    // for main: location.pathname = "quest/add-main"

    useEffect(() => {
        if (path === "/quest/add-main") {
            setFormState(prevState => ({
                ...prevState,
                type: 'Main'
            }))
        } else if (path === "/quest/add-side") {
            setFormState(prevState => ({
                ...prevState,
                type: 'Side'
            }))
        } else {
            setFormState(prevState => ({
                ...prevState,
                type: 'Personal',
                user: user.id
            }))
        }
    }, [])

    useEffect(() => {
        console.log(formState)

    }, [formState])

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
            description: description
        }));
    }, [description]);


    const submit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in')
            return
        }

        const quest = {...formState, "campaignID": campaigns._id}

        const response = await fetch('https://dnd-kukm.onrender.com/api/quest/', {
            method: 'POST',
            body: JSON.stringify(quest),
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
                title: '',
                description: '',
                image: '',
                type: '',
                user: '',
                givenBy: '',
                returnTo: '',
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
           <h2>Add Quest</h2>
            <label>Title</label>
            <input className={emptyFields.includes("title") && "error"} type="text" id="title" onChange={handleChange}></input>

            <label>Description</label>
            <Editor value={description} onChange={setDescription}/>

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            {/* <label>Type</label>
                <select id="type" onChange={handleChange}>
                    <option value="" disabled>Select a type</option>
                    <option value="Main">Main Quest</option>
                    <option value="Side">Side Quest</option>
                    <option value="Personal">Personal Quest</option>
                </select> */}

            <label>Given By</label>
            <input type="text" id="givenBy" onChange={handleChange}></input>

            <label>Return To</label>
            <input type="text" id="returnTo" onChange={handleChange}></input>

            {slashCount < 3 && <label>Hide Quest</label>}
            {slashCount < 3 && 
            <label className="slider" style={{backgroundColor: formState.hidden ? "var(--primary-800)" : "#ccc"}}>
                <input type="checkbox" id="hidden" checked={formState.hidden} onChange={handleChange} className="slider-checkbox" />
                <span className="slider-round"></span>
            </label>
            }

            <button className="button-primary" type="submit">Add Quest</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddQuest