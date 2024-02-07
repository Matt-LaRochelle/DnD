import './navbar.css'

import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import Logo from '../logo/Logo';

import { IoMdMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

import { FaRegUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { LiaMapSolid } from "react-icons/lia";
import { GiOpenTreasureChest } from "react-icons/gi";
import { FaBookAtlas } from "react-icons/fa6";
import { GiNewspaper } from "react-icons/gi";
import { GiSeaCreature } from "react-icons/gi";
import { BsJournal } from "react-icons/bs";
import { RiDoubleQuotesR } from "react-icons/ri";
import { MdGridOn } from "react-icons/md";
import { useState } from 'react';

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const navigate = useNavigate()


    const [nav, setNav] = useState(false)

    const handleClick = () => {
        logout()
    }

    const toggleNav = () => {
        setNav(!nav)
    }

    const navSettings = () => {
        navigate('/settings')
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
                        <div className={nav ? "nav-menu active" : "nav-menu"} >
                            <ul>
                                <li onClick={() => setNav(!nav)}><Link to="/settings"><FaRegUserCircle className='nav-icon' />{user.username}</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to="/"><FaHome className='nav-icon' />Home</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to ="/campaign"><TbWorld className="nav-icon" />Campaign</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to ="/settings"><IoIosSettings className="nav-icon" />Settings</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/characters'><FaPeopleGroup className="nav-icon" />Characters</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/maps'><LiaMapSolid className="nav-icon" />Maps</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/quests'><GiOpenTreasureChest className="nav-icon" />Quests</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/lore'><FaBookAtlas className="nav-icon" />Lore</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/news'><GiNewspaper className="nav-icon" />News</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/creatures'><GiSeaCreature className="nav-icon" />Creatures</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/journal'><BsJournal className="nav-icon" />Journal</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/quotes'><RiDoubleQuotesR className="nav-icon" />Quotes</Link></li>
                                <li onClick={() => setNav(!nav)}><Link to='/bingo'><MdGridOn className="nav-icon" />Bingo</Link></li>
                                <li onClick={() => setNav(!nav)}><button onClick={handleClick}>Log out</button></li>
                            </ul>
                        </div>
                    )}
                    {!user && (
                        <div className="logged-out-menu">
                            <Link to='/login'>Login</Link>
                            <Link to='/signup'>Signup</Link>
                        </div>
                    )}
                    {nav ? <IoIosClose className="menu-icon" onClick={toggleNav} /> : <IoMdMenu className="menu-icon" onClick={toggleNav} /> }
                </nav>
            </div>
        </header>
    )
}

export default Navbar