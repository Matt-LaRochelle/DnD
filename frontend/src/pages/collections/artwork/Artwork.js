import './artwork.css'
import { useState, useEffect } from 'react'

// Context
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'

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
    const { campaigns } = useCampaignsContext()

    const handleSubmit = async () => {
        console.log(url, description);
        const response = await fetch('https://dnd-kukm.onrender.com/api/artwork/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({url, description, campaignID: campaigns._id})
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
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }



    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchImages = async () => {
            const response = await fetch('https://dnd-kukm.onrender.com/api/artwork/' + campaigns._id, {
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

    // useEffect(() => {
    //     for(let i = 0; i < images.length; i++) {
    //         if (images[i].description) {
    //             let singleDescription = cleanHTML(images[i].description)
    //             setDescriptionsArray([...descriptionsArray, singleDescription])
    //         }
    //         let singleDescription = ""
    //         setDescriptionsArray([...descriptionsArray, singleDescription])
    //     }
    // })

    return (
        <div className="artwork__container">
            <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            {images.map((image, index) => {
                return (
                    <SwiperSlide key={index} className="image-slide">
                        <img className="slider-image" src={image.url} alt={image.name} />
                        <p>{image.description}</p>
                    </SwiperSlide>
                )
            }
            )}
                <SwiperSlide>
                    <div className="add-art">
                        <h2>Add Art</h2>
                        <input type="text" value={url} placeholder='URL' onChange={handleChange}></input>
                        <input type="text" value={description} placeholder='Description' onChange={handleDescriptionChange}></input>
                        <button className="button-primary" onClick={handleSubmit}>Submit</button>
                        {isLoading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Artwork