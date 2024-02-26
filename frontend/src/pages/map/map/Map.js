import './map.css'

import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'

// Context
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { usePcsContext } from '../../../hooks/usePcsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useMapsContext } from '../../../hooks/useMapsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'

// Components
import Avatar from '../../../components/avatar/Avatar'
import Loading from '../../../components/loading/Loading'

// Icons
import { MdOutlineContactPage } from "react-icons/md";
import { MdOutlineAdd } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosMove } from "react-icons/io";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";

// 3rd Party
import Draggable from 'react-draggable';
import DOMPurify from 'dompurify';

const Map = () => {
    const [loading, setLoading] = useState(true)
    // const [map, setMap] = useState(null)
    const [clientCharacterList, setClientCharacterList] = useState([])
    const [avatarMenu, setAvatarMenu] = useState(null)

    const [mapCoordinates, setMapCoordinates] = useState({ x: 0, y: 0})
    const [currentAvatarCoordinates, setCurrentAvatarCoordinates] = useState({ x: 0, y: 0})
    const [trackedAvatarCoordinates, setTrackedAvatarCoordinates] = useState({ x: 0, y: 0 });

    const [description, setDescription] = useState('')
    const [secrets, setSecrets] = useState('')

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { maps, dispatch } = useMapsContext()
    const { pcs } = usePcsContext()
    const { npcs } = useNpcsContext()
    const { creatures } = useCreaturesContext()

    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    const [highlightedAvatar, setHighlightedAvatar] = useState(null);
    const [fullScreen, setFullScreen] = useState(false)


    // Create a ref for each avatar in your render method
    // const avatarRefs = clientCharacterList.reduce((acc, character) => {
    //     acc[character._id] = React.createRef();
    //     return acc;
    // }, {});


    // useEffect(() => {
    //     console.log("client character list", clientCharacterList)
    // }, [clientCharacterList])

    useEffect(() => {
        // Fetch an Map's information
        const fetchMapInfo = async () => {
            setLoading(true);
            const response = await fetch(`https://dnd-kukm.onrender.com/api/map/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_MAP', payload: json })
                // Set the characterList to be the maps characterList but with a 
                // different format: { _id: "id", currentX: 0, currentY: 0, trackedX: 0, trackedY: 0}

                // This is what needs to be tracked on the client side
                const buildingCharacterList = json.characterList.map(character => {
                    return {
                        _id: character._id,
                        type: character.type,
                        currentX: character.x + mapCoordinates.x,
                        currentY: character.y + mapCoordinates.y,
                        trackedX: character.x,
                        trackedY: character.y
                    }
                })
                setClientCharacterList(buildingCharacterList)
                setLoading(false)
            }
        }

        if (user) {
            fetchMapInfo()
        }
    }, [user])

console.log("pcs-context:", pcs)
    const goBack = () => {
        navigate(`/campaign/${campaigns._id}`)
    }

    // Add a character to the map
    const addCharacter = async (id, type) => {
        if (!user) {
            alert("You must be logged in.")
            return
        }
        let dbCharacterList = maps.characterList
        const newCharacter = {
            _id: id,
            type,
            x: 0,
            y: 0
        }
        dbCharacterList.push(newCharacter)
        const response = await fetch('https://dnd-kukm.onrender.com/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({characterList: dbCharacterList})
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: 'SET_MAP', payload: json })
            // This is what needs to be tracked on the client side
            // Take all DB characters and format them for client side.
            const returnedCharacterList = json.characterList.map(character => {
                if (character._id === id) {
                return {
                    _id: character._id,
                    type: character.type,
                    currentX: character.x,
                    currentY: character.y,
                    trackedX: character.x,
                    trackedY: character.y
                }
            } else {
                return {
                    _id: character._id,
                    type: character.type,
                    currentX: character.x + mapCoordinates.x,
                    currentY: character.y + mapCoordinates.y,
                    trackedX: character.x,
                    trackedY: character.y
                
                }
            }
            })
            setClientCharacterList(returnedCharacterList)
        }
    }

    // Remove a character from the map
    const removeCharacter = async (index, id) => {
        if (!user) {
            alert("You must be logged in.")
            return
        }

        // go through each item in maps.characterList. If an item has an _id that matches id, remove it from the list.
        const newCharacterList = maps.characterList.filter((character) => {
            return character._id !== id;
        });
        console.log("new character list", newCharacterList)

            const response = await fetch('https://dnd-kukm.onrender.com/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({characterList: newCharacterList})
        })
        const json = await response.json()
        
        if (response.ok) {
            dispatch({ type: 'SET_MAP', payload: json })
            // This is what needs to be tracked on the client side
            const updatedCharacterList = json.characterList.map(character => {
                return {
                    _id: character._id,
                    type: character.type,
                    currentX: character.x + mapCoordinates.x,
                    currentY: character.y + mapCoordinates.y,
                    trackedX: character.x,
                    trackedY: character.y
                }
            })
            setClientCharacterList(updatedCharacterList)
        }
        setAvatarMenu(null)
    }

    // Show the menu for clicked avatar
    const showAvatarMenu = (index) => {
        if (avatarMenu === index) {
            setAvatarMenu(null)
            return
        }
        setAvatarMenu(index)
    }

    // Setting avatar coordinates when the avatar moves
    const handleDrag = (e, data) => {
        let characterID = e.target.id;
        console.log("dragging... characterID:", characterID)
    
        // Map over clientCharacterList to create a new array
        let newCharacterList = clientCharacterList.map(character => {
            // If the character's _id matches the target id, return a new object with the updated values
            if (character._id === characterID) {
                return {
                    _id: characterID,
                    type: character.type,
                    currentX: data.x,
                    currentY: data.y,
                    trackedX: data.x - mapCoordinates.x,
                    trackedY: data.y - mapCoordinates.y
                };
            } else {
                // If the character's _id doesn't match the target id, return the character as is
                return character;
            }
        });
    
        // Update the client state with the new array
        setClientCharacterList(newCharacterList);
    };


// This is where the problem is happening - the format changes.
    const handleStop = async (e, data) => {
        // Update the database character x and y coordinates to match the trackedX and trackedY of this specific avatar
        let characterID = e.target.id;
        console.log("characterID:", characterID)
        if (!characterID) {
            return
        }
        let clientFormatCharacter = clientCharacterList.find(character => character._id === characterID)
        let updatedDBCharacter = {
            _id: clientFormatCharacter._id,
            type: clientFormatCharacter.type,
            x: clientFormatCharacter.trackedX,
            y: clientFormatCharacter.trackedY
        }
        // add updatedDBCharacter to the maps.characterList item with the same _id
        const updatedCharacterList = maps.characterList.map(character => {
            if (character._id === characterID) {
                return updatedDBCharacter
            } else {
                return character
            }
        })
        
        // Update the database with the new characterList
        const response = await fetch('https://dnd-kukm.onrender.com/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({characterList: updatedCharacterList})
        })
        const json = await response.json()
        
        if (response.ok) {
            dispatch({ type: 'SET_MAP', payload: json })

            // Change the border color of the avatar
            // Highlight the avatar
            setHighlightedAvatar(characterID);

            // Remove the highlight after 1 second
            setTimeout(() => {
                setHighlightedAvatar(null);
            }, 1000);
                }
    };


    // Setting map coordinates when the map moves
    const handleMapDrag = (e, data) => {
        console.log(data);
        setMapCoordinates({x: data.x, y: data.y})
        // Update the trackedX and trackedY of each character in the characterList
        const newCharacterList = clientCharacterList.map(character => {
            return {
                _id: character._id,
                type: character.type,
                currentX: character.currentX + data.deltaX,
                currentY: character.currentY + data.deltaY,
                trackedX: character.currentX,
                trackedY: character.currentY
            }
        })
        setClientCharacterList(newCharacterList)
        console.log("done")
        };

    const handleMapDragStop = (e, data) => {
        console.log("map drag stop")
        const newCharacterList = maps.characterList.map(character => {
            return {
                _id: character._id,
                type: character.type,
                currentX: character.x + mapCoordinates.x,
                currentY: character.y + mapCoordinates.y,
                trackedX: character.x,
                trackedY: character.y
            }
        })
        setClientCharacterList(newCharacterList)
        console.log("done")
    }




    // For handling inner HTML
    useEffect(()=> {
        const cleanHtml = () => {
            if (maps.description) {
                let cleanDescription = DOMPurify.sanitize(maps.description)
                setDescription(cleanDescription)
            }
            if (maps.secrets) {
                let cleanSecrets = DOMPurify.sanitize(maps.secrets)
                setSecrets(cleanSecrets)
            }
        }
        if (maps) {
            cleanHtml()
        }
    }, [maps])

    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='map__container glass'>
                    <h1>{maps.name} Coordinates: {mapCoordinates.x} {mapCoordinates.y}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div 
                        className={fullScreen ? "map__image full-screen" : "map__image"}    
    //                     style={{
    //                     position: fullScreen ? "fixed" : "relative",
    //                     top: fullScreen ? "0" : "initial",
    //                     left: fullScreen ? "0" : "initial",
    //                     right: fullScreen ? "0" : "initial",
    //                     bottom: fullScreen ? "0" : "initial",
    //                     width: fullScreen ? "100vw" : "100%",
    //                     height: fullScreen ? "100vh" : "min(900px, 80vh)",
    //                     zIndex: fullScreen ? "10" : "1",
    // }}
    >
                        {fullScreen 
                        ? 
                            <MdFullscreenExit 
                                className="full-screen-icon" 
                                onClick={() => setFullScreen(!fullScreen)} />
                        :   
                            <MdFullscreen 
                                    className="full-screen-icon" 
                                    onClick={() => setFullScreen(!fullScreen)} /> 
                        }
                        <div className="movable-characters glass">
                            {clientCharacterList.map((character, index) => (
                                <Draggable
                                        defaultPosition={{x: 0, y: 0}}
                                        position={{x: character.currentX, y: character.currentY}}
                                        scale={1}
                                        handle="strong"
                                        onDrag={handleDrag}
                                        onStop={handleStop}
                                        >
                                    <div className="movable-avatar" ariaLabel={character._id} style={character._id === highlightedAvatar ? { border: '4px solid lime' } : {}}>
                                        <div onClick={() => showAvatarMenu(index)} >
                                            {character.type === "pc" &&
                                            <Avatar 
                                                key={index} 
                                                image={pcs.find(pc => pc._id === character._id).image} 
                                                name={pcs.find(pc => pc._id === character._id).name} 
                                                hideName={true} 
                                                />
                                            }
                                            {character.type === "npc" &&
                                            <Avatar 
                                                key={index} 
                                                image={npcs.find(npc => npc._id === character._id).image} 
                                                name={npcs.find(npc => npc._id === character._id).name} 
                                                hideName={true} 
                                                />
                                            }
                                            {character.type === "creature" &&
                                            <Avatar 
                                                key={index} 
                                                image={creatures.find(creature => creature._id === character._id).image} 
                                                name={creatures.find(creature => creature._id === character._id).name} 
                                                hideName={true} 
                                                />
                                            }
                                        </div>
                                        {avatarMenu === index && 
                                            <div className="avatar-menu">
                                                <Link to={`/pc/${character._id}`} className="button-primary avatar-info"><MdOutlineContactPage /></Link>
                                                <p className="button-secondary avatar-remove" onClick={() => removeCharacter(index, character._id)}><MdDeleteOutline /></p>
                                                <p className="button-primary avatar-move"><strong><IoIosMove id={character._id}/></strong></p>
                                                <div className="debugging-avatar-div glass">
                                                    {character.type === "pc" && <p>{pcs.find(pc => pc._id === character._id).name}</p>}
                                                    {character.type === "npc" && <p>{npcs.find(npc => npc._id === character._id).name}</p>}
                                                    {character.type === "creature" && <p>{creatures.find(creature => creature._id === character._id).name}</p>}
                                                    <p>{character.currentX}, {character.currentY}</p>
                                                    <p>{character.trackedX}, {character.trackedY}</p>
                                                </div>
                                            </div>}
                                    </div>
                                </Draggable>
                            ))}
                        </div>

                        <Draggable 
                            onDrag={handleMapDrag}
                            onStop={handleMapDragStop}>
                            <div className='map__image' style={{    
                                backgroundImage: `url(${maps.image})`,
                                backgroundRepeat: 'no-repeat'
                            }}>


                            </div>
                        </Draggable>
                    </div>
                    <div>
                        <h2>Characters</h2>
                        <ul className="map-pc-row">
                            {pcs.map(pc => (
                                <li key={pc._id}>
                                    <Avatar image={pc.image} name={pc.name} hideName={true} />
                                    <p className="add" onClick={() => addCharacter(pc._id, "pc")}>+</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {campaigns.dmID === user.id && 
                    <div>
                        <h2>Non Player Characters</h2>
                        <ul className="map-pc-row">
                            {npcs.map(npc => (
                                <li key={npc._id}>
                                    <Avatar image={npc.image} name={npc.name} hideName={true} />
                                    <p className="add" onClick={() => addCharacter(npc._id, "npc")}>+</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    }
                    {campaigns.dmID === user.id && 
                    <div>
                        <h2>Creatures</h2>
                        <ul className="map-pc-row">
                            {creatures.map(creature => (
                                <li key={creature._id}>
                                    <Avatar image={creature.image} name={creature.name} hideName={true} />
                                    <p className="add" onClick={() => addCharacter(creature._id, "creature")}>+</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    }
                    <div>
                        <h2>Description</h2>
                        <p dangerouslySetInnerHTML={{__html: description}}></p>
                        {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p dangerouslySetInnerHTML={{__html: secrets}}></p>
                            </div>
                        }
                        {campaigns.dmID === user.id && 
                            <button className="button-primary" onClick={() => navigate(`/map/edit/${maps._id}`)}>Edit</button>
                        }
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default Map