import './map.css'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Draggable from 'react-draggable';

import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCampaignsContext } from '../../../hooks/useCampaignsContext'
import { usePcsContext } from '../../../hooks/usePcsContext'
import { useNpcsContext } from '../../../hooks/useNpcsContext'
import { useMapsContext } from '../../../hooks/useMapsContext'
import { useCreaturesContext } from '../../../hooks/useCreaturesContext'

import Avatar from '../../../components/avatar/Avatar'

import Loading from '../../../components/loading/Loading'

const Map = () => {
    const [loading, setLoading] = useState(true)
    const [map, setMap] = useState(null)

    const { user } = useAuthContext()
    const { campaigns } = useCampaignsContext()
    const { pcs } = usePcsContext()
    const location = useLocation()
    const path = location.pathname.split("/")[2]
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch an Map's information
        const fetchMapInfo = async () => {
            setLoading(true);
            const response = await fetch(`/api/map/${campaigns._id}/${path}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const mapInfo = await response.json()

            if (response.ok) {
                setMap(mapInfo)
                setLoading(false)
            }
        }

        if (user) {
            fetchMapInfo()
        }
    }, [user])

    const goBack = () => {
        navigate(`/campaign/${campaigns._id}`)
    }


    return (
        <div>
            {loading
                ?
                <Loading />
                :
                <div className='map__container glass'>
                    <h1>{map.name}</h1>
                    <button className="button-primary back" onClick={goBack}>Back</button>
                    <div className="map__box">
                        <Draggable>
                            <div className='map__image' style={{    
                                backgroundImage: `url(${map.image})`,
                                backgroundRepeat: 'no-repeat'
                            }}>
                            </div>
                        </Draggable>
                    </div>
                    <div>
                        <h2>Characters</h2>
                        <ul className="map-pc-row">
                            {pcs.map(pc => (
                                <li key={pc._id}>
                                    <Avatar image={pc.image} name={pc.name} hideName={true} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p><strong>Description</strong></p>
                        <p>{map.description}</p>
                        {campaigns.dmID === user.id && 
                            <div>
                                <p><strong>Secrets</strong></p>
                                <p>{map.secrets}</p>
                            </div>
                        }
                        {campaigns.dmID === user.id && 
                            <button className="button-primary" onClick={() => navigate(`/map/edit/${map._id}`)}>Edit</button>
                        }
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default Map