import { useState } from 'react'
import { Link } from 'react-router-dom'
import './landing.css'

// Hooks
import { useLogin } from '../../hooks/useLogin'

// Components
import LoginLoading from '../../components/loading/LoginLoading';

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
                    <LoginLoading />}
        </form>
    )
}

export default Login