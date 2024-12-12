import './dice.css'
import { useState } from 'react'

const Dice = () => {
    const [dice, setDice] = useState(1)
    const [isRotating, setIsRotating] = useState(false);

    //zom
        const [zoom, setZoom] = useState(1);
    
        const handleZoomIn = () => {
            setZoom(prevZoom => Math.min(prevZoom + 0.1, 1.5)); // Limit max zoom level to 3
            console.log(zoom);
        };
    
        const handleZoomOut = () => {
            setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.1)); // Limit min zoom level to 0.5
            console.log(zoom);
        };
    //zoom

    const handleClick = (number) => {
        setIsRotating(true);
        setTimeout(() => {
            setDice(Math.floor(Math.random() * number) + 1);
            setIsRotating(false);
        }, 700);
    }
    return (
        <div className="dice__page">
            <div className="dice__container">
                <h1>Dice</h1>
                <div className={`dice-result ${isRotating ? 'dice-rotate' : ''}`}>
                    {dice}
                </div>
                <p onClick={() => handleClick(4)}>D4</p>
                <p onClick={() => handleClick(6)}>D6</p>
                <p onClick={() => handleClick(8)}>D8</p>
                <p onClick={() => handleClick(10)}>D10</p>
                <p onClick={() => handleClick(12)}>D12</p>
                <p onClick={() => handleClick(20)}>D20</p>
                <p onClick={() => handleClick(100)}>D100</p>
            </div>
            <div className="map-controls">
                        <button onClick={handleZoomIn}>Zoom In</button>
                        <button onClick={handleZoomOut}>Zoom Out</button>
                    </div>
            <div className='experiment' style={{    
                    backgroundImage: `url(https://m.media-amazon.com/images/I/71bsGqRMljL._AC_UF894,1000_QL80_.jpg)`,
                    backgroundRepeat: 'no-repeat',
                    // This section is new
                    transform: `scale(${zoom})`, // Apply zoom level
                    transformOrigin: 'center center' // Ensure zoom is centered
                    // end new section
                    }}>
            </div>
        </div>
    )
}

export default Dice