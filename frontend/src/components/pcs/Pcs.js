import '../npc/npcs.css'

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { usePcsContext } from '../../hooks/usePcsContext'



const Pcs = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const [xAxis, setXAxis] = useState(0)
    const [startX, setStartX] = useState(null);

    const {campaigns, dispatch} = useCampaignsContext()
    const { pcs, dispatch: pcsDispatch } = usePcsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPcs = async () => {
            setLoading(true);
            const response = await fetch(`/api/pc/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            console.log("Step 1: json data from server:", json);

            if (response.ok) {
                pcsDispatch({type: 'SET_PCS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchPcs()
        }
    }, [path, user, dispatch])


    const deletePC = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/pc/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        console.log("Step 1: json data from server:", json);

        if (response.ok) {
            pcsDispatch({type: 'DELETE_PC', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/pc/${id}`);
    }

    const handleClick = () => {
        navigate(`/pc/add`);
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
            {!loading && pcs.map((pc) => (
                <div className={pc.hidden ? "npc npc-hidden" : "npc"} key={pc._id} style={{ display: pc.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{pc.name}</h3>
                    <img src={pc.image} alt={pc.name} />
                    <button className='button-primary' onClick={() => moreInfo(pc._id)}>More Info</button>
                    {campaigns.dmID === user.id || pc.userID === user.id && <button className="button-secondary" onClick={() => deletePC(pc._id)}>Delete</button>}
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
            
            <div className="npc" >
                <h3>Add PC</h3>
                <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add NPC" />
                <p onClick={handleClick} className='add'>+</p>
            </div>
            </div>
            <div className="npcs__buttons">
                {!loading && pcs.map((pc, index) => (
                    <div className="npcs__button" onClick={() => swiperClick(index)} />
                ))}
                
                
            </div>
        </div>
    )
}

export default Pcs