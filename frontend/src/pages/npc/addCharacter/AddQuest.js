import './add.css'
import { useEffect, useState } from 'react'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const AddQuest = () => {
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


    const submit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in')
            return
        }

        const quest = {...formState, "campaignID": campaigns._id}

        const response = await fetch('/api/quest/', {
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
        <form className='Add__form' onSubmit={submit}>
           <h2>Add Quest</h2>
            <label>Title</label>
            <input className={emptyFields.includes("title") && "error"} type="text" id="title" onChange={handleChange}></input>

            <label>Description</label>
            <input type="text" id="description" onChange={handleChange}></input>

            <label>Image</label>
            <input type="text" id="image" onChange={handleChange}></input>

            <label>Type</label>
                <select id="type" onChange={handleChange}>
                    <option value="Main">Main Quest</option>
                    <option value="Side">Side Quest</option>
                    <option value="Neutral">Personal Quest</option>
                </select>

            <label>Given By</label>
            <input type="text" id="givenBy" onChange={handleChange}></input>

            <label>Return To</label>
            <input type="text" id="returnTo" onChange={handleChange}></input>

            <label>Hide Character</label>
            <input type="checkbox" id="hidden" onChange={handleChange}></input>

            <button type="submit">Add NPC</button>
            {error && <div className="error" >{error}</div>}
        </form>
    )
}

export default AddQuest