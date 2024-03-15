import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

import { usePcsContext } from './usePcsContext'
import { useNpcsContext } from './useNpcsContext'
import { useMapsContext } from './useMapsContext'
import { useCreaturesContext } from './useCreaturesContext'
import { useQuestsContext } from './useQuestsContext'

export const useFetch = (path, type) => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()
    const { dispatch: pcsDispatch } = usePcsContext()
    const { dispatch: npcsDispatch } = useNpcsContext()
    const { dispatch: mapsDispatch } = useMapsContext()
    const { dispatch: creaturesDispatch } = useCreaturesContext()
    const { dispatch: questsDispatch } = useQuestsContext()

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const fetchCollection = async () => {

            // creature / campaignID
            // map / campaignID
            // npc / campaignID
            // quest / campaignID
            // pc / campaignID

            const response = await fetch('https://dnd-kukm.onrender.com/api/' + path, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                switch (type) {
                    case 'pc':
                        pcsDispatch({type: 'SET_PCS', payload: json})
                        break
                    case 'npc':
                        npcsDispatch({type: 'SET_NPCS', payload: json})
                        break
                    case 'map':
                        mapsDispatch({type: 'SET_MAPS', payload: json})
                        break
                    case 'creature':
                        creaturesDispatch({type: 'SET_CREATURES', payload: json})
                        break
                    case 'quest':
                        questsDispatch({type: 'SET_QUESTS', payload: json})
                        break
                    default:
                        break
                }
                setIsLoading(false)
                setError(null)
            }
        }
        if (user) {
            fetchCollection()
        }
    
    }, [user])

    return { isLoading, error }

}