import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RingLoader from "react-spinners/RingLoader";
import './landing.css'

function ResetPassword() {
  const { token } = useParams();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [completeReset, setCompleteReset] = useState(false)
  

  useEffect(() => {
    const checkToken = async () => {
      // Check token with backend
      if (token) {
        const response = await fetch('https://dnd-kukm.onrender.com/api/user/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token: token})
      })
  const json = await response.json()
        if (!response.ok) {
            setError(json.error)
            setAuthenticated(false);
        }
        if (response.ok) {
            const text = JSON.stringify(json)
            console.log("got things back: " + text)
            setAuthenticated(true);
        }
      }
    }
  checkToken()
  },[token])
    

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true)

    if (password === confirmPassword) {
      const response = await fetch('https://dnd-kukm.onrender.com/api/user/reset', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token, password })
      })
  const json = await response.json()
        if (!response.ok) {
            setError(json.error)
            setIsLoading(false)
        }
        if (response.ok) {
            const text = JSON.stringify(json)
            setError(null)
            setIsLoading(false)
            setCompleteReset(true)
        }
    } else {
      setError("passwords must match")
      setIsLoading(false)
    }

  };

  return (
    <div>
      {!authenticated ? <h1>Bad link, please try again</h1> :
      <div>
        <h1>Reset Your Password</h1>
        {!completeReset ? 
        <form className="login" onSubmit={handleSubmit}>
          <input type="hidden" value={token} name="token" />
          <label htmlFor="password">New Password</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button className="form-button" disabled={isLoading} type="submit">Reset Password</button>
          {error && <div className="error">{error}</div>}
            {isLoading && 
                <div className="loading">
                    <p>Fetching data from server...</p>
                    <p>This process tends to take 5-60 seconds</p>
                    <RingLoader color="#36d7b7" />
                </div>}
        </form> : <div className="good-response">Password has been reset!</div> }
      </div> }
    </div>
  );
}

export default ResetPassword