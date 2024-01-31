import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

const Settings = () => {
    const { user } = useAuthContext()

    return (
        <div>
            <h1>Settings</h1>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Username: </strong>{user.username}</p>
            <p><strong>Password</strong></p>
            <p><strong>Image:</strong></p>
            <img src={user.image} alt="user image" />
        </div>
    )
}

export default Settings