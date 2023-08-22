import NewMap from '../../components/newMap/NewMap';
import './map.scss'
import { useState } from 'react'

const Map = () => {
    const [newScreen, setNewScreen] = useState(false);
    const handleClick = () => {
        setNewScreen(() => !newScreen)
    }
    return (
        <div className="mContainer">
            <h1>Maps</h1>
            <div className="mSingle">
                <h2>Title of this place</h2>
                <p>(Think Magic the Gathering) A few choice words to create a Description of this place</p>
                <p>Image</p>
            </div>
            <div className="mSingle">
                <h2>Title of this place</h2>
                <p>(Think Magic the Gathering) A few choice words to create a Description of this place</p>
                <p>Image</p>
            </div>
            <div className="mSingle">
                <h2>Title of this place</h2>
                <p>(Think Magic the Gathering) A few choice words to create a Description of this place</p>
                <p>Image</p>
            </div>
            <h2>Add a New Map</h2>
            <button onClick={handleClick}>Add</button>
            {newScreen && <NewMap />}
            
        </div>
    )
}

export default Map