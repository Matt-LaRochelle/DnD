import './addNPC.css'

const AddNPC = () => {

    return (
        <form className='AddNPC__form'>
            <h2>Add NPC</h2>
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

            <label>Hide Character</label>
            <input type="checkbox"></input>

            <button type="submit">Add NPC</button>
        </form>
    )
}

export default AddNPC