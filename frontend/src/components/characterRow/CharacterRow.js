import './characterRow.css'

const CharacterRow = ({dmInfo, playerInfo}) => {
    return (
        <div className="characterRow__container">
            <h2>DM</h2>
            <div className="characterRow__dm">
                <div className="avatar-name">
                    <img src={dmInfo.image} alt={dmInfo.username} />
                    <p>{dmInfo.username}</p>
                </div>
            </div>
            <h2>Players</h2>
            <div className="characterRow__players">
                {playerInfo.map((player) => (
                    <div className="avatar-name">
                        <img src={player.image} alt={player.username} />
                        <p>{player.username}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CharacterRow