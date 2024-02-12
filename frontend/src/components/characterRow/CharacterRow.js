import './characterRow.css'

import Avatar from '../avatar/Avatar'

const CharacterRow = ({dmInfo, playerInfo}) => {
    return (
        <div className="characterRow__container">
            <h2>DM</h2>
            <h2>Players</h2>
            <div className="characterRow__dm">
                <Avatar 
                    image={dmInfo.image} 
                    name={dmInfo.username}
                    hideName={false} />
            </div>
            <div className="characterRow__players">
                {playerInfo.map((player) => (
                    <Avatar
                        image={player.image}
                        name={player.username}
                        hideName={false} />
                ))}
            </div>
        </div>
    )
}

export default CharacterRow