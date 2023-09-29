import './logo.css'
import logo from '../images/logo.png'

const Logo = () => {
    return (
        <div className="logo__container">
            <img src={logo} alt="logo" className="logo__image" />
        </div>
    )
}

export default Logo