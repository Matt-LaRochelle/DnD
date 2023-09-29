import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import RingLoader from "react-spinners/RingLoader";
import './landing.css'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, username, password)
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Username:</label>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            
            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
            {isLoading && 
                    <div className="loading">
                        <p>Fetching data from server...</p>
                        <p>This process tends to take 5-60 seconds</p>
                        <RingLoader color="#1aac83" />
                    </div>}
        </form>
    )
}

export default Signup