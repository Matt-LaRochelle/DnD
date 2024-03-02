import { useState } from 'react'
import './landing.css'

// Hooks
import { useSignup } from '../../hooks/useSignup'

// Components
import LoginLoading from '../../components/loading/LoginLoading';

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
            
            <button className="button-primary" disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
            {isLoading && 
                    <LoginLoading />}
        </form>
    )
}

export default Signup