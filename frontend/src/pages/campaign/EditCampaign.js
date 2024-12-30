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
    
    const [campaignDescription, setCampaignDescription] = useState('')
    const [campaignPlotPoints, setCampaignPlotPoints] = useState('')

    // Editor and add windows
    const [eTitle, setETitle] = useState(false)
    const [eDescription, setEDescription] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [ePlotPoints, setEPlotPoints] = useState(false)
    const [aPlotPoints, setAPlotPoints] = useState(false)

    const [formState, setFormState] = useState({
        title: '',
        description: '',
        image: '',
        plotPoints: ''
    })
    const [description, setDescription] = useState('')
    const [plotPoints, setPlotPoints] = useState('')
    const [newPlotPoints, setNewPlotPoints] = useState('')

    // Toggle editor windows
    const editTitle = () => {
        setETitle(!eTitle)
    }
    const editDescription = () => {
        setEDescription(!eDescription)
    }
    const editPlotPoints = () => {
        console.log('Editing plot points')
        setEPlotPoints(!ePlotPoints)
    }
    const addPlotPoints = () => {
        console.log('Adding plot points')
        setAPlotPoints(!aPlotPoints)
    }
    const editImage = () => {
        setEImage(!eImage)
    }

    // Function to add a new plot point
    const addANewPlotPoint = (e) => {
        console.log('Adding a new plot point')
        console.log('old campaign plot points:', campaignPlotPoints)
        campaignPlotPoints.push(newPlotPoints)
        console.log('new campaign plot points:', campaignPlotPoints)
        submit(e)
    }

    // ???
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
            "campaignPlotPoints:", campaignPlotPoints,
            "plotPoints:", plotPoints,
            "This is just a test when campaigns, campaignPlotPoints, or plotPoints changes"
        )
    }, [campaigns, campaignPlotPoints, plotPoints]
    )

    // For debugging
    useEffect(() => {
        console.log("formState:", formState)
    }, [formState])

    // For handling inner HTML
    useEffect(()=> {
        const cleanHtml = () => {
            // console.log(campaigns.description)
            if (campaigns.description) {
                let cleanCampaignDescription = DOMPurify.sanitize(campaigns.description)
                setCampaignDescription(cleanCampaignDescription)
            } if (campaigns.plotPoints) {
                console.log("plot points are located")
                let cleanCampaignPlotPoints = campaigns.plotPoints.map(plotPoint => DOMPurify.sanitize(plotPoint));
                console.log("plot points have been cleaned", cleanCampaignPlotPoints)
                setCampaignPlotPoints(cleanCampaignPlotPoints);
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
        console.log("updatedData 1:", updatedData)

        // I don't understand this function
        for (const [key, value] of Object.entries(formState)) {
            if (value !== undefined && value !== "") {
                updatedData[key] = value
            }
        }
        console.log("updatedData 2:", updatedData)

        // I also don't understand these two functions
        if (description) {
            updatedData['description'] = description
        } else if (plotPoints) {
            updatedData['plotPoints'] = plotPoints
        }

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
            setEPlotPoints(false)
            setAPlotPoints(false)
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
            <p dangerouslySetInnerHTML={{__html: campaignDescription}}></p>
            <FaEdit onClick={editDescription} />
            {eDescription && 
                <div>
                    {/* <input type="text" id="description" onChange={handleChange} /> */}
                    <Editor value={description} onChange={setDescription} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <p><strong>Plot points</strong></p>
            {campaignPlotPoints && campaignPlotPoints.map((campaignPlotPoint, index) => (
                <div className="plotPoint">
                    <p key={index} dangerouslySetInnerHTML={{__html: campaignPlotPoint}}></p>
                    <p>{index}</p>
                    <FaEdit onClick={editPlotPoints} />
                </div>
            ))}
            <FaEdit onClick={addPlotPoints} />
            {/* This is when we edit a plot point */}
            {ePlotPoints && 
                <div>
                    {/* <input type="text" id="plotPoints" onChange={handleChange} /> */}
                    <Editor value={plotPoints} onChange={setPlotPoints} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            {/* This is when we add a plot point */}
            {aPlotPoints &&
                <div>
                    {/* <input type="text" id="plotPoints" onChange={handleChange} /> */}
                    <Editor value={newPlotPoints} onChange={setNewPlotPoints} />
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