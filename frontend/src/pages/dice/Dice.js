import './dice.css'
import D6 from '../../components/dice/D6'
import D4 from '../../components/dice/D4'

const Dice = () => {
    return (
        <div className="dice__page">
            <div className="dice__container">
                <h1>Dice</h1>
                <p>D4</p>
                <p>D6</p>
                <p>D8</p>
                <p>D10</p>
                <p>D12</p>
                <p>D20</p>
                <p>D100</p>
            </div>
            <D4 />
            <D6 />
        </div>
    )
}

export default Dice