import '../maps/maps.css'

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCreaturesContext } from '../../hooks/useCreaturesContext'



const Creatures = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const [xAxis, setXAxis] = useState(0)
    const [startX, setStartX] = useState(null);

    const {campaigns, dispatch} = useCampaignsContext()
    const { creatures, dispatch: creaturesDispatch } = useCreaturesContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCreatures = async () => {
            setLoading(true);
            const response = await fetch(`/api/creature/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                creaturesDispatch({type: 'SET_CREATURES', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchCreatures()
        }
    }, [path, user, dispatch])


    const deleteCreature = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/creature/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            creaturesDispatch({type: 'DELETE_CREATURE', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/creature/${id}`);
    }

    const handleClick = () => {
        navigate(`/creature/add`);
    }

    const swiperClick = (index) => {
        setXAxis(() => index * 280)
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
            {!loading && creatures.map((creature) => (
                <div className={creature.hidden ? "npc npc-hidden" : "npc"} key={creature._id} style={{ display: creature.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{creature.name}</h3>
                    <img src={creature.image} alt={creature.name} />
                    <button className='button-primary' onClick={() => moreInfo(creature._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteCreature(creature._id)}>Delete</button>}
                </div>
                ))}

            {campaigns.dmID === user.id && 
                <div className="npc" >
                    <h3>Add Creature</h3>
                    <img src="https://www.animal-symbols.com/pictures/animal-symbol_3.png" alt="Add Map" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
            <div className="npcs__buttons">
            {!loading && creatures.filter((creature) => {
                if (user.id === campaigns.dmID) {
                    return true; // Include all creatures
                } else {
                    return !creature.hidden; // Exclude creatures with hidden=true
                }
            }).map((creature, index) => (
                <div 
                    className="npcs__button" 
                    onClick={() => swiperClick(index)}
                />
            ))} 
            </div>
        </div>
    )
}

export default Creatures