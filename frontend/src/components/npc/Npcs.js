import './npcs.css'

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNpcsContext } from '../../hooks/useNpcsContext'



const Npcs = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const [xAxis, setXAxis] = useState(0)
    const [startX, setStartX] = useState(null);

    const {campaigns, dispatch} = useCampaignsContext()
    const { npcs, dispatch: npcsDispatch } = useNpcsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNpcs = async () => {
            setLoading(true);
            const response = await fetch(`/api/npc/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log("Step 1: json data from server:", json);

            if (response.ok) {
                npcsDispatch({type: 'SET_NPCS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchNpcs()
        }
    }, [path, user, dispatch])


    const deleteNPC = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/npc/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log("Step 1: json data from server:", json);

        if (response.ok) {
            npcsDispatch({type: 'DELETE_NPC', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/npc/${id}`);
    }

    const handleClick = () => {
        navigate(`/npc/add`);
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
            {!loading && npcs.map((npc) => (
                <div className={npc.hidden ? "npc npc-hidden" : "npc"} key={npc._id} style={{ display: npc.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{npc.name}</h3>
                    <img src={npc.image} alt={npc.name} />
                    <button className='button-primary' onClick={() => moreInfo(npc._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteNPC(npc._id)}>Delete</button>}
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
                    <h3>Add NPC</h3>
                    <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add NPC" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
            <div className="npcs__buttons">
            {!loading && npcs.filter((npc) => {
                if (user.id === campaigns.dmID) {
                    return true; // Include all NPCs
                } else {
                    return !npc.hidden; // Exclude NPCs with hidden=true
                }
            }).map((npc, index) => (
                <div 
                    className="npcs__button" 
                    onClick={() => swiperClick(index)}
                />
            ))} 
            </div>
        </div>
    )
}

export default Npcs