import './bento.css'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

// Context
import { useCampaignsContext } from '../../hooks/useCampaignsContext'

// Components
import CharacterRow from '../../components/characterRow/CharacterRow';

// Utils
import { cleanHTML } from '../../utils/CleanHtml'

// Icons
import { FaPeopleGroup } from "react-icons/fa6";
import { LiaMapSolid } from "react-icons/lia";
import { GiOpenTreasureChest } from "react-icons/gi";
import { FaRobot } from "react-icons/fa6";
import { IoIosImages } from "react-icons/io";
import { GiSeaCreature } from "react-icons/gi";


const Bento = ({ dmInfo, playerInfo }) => {
    const { campaigns } = useCampaignsContext() 
    const [campaignDescription, setCampaignDescription] = useState("")
    const navigate = useNavigate()

    // For handling inner HTML
    useEffect(() => {
            cleanHTML(campaigns.description, setCampaignDescription);
    }, []);


    return (
        <div className="bento-wrapper" style={{background: `url(${campaigns.image}) center / cover no-repeat`}}>
            <div className="bento-item1" onClick={() => navigate('/campaign')}>
                <h2>{campaigns.title}</h2>
                <p dangerouslySetInnerHTML={{__html: campaignDescription}}></p>
            </div>
            <div className="bento-item2">
                <h2>Campaign Artwork</h2>
                <IoIosImages className="bento-icon" />
            </div>
            <div className="bento-item3" onClick={() => navigate('/maps')}>
                <h2>Maps</h2>
                <LiaMapSolid className="bento-icon" />
            </div>
            <div className="bento-item4" onClick={() => navigate('/quests')}>
            <h2>Quests</h2>
                <GiOpenTreasureChest className="bento-icon" />
            </div>
            <div className="bento-item5" onClick={() => navigate('/creatures')}>
                <h2>Creatures</h2>
                <GiSeaCreature className="bento-icon" />
            </div>
            <div className="bento-item6" onClick={() => navigate('/player-characters')}>
                <h2>Player Characters</h2>
                <FaPeopleGroup className="bento-icon" />
            </div>
            <div className="bento-item7" onClick={() => navigate('/non-player-characters')}>
                <h2>Non Player Characters</h2>
                <FaRobot className="bento-icon" />
            </div>
        </div>
    )
}

export default Bento