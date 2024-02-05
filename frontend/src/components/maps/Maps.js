import './maps.css'

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useMapsContext } from '../../hooks/useMapsContext'



const Maps = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const [xAxis, setXAxis] = useState(0)
    const [startX, setStartX] = useState(null);

    const {campaigns, dispatch} = useCampaignsContext()
    const { maps, dispatch: mapsDispatch } = useMapsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMaps = async () => {
            setLoading(true);
            const response = await fetch(`/api/map/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log("Step 1: json data from server:", json);

            if (response.ok) {
                mapsDispatch({type: 'SET_MAPS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchMaps()
        }
    }, [path, user, dispatch])


    const deleteMap = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/map/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log("Step 1: json data from server:", json);

        if (response.ok) {
            mapsDispatch({type: 'DELETE_MAP', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/map/${id}`);
    }

    const handleClick = () => {
        navigate(`/map/add`);
    }

    const swiperClick = (index) => {
        setXAxis(() => index * 280)
        console.log("Swiper Clicked", xAxis);
    }


    // // For swiper component
    // function handleMouseDown(event) {
    //     setStartX(event.clientX);
    //   }
    
    //   function handleMouseUp(event) {
    //     const currentX = event.clientX;
    //     const distance = currentX - startX;
    
    //     if (Math.abs(distance) >= 150) {
    //       // Trigger your function here
    //       console.log('Function triggered!');
    //     }
    
    //     setStartX(null);
    //   }

    //   useEffect(() => {
    //     console.log("x-axis:", xAxis)
    //     if (xAxis < 0) {
    //       setXAxis(0)
    //     }
    //     // If the xAxis variable is halfway to the next component, set it to the next components position.
    //     if (xAxis > 140) {
    //       setXAxis(280)
    //     }
    //   }, [xAxis]);
    
    //   useEffect(() => {
    //     const handleMouseMove = (event) => {
    //       if (startX !== null) {
    //         const currentX = event.clientX;
    //         const distance = startX - currentX;
            
    //         setXAxis(xAxis + distance);
    //       }
    //     }
    
    //     window.addEventListener('mousemove', handleMouseMove);
    //     return () => {
    //       window.removeEventListener('mousemove', handleMouseMove);
    //     };
    //   }, [startX]);



    return (
        <div 
            className="npcs__container"
            // onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            >
            <div className="npcs__swiper" style={{transform: `translateX(-${xAxis}px)`}}>
            {!loading && maps.map((map) => (
                <div className={map.hidden ? "npc npc-hidden" : "npc"} key={map._id} style={{ display: map.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{map.name}</h3>
                    <img src={map.image} alt={map.name} />
                    <button className='button-primary' onClick={() => moreInfo(map._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteMap(map._id)}>Delete</button>}
                </div>
                ))}
            {/* {!loading && npcs.map((npc) => (
                <div className={npc.hidden ? "npc npc-hidden" : "npc"} key={npc._id}>
                    <h3>{npc.name}</h3>
                    <img src={npc.image} alt={npc.name} />
                    <button className='button-primary' onClick={() => moreInfo(npc._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteNPC(npc._id)}>Delete</button>}
                </div>
            ))} */}
            {campaigns.dmID === user.id && 
                <div className="npc" >
                    <h3>Add Map</h3>
                    <img src="https://garden.spoonflower.com/c/14409649/p/f/m/7ymlkg-hbhMsJgmHbo_kFYPOIs3PddAIZ-Jsp793-WT9emAe4cmy/Grid%20wallpaper%20-%20cloud%20grey%20grid%20jumbo%20scale%20.jpg" alt="Add Map" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
            <div className="npcs__buttons">
            {!loading && maps.filter((map) => {
                if (user.id === campaigns.dmID) {
                    return true; // Include all maps
                } else {
                    return !map.hidden; // Exclude maps with hidden=true
                }
            }).map((map, index) => (
                <div 
                    className="npcs__button" 
                    onClick={() => swiperClick(index)}
                />
            ))} 
            </div>
        </div>
    )
}

export default Maps