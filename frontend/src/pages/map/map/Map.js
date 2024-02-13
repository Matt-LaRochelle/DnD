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
    // const [characterList, setCharacterList] = useState([])
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
    //     console.log(characterList)
    // }, [characterList])

    useEffect(() => {
        // Fetch an Map's information
        const fetchMapInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/map/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const mapInfo = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_MAP', payload: mapInfo })
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

    const addCharacter = async (id) => {
        if (!user) {
            alert("You must be logged in.")
            return
        }
        const characterList = maps.characterList
        const newCharacter = {
            _id: id,
            x: 0,
            y: 0
        }
        characterList.push(newCharacter)
        const response = await fetch('/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({characterList})
        })
        const json = await response.json()

        if (response.ok) {
            console.log(json)
        }
    }
    const removeCharacter = async (index, id) => {
        if (!user) {
            alert("You must be logged in.")
            return
        }
        console.log(index, id)
        // If this character matches the index in characterList AND the id in that index, then remove it from the list
        if (maps.characterList[index]._id === id) {
            const newCharacterList = maps.characterList.filter((character, i) => i !== index)
            console.log(newCharacterList)
            
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
            console.log(json)
        }
        setAvatarMenu(null)
    }
    }

    const showAvatarMenu = (index) => {
        if (avatarMenu === index) {
            setAvatarMenu(null)
            return
        }
        setAvatarMenu(index)
    }

    // Setting avatar coordinates when the avatar moves
    const handleDrag = (e, data) => {
        setCurrentAvatarCoordinates({ x: data.x, y: data.y });
        setTrackedAvatarCoordinates({ x: data.x - mapCoordinates.x, y: data.y - mapCoordinates.y });
        };
    const handleStop = async () => {
        // Update the x and y coordinates of the character in the characterList
        const characterList = maps.characterList
        const index = characterList.findIndex(character => character._id === pcs[avatarMenu]._id)
        characterList[index] = {
            x: trackedAvatarCoordinates.x,
            y: trackedAvatarCoordinates.y
        }
        const response = await fetch('/api/map/' + maps._id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({characterList})
        })
        const json = await response.json()

        if (response.ok) {
            console.log(json)
        }
    }

    // Setting map coordinates when the map moves
    const handleMapDrag = (e, data) => {
        console.log(data);
        setMapCoordinates({x: data.x, y: data.y})
        setCurrentAvatarCoordinates({ x: (currentAvatarCoordinates.x + data.deltaX), y: (currentAvatarCoordinates.y + data.deltaY) });
        };

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
                            {maps.characterList.map((character, index) => (
                                <Draggable
                                        defaultPosition={{x: 0, y: 0}}
                                        position={currentAvatarCoordinates}
                                        scale={1}
                                        handle="strong"
                                        onDrag={handleDrag}
                                        onStop={handleStop}>
                                    <div className="movable-avatar">
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
                                                <p className="button-primary avatar-move"><strong><IoIosMove /></strong></p>
                                                <p>{pcs.find(pc => pc._id === character._id).name}</p>
                                                <p>{currentAvatarCoordinates.x}, {currentAvatarCoordinates.y}</p>
                                                <p>{trackedAvatarCoordinates.x}, {trackedAvatarCoordinates.y}</p>
                                            </div>}
                                    </div>
                                </Draggable>
                            ))}
                        </div>

                        <Draggable onDrag={handleMapDrag}>
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