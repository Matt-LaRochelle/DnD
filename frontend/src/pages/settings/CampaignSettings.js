import './campaignSettings.css'

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCampaignsContext } from '../../hooks/useCampaignsContext';

const CampaignSettings = () => {
    const { user } = useAuthContext();
    const { campaigns, dispatch } = useCampaignsContext();

    const [checkboxes, setCheckboxes] = useState({
        description: true,
        image: true,
        players: true,
        maps: true,
        playerCharacters: true,
        nonPlayerCharacters: true,
        creatures: true,
        quests: true
    });
    const [error, setError] = useState(false);
    const [complete, setComplete] = useState(false);

    const handleChange = (event) => {
        setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        if (campaigns) {
            let updatedSettings = campaigns.playerSettings.find(setting => setting.id === user.id).settings;
            console.log("updated Settings:", updatedSettings)
            setCheckboxes(updatedSettings)
        }
    }, [])

    const save = async () => {
        console.log(checkboxes, campaigns._id, user.id);

        if (!user) {
            alert("You must be logged in.")
            return
        }

        const data = {
            campaignID: campaigns._id,
            id: user.id,
            username: user.username,
            settings: checkboxes
        }
        console.log("data", data);

        const response = await fetch('/api/campaign/settings', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(data)
        })
        const json = await response.json()
        console.log("JSON response:", json)

        if (response.ok) {
            console.log(json)
            dispatch({type: 'UPDATE_CAMPAIGN', payload: json})
            // Set complete to true for 5 seconds
            
            setComplete(true)
            setTimeout(() => {
                setComplete(false)
            }, 5000)
        }
        else {
            setError(json.message)
            setTimeout(() => {
                setError(false)
            }, 5000)
        }
    }

    return (
<div className="campaignSettings__container glass">
    <h1>Campaign Settings</h1>
    <p>Toggle the displays on your main campaign page here</p>
    <div className="checkbox-container">
        <p>Description</p>
        <label className="slider" style={{backgroundColor: checkboxes.description ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="description" checked={checkboxes.description} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Image</p>
        <label className="slider" style={{backgroundColor: checkboxes.image ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="image" checked={checkboxes.image} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Players</p>
        <label className="slider" style={{backgroundColor: checkboxes.players ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="players" checked={checkboxes.players} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Maps</p>
        <label className="slider" style={{backgroundColor: checkboxes.maps ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="maps" checked={checkboxes.maps} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Player Characters</p>
        <label className="slider" style={{backgroundColor: checkboxes.playerCharacters ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="playerCharacters" checked={checkboxes.playerCharacters} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Non Player Characters</p>
        <label className="slider" style={{backgroundColor: checkboxes.nonPlayerCharacters ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="nonPlayerCharacters" checked={checkboxes.nonPlayerCharacters} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Creatures</p>
        <label className="slider" style={{backgroundColor: checkboxes.creatures ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="creatures" checked={checkboxes.creatures} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <div className="checkbox-container">
        <p>Quests</p>
        <label className="slider" style={{backgroundColor: checkboxes.quests ? "var(--primary-800)" : "#ccc"}}>
            <input type="checkbox" name="quests" checked={checkboxes.quests} onChange={handleChange} className="slider-checkbox" />
            <span className="slider-round"></span>
        </label>
    </div>
    <button className="button-primary" onClick={save}>Save</button>
    {error && <p>{error}</p>}
    {complete && <p>Settings saved!</p>}
</div>
    );
}

export default CampaignSettings;