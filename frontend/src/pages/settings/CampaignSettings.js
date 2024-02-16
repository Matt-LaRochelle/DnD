import './campaignSettings.css'

import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCampaignsContext } from '../../hooks/useCampaignsContext';

const CampaignSettings = () => {
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

    const { user } = useAuthContext();
    const { campaigns } = useCampaignsContext();

    const handleChange = (event) => {
        setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
    };

    const save = () => {
        console.log(checkboxes, campaigns._id, user.id);
    }

    return (
<div className="campaignSettings__container glass">
    <h1>Campaign Settings</h1>
    <p>Toggle the displays on your main campaign page here</p>
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
</div>
    );
}

export default CampaignSettings;