import { useState } from 'react'
import './newMap.scss'

const NewMap = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("title:", title, "description:", description)
    }
    return (
        <div className='cNewMap'>
            <form onSubmit={handleSubmit}>
                <label>Map Title</label>
                <input type="text" onChange={(e) => setTitle(e.target.value)}></input>
                <label>Map Description</label>
                <input type="text" onChange={(e) => setDescription(e.target.value)}></input>
                {/* <label>Map Image</label>
                <input type="text"></input> */}
                <button>Submit</button>
            </form>
        </div>
    )
}

export default NewMap