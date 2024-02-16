import './characters.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { usePcsContext } from '../../../hooks/usePcsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useAuthContext } from '../../../hooks/useAuthContext'

const Characters = () => {
    const { user } = useAuthContext()
    const {campaigns, dispatch} = useCampaignsContext()
    const { pcs, dispatch: pcsDispatch } = usePcsContext()
    const { npcs, dispatch: npcsDispatch } = useNpcsContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPcs = async () => {
            setLoading(true);
            const response = await fetch(`/api/pc/${campaigns._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                pcsDispatch({type: 'SET_PCS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchPcs()
        }
    }, [campaigns, user, dispatch])


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

        if (response.ok) {
            pcsDispatch({type: 'DELETE_PC', payload: json})
            setLoading(false)
            
        }
    }



    const morePcInfo = (id) => {
        navigate(`/pc/${id}`);
    }

    const handlePcClick = () => {
        navigate(`/pc/add`);
    }



    useEffect(() => {
        const fetchNpcs = async () => {
            setLoading(true);
            const response = await fetch(`/api/npc/${campaigns._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                npcsDispatch({type: 'SET_NPCS', payload: json})
                setLoading(false)
            }
        }

        if (user) {
            fetchNpcs()
        }
    }, [campaigns, user, dispatch])


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

        if (response.ok) {
            npcsDispatch({type: 'DELETE_NPC', payload: json})
            setLoading(false)
            
        }
    }

    const moreNpcInfo = (id) => {
        navigate(`/npc/${id}`);
    }

    const handleNpcClick = () => {
        navigate(`/npc/add`);
    }


    return (
        <div className="characters__container glass">
            <h1>Characters</h1>
            <h2>Player Characters</h2>
            <div className="characters__flexy">
                {!loading && pcs.filter((pc) => {
                    if (user.id === campaigns.dmID || pc.userID === user.id) {
                        return true; // Include all PCs
                    } else {
                        return !pc.hidden; // Exclude PCs with hidden=true
                    }
                }).map((pc) => (
                    <div className={pc.hidden ? "npc npc-hidden" : "npc"} key={pc._id}>
                        <h3>{pc.name}</h3>
                        <img src={pc.image} alt={pc.name} />
                        <button className='button-primary' onClick={() => morePcInfo(pc._id)}>More Info</button>
                        {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deletePC(pc._id)}>Delete</button> || pc.userID === user.id && <button className="button-secondary" onClick={() => deletePC(pc._id)}>Delete</button>}
                    </div>
                    ))}
                <div className="npc" >
                    <h3>Add PC</h3>
                    <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add PC" />
                    <p onClick={handlePcClick} className='add'>+</p>
                </div>
            </div>
            <h2>Non Player Characters</h2>
            <div className="characters__flexy">
            {!loading && npcs.map((npc) => (
                <div className={npc.hidden ? "npc npc-hidden" : "npc"} key={npc._id} style={{ display: npc.hidden && user.id !== campaigns.dmID && "none"}}>
                <h3>{npc.name}</h3>
                    <img src={npc.image} alt={npc.name} />
                    <button className='button-primary' onClick={() => moreNpcInfo(npc._id)}>More Info</button>
                    {campaigns.dmID === user.id && <button className="button-secondary" onClick={() => deleteNPC(npc._id)}>Delete</button>}
                </div>
                ))}
            {campaigns.dmID === user.id && 
            <div className="npc" >
                <h3>Add NPC</h3>
                <img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" alt="Add NPC" />
                <p onClick={handleNpcClick} className='add'>+</p>
            </div>}
            </div>
        </div>
    )
}

export default Characters