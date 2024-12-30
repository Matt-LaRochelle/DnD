import '../settings/settings.css'

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useNavigate } from 'react-router-dom'

import Editor from '../../components/editor/Editor'
import DOMPurify from 'dompurify'

import { FaEdit } from "react-icons/fa";


const EditCampaign = () => {
    const { user } = useAuthContext()
    const { campaigns, dispatch } = useCampaignsContext()
    const navigate = useNavigate()
    
    const [campaignDescription, setCampaignDescription] = useState('')
    const [campaignPlotPoints, setCampaignPlotPoints] = useState('')
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

    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.id]: event.target.value
        });
    }

    useEffect(() => {
        console.log(
            "campaigns:", campaigns,
            "campaignPlotPoints:", campaignPlotPoints,
            "plotPoints:", plotPoints,
            "This is just a test when campaigns, campaignPlotPoints, or plotPoints changes"
        )
    }, [campaigns, campaignPlotPoints, plotPoints]
    )

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
                    <Editor value={plotPoints} onChange={setPlotPoints} />
                    <button onClick={submit}>Save</button>
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