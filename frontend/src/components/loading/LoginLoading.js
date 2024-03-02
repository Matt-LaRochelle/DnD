import './loginLoading.css'

// 3rd Party
import RingLoader from "react-spinners/RingLoader";

const LoginLoading = () => {
    return (
        <div className="login-loading">
            <p>Fetching data from server...</p>
            <p>This process tends to take 5-60 seconds</p>
            <RingLoader color="#dc0c0c" />
        </div>
    )
}

export default LoginLoading