import { useCampaignsContext } from '../hooks/useCampaignsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from 'react-router-dom'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const CampaignDetails = ({ campaign }) => {
    const { dispatch } = useCampaignsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }
        const response = await fetch('/api/campaigns/' + campaign._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_CAMPAIGN', payload: json})
        }
    }
    
    return (
        <div className="campaign-details">
            <h4>{campaign.title}</h4>
            <p>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            <Link to="/campaign">Enter</Link>
        </div>
    )
}

export default CampaignDetails