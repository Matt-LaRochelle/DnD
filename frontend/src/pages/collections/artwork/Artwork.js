import './artwork.css'
import { useState, useEffect } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

const Artwork = () => {
    const [artwork, setArtwork] = useState("");

    const handleSubmit = () => {
        console.log(artwork);
    }
    const handleChange = (event) => {
        setArtwork(event.target.value);
    }

    return (
        <div className="artwork__container">
            <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                <SwiperSlide>
                    <div className="add-art">
                        <h2>Add Art</h2>
                        <input type="text" value={artwork} placeholder='URL' onChange={handleChange}></input>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Artwork