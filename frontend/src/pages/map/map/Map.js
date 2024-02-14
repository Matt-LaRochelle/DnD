import './map.css'

import { useEffect, useState } from 'react'
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

// 3rd Party
import Draggable from 'react-draggable';

const Map = () => {
    const [loading, setLoading] = useState(true)
    // const [map, setMap] = useState(null)
    const [clientCharacterList, setClientCharacterList] = useState([])
    const [avatarMenu, setAvatarMenu] = useState(null)

    const [mapCoordinates, setMapCoordinates] = useState({ x: 0, y: 0})
    const [currentAvatarCoordinates, setCurrentAvatarCoordinates] = useState({ x: 0, y: 0})
    const [trackedAvatarCoordinates, setTrackedAvatarCoordinates] = useState({ x: 0, y: 0 });

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { maps, dispatch } = useMapsContext()
    const { pcs } = usePcsContext()

    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()


    // useEffect(() => {
    //     console.log("client character list", clientCharacterList)
    // }, [clientCharacterList])

    useEffect(() => {
        // Fetch an Map's information
        const fetchMapInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/map/${campaigns._id}/${path}`, {
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


    const goBack = () => {
        navigate(`/campaign/${campaigns._id}`)
    }

    // Add a character to the map
    const addCharacter = async (id) => {
        if (!user) {
            alert("You must be logged in.")
            return
        }
        let dbCharacterList = maps.characterList
        const newCharacter = {
            _id: id,
            x: 0,
            y: 0
        }
        dbCharacterList.push(newCharacter)
        const response = await fetch('/api/map/' + maps._id, {
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
                    currentX: character.x,
                    currentY: character.y,
                    trackedX: character.x,
                    trackedY: character.y
                }
            } else {
                return {
                    _id: character._id,
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

            const response = await fetch('/api/map/' + maps._id, {
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
    
        // Map over clientCharacterList to create a new array
        let newCharacterList = clientCharacterList.map(character => {
            // If the character's _id matches the target id, return a new object with the updated values
            if (character._id === characterID) {
                return {
                    _id: characterID,
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
        if (!characterID) {
            return
        }
        let clientFormatCharacter = clientCharacterList.find(character => character._id === characterID)
        let updatedDBCharacter = {
            _id: clientFormatCharacter._id,
            x: clientFormatCharacter.trackedX,
            y: clientFormatCharacter.trackedY
        }
        console.log("updatedDBCharacter:", updatedDBCharacter)
        // add updatedDBCharacter to the maps.characterList item with the same _id
        const updatedCharacterList = maps.characterList.map(character => {
            if (character._id === characterID) {
                return updatedDBCharacter
            } else {
                return character
            }
        })
        
        // Update the database with the new characterList
        const response = await fetch('/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({characterList: updatedCharacterList})
        })
        const json = await response.json()
        
        if (response.ok) {
            console.log("update character:", json)
            dispatch({ type: 'SET_MAP', payload: json })
            console.log(maps)
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
                currentX: character.x + mapCoordinates.x,
                currentY: character.y + mapCoordinates.y,
                trackedX: character.x,
                trackedY: character.y
            }
        })
        setClientCharacterList(newCharacterList)
        console.log("done")
    }

    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='map__container glass'>
                    <h1>{maps.name} Coordinates: {mapCoordinates.x} {mapCoordinates.y}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className="map__box">
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
                                    <div className="movable-avatar" ariaLabel={character._id}>
                                        <div onClick={() => showAvatarMenu(index)} >
                                            <Avatar 
                                                key={index} 
                                                image={pcs.find(pc => pc._id === character._id).image} 
                                                name={pcs.find(pc => pc._id === character._id).name} 
                                                hideName={true} 
                                                />
                                        </div>
                                        {avatarMenu === index && 
                                            <div className="avatar-menu glass">
                                                <Link to={`/pc/${character._id}`} className="button-primary avatar-info"><MdOutlineContactPage /></Link>
                                                <p className="button-secondary avatar-remove" onClick={() => removeCharacter(index, character._id)}><MdDeleteOutline /></p>
                                                <p  className="button-primary avatar-move"><strong><IoIosMove id={character._id}/></strong></p>
                                                <p>{pcs.find(pc => pc._id === character._id).name}</p>
                                                <p>{character.currentX}, {character.currentY}</p>
                                                <p>{character.trackedX}, {character.trackedY}</p>
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
                                    <p className="add" onClick={() => addCharacter(pc._id)}>+</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p><strong>Description</strong></p>
                        <p>{maps.description}</p>
                        {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p>{maps.secrets}</p>
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