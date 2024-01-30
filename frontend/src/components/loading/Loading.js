import './loading.css';
import RingLoader from "react-spinners/RingLoader";

const Loading = () => {
    return (
        <div className='loading__container'>
            <h1>Loading...</h1>
            <RingLoader className="loading-icon" color="#dc0c0c" />
        </div>
    )
}

export default Loading