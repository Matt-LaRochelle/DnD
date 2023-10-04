import './addNPC.css'
import { useState } from 'react'

const AddNPC = () => {
    const [showForm, setShowForm] = useState(false)

    const handleClick = () => {
        setShowForm(prevValue => !prevValue)
    }

    return (
        <form className='AddNPC__form'>
            <h2>Add NPC</h2>
            <p onClick={handleClick} className='add'>{ showForm ? "-" : "+" }</p>
            
            {showForm && 
                <div>
                    <label>Name</label>
                    <input type="text"></input>
                    <label>Description</label>
                    <input type="text"></input>
                    <label>Image</label>
                    <input type="text"></input>
                    <label>Secrets</label>
                    <input type="text"></input>
                    <label>Last Seen</label>
                    <input type="text"></input>
                </div>
            }
        </form>
    )
}

export default AddNPC