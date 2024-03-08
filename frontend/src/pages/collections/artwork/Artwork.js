import './artwork.css'
import { useState, useEffect } from 'react'

// Context
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

// Components
import Editor from '../../../components/editor/Editor'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

const Artwork = () => {
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()
    const { campaignID } = useCampaignsContext()

    const handleSubmit = async () => {
        console.log(url, description);
        const response = await fetch('https://dnd-kukm.onrender.com/api/artwork/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url, description, campaignID})
        })
        const json = await response.json()

        // This is what happens if the request is bad
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            setIsLoading(false)
        }


    }
    const handleChange = (event) => {
        setUrl(event.target.value);
    }



    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchImages = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/artwork/' + campaignID, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                setImages(json)
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchImages()
        }
    
    }, [user])

    return (
        <div className="artwork__container">
            <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            {images.map((image, index) => {
                return (
                    <SwiperSlide key={index}>
                        <img src={image.url} alt={image.name} />
                    </SwiperSlide>
                )
            }
            )}
                <SwiperSlide>
                    <div className="add-art">
                        <h2>Add Art</h2>
                        <input type="text" value={url} placeholder='URL' onChange={handleChange}></input>
                        <label>Description</label>
                        <Editor value={description} onChange={setDescription}/>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Artwork