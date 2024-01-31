import './navbar.css'

import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import Logo from '../logo/Logo';

import { IoIosSettings } from "react-icons/io";

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }
    
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <div className="navbar__title">
                        <div className="navbar__logo">
                            <Logo />
                        </div>
                        <h1>Role Playing Buddy</h1>
                    </div>
                </Link>
                <nav>
                    {user && (
                        <div className="nav-menu">
                            <span>{user.email}</span>
                            <IoIosSettings className="nav-icon" />
                            <button onClick={handleClick}>Log out</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to='/login'>Login</Link>
                            <Link to='/signup'>Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar