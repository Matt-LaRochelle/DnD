import { useState } from 'react';
import './toggle.css'

const Toggle = ({ onClick }) => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle((prevToggle) => !prevToggle);

        // If we want an onclick event - this does it
        if (onClick) {
            onClick();
        }
    };

    return (
        <div>
            <div onClick={handleToggle} className="toggle__background">
                <div style={{transform: toggle && "translateX(40px)"}}>

                </div>
            </div>
        </div>
    )
}

export default Toggle