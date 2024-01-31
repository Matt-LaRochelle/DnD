import './npcs.css'

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useCampaignsContext } from '../../hooks/useCampaignsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNpcsContext } from '../../hooks/useNpcsContext'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


const Npcs = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(true)

    const [variable, setVariable] = useState(3);

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


    useEffect(() => {
        // Function to update the variable based on window size
        function updateVariable() {
          const windowWidth = window.innerWidth;
          console.log("Running")
          if (windowWidth >= 1200) {
            setVariable(3);
          } else if (windowWidth >= 800) {
            setVariable(1);
          } else {
            setVariable(5);
          }
        }
    
        // Add event listener for window resize
        window.addEventListener('resize', updateVariable);
    
        // Call the function initially to set the variable based on the initial window size
        updateVariable();
    
        // Clean up the event listener when the component is unmounted
        return () => {
          window.removeEventListener('resize', updateVariable);
        };
      }, []);

    return (
        <div className="npcs__container">
            <div className="npcs__swiper">
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
                <div className="npcs__button"></div>
                <div className="npcs__button"/>
                <div className="npcs__button"/>
                <div className="npcs__button"/>
                <div className="npcs__button"/>
                <div className="npcs__button"/>
                <div className="npcs__button"/>
                
            </div>
        </div>
    )
}

export default Npcs