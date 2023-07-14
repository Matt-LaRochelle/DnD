import { useAuthContext } from './useAuthContext'
import { useWorkoutsContext } from './useWorkoutsContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: workoutsDispatch } = useWorkoutsContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        
        // This clears the global workouts state so that when another
        // person logs in they do not see the workouts for a brief second.
        workoutsDispatch({type: 'SET_WORKOUTS', payload: null})
    }

    return {logout}
}