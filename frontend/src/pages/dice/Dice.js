import './dice.css'
import { useState } from 'react'

const Dice = () => {
    const [dice, setDice] = useState(1)
    const [isRotating, setIsRotating] = useState(false);

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
        </div>
    )
}

export default Dice