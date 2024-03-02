import './background.css'

import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

const Background = () => {
    const { user } = useAuthContext()
    const [background, setBackground] = useState(null)

    useEffect(() => {
        // Check if there is a key value pair for backgroundImage inside of the user object
        if (user && user.backgroundImage) {
            setBackground(user.backgroundImage)
        } else {
            setBackground(null)
        }

    }, [user])

    return (
        <div className='background' style={!background ? {} : {background: `center / cover no-repeat url(${background})`}}>

        </div>
    )
}

export default Background