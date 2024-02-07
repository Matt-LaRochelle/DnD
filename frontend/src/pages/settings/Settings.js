import './settings.css'

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

import { FaEdit } from "react-icons/fa";


const Settings = () => {
    const { user, dispatch } = useAuthContext()
    const navigate = useNavigate()

    const [eUsername, setEUsername] = useState(false)
    const [ePassword, setEPassword] = useState(false)
    const [eImage, setEImage] = useState(false)
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        image: ''
    })

    const editUsername = () => {
        setEUsername(!eUsername)
    }

    const editPassword = () => {
        setEPassword(!ePassword)
    }

    const editImage = () => {
        setEImage(!eImage)
    }

    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.id]: event.target.value
        });
    }



    const submit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in.")
            return
        }

        // Only add things that were updated
        const updatedData = {};

        if (formState.username) {
            updatedData.username = formState.username;
        }
        if (formState.password) {
            updatedData.password = formState.password;
        }
        if (formState.image) {
            updatedData.image = formState.image;
        }

        const response = await fetch('/api/user/' + user.id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedData)
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'UPDATE', payload: json})
            setEUsername(false)
            setEPassword(false)
            setEImage(false)
        }


    }

    return (
        <div className="settings__container">
            <h1>Settings</h1>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Username: </strong>{user.username}</p><FaEdit onClick={editUsername}/>
            {eUsername && 
                <div>
                    <input type="text" id="username" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <p><strong>Password</strong></p><FaEdit onClick={editPassword} />
            {ePassword && 
                <div>
                    <input type="text" id="password" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <p><strong>Image:</strong></p><FaEdit onClick={editImage} />
            {eImage && 
                <div>
                    <input type="text" id="image" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <img src={user.image} alt="user image" />
        </div>
    )
}

export default Settings