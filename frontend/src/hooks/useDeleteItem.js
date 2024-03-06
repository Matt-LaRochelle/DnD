import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

import { useNpcsContext } from './useNpcsContext'
import { usePcsContext } from './usePcsContext'
import { useCreaturesContext } from './useCreaturesContext'
import { useMapsContext } from './useMapsContext'
import { useQuestsContext } from './useQuestsContext'

export const useDeleteItem = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuthContext()

    const { dispatch: dispatchNpc } = useNpcsContext()
    const { dispatch: dispatchPc } = usePcsContext()
    const { dispatch: dispatchCreature } = useCreaturesContext()
    const { dispatch: dispatchMap } = useMapsContext()
    const { dispatch: dispatchQuest } = useQuestsContext()

    const deleteItem = async (type, id) => {
        if (!user) {
            return
        }
        setIsLoading(true);
        setError(null)
        const response = await fetch(`https://dnd-kukm.onrender.com/api/${type}/${id}`, {
            method: 'DELETE', // Specify the method here
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setIsLoading(false)
            return
        }
        if (response.ok) {
            if (type === 'npc') {
                dispatchNpc({type: 'DELETE_NPC', payload: json})
            }
            if (type === 'pc') {
                dispatchPc({type: 'DELETE_PC', payload: json})
            }
            if (type === 'creature') {
                dispatchCreature({type: 'DELETE_CREATURE', payload: json})
            }
            if (type === 'map') {
                dispatchMap({type: 'DELETE_MAP', payload: json})
            }
            if (type === 'quest') {
                dispatchQuest({type: 'DELETE_QUEST', payload: json})
            }
            setIsLoading(false)
        }
    }

return { deleteItem, isLoading, error }
}