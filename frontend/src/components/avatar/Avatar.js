import './avatar.css'

const Avatar = (props) => {

    return (
        <div className="avatar__container">
            <img src={props.image} alt={props.name} />
            {!props.hideName && <p>{props.name}</p>}
        </div>
    )
}

export default Avatar