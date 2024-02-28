import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link } from 'react-router-dom'
import RingLoader from "react-spinners/RingLoader";
import './landing.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <p>Forgot your password? <Link to="/forgot">Reset it here</Link></p>
            <button disabled={isLoading} className="button-primary">Log in</button>
            {error && <div className='error'>{error}</div>}
            {isLoading && 
                    <div className="loading">
                        <p>Fetching data from server...</p>
                        <p>This process tends to take 5-60 seconds</p>
                        <RingLoader color="#1aac83" />
                    </div>}
        </form>
    )
}

export default Login