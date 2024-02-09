import '../npcs/npcs.css'

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useQuestsContext } from '../../hooks/useQuestsContext'



const Quests = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const [xAxis, setXAxis] = useState(0)
    const [startX, setStartX] = useState(null);

    const {campaigns, dispatch} = useCampaignsContext()
    const { quests, dispatch: questsDispatch } = useQuestsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchQuests = async () => {
            setLoading(true);
            const response = await fetch(`/api/quest/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                questsDispatch({type: 'SET_QUESTS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchQuests()
        }
    }, [path, user, dispatch])


    const deleteQuest = async (id) => {
        if (!user) {
            return
        }
        setLoading(true);
        const response = await fetch(`/api/quest/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            questsDispatch({type: 'DELETE_QUEST', payload: json})
            setLoading(false)
            
        }
    }

    const moreInfo = (id) => {
        navigate(`/quest/${id}`);
    }

    const handleClick = () => {
        navigate(`/quest/add`);
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
            {!loading && quests.map((quest) => (
                <div className={quest.hidden ? "npc npc-hidden" : "npc"} key={quest._id} style={{ display: quest.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{quest.title}</h3>
                    <img src={quest.image} alt={quest.name} />
                    <button className='button-primary' onClick={() => moreInfo(quest._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteQuest(quest._id)}>Delete</button>}
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
                    <h3>Add Quest</h3>
                    <img src="https://static.vecteezy.com/system/resources/previews/002/766/904/non_2x/quest-linear-icons-set-search-for-missing-piece-keys-for-unlocking-map-for-treasure-part-of-quest-customizable-thin-line-contour-symbols-isolated-outline-illustrations-editable-stroke-vector.jpg" alt="Add Quest" />
                    <p onClick={handleClick} className='add'>+</p>
                </div>}
            </div>
            <div className="npcs__buttons">
            {!loading && quests.filter((quest) => {
                if (user.id === campaigns.dmID) {
                    return true; // Include all quests
                } else {
                    return !quest.hidden; // Exclude quests with hidden=true
                }
            }).map((quest, index) => (
                <div 
                    className="npcs__button" 
                    onClick={() => swiperClick(index)}
                />
            ))} 
            </div>
        </div>
    )
}

export default Quests