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
    const [eBImage, setEBImage] = useState(false)
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        image: '',
        backgroundImage: ''
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
    const editBgImage = () => {
        setEBImage(!eBImage)
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
        if (formState.backgroundImage) {
            updatedData.backgroundImage = formState.backgroundImage;
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
            setEBImage(false)
        }


    }

    return (
        <div className="settings__container glass">
            <h1>Your Account</h1>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Username: </strong>{user.username}</p><button className="button-primary" onClick={editUsername}>Edit</button>
            {eUsername && 
                <div>
                    <input type="text" id="username" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <p><strong>Password</strong></p><button className="button-primary" onClick={editPassword}>Edit</button>
            {ePassword && 
                <div>
                    <input type="text" id="password" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <p><strong>Image:</strong></p><button className="button-primary" onClick={editImage}>Edit</button>
            {eImage && 
                <div>
                    <input type="text" id="image" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <img src={user.image} alt="user image" />
            <p><strong>Background Image:</strong></p><button className="button-primary" onClick={editBgImage}>Edit</button>
            {eBImage && 
                <div>
                    <input type="text" id="backgroundImage" onChange={handleChange} />
                    <button onClick={submit}>Save</button>
                </div>
            }
            <img src={user.backgroundImage ? user.backgroundImage : "https://i.pinimg.com/originals/0a/fe/39/0afe399b3f0a454632c7fea074a3f0cb.jpg"} alt="user image" />
        </div>
    )
}

export default Settings