import { useAuthContext } from './useAuthContext'
import { useCampaignsContext } from './useCampaignsContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: campaignsDispatch } = useCampaignsContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        
        // This clears the global campaigns state so that when another
        // person logs in they do not see the campaigns for a brief second.
        campaignsDispatch({type: 'SET_CAMPAIGNS', payload: null})
    }

    return {logout}
}