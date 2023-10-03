import { useState } from 'react';
import './toggle.css'

const Toggle = () => {
    const [hidden, setHidden] = useState(false);

    const handleHidden = () => {
        setHidden(hidden => !hidden);
    }

    return (
        <div>
            <div className="toggle__background">
                <div onClick={handleHidden} style={{transform: hidden && "translateX(40px)"}}>

                </div>
            </div>
        </div>
    )
}

export default Toggle