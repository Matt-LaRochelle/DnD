import '../settings/settings.css'

// Hooks
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useNavigate } from 'react-router-dom'

// Components and functions
import Editor from '../../components/editor/Editor'
import DOMPurify from 'dompurify'

// Icons
import { FaEdit } from "react-icons/fa";

const EditCampaign = () => {
    const { user } = useAuthContext()
    const { campaigns, dispatch } = useCampaignsContext()
    const navigate = useNavigate()
    
    // Information from the DB
    const [dbDescription, setDbDescription] = useState('')
    const [dbPlotPoints, setDbPlotPoints] = useState('')

    // Editor and add windows
    const [eTitle, setETitle] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [ePlotPoint, setEPlotPoint] = useState(false)
    const [aPlotPoint, setAPlotPoint] = useState(false)

    // This is the variable that gets sent to the DB
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        image: '',
        plotPoints: ''
    })

    // Variables that hold data as it moves from the editor component to the form state
    const [description, setDescription] = useState('')
    const [editedPlotPoint, setEditedPlotPoint] = useState('')
    const [newPlotPoint, setNewPlotPoint] = useState('')

    // Toggle editor windows
    const editTitle = () => {setETitle(!eTitle)}
    const editDescription = () => {setEDescription(!eDescription)}
    const editPlotPoint = () => {setEPlotPoint(!ePlotPoint)}
    const addPlotPoint = () => {setAPlotPoint(!aPlotPoint)}
    const editImage = () => {setEImage(!eImage)}

    // Function to add a new plot point
    // TO DO: Currently off by 1 submit click...
    const addANewPlotPoint = (e) => {
        console.log("Adding a new plot point function")
        console.log('old campaign plot points:', dbPlotPoints)

        // Update the plotPoints array with the new plot point
        const updatedPlotPoints = [...dbPlotPoints, newPlotPoint];
        console.log("updated plot points:", updatedPlotPoints);

        // Update the formState with the new plot points
        setFormState(prevFormState => ({
            ...prevFormState,
            plotPoints: updatedPlotPoints
        }));

        // I need this to be current but it is one step behind...
        console.log("formState after adding a new plot point:", formState)
        // submit(e)
    }


    // For handling Title and Image changes using basic input
    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.id]: event.target.value
        });
    }

    // For debugging
    useEffect(() => {
        console.log(
            "campaigns:", campaigns,
            "dbPlotPoints:", dbPlotPoints,
            "newPlotPoint:", newPlotPoint
        )
    }, [campaigns, dbPlotPoints]
    )

    // For debugging
    useEffect(() => {
        console.log("formState always:", formState)
    }, [formState])

    // For handling inner HTML --> Take DB information and format it to HTML
    useEffect(()=> {
        const cleanHtml = () => {
            if (campaigns.description) {
                let cleanDbDescription = DOMPurify.sanitize(campaigns.description)
                setDbDescription(cleanDbDescription)
            } if (campaigns.plotPoints) {
                let cleanDbPlotPoints = campaigns.plotPoints.map(plotPoint => DOMPurify.sanitize(plotPoint));
                setDbPlotPoints(cleanDbPlotPoints);
            }
        }
        if (campaigns) {
            cleanHtml()
        }
    }, [campaigns])

    // Submitting any type of data
    const submit = async (e) => {
        e.preventDefault();
        console.log("Submitting form")

        if (!user) {
            alert("You must be logged in.")
            return
        }

        // Only add things that were updated
        const updatedData = {};

        // This goes through each object within the form state and adds it to updatedData if it's not undefined or an empty string
        for (const [key, value] of Object.entries(formState)) {
            if (value !== undefined && value !== "") {
                updatedData[key] = value
            }
        }
        console.log("updatedData 1:", updatedData)

        // Since description doesn't have a key/value we assign one here.
        // Plot points are a bit different since they are an array
        if (description) {
            updatedData['description'] = description
        } 
        // else if (currentPlotPoints) {
        //     updatedData['plotPoints'] = currentPlotPoints
        // }

        console.log("updatedData 2:", updatedData)

        const response = await fetch('https://dnd-kukm.onrender.com/api/campaign/' + campaigns._id, {
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
            dispatch({type: 'UPDATE_CAMPAIGN', payload: json})
            // Close all editor windows
            setETitle(false)
            setEDescription(false)
            setEImage(false)
            setEPlotPoint(false)
            setAPlotPoint(false)

            // Reset form state
            setFormState({
                title: '',
                description: '',
                image: '',
                plotPoints: ''
            })
        }
    }

    return (
        <div className="settings__container glass">
            <h1>Campaign Editor</h1>

            <p><strong>Campaign title: </strong>{campaigns.title}</p>
            <FaEdit onClick={editTitle}/>
            {eTitle && 
                <div>
                    <input type="text" id="title" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }

            <p><strong>Description</strong></p>
            <p dangerouslySetInnerHTML={{__html: dbDescription}}></p>
            <FaEdit onClick={editDescription} />
            {eDescription && 
                <div>
                    <Editor value={description} onChange={setDescription} />
                    <button onClick={submit}>Save</button>
                </div>
            }

            <p><strong>Plot points</strong></p>
            {dbPlotPoints && dbPlotPoints.map((dbPlotPoint, index) => (
                <div className="plotPoint">
                    <p key={index} dangerouslySetInnerHTML={{__html: dbPlotPoint}}></p>
                    <p>{index}</p>
                    <FaEdit onClick={editPlotPoint} />
                </div>
            ))}
            {/* This is when we edit a plot point */}
            {ePlotPoint && 
                <div>
                    <Editor value={editedPlotPoint} onChange={setEditedPlotPoint} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <FaEdit onClick={addPlotPoint} />
            {/* This is when we add a plot point */}
            {aPlotPoint &&
                <div>
                    <Editor value={newPlotPoint} onChange={setNewPlotPoint} />
                    <button onClick={addANewPlotPoint}>Save</button>
                </div>
            }

            <p><strong>Image:</strong></p><FaEdit onClick={editImage} />
            {eImage && 
                <div>
                    <input type="text" id="image" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <img src={campaigns.image} alt="campaign image" />
        </div>
    )
}

export default EditCampaign