import './map.css'
import './controlPanel.css'
import { useState } from 'react'

// Context
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../../hooks/useCampaignsContext'
import { usePcsContext } from '../../../../hooks/usePcsContext'
import { useNpcsContext } from '../../../../hooks/useNpcsContext'
import { useMapsContext } from '../../../../hooks/useMapsContext'
import { useCreaturesContext } from '../../../../hooks/useCreaturesContext'

// Components
import Avatar from '../../../../components/avatar/Avatar'

const ControlPanel = ({ clientCharacterList, setClientCharacterList, mapCoordinates }) => {
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { maps, dispatch } = useMapsContext()
    const { pcs } = usePcsContext()
    const { npcs } = useNpcsContext()
    const { creatures } = useCreaturesContext()

    const [add, setAdd] = useState(false)
    const [selectedType, setSelectedType] = useState('pc');


    const handleAdd = () => {
        setAdd(!add)
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

    return (
        <div className="map__control-panel">
            <h2>Add</h2>
            <button className="add" onClick={handleAdd}>{add ? "-" : "+"}</button>
            {add &&
            <div>
                {campaigns.dmID === user.id &&
                <div>
                    <label>Type:</label>
                    <select onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="pc">Player Character</option>
                        <option value="npc">Non Player Character</option>
                        <option value="creature">Creature</option>
                    </select>
                </div>
                }
            
            {selectedType === "pc" &&
            <div>
                <h2>Characters</h2>
                {campaigns.dmID === user.id ?
                <ul className="map-pc-row">
                    {pcs.map(pc => (
                        <li key={pc._id}>
                            <Avatar image={pc.image} name={pc.name} hideName={true} />
                            <p className="add" onClick={() => addCharacter(pc._id, "pc")}>+</p>
                        </li>
                    ))}
                </ul>
                :
                <ul className="map-pc-row">
                    {pcs.filter(pc => pc.userID === user.id).map(pc => (
                        <li key={pc._id}>
                            <Avatar image={pc.image} name={pc.name} hideName={true} />
                            <p className="add" onClick={() => addCharacter(pc._id, "pc")}>+</p>
                        </li>
                    ))}
                </ul>
                }
            </div>
            }
            
            {selectedType === "npc" && 
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
            {selectedType === "creature" && 
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
            </div>
            }
        </div>
    )
}

export default ControlPanel;